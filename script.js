// EmailJS init
emailjs.init("ad1dHGUf_gonZ5ERG");

// Welcome page button
const welcomePage=document.getElementById('welcomePage');
const bookingPage=document.getElementById('bookingPage');
document.getElementById('startBooking').addEventListener('click', ()=>{
  welcomePage.classList.remove('active');
  bookingPage.classList.add('active');
});

// Slideshow
const slides=document.querySelectorAll('.slide');
let slideIndex=0;
setInterval(()=>{
  slides.forEach(s=>s.classList.remove('active'));
  slides[slideIndex].classList.add('active');
  slideIndex=(slideIndex+1)%slides.length;
},10000);

// Steps
const step1=document.getElementById('step1');
const step2=document.getElementById('step2');
const review=document.getElementById('review');
const prog=document.getElementById('prog');
const resultPanel=document.getElementById('resultPanel');
const resultTitle=document.getElementById('resultTitle');
const resultMessage=document.getElementById('resultMessage');
const secondsEl=document.getElementById('seconds');

document.getElementById('next1').addEventListener('click', ()=>{
  const n=document.getElementById('user_name').value.trim();
  const p=document.getElementById('user_phone').value.trim();
  const t=document.getElementById('maintenance_type').value;
  if(!n||!p||!t){alert('Fill Name, Phone, Maintenance Type');return;}
  step1.classList.remove('active'); step2.classList.add('active'); prog.style.width='66%';
});

document.getElementById('back1').addEventListener('click', ()=>{
  step2.classList.remove('active'); step1.classList.add('active'); prog.style.width='33%';
});

document.getElementById('toReview').addEventListener('click', ()=>{
  const email=document.getElementById('user_email').value.trim();
  const priority=document.getElementById('audience_level').value;
  const address=document.getElementById('contact_address').value.trim();
  if(!email||!priority||!address){alert('Fill Email, Priority, Address');return;}
  const data={
    user_name:document.getElementById('user_name').value.trim(),
    user_phone:document.getElementById('user_phone').value.trim(),
    maintenance_type:document.getElementById('maintenance_type').value,
    user_email:email,
    audience_level:priority,
    preferred_datetime:document.getElementById('preferred_datetime').value||'',
    message:document.getElementById('message').value.trim()||'',
    contact_address:address
  };
  sessionStorage.setItem('smartfix_booking', JSON.stringify(data));
  document.getElementById('reviewBox').innerHTML=Object.entries(data).map(([k,v])=>`<div><strong>${k.replace('_',' ')}:</strong> ${v||'N/A'}</div>`).join('');
  step2.classList.remove('active'); review.classList.add('active'); prog.style.width='100%';
});

document.getElementById('editBtn').addEventListener('click', ()=>{
  review.classList.remove('active'); step2.classList.add('active'); prog.style.width='66%';
});

let countdownInterval;
document.getElementById('confirmBtn').addEventListener('click', ()=>{
  const raw=sessionStorage.getItem('smartfix_booking');
  if(!raw){alert('No booking found');return;}
  const params=JSON.parse(raw);
  document.getElementById('sending').style.display='block';
  emailjs.send("service_972cf37","template_3epza38", params)
    .then(()=>{
      document.getElementById('sending').style.display='none';
      resultTitle.innerText="✅ Request Sent";
      resultMessage.innerText="Thanks for booking with SmartFix electricals. We will contact you soon.";
      resultPanel.style.display='flex';
      sessionStorage.removeItem('smartfix_booking');
      let seconds=10;
      secondsEl.innerText=seconds;
      countdownInterval=setInterval(()=>{
        seconds--;
        secondsEl.innerText=seconds;
        if(seconds<=0) resetToHome();
      },1000);
    })
    .catch(()=>{
      document.getElementById('sending').style.display='none';
      resultTitle.innerText="❌ Submission Failed";
      resultMessage.innerText="There was an error sending your request. Please try again.";
      resultPanel.style.display='flex';
    });
});

function resetToHome(){
  resultPanel.style.display='none';
  clearInterval(countdownInterval);
  review.classList.remove('active');
  step2.classList.remove('active');
  step1.classList.add('active');
  prog.style.width='33%';
  document.getElementById('formMain')?.reset();
}

// Quick WhatsApp dynamic
['user_name','user_phone','maintenance_type'].forEach(id=>{
  const el=document.getElementById(id);
  el?.addEventListener('input', ()=>{
    const name=document.getElementById('user_name').value.trim()||'[name]';
    const phone=document.getElementById('user_phone').value.trim()||'[phone]';
    const type=document.getElementById('maintenance_type').value||'electrical assistance';
    document.getElementById('quickwhats').href='https://api.whatsapp.com/send?phone=233543899210&text='+encodeURIComponent(`Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`);
  });
});
