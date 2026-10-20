/* Deterministic preliminary assessment, mirrored from Python scoring.py.
 * Never rendered to the candidate. Client scores require human verification. */
(function (root) {
  'use strict';
  function assess(data, rules) {
    const totals = Object.fromEntries(Object.keys(rules.dimensions).map(k => [k, 0]));
    const risks = [
      '核实开放题经历、本人行动与结果；开放题仅计结构化证据覆盖，不能判定真实性或质量。',
      '面谈确认底薪、提成、考核与初期收入预期，不承诺固定收入或涨薪。',
      '人工复核产品理解、英文语义及交期承诺；AI 和外贸经验本身不是淘汰条件。',
      '本评估在浏览器生成，需结合原文复核，不作为可信服务端评分或录用决定。'
    ];
    const answers = rules.questions.map(q => {
      const a = data.answers[q.id], counts = {};
      Object.values(a).filter(v => typeof v === 'string' && v.trim().length >= 8).forEach(v => { const t=v.trim().toLowerCase(); counts[t]=(counts[t]||0)+1; });
      let score=0;
      const rationale=q.rubric.map(c => {
        const v=a[c.field]; let n=0, reason;
        if(c.kind==='choice') {n=c.points[v]||0;reason='预设选项计分，反映自述意向，需面试核实。';}
        else if(c.kind==='multi') {n=Math.min(c.max,Math.max(0,v.reduce((s,x)=>s+(c.points[x]||0),0)));reason='按预设分值累加，并限制在该项分值范围内。';}
        else {
          const chars=[...v.trim()].filter(x=>/[\p{L}\p{N}]/u.test(x)), minimum=c.field==='name'?2:8;
          let present=chars.length>=minimum&&new Set(chars).size>=Math.min(4,minimum);
          if(c.kind==='english') {
            const words=v.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[],letters=[...v].filter(x=>/\p{L}/u.test(x));
            present=words.length>=3&&new Set(words.map(x=>x.toLowerCase())).size>=3&&(v.match(/[A-Za-z]/g)||[]).length/Math.max(1,letters.length)>=0.8;
          }
          const repeated=counts[v.trim().toLowerCase()]>1;
          n=present&&!repeated?c.max:0;
          reason=repeated?'初评：同题多栏原文重复，需分别复核。':!present?'初评：未达到基础资料覆盖要求；需人工阅读，不作淘汰结论。':c.kind==='english'?'初评：含至少三个不同英文词、字母以英文为主；未判定语义、语法或正确性。':'初评：已填写可供复核的说明；仅计证据覆盖，不判定经历真实或内容优劣。';
        }
        score+=n;return `${c.label}：${n}/${c.max}。${reason}`;
      });
      const maxScore=q.rubric.reduce((s,c)=>s+c.max,0);totals[q.dimension]+=score;
      if(score<maxScore)risks.push(`核实 ${q.id}：${q.title}，依据原文追问，不据此自动淘汰。`);
      const answer=q.fields.map(f=>{const v=a[f.key],labels=Object.fromEntries((f.options||[]).map(o=>[o.value,o.label]));return `${f.label}：${Array.isArray(v)?v.map(x=>labels[x]||x).join('；'):labels[v]||v}`;}).join('\n');
      return {questionId:q.id,question:q.title,answer,score,maxScore,rationale:rationale.join('\n'),category:rules.dimensions[q.dimension][0],needsManualReview:true};
    });
    const a=data.answers, priority=[];
    if(a.q2.horizon==='short')priority.push('长期发展目标与短期过渡意向的差异');
    if(['steady','not_fit'].includes(a.q3.position))priority.push('前期收入预期与底薪加提成的适配');
    if(['observe','cannot'].includes(a.q4.position))priority.push('现场学习及基础工作的分工与接受程度');
    if(a.q6.approach==='copy')priority.push('AI 输出独立核实习惯');
    if(a.q8.action!=='own'||a.q9.steps.includes('promise'))priority.push('订单错误与交期风险沟通，避免未经确认的承诺');
    if(['silent','avoid'].includes(a.q10.style)||['guess','wait'].includes(a.q11.start))priority.push('直接汇报、反馈与无流程任务的沟通方式');
    const totalScore=Object.values(totals).reduce((s,n)=>s+n,0);
    const summary=priority.length?'存在需优先核实的岗位预期或处理方式差异；总分不能替代逐项沟通。':totalScore>=80?'自述与岗位期待较接近，建议面试核实':totalScore>=60?'部分匹配，需针对差异进一步交流':'当前自述有较多待确认项，建议先沟通预期';
    // Preserve the deployed Sheet's existing columns; the optional WeChat ID
    // is also readable in its existing experience cell without a GAS update.
    const candidate = {...data.contact};
    if (candidate.wechat) candidate.experience += '\n\n微信号：' + candidate.wechat;
    if (candidate.age) candidate.experience += '\n年龄：' + candidate.age + ' 岁（选填，不计分）';
    return {submissionId:data.submission_id,submittedAt:data.submittedAt||new Date().toISOString(),website:data.website,candidate,
      assessment:{totalScore,categoryScores:Object.fromEntries(Object.entries(totals).map(([k,v])=>[rules.dimensions[k][0],v])),summary,riskPoints:[...priority,...risks],recommendation:'供招聘负责人结合完整答案面试复核；自动评分不决定录用或拒绝。',needsManualReview:true},answers};
  }
  root.WK_assessCareers=assess;
  if(typeof module!=='undefined')module.exports=assess;
})(typeof window!=='undefined'?window:globalThis);
