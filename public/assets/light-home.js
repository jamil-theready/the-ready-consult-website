
const subscriptionSeo=document.querySelector('.subscription-seo');
if(subscriptionSeo){
  const revealSubscriptionSeo=()=>{
    if(subscriptionSeo.classList.contains('is-active'))return;
    subscriptionSeo.classList.add('is-active');
    subscriptionSeo.querySelectorAll('.subscription-gauge').forEach((gauge,index)=>{
      const score=Number(gauge.dataset.score);
      const number=gauge.querySelector('strong');
      const ring=gauge.querySelector('.progress');
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ring.style.strokeDashoffset=String(176*(1-score/100));return;}
      number.textContent='0';
      setTimeout(()=>{
        ring.style.strokeDashoffset=String(176*(1-score/100));
        const start=performance.now();
        const tick=now=>{const progress=Math.min(1,(now-start)/1700);number.textContent=String(Math.round(score*(1-Math.pow(1-progress,3))));if(progress<1)requestAnimationFrame(tick)};
        requestAnimationFrame(tick);
      },400+index*300);
    });
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const target=subscriptionSeo.querySelector('.subscription-typed');
      const message=target.textContent;target.textContent='';
      setTimeout(()=>{let position=0;const interval=setInterval(()=>{target.textContent=message.slice(0,++position);if(position>=message.length)clearInterval(interval)},26)},1800);
    }
  };
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){revealSubscriptionSeo();observer.disconnect()}},{threshold:.25});observer.observe(subscriptionSeo)}else revealSubscriptionSeo();
}
const workflowIntro=document.querySelector('.workflow-intro');
workflowIntro.querySelector('h2').innerHTML='It’s simple.<br>Here’s how it goes down.';
workflowIntro.querySelector('p').replaceWith(Object.assign(document.createElement('a'),{className:'workflow-cta',href:'#signup',innerHTML:'Sign up <span aria-hidden="true">→</span>'}));
document.querySelectorAll('.workflow-cards .flow-step').forEach(step=>step.classList.add('active'));
const planFlows=[['Search','Website','Leads'],['Ads','Website','Lead','Follow-up']];
const auditStep=document.querySelectorAll('.flow-step')[0];auditStep.querySelector('h3').textContent='See what customers are searching for.';
const siteStep=document.querySelectorAll('.flow-step')[1];siteStep.querySelector('h3').textContent='We build you a new site.';siteStep.querySelector('p').textContent='Then we make it clear, fast, and easy to trust so searchers become customers who call or message you.';
document.querySelectorAll('.plan').forEach((plan,index)=>{const flow=document.createElement('div');flow.className='service-flow';flow.setAttribute('aria-label',planFlows[index].join(' leads to '));flow.innerHTML=planFlows[index].map((label,i)=>`<span>${label}</span>${i<planFlows[index].length-1?'<i></i>':''}`).join('');plan.querySelector('.tiles').after(flow);plan.querySelector('.button').textContent=index===0?'Start here':'Get more jobs';});
const seoStep=document.querySelectorAll('.flow-step')[2];seoStep.querySelector('.step-copy p').textContent='We use real search data to strengthen the pages customers need, resolve the technical problems limiting visibility, and steadily improve how your business appears in local search.';
const bottomCta=document.createElement('section');bottomCta.className='bottom-cta';bottomCta.setAttribute('aria-label','Ready to grow your business');bottomCta.innerHTML='<div class="bottom-cta-panel"><i class="cta-orbit one" aria-hidden="true">⌕</i><i class="cta-orbit two" aria-hidden="true">↗</i><i class="cta-orbit three" aria-hidden="true">◎</i><i class="cta-orbit four" aria-hidden="true">→</i><div class="bottom-cta-copy"><h2>Ready to be easier to find?</h2><p>We build your website, improve your visibility, and give customers a simple way to reach you.</p><a href="#signup">Sign up <span aria-hidden="true">→</span></a></div><div class="bottom-cta-rail"><span><i></i>A new website</span><span><i></i>Better Google visibility</span><span><i></i>More qualified leads</span><span><i></i>Clear reporting</span></div></div>';document.querySelector('.review-note').replaceWith(bottomCta);
const leadRush=document.createElement('div');leadRush.className='lead-rush';leadRush.setAttribute('aria-label','Illustrative sequence of incoming WhatsApp leads');leadRush.innerHTML='<div class="rush-card"><i class="rush-icon">✆</i><div class="rush-copy"><small>WHATSAPP · THE READY CONSULT</small><b>New lead: Alex Carter</b><p>“Can I get an estimate?”</p></div><em class="rush-time">now</em><i class="rush-badge">1</i></div><div class="rush-card"><i class="rush-icon">✆</i><div class="rush-copy"><small>WHATSAPP · THE READY CONSULT</small><b>Estimate: Jordan Lee</b><p>“Can you call me today?”</p></div><em class="rush-time">now</em><i class="rush-badge">2</i></div><div class="rush-card"><i class="rush-icon">✆</i><div class="rush-copy"><small>WHATSAPP · THE READY CONSULT</small><b>New project: Sam Rivera</b><p>“I need help with a project.”</p></div><em class="rush-time">now</em><i class="rush-badge">3</i></div>';document.querySelector('.iphone-screen').append(leadRush);
const proofRail=document.querySelector('.bottom-cta-rail');proofRail.innerHTML='<div class="ticker-track">'+proofRail.innerHTML+proofRail.innerHTML+'</div>';
bottomCta.id='bottom-cta';
const signupSection=document.getElementById('signup');
const signupShell=signupSection.querySelector('.signup-shell');
const bottomPanel=bottomCta.querySelector('.bottom-cta-panel');
signupShell.classList.add('cta-form-shell');
signupShell.hidden=true;
const closeSignup=document.createElement('button');
closeSignup.type='button';closeSignup.className='cta-form-close';closeSignup.textContent='← Back';closeSignup.setAttribute('aria-label','Close signup form');
signupShell.prepend(closeSignup);bottomPanel.append(signupShell);signupSection.remove();
const checkoutCard=document.createElement('div');
checkoutCard.className='signup-flow-card';checkoutCard.hidden=true;
checkoutCard.innerHTML=`<button class="checkout-back" type="button">← Back</button>
  <h2 class="visually-hidden">Choose how to continue</h2>
  <div class="next-choices">
    <a class="call-link" href="https://calendly.com/thereadyconsult/30min" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 15h3"/></svg><span>Book a call</span></a>
    <span class="choice-divider" aria-hidden="true"></span>
    <div class="start-choice"><span>Get started now</span><a class="checkout-link" href="#" rel="noopener">Start subscription</a></div>
  </div>`;
