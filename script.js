// EmailJS init
try { emailjs.init("ad1dHGUf_gonZ5ERG"); } catch(e){ console.error(e); }

// Pages
const welcomePage = document.getElementById('welcomePage');
const bookingPage = document.getElementById('bookingPage');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const resultPage = document.getElementById('resultPage');

// Buttons
const welcomeBtn = document.getElementById('welcomeBtn');
const next1 = document.getElementById('next1');
const backWelcome = document.getElementById('backWelcome');
const back1 = document.getElementById('back1');
const toReview = document.getElementById('toReview');
const editBtn = document.getElementById('editBtn');
const confirmBtn = document.getElementById('confirmBtn');
const backHomeBtn = document.getElementById('backHomeBtn');

// Slideshow
const slides = document.querySelectorAll('.slideshow img');
let currentSlide = 0;
setInterval(()=> {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide+1)%slides.length;
  slides[currentSlide].classList.add('active');
},10000); // 10s

// Live DateTime
function updateDateTime(){
  const dt = new Date();
  document.getElementById('liveDateTime').innerText = dt.toLocaleString();
}
setInterval(updateDateTime,1000);
updateDateTime();

// WELCOME PAGE
welcomeBtn.addEventListener('click', ()=>{
  welcomePage.classList.remove('active');
  bookingPage.classList.add('active');
  step1.classList.add('active');
});

// BACK TO WELCOME
backWelcome.addEventListener('click', ()=>{
  bookingPage.classList.remove('active');
  step1.classList.remove('active');
  welcomePage.classList.add('active');
});

// STEP1 -> STEP2
next1.addEventListener('click', ()=>{
  const name = document.getElementById('user_name').value.trim();
  const phone = document.getElementById('user_phone').value.trim();
  const type = document.getElementById('maintenance_type').value;
  if(!name||!phone||!type){ alert('Fill all fields'); return;}
  step1.classList.remove('active');
  step2.classList.add('active');
});

// STEP2 -> REVIEW
toReview.addEventListener('click', ()=>{
  const email = document.getElementById('user_email').value.trim();
  const priority = document.getElementById('audience_level').value;
  const address = document.getElementById('contact_address').value.trim();
  if(!email||!priority||!address){ alert('Fill all fields'); return; }
  const data = {
    user_name:document.getElementById('user_name').value,
    user_phone:document.getElementById('user_phone').value,
    maintenance_type:document.getElementById('maintenance_type').value,
    user_email:email,
    audience_level:priority,
    contact_address:address,
    preferred_datetime:document.getElementById('preferred_datetime').value || '',
    message:document.getElementById('message').value || ''
  };
  sessionStorage.setItem('smartfix_booking', JSON.stringify(data));
  const reviewBox = document.getElementById('reviewBox');
  reviewBox.innerHTML = Object.entries(data).map(([k,v])=>`<div><strong>${k.replace('_',' ')}:</strong> ${v}</div>`).join('');
  step2.classList.remove('active');
  step3.classList.add('active');
});

// REVIEW -> EDIT
editBtn.addEventListener('click', ()=>{
  step3.classList.remove('active');
  step2.classList.add('active');
});

// BACK STEP2 -> STEP1
back1.addEventListener('click', ()=>{
  step2.classList.remove('active');
  step1.classList.add('active');
});

// CONFIRM & SEND
confirmBtn.addEventListener('click', ()=>{
  const raw = sessionStorage.getItem('smartfix_booking');
  if(!raw){ alert('No data'); return;}
  const params = JSON.parse(raw);
  document.getElementById('sending').style.display='block';

  emailjs.send("service_972cf37","template_3epza38",params)
  .then(()=>{
    document.getElementById('sending').style.display='none';
    showResult('✅ Request Sent','Thanks for booking. We will contact you soon.');
  }).catch(()=>{
    document.getElementById('sending').style.display='none';
    showResult('❌ Submission Failed','Error sending your request. Try again.');
  });
});

function showResult(title,msg){
  step1.classList.remove('active');
  step2.classList.remove('active');
  step3.classList.remove('active');
  bookingPage.classList.remove('active');
  resultPage.classList.add('active');
  document.getElementById('resultTitle').innerText=title;
  document.getElementById('resultMessage').innerText=msg;

  let seconds = 10;
  const countdownText = document.getElementById('countdownText');
  countdownText.innerText = `Returning to home in ${seconds}s`;
  const interval = setInterval(()=>{
    seconds--;
    countdownText.innerText = `Returning to home in ${seconds}s`;
    if(seconds<=0){
      clearInterval(interval);
      resetToHome();
    }
  },1000);
}

// BACK TO HOME MANUAL
backHomeBtn.addEventListener('click', resetToHome);

function resetToHome(){
  resultPage.classList.remove('active');
  welcomePage.classList.add('active');
  sessionStorage.removeItem('smartfix_booking');
  document.getElementById('user_name').value='';
  document.getElementById('user_phone').value='';
  document.getElementById('maintenance_type').value='';
  document.getElementById('user_email').value='';
  document.getElementById('audience_level').value='';
  document.getElementById('contact_address').value='';
  document.getElementById('preferred_datetime').value='';
  document.getElementById('message').value='';
}

// QUICK WHATSAPP DYNAMIC
['user_name','user_phone','maintenance_type'].forEach(id=>{
  document.getElementById(id).addEventListener('input',()=>{
    const name=document.getElementById('user_name').value||'[name]';
    const phone=document.getElementById('user_phone').value||'[phone]';
    const type=document.getElementById('maintenance_type').value||'electrical help';
    document.getElementById('quickwhats').href='https://api.whatsapp.com/send?phone=233543899210&text='+encodeURIComponent(`Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`);
  });
});
