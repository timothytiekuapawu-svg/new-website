// === Welcome Page ===
const welcomeBtn = document.getElementById('welcomeBtn');
if(welcomeBtn){
  welcomeBtn.addEventListener('click', ()=>{ window.location.href="booking.html"; });
}

// Live date & time
const dateTimeEl = document.getElementById('liveDateTime');
function updateDateTime(){
  if(dateTimeEl){
    const now=new Date();
    dateTimeEl.innerText=now.toLocaleString();
  }
}
setInterval(updateDateTime,1000);
updateDateTime();

// === Slideshow ===
let currentSlide=0;
const slides=document.querySelectorAll('.slide');
function showSlide(){
  slides.forEach((s,i)=>s.classList.toggle('active',i===currentSlide));
  currentSlide=(currentSlide+1)%slides.length;
}
if(slides.length>0) showSlide();
setInterval(showSlide,10000); // 10 seconds

// === Booking Steps ===
const step1=document.getElementById('step1'),
      step2=document.getElementById('step2'),
      review=document.getElementById('review'),
      prog=0;

document.getElementById('next1')?.addEventListener('click',()=>{
  const n=document.getElementById('user_name').value.trim(),
        p=document.getElementById('user_phone').value.trim(),
        t=document.getElementById('maintenance_type').value;
  if(!n||!p||!t){alert('Fill Name, Phone, Maintenance');return;}
  step1.classList.remove('active'); step2.classList.add('active');
});

document.getElementById('back1')?.addEventListener('click',()=>{
  step2.classList.remove('active'); step1.classList.add('active');
});

document.getElementById('backWelcome')?.addEventListener('click',()=>{
  window.location.href="index.html";
});

// Quick WhatsApp
['user_name','user_phone','maintenance_type'].forEach(id=>{
  const el=document.getElementById(id);
  el?.addEventListener('input', ()=>{
    const name=document.getElementById('user_name').value.trim()||'[name]',
          phone=document.getElementById('user_phone').value.trim()||'[phone]',
          type=document.getElementById('maintenance_type').value||'electrical assistance';
    document.getElementById('quickwhats').href='https://api.whatsapp.com/send?phone=233543899210&text='+encodeURIComponent(`Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`);
  });
});

// Review & Confirm
document.getElementById('toReview')?.addEventListener('click',()=>{
  const email=document.getElementById('user_email').value.trim(),
        priority=document.getElementById('audience_level').value,
        address=document.getElementById('contact_address').value.trim();
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
  window.sessionStorage.setItem('smartfix_booking',JSON.stringify(data));
  document.getElementById('reviewBox').innerHTML=`
    <div><strong>Name:</strong> ${data.user_name}</div>
    <div><strong>Phone:</strong> ${data.user_phone}</div>
    <div><strong>Maintenance Type:</strong> ${data.maintenance_type}</div>
    <div><strong>Email:</strong> ${data.user_email}</div>
    <div><strong>Priority:</strong> ${data.audience_level}</div>
    <div><strong>Preferred Date & Time:</strong> ${data.preferred_datetime||'Not specified'}</div>
    <div><strong>Address:</strong> ${data.contact_address}</div>
    <div><strong>Description:</strong> ${data.message||'No description provided'}</div>
  `;
  step2.classList.remove('active'); review.classList.add('active');
});

document.getElementById('editBtn')?.addEventListener('click',()=>{
  review.classList.remove('active'); step2.classList.add('active');
});

// EmailJS Sending
emailjs.init("ad1dHGUf_gonZ5ERG"); // Replace with your public key
document.getElementById('confirmBtn')?.addEventListener('click',()=>{
  const raw=window.sessionStorage.getItem('smartfix_booking');
  if(!raw){alert('No booking found');return;}
  const params=JSON.parse(raw);
  document.getElementById('sending').style.display='block';
  emailjs.send("service_972cf37","template_3epza38",params)
    .then(()=>{
      document.getElementById('sending').style.display='none';
      showResult("✅ Request Sent","Thanks for booking. We will contact you soon.");
    })
    .catch(()=>{
      document.getElementById('sending').style.display='none';
      showResult("❌ Submission Failed","Error sending request. Try again.");
    });
});

function showResult(title,msg){
  const panel=document.getElementById('resultPanel'),
        titleEl=document.getElementById('resultTitle'),
        msgEl=document.getElementById('resultMessage'),
        countdownEl=document.getElementById('countdownText');
  titleEl.innerText=title; msgEl.innerText=msg;
  panel.classList.add('active');
  let seconds=10;
  countdownEl.innerText=`Returning to home in ${seconds}s...`;
  const interval=setInterval(()=>{
    seconds--; countdownEl.innerText=`Returning to home in ${seconds}s...`;
    if(seconds<=0){ clearInterval(interval); resetToHome(); }
  },1000);
  document.getElementById('backHomeBtn').onclick=()=>{ clearInterval(interval); resetToHome(); };
}

function resetToHome(){
  const panel=document.getElementById('resultPanel');
  panel.classList.remove('active');
  step1.classList.add('active');
  step2.classList.remove('active');
  review.classList.remove('active');
  document.getElementById('formMain')?.reset();
  window.sessionStorage.removeItem('smartfix_booking');
}
