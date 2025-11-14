// EmailJS init (insert your public key here)
emailjs.init("ad1dHGUf_gonZ5ERG");

// Welcome Page
const welcome = document.getElementById('welcome');
const bookingPage = document.getElementById('bookingPage');
document.getElementById('enterBooking').addEventListener('click', ()=>{
  welcome.style.display='none';
  bookingPage.style.display='block';
});

// Welcome Date & Time
const welcomeDateTime = document.getElementById('welcomeDateTime');
function updateDateTime(){
  const now = new Date();
  welcomeDateTime.innerText = now.toLocaleString();
}
setInterval(updateDateTime,1000);
updateDateTime();

// Slideshow
let slideIndex=0;
const slides=document.querySelectorAll('.slide');
function showSlides(){
  slides.forEach(s=>s.classList.remove('active'));
  slideIndex=(slideIndex+1)%slides.length;
  slides[slideIndex].classList.add('active');
}
setInterval(showSlides,10000);

// Steps
const step1=document.getElementById('step1');
const step2=document.getElementById('step2');
const review=document.getElementById('review');

// Step Navigation
document.getElementById('next1').addEventListener('click', ()=>{
  const n=document.getElementById('user_name').value.trim();
  const p=document.getElementById('user_phone').value.trim();
  const t=document.getElementById('maintenance_type').value;
  if(!n||!p||!t){alert('Fill Name, Phone, and Maintenance Type');return;}
  step1.classList.remove('active');
  step2.classList.add('active');
});

document.getElementById('back1').addEventListener('click', ()=>{
  step2.classList.remove('active');
  step1.classList.add('active');
});

document.getElementById('toReview').addEventListener('click', ()=>{
  const email=document.getElementById('user_email').value.trim();
  const priority=document.getElementById('audience_level').value;
  const address=document.getElementById('contact_address').value.trim();
  if(!email||!priority||!address){alert('Fill Email, Priority, and Address');return;}
  
  const data={
    user_name: document.getElementById('user_name').value,
    user_phone: document.getElementById('user_phone').value,
    maintenance_type: document.getElementById('maintenance_type').value,
    user_email: email,
    audience_level: priority,
    contact_address: address,
    preferred_datetime: document.getElementById('preferred_datetime').value,
    message: document.getElementById('message').value
  };
  window.sessionStorage.setItem('smartfix_booking', JSON.stringify(data));

  document.getElementById('reviewBox').innerHTML=`
    <div><strong>Name:</strong> ${data.user_name}</div>
    <div><strong>Phone:</strong> ${data.user_phone}</div>
    <div><strong>Maintenance Type:</strong> ${data.maintenance_type}</div>
    <div><strong>Email:</strong> ${data.user_email}</div>
    <div><strong>Priority:</strong> ${data.audience_level}</div>
    <div><strong>Address:</strong> ${data.contact_address}</div>
    <div><strong>Date & Time:</strong> ${data.preferred_datetime||'Not specified'}</div>
    <div><strong>Description:</strong> ${data.message||'None'}</div>
  `;
  step2.classList.remove('active');
  review.classList.add('active');
});

document.getElementById('editBtn').addEventListener('click', ()=>{
  review.classList.remove('active');
  step2.classList.add('active');
});

// Confirm & Send using EmailJS
document.getElementById('confirmBtn').addEventListener('click', ()=>{
  const raw=window.sessionStorage.getItem('smartfix_booking');
  if(!raw){alert('No booking found'); return;}
  const params=JSON.parse(raw);
  document.getElementById('sending').style.display='block';

  // Replace service ID and template ID
  emailjs.send("service_972cf37","template_3epza38", params)
    .then(()=>{
      document.getElementById('sending').style.display='none';
      showResult("✅ Request Sent", "Thanks for booking with SmartFix. We will contact you soon.");
      window.sessionStorage.removeItem('smartfix_booking');
    })
    .catch(()=>{
      document.getElementById('sending').style.display='none';
      showResult("❌ Submission Failed", "There was an error sending your request. Please try again.");
    });
});

function showResult(title,msg){
  const resultPanel=document.getElementById('resultPanel');
  const resultTitle=document.getElementById('resultTitle');
  const resultMessage=document.getElementById('resultMessage');
  const countdown=document.getElementById('countdown');

  resultTitle.innerText=title;
  resultMessage.innerText=msg;
  resultPanel.style.display='flex';

  let seconds=10;
  countdown.innerText=`Returning to home in ${seconds} seconds`;
  const interval=setInterval(()=>{
    seconds--;
    countdown.innerText=`Returning to home in ${seconds} seconds`;
    if(seconds<=0){clearInterval(interval); backToHome();}
  },1000);
}

document.getElementById('backHome').addEventListener('click', backToHome);

function backToHome(){
  document.getElementById('resultPanel').style.display='none';
  step1.classList.add('active');
  step2.classList.remove('active');
  review.classList.remove('active');

  document.getElementById('user_name').value='';
  document.getElementById('user_phone').value='';
  document.getElementById('maintenance_type').value='';
  document.getElementById('user_email').value='';
  document.getElementById('audience_level').value='';
  document.getElementById('contact_address').value='';
  document.getElementById('preferred_datetime').value='';
  document.getElementById('message').value='';
}

// Quick WhatsApp dynamic
['user_name','user_phone','maintenance_type'].forEach(id=>{
  document.getElementById(id).addEventListener('input',()=>{
    const name=document.getElementById('user_name').value.trim()||'[name]';
    const phone=document.getElementById('user_phone').value.trim()||'[phone]';
    const type=document.getElementById('maintenance_type').value||'electrical assistance';
    document.getElementById('quickwhats').href='https://api.whatsapp.com/send?phone=233543899210&text='+encodeURIComponent(`Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`);
  });
});
