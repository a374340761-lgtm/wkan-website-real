(function(){
 'use strict';
 const input=document.getElementById('specLibrarySearch'),count=document.getElementById('specLibraryCount');
 if(!input)return;
 const zh=document.documentElement.lang.toLowerCase().startsWith('zh');
 const groups=[...document.querySelectorAll('.spec-library-group')];
 const normalize=s=>s.toLowerCase().replace(/[×*ｘ]/g,'x').replace(/\s+/g,'');
 const index=groups.map(el=>({el,text:normalize(el.textContent)}));
 function filter(){const q=normalize(input.value);let visible=0;
  index.forEach(({el,text})=>{el.hidden=!!q&&!text.includes(q);if(!el.hidden)visible++;if(q&&!el.hidden)el.open=true;});
  document.querySelectorAll('.spec-library-family').forEach(el=>el.hidden=![...el.children].some(c=>!c.hidden));
  count.textContent=zh?`共 ${visible} 组配置；空白格为原表未提供或待确认。`:`${visible} configuration groups; blank cells are unspecified or require confirmation.`;
 }
 function anchor(){try{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el){if(el.matches('details'))el.open=true;else el.querySelectorAll('details').forEach(d=>d.open=true);el.scrollIntoView();}}catch(_){} }
 input.addEventListener('input',filter);window.addEventListener('hashchange',anchor);filter();anchor();
})();