bottomPanel.append(checkoutCard);checkoutCard.querySelector('h2').tabIndex=-1;
function openSignup(){checkoutCard.hidden=true;signupShell.hidden=false;bottomPanel.classList.add('form-open');document.body.classList.add('signup-open');bottomCta.scrollIntoView({behavior:'smooth',block:'start'});}
function hideSignup(){bottomPanel.classList.remove('form-open');document.body.classList.remove('signup-open');signupShell.hidden=true;checkoutCard.hidden=true;bottomCta.scrollIntoView({behavior:'smooth',block:'start'});}
closeSignup.addEventListener('click',hideSignup);
checkoutCard.querySelector('.checkout-back').addEventListener('click',hideSignup);
document.addEventListener('click',event=>{const link=event.target.closest('a[href="#signup"]');if(!link)return;event.preventDefault();openSignup();});
if(location.hash==='#signup')openSignup();
let timer;
function showLead(){document.getElementById('lead-count').textContent='24';document.getElementById('lead-growth').innerHTML='↑ 8 more <span>than last month</span>';document.getElementById('new-lead').classList.add('visible');const n=document.getElementById('notification');n.classList.remove('waiting');n.classList.add('pulse');document.getElementById('notification-time').textContent='Just now';document.getElementById('notification-title').textContent='New lead: Jordan Lee';document.getElementById('notification-message').textContent='“Hi! We’d like an estimate for a new patio. Can you help?”';}
function replay(){clearTimeout(timer);document.getElementById('lead-count').textContent='23';document.getElementById('lead-growth').innerHTML='↑ 7 more <span>than last month</span>';document.getElementById('new-lead').classList.remove('visible');document.getElementById('notification').className='notice waiting';document.getElementById('notification-title').textContent='Your next inquiry lands here.';document.getElementById('notification-message').textContent='Their name. Their message. A quick way to follow up.';document.getElementById('notification-time').textContent='Demo';timer=setTimeout(showLead,900);}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){document.querySelector('.showcase').classList.add('in-view');timer=setTimeout(showLead,1700);observer.disconnect()}},{threshold:.15});observer.observe(document.querySelector('.dash'));
document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',openSignup));

const intakeScript = document.createElement('script'); intakeScript.src = '/assets/intake-flow.js?v=20261111-intake'; document.body.appendChild(intakeScript);
