/* ZEBERL PREMIUM — interactions */
(function(){
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const $=(s,c)=>(c||document).querySelector(s);
  const $$=(s,c)=>Array.from((c||document).querySelectorAll(s));

  // loader
  const loader=$('#loader');
  document.body.classList.add('loading');
  function hide(){ if(!loader)return; loader.classList.add('done'); document.body.classList.remove('loading'); setTimeout(()=>loader&&loader.remove(),800); runWords(); }
  window.addEventListener('load',()=>setTimeout(hide,reduce?150:1500));
  setTimeout(hide,4000);

  // nav
  const nav=$('.nav');
  const onScroll=()=>nav&&nav.classList.toggle('scrolled',scrollY>24);
  onScroll(); addEventListener('scroll',onScroll,{passive:true});
  const burger=$('.burger'); if(burger)burger.addEventListener('click',()=>nav.classList.toggle('menu-open'));
  $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('menu-open')));

  // word reveal (hero headline)
  function runWords(){
    $$('.words').forEach(el=>{
      if(el.dataset.done)return; el.dataset.done=1;
      el.innerHTML=el.textContent.trim().split(' ').map(w=>`<span class="word">${w} </span>`).join('');
      if(reduce) return;
      el.classList.add('anim');
      el.querySelectorAll('.word').forEach((w,i)=>{ w.style.animationDelay=(i*0.1)+'s'; w.classList.add('go'); });
    });
  }

  // reveals
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(el=>io.observe(el));

  // counters
  function count(el){
    const t=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length;
    if(reduce){el.textContent=t.toLocaleString('de-DE',{minimumFractionDigits:dec});return;}
    const d=1500,s=performance.now();
    (function tick(n){const p=Math.min((n-s)/d,1),e=1-Math.pow(1-p,3);el.textContent=(t*e).toLocaleString('de-DE',{minimumFractionDigits:dec,maximumFractionDigits:dec});p<1?requestAnimationFrame(tick):el.textContent=t.toLocaleString('de-DE',{minimumFractionDigits:dec});})(s);
  }
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);cio.unobserve(e.target);}}),{threshold:.6});
  $$('[data-count]').forEach(el=>cio.observe(el));

  // spotlight bento + magnetic
  if(!reduce && matchMedia('(hover:hover)').matches){
    $$('.bento-item').forEach(c=>c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');}));
    $$('.magnetic').forEach(b=>{const s=.3;b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*s}px,${(e.clientY-r.top-r.height/2)*s}px)`;});b.addEventListener('mouseleave',()=>b.style.transform='');});
  }

  // faq
  $$('.q-btn').forEach(b=>b.addEventListener('click',()=>{
    const q=b.closest('.q'),body=q.querySelector('.q-body'),open=q.classList.contains('open');
    $$('.q.open').forEach(o=>{o.classList.remove('open');o.querySelector('.q-body').style.maxHeight=null;});
    if(!open){q.classList.add('open');body.style.maxHeight=body.scrollHeight+'px';}
  }));

  // cookie + year
  const ck=$('#cookie');
  if(ck&&!localStorage.getItem('zb_ck')){setTimeout(()=>ck.classList.add('show'),1700);$$('#cookie button').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('zb_ck','1');ck.classList.remove('show');}));}
  $$('.year').forEach(e=>e.textContent=new Date().getFullYear());

  // GSAP hero parallax
  if(window.gsap&&window.ScrollTrigger&&!reduce){
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-bg img',{scale:1.16,yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero-inner',{yPercent:-14,opacity:.5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }
})();
