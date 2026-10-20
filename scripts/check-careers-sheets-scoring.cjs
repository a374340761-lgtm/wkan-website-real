const fs=require('fs'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const assess=require('./careers-assessment.js'),rules=JSON.parse(fs.readFileSync('data/careers-scoring-rules.json','utf8'));
const cases=JSON.parse(execFileSync('python',['-c',`
import json,random,copy
from careers_backend.test_app import fixture
from careers_backend.questionnaire import QUESTIONS
from careers_backend.scoring import score_application
random.seed(42);cases=[]
for i in range(100):
 p=fixture()
 for q in QUESTIONS:
  for f in q['fields']:
   if f['type']=='select': p['answers'][q['id']][f['key']]=random.choice(f['options'])['value']
   elif f['type']=='checkboxes': p['answers'][q['id']][f['key']]=[o['value'] for o in f['options'] if random.choice([True,False])]
   elif i%4==0:p['answers'][q['id']][f['key']]='?'
   elif i%4==1:p['answers'][q['id']][f['key']]='重复的内容没有区别需要核实'
 cases.append({'input':p,'expected':score_application(p)})
print(json.dumps(cases,ensure_ascii=True))
`],{encoding:'utf8',maxBuffer:8*1024*1024}));
for(const c of cases){const actual=assess(c.input,rules),expected=c.expected;assert.equal(actual.assessment.totalScore,expected.total);assert.deepEqual(actual.answers.map(q=>q.score),expected.questions.map(q=>q.score));assert.deepEqual(Object.values(actual.assessment.categoryScores),expected.dimensions.map(d=>d.score));assert.equal(actual.answers.length,13);assert.equal(actual.answers.reduce((s,q)=>s+q.maxScore,0),100);assert(actual.answers.every(q=>q.answer&&q.rationale&&q.needsManualReview));}
console.log('PASS: 100 deterministic JS/Python assessment parity cases, all 13 questions and 100-point totals.');
// Verify generated Apps Script response is executable HTML, not escaped markup.
const vm=require('vm');let generated='';const messages=[];
const context={HtmlService:{createHtmlOutput(html){generated=html;return {setXFrameOptionsMode(){return html;}}},XFrameOptionsMode:{ALLOWALL:'ALLOWALL'}}};
vm.createContext(context);vm.runInContext(fs.readFileSync('deploy/careers/apps-script-reply.gs','utf8'),context);
for(const ok of [true,false,'true']){context.recruitmentReply_('test-</script>-id',ok);assert(generated.includes('</script></body>'));assert(!generated.includes('test-</script>-id'));const source=generated.match(/<script>([\s\S]*?)<\/script>/)[1];const top={postMessage(data,origin){messages.push({data,origin});}};top.parent=top;vm.runInNewContext(source,{window:{parent:top}});assert.equal(messages.at(-1).data.ok,ok===true);assert.equal(messages.at(-1).data.requestId,'test-</script>-id');assert.equal(messages.at(-1).data.type,'recruitment-submit-result');assert(messages.every(m=>m.origin!=='*'));}
console.log('PASS: Apps Script response HTML, JSON escaping, strict success flag and exact target origins.');
