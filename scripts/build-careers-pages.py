from pathlib import Path
import re,json,sys,html
sys.path.insert(0,str(Path('.').resolve()))
from careers_backend.questionnaire import public_schema, QUESTIONS, DIMENSIONS, VERSION
CHECK = '--check' in sys.argv
def save(path, content):
 path = Path(path)
 if CHECK:
  if not path.exists() or path.read_text(encoding='utf-8').replace('\r\n','\n') != content.replace('\r\n','\n'):
   raise SystemExit('Out of date: '+str(path))
 else:
  path.write_text(content,encoding='utf-8')
save('data/careers-questionnaire.json',json.dumps(public_schema(),ensure_ascii=False,indent=2))
save('data/careers-scoring-rules.json',json.dumps({'version':VERSION,'questions':QUESTIONS,'dimensions':DIMENSIONS},ensure_ascii=False,indent=2))
profile='''<section class="careers-box" aria-labelledby="contactHeading"><h2 id="contactHeading">基本申请信息</h2><p class="careers-hint">仅收集招聘所需资料；基本联系信息及工作年限不计分。无正式工作经历可如实填写学习、兼职或其他相关经历。</p><div class="careers-profile">
<div><label for="applicantName">姓名</label><input id="applicantName" name="name" autocomplete="name" required maxlength="80"></div>
<div><label for="applicantPhone">电话</label><input id="applicantPhone" name="phone" type="tel" autocomplete="tel" required minlength="7" maxlength="30"></div>
<div><label for="applicantEmail">邮箱</label><input id="applicantEmail" name="email" type="email" autocomplete="email" required maxlength="254"></div>
<div><label for="applicantLocation">所在地（城市即可）</label><input id="applicantLocation" name="location" autocomplete="address-level2" required maxlength="120"></div>
<div class="wide"><label for="applicantAvailability">可到岗时间</label><input id="applicantAvailability" name="availability" required maxlength="120" placeholder="例如：收到录用通知后两周内"></div>
<div class="wide"><label for="applicantExperience">相关工作或学习经历</label><textarea id="applicantExperience" name="experience" required rows="3" maxlength="1200" placeholder="简述做过的事情、负责内容；没有外贸经历也可以申请。"></textarea></div>
</div></section>'''
body='''<main class="careers-layout"><article class="careers-page" lang="zh-CN"><div class="container">
<nav class="breadcrumb" aria-label="面包屑"><a href="{prefix}index.html">首页</a><span>/</span><span>加入我们 / Careers</span></nav>
<aside class="careers-notice" role="note"><strong>填写前请注意：请先打开 VPN（或可正常访问 Google 的网络）。</strong><p>问卷通过 Google 服务接收；无法连接时，招聘负责人可能收不到问卷。请保持网络连接，只有本页显示“提交成功”才表示收到写入确认。</p></aside>
<header><p class="careers-hint">伟群帐篷 · 海外销售业务团队</p><h1>加入我们，一起把产品带向海外客户</h1><p class="careers-lead">外贸销售岗位｜经验不限｜逐步培养独立负责外贸全流程的业务骨干</p></header>
<section class="careers-box"><h2>你将与谁共事</h2><p>招聘负责人介绍：我有海外留学经历，回国后在父亲经营的公司体系内负责销售业务板块，主要负责海外销售和业务发展。目前我负责的海外销售业务正在拓展，也在逐步建设团队。</p><p>你入职后是公司员工，日常直接向我汇报。我们希望在实际业务中持续学习、沟通和复盘，一起把海外销售工作做扎实。</p></section>
<section class="careers-box"><h2>岗位是什么，也需要面对什么</h2><div class="careers-facts">
<p><strong>主业是外贸销售</strong><br>逐步学习产品、客户开发、英文沟通、报价、跟单、出货与售后，成长为能独立负责全流程的业务骨干。希望你愿意稳定发展 3 年以上。</p>
<p><strong>初期从产品与现场学起</strong><br>需要了解产品和工厂现场，也可能参与检查、备货、打包等基础工作，建立对产品、质量和交付的实际认识。</p>
<p><strong>销售也要跟进生产进度</strong><br>订单生产落后、货物可能赶不出来或影响交期时，要及时联系相关负责人，协助沟通和推动进度，并向我汇报。这属于销售订单跟进的一部分，主要工作仍是外贸销售。</p>
<p><strong>薪酬与食宿如实说明</strong><br>薪酬为底薪＋成交提成，前 3–6 个月收入可能起步较慢，具体金额和规则面谈确认，不承诺固定收入、固定涨薪或必然达到某种收入。公司可以提供食宿，是否入住由你自行选择。</p>
</div><p>外贸经验不限；更看重你对外贸的兴趣、主动了解产品和学习 AI 工具的意愿，以及基础英文读写和沟通能力。没有 AI 使用经验不直接视为不合格。</p></section>
<section class="careers-box"><h2>填写前，请先了解</h2><ul><li>问卷预计 8–10 分钟，共 13 题。简答栏建议用一两句话；按真实情况填写即可，不需要标准答案。</li><li>请先浏览一个感兴趣的产品，想一想它解决的需求、适用客户和你还想了解的信息。<a class="btn btn-secondary" href="{prefix}all-products.html" target="_blank" rel="noopener noreferrer">打开产品目录 ↗</a></li><li>可学习用 AI 辅助市场和客户研究、英文邮件、产品资料、内容制作、跟单整理和效率提升。客户信息、产品参数、报价等必须独立核实，不能盲目照搬 AI 输出。</li><li>英文回复题请独立完成。问卷只辅助招聘评估，不自动淘汰或录用；开放题会保留原文由负责人复核。</li><li>本页不在浏览器本地保存个人资料。关闭或刷新页面可能丢失未提交内容，请预留完整填写时间。</li></ul></section>
<div id="careersStatus" class="careers-notice" role="status" aria-live="polite" tabindex="-1" data-state="unconfigured">正在加载在线问卷，请先确认可以访问 Google 服务。</div>
<p id="careersProgress" class="careers-progress" aria-live="polite">正在加载问卷…</p>
<form id="careersForm" action="#careersStatus" method="post">
'''+profile+'''
<div class="careers-honey" aria-hidden="true"><label for="careersWebsite">请留空</label><input id="careersWebsite" name="website" tabindex="-1" autocomplete="off"></div>
<div id="careersQuestions"></div><noscript><p class="careers-notice">问卷需要启用 JavaScript。当前无法提交，请联系招聘负责人。</p></noscript>
<section class="careers-box" id="recruitmentPrivacy"><h2>招聘隐私说明</h2><p>姓名、电话、邮箱、所在地、到岗时间、经历与问卷答案仅用于本次招聘联系和岗位评估。提交后，资料及供人工复核的评估报告通过 Google Apps Script 写入招聘负责人管理的私人 Google 表格（候选人总览、逐题答案），候选人页面不展示评分。</p><p>不要求年龄、婚育、健康、宗教、身份证件等与岗位无关的敏感信息，请不要在答案中主动填写这些内容。不会将候选人信息发送给未经配置的第三方 AI。申请信息不用于营销。需要查询、更正或删除申请资料时，可联系 yishu@waikwantent.com；招聘负责人应限制资料访问并在招聘结束后及时清理不再需要的资料。</p><label class="careers-check"><input name="consent" type="checkbox" required><span>我已阅读并同意上述隐私说明，同意将我提供的资料仅用于招聘联系和评估。</span></label>
<button id="careersSubmit" type="submit" class="btn btn-primary careers-submit" disabled>正在加载问卷…</button><p class="careers-hint">只有收到 Google 表格写入成功回执，页面才会显示“提交成功”。若显示失败或超时，请保留答案并联系负责人核实。</p></section></form></div></article>'''
for zh in [False,True]:
 prefix='/zh/' if zh else '/';p=Path('zh/careers.html' if zh else 'careers.html');template=Path('zh/export-loading.html' if zh else 'export-loading.html').read_text(encoding='utf-8');head=template.split('<main>')[0]
 head=re.sub(r'<script type="application/ld\+json"[^>]*>.*?</script>','',head,flags=re.S).replace('export-loading.html','careers.html').replace('/styles/export-loading.css?v=20261020','/styles/careers.css?v=20261020-footer')
 title='加入我们 Careers｜外贸销售招聘问卷｜伟群帐篷';desc='伟群海外销售业务团队招聘外贸销售，经验不限。了解岗位、汇报关系、薪酬预期与产品学习要求，填写中文招聘问卷。'
 head=re.sub(r'<title>.*?</title>','<title>'+title+'</title>',head,flags=re.S)
 for attr,key,value in [('name','description',desc),('property','og:title',title),('property','og:description',desc),('name','twitter:title',title),('name','twitter:description',desc)]:head=re.sub(r'(<meta '+attr+'="'+re.escape(key)+'" content=")[^"]*',lambda m:m[1]+html.escape(value,quote=True),head)
 head=re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*',r'\1https://www.waikwantent.com/images/waikwancompanylogo.png',head)
 head=head.replace('</head>', "<meta http-equiv=\"Content-Security-Policy\" content=\"frame-src 'self' https://script.google.com https://*.googleusercontent.com; form-action 'self' https://script.google.com https://*.googleusercontent.com\">\n</head>")
 schema={'@context':'https://schema.org','@type':'WebPage','name':title,'description':desc,'url':'https://www.waikwantent.com'+prefix+'careers.html','inLanguage':['zh-CN','en'],'about':{'@id':'https://www.waikwantent.com/#organization'}}
 head=head.replace('</head>','<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>\n</head>')
 footer_source=Path('zh/index.html' if zh else 'index.html').read_text(encoding='utf-8')
 footer=re.search(r'<section class="contact-bottom">.*?</section>',footer_source,re.S).group(0)
 scripts='''<script src="/scripts/bilingual-routing.js?v=20261020-careers" defer></script><script src="/scripts/cart.js"></script><script src="/scripts/main.js?v=20261020-careers-nav"></script><script src="/scripts/multilang.js?v=20261020-careers-nav"></script><script src="/scripts/get-quote-footer.js?v=20261020-careers"></script><script src="/scripts/careers-config.js?v=20261020-sheets-r2"></script><script src="/scripts/careers-assessment.js?v=20261020-sheets-r2"></script><script src="/scripts/careers.js?v=20261020-sheets-r2"></script>'''
 # The head already supplies routing; do not initialize it twice.
 scripts=scripts.replace('<script src="/scripts/bilingual-routing.js?v=20261020-careers" defer></script>','')
 save(p,head+body.replace('{prefix}',prefix)+footer+'</main>'+scripts+'</body></html>\n')
print('OK: careers pages and public question schema are current.' if CHECK else 'Generated Chinese-first EN/ZH careers pages and public question schema.')
