/* ⚠️ keine Top-Level-Variable `l` */
document.documentElement.classList.add('js');/* aktiviert Reveal-Verstecken nur wenn JS läuft */
const reduceM=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent=new Date().getFullYear();

/* ---- Hauptseite starten ---- */
let started=false;
function start(){
  if(started)return; started=true;

  /* progress */
  addEventListener('scroll',()=>{const h=document.documentElement;document.getElementById('prog').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';});
  /* nav */
  const nav=document.getElementById('nav'),notruf=document.getElementById('notruf');
  addEventListener('scroll',()=>{const s=scrollY>40;nav.classList.toggle('scrolled',s);notruf.classList.toggle('show',s);});
  /* mobile */
  const burger=document.getElementById('burger'),nl=document.getElementById('navlinks');
  burger.addEventListener('click',()=>nl.classList.toggle('open'));
  nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nl.classList.remove('open')));

  if(reduceM){const cv=document.getElementById('cylVideo');if(cv){cv.removeAttribute('autoplay');cv.pause();}}
  if(reduceM||!window.gsap){
    document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
    document.querySelectorAll('[data-to]').forEach(b=>b.textContent=(+b.dataset.to).toLocaleString('de-DE')+(b.dataset.suffix||''));
    return;
  }
  if(window.Lenis){const lenis=new Lenis({lerp:.1});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  /* ---- Cinematic Hero (Skill cinematic-hero, exakte Referenz-Mechanik) ---- */
  /* Echte Glyph-Pfade (opentype.js, Arial Black) — DIESELBEN Pfade für Stroke UND Maske,
     dadurch sitzen Wortmarke und „Schlüssel-in-den-Buchstaben" pixelgenau aufeinander. */
  const WORDMARK={"viewBox":"0.6 -204.4 1194.7 208.4","letters":["M15.45-157.64L15.45-200.43L190.72-200.43L190.72-160.37L78.34-43.07L194.82-43.07L194.82 0L4.65 0L4.65-41.56L115.80-157.64","M216.58 0L216.58-200.43L382.55-200.43L382.55-157.64L278.65-157.64L278.65-125.78L375.04-125.78L375.04-84.90L278.65-84.90L278.65-45.39L385.56-45.39L385.56 0","M413.06 0L413.06-200.43L529-200.43Q557.98-200.43 573.50-186.07Q589.02-171.72 589.02-150.53Q589.02-132.75 577.94-120.04Q570.56-111.56 556.34-106.64Q577.94-101.45 588.13-88.80Q598.31-76.15 598.31-57.01Q598.31-41.43 591.07-28.98Q583.82-16.54 571.24-9.30Q563.45-4.79 547.73-2.73Q526.81 0 519.97 0L413.06 0M475.54-159.82L475.54-121.82L502.47-121.82Q516.96-121.82 522.64-126.81Q528.31-131.80 528.31-141.23Q528.31-149.98 522.64-154.90Q516.96-159.82 502.88-159.82L475.54-159.82M475.54-83.67L475.54-43.07L507.12-43.07Q523.12-43.07 529.68-48.74Q536.24-54.41 536.24-63.98Q536.24-72.87 529.75-78.27Q523.25-83.67 506.98-83.67","M624.58 0L624.58-200.43L790.55-200.43L790.55-157.64L686.65-157.64L686.65-125.78L783.04-125.78L783.04-84.90L686.65-84.90L686.65-45.39L793.56-45.39L793.56 0","M883.95 0L821.74 0L821.74-200.43L924.96-200.43Q953.68-200.43 968.85-195.51Q984.03-190.59 993.32-177.26Q1002.62-163.93 1002.62-144.79Q1002.62-128.11 995.51-116.01Q988.40-103.91 975.96-96.39Q968.03-91.60 954.22-88.46Q965.30-84.77 970.36-81.07Q973.77-78.61 980.27-70.55Q986.76-62.48 988.95-58.11L1018.89 0L948.89 0L915.80-61.25Q909.52-73.14 904.59-76.70Q897.89-81.35 889.42-81.35L883.95-81.35L883.95 0M883.95-159.96L883.95-119.22L910.06-119.22Q914.30-119.22 926.47-121.95Q932.62-123.18 936.52-128.24Q940.41-133.30 940.41-139.86Q940.41-149.57 934.26-154.77Q928.11-159.96 911.16-159.96","M1032.71 0L1032.71-200.43L1094.65-200.43L1094.65-49.36L1191.31-49.36L1191.31 0"]};
  (function(){
    const svg=document.getElementById('logoSvg');if(!svg)return;
    svg.setAttribute('viewBox',WORDMARK.viewBox);
    svg.innerHTML=WORDMARK.letters.map(d=>`<path d="${d}"/>`).join('');
    const maskSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORDMARK.viewBox}"><g fill="white">`+WORDMARK.letters.map(d=>`<path d="${d}"/>`).join('')+'</g></svg>';
    const url=`url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;
    const c=document.getElementById('composite'); c.style.webkitMaskImage=url; c.style.maskImage=url;
  })();
  /* Scroll-Timeline: Schlüssel wächst aus dem Nebel → Wolken teilen sich → Wortmarke wird
     gezeichnet → Schlüssel erscheint IN den Buchstaben (Werte 1:1 aus der Referenz) */
  const ctl=gsap.timeline();
  ctl.to(['#subject','#subjectComp'],{y:'-30%',scale:1.26,duration:1},0)
    .to('#smoke',{y:'0%',duration:1},0)
    .to('#content',{y:'20%',scale:.9,duration:1},0)
    .to('#content',{opacity:0,duration:.2},0)
    .to('#logo',{opacity:1,duration:.01},.1)
    .fromTo('#logoSvg path',{drawSVG:'0%'},{drawSVG:'100%',duration:.3},.1)
    .to('#logo',{opacity:0,duration:.2},.28)
    .to('#composite',{opacity:1,duration:.1},.3)
    .to('#subject',{opacity:0,duration:.1},.3);
  ScrollTrigger.create({trigger:'#top',animation:ctl,start:'top top',end:'bottom top',scrub:.1});
  /* Nebel-Drift (lebendig) */
  gsap.to('#smoke img',{x:26,scale:1.04,transformOrigin:'bottom center',duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});
  /* Metall-Funken & Glints (Branchen-Eyecatcher Sicherheitstechnik) */
  (function(){const __hb=document.querySelector('.hero-bg');if(!__hb)return;const stage=document.createElement('div');stage.className='ambient';
    __hb.insertBefore(stage,document.getElementById('logo'));
    const R=(a,b)=>a+Math.random()*(b-a);
    /* aufsteigende Funken (Glut) */
    for(let i=0;i<26;i++){const s=R(1.5,4),el=document.createElement('div');el.className='particle';
      Object.assign(el.style,{width:s+'px',height:s+'px',left:R(0,100)+'vw',top:R(35,100)+'vh',
        background:['rgba(150,195,255,','rgba(110,160,235,','rgba(210,232,255,'][i%3]+R(.5,1).toFixed(2)+')',
        boxShadow:'0 0 '+R(5,11).toFixed(0)+'px rgba(120,170,245,.7)'});
      stage.appendChild(el);
      (function rise(){gsap.fromTo(el,{x:0,y:0,opacity:0},{x:R(-40,70),y:R(-120,-300),opacity:R(.6,1),duration:R(7,15),delay:R(0,8),ease:'none',onUpdate(){if(this.progress()>.75)el.style.opacity=(1-this.progress())*4;},onComplete:rise});})();
    }
    /* Glints — kurze helle Aufblitzer */
    for(let i=0;i<7;i++){const s=R(40,90),el=document.createElement('div');el.className='glint';
      Object.assign(el.style,{width:s+'px',height:s+'px',left:R(8,92)+'vw',top:R(18,80)+'vh',opacity:0});
      stage.appendChild(el);
      (function flash(){gsap.fromTo(el,{scale:.4,opacity:0},{scale:1,opacity:R(.5,.9),duration:R(.18,.4),ease:'power2.out',delay:R(.5,7),onComplete(){gsap.to(el,{opacity:0,scale:.6,duration:R(.4,.9),ease:'power2.in',onComplete:flash});}});})();
    }})();
  /* Intro-Choreografie (einmalig beim Laden) */
  const cin=gsap.timeline();
  cin.fromTo('#top',{autoAlpha:0},{autoAlpha:1,duration:.6},0)
    .to('#eyebrow',{opacity:1,duration:.8},.2)
    .to('#title .line span',{y:0,duration:2,stagger:.1,ease:'expo.out'},.2)
    .to(['#text','#actions'],{opacity:1,duration:1,stagger:.15,ease:'power2.out'},.6)
    .from('#back',{scale:1.18,duration:5,ease:'expo.out'},0)
    .from(['#subject img','#subjectComp img'],{opacity:0,duration:.6},.2)
    .from(['#subject img','#subjectComp img'],{y:'10%',duration:3,ease:'expo.out'},.2);

  /* reveals */
  gsap.utils.toArray('.reveal').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 88%',onEnter:()=>el.classList.add('in')}));
  setTimeout(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in')),2400);

  /* counters (micro-fx) */
  gsap.utils.toArray('[data-to]').forEach(b=>{const to=+b.dataset.to,suf=b.dataset.suffix||'',yr=b.dataset.year;
    ScrollTrigger.create({trigger:b,start:'top 90%',once:true,onEnter:()=>{gsap.to({v:0},{v:to,duration:1.6,ease:'power2.out',onUpdate(){b.textContent= yr?Math.round(this.targets()[0].v):Math.round(this.targets()[0].v).toLocaleString('de-DE')+suf;}});}});});


  /* Leistungen: Sticky Bild/Text-Paare — sanfter Ken-Burns-Zoom beim Durchscrollen (scroll-story) */
  gsap.utils.toArray('.svc .media').forEach(m=>{const img=m.querySelector('img'); if(!img)return;
    gsap.fromTo(img,{scale:1.12},{scale:1,ease:'none',scrollTrigger:{trigger:m,start:'top 92%',end:'bottom 30%',scrub:true}});});

  /* Interaktiver Schließzylinder — Schlüssel fährt ein, Stifte stellen sich auf die Scherlinie, Zylinder entriegelt (Brief Szene 04, in Code) */
  (function(){const v=document.getElementById('lockviz');if(!v)return;
    const lift=[36,44,30,48,40];
    const drivers=gsap.utils.toArray('#lockDrivers rect');
    const keypins=gsap.utils.toArray('#lockKeypins rect');
    const key=document.getElementById('lockKey'),status=document.getElementById('lockStatus');
    function reset(){v.classList.remove('open');gsap.set(key,{x:330,rotation:0,transformOrigin:'406px 268px'});gsap.set([...drivers,...keypins],{y:0});if(status)status.textContent='● Verriegelt';}
    function play(){reset();const tl=gsap.timeline();
      tl.to(key,{x:0,duration:1.1,ease:'power3.inOut'},0);
      keypins.forEach((kp,i)=>tl.to([kp,drivers[i]],{y:-lift[i],duration:.5,ease:'power2.out'},.55+i*.1));
      tl.to(key,{rotation:-9,duration:.7,ease:'power3.inOut'},'+=.15')
        .add(()=>{v.classList.add('open');if(status)status.textContent='● Entriegelt';},'<.15');
      return tl;}
    reset();
    ScrollTrigger.create({trigger:v,start:'top 75%',once:true,onEnter:play});
    const rb=document.getElementById('lockReplay');if(rb)rb.addEventListener('click',play);
  })();
}

/* drawer */
function openDrawer(w){document.getElementById('d-impressum').style.display=w==='impressum'?'block':'none';document.getElementById('d-datenschutz').style.display=w==='datenschutz'?'block':'none';document.getElementById('drawer').classList.add('open');document.getElementById('dbg').classList.add('open');}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('dbg').classList.remove('open');}
/* Cinematic Hero ist der Auftakt — Seite direkt starten */
start();
