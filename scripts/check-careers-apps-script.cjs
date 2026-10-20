/* In-memory Apps Script API simulation. Never accesses a real Sheet. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const assess=require('./careers-assessment.js'),rules=JSON.parse(fs.readFileSync('data/careers-scoring-rules.json','utf8'));
const fixture=JSON.parse(execFileSync('python',['-c','import json; from careers_backend.test_app import fixture; print(json.dumps(fixture(),ensure_ascii=True))'],{encoding:'utf8'}));
const report=assess(fixture,rules),copy=x=>JSON.parse(JSON.stringify(x));
class Sheet{
 constructor(name,owner){this.name=name;this.rows=[];this.owner=owner;}
 getLastRow(){return this.rows.length;}
 getRange(row,col,n=1,m=1){const sheet=this;return {
  setValues(values){if(sheet.name==='逐题答案'&&row>1&&sheet.owner.failAnswers){sheet.owner.failAnswers=false;throw Error('injected write failure');}values.forEach((v,i)=>{sheet.rows[row-1+i]||=[];v.forEach((x,j)=>sheet.rows[row-1+i][col-1+j]=x);});return this;},
  setValue(value){return this.setValues([[value]]);},
  getValues(){return Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>sheet.rows[row-1+i]?.[col-1+j]??''));},
  getDisplayValues(){return this.getValues().map(r=>r.map(String));},
  getDisplayValue(){return String(this.getValues()[0][0]);}
 };}
 setFrozenRows(){}
 deleteRow(row){this.rows.splice(row-1,1);}
}
function create(){const owner={sheets:{},failAnswers:false,flushes:0,locked:false};const ss={getSheetByName:n=>owner.sheets[n],insertSheet:n=>owner.sheets[n]=new Sheet(n,owner)};const context={console:{error(){}},SpreadsheetApp:{openById:()=>ss,flush(){owner.flushes++;}},LockService:{getScriptLock:()=>({waitLock(){owner.locked=true;},hasLock:()=>owner.locked,releaseLock(){owner.locked=false;}})},HtmlService:{createHtmlOutput:x=>({setXFrameOptionsMode:()=>x}),XFrameOptionsMode:{ALLOWALL:'ALLOWALL'}}};vm.createContext(context);vm.runInContext(fs.readFileSync('deploy/careers/Code.gs','utf8'),context);context.recruitmentReply_=(id,ok)=>({id,ok});return {owner,context,submit(p){return context.doPost({parameter:{payload:JSON.stringify(p)}});}};}
let checks=[];
{const x=create();assert.equal(x.submit(report).ok,true);assert.equal(x.owner.sheets['候选人总览'].rows.length,2);assert.equal(x.owner.sheets['逐题答案'].rows.length,14);assert.equal(x.owner.sheets['候选人总览'].rows[1][14],'已完成');assert.equal(x.owner.locked,false);const s=JSON.stringify(x.owner.sheets['候选人总览'].rows),a=JSON.stringify(x.owner.sheets['逐题答案'].rows);assert.equal(x.submit(report).ok,true);assert.equal(JSON.stringify(x.owner.sheets['候选人总览'].rows),s);assert.equal(JSON.stringify(x.owner.sheets['逐题答案'].rows),a);checks.push('valid native payload creates unchanged 15/11-column headers, 1 summary + 13 answers; retry deduplicates');
// Completed summary with a missing answer is repaired rather than falsely acknowledged.
x.owner.sheets['逐题答案'].rows.pop();assert.equal(x.submit(report).ok,true);assert.equal(x.owner.sheets['逐题答案'].rows.length,14);checks.push('missing answer under completed status is repaired');}
{const x=create();x.owner.failAnswers=true;assert.equal(x.submit(report).ok,false);assert.equal(x.owner.sheets['候选人总览'].rows[1][14],'写入失败');assert.equal(x.owner.locked,false);assert.equal(x.submit(report).ok,true);assert.equal(x.owner.sheets['候选人总览'].rows.length,2);assert.equal(x.owner.sheets['逐题答案'].rows.length,14);checks.push('injected second-sheet write failure returns false; retry restores same summary and 13 answers');}
for(const mutate of [p=>p.answers.pop(),p=>p.answers[1].questionId='q1',p=>p.assessment.totalScore=99,p=>p.assessment.categoryScores['外贸兴趣']=0,p=>p.answers[0].score=999,p=>p.candidate.email='bad',p=>p.website='spam',p=>p.answers[0].rationale='']){const x=create(),p=copy(report);mutate(p);assert.equal(x.submit(p).ok,false);assert.equal(Object.keys(x.owner.sheets).length,0);}checks.push('8 malformed/inconsistent submissions rejected before writes');
{const x=create(),p=copy(report);p.candidate.experience=' \t=IMPORTXML("url","query")';p.answers[0].answer='\n=1+1';assert.equal(x.submit(p).ok,true);assert(x.owner.sheets['候选人总览'].rows[1][6].startsWith("'"));assert(x.owner.sheets['逐题答案'].rows[1][5].startsWith("'"));checks.push('leading-whitespace formulas stored as text');}
{const x=create();assert.equal(x.submit(report).ok,true);x.owner.sheets['候选人总览'].rows[0][0]='unexpected header';const before=JSON.stringify(x.owner.sheets['候选人总览'].rows);assert.equal(x.submit(report).ok,false);assert.equal(JSON.stringify(x.owner.sheets['候选人总览'].rows),before);checks.push('existing mismatched headers preserved, no silent column modification');}
fs.writeFileSync('reports/careers-apps-script-tests.json',JSON.stringify({simulated:true,realSheetWrites:0,checks,pass:true},null,2));console.log('PASS: '+checks.length+' Apps Script contract groups (8 invalid variants), no real Sheet changes.');
