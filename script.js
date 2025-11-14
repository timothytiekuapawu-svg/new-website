emailjs.init("ad1dHGUf_gonZ5ERG"); // Insert your public key

const welcomePage=document.getElementById('welcomePage');
const bookingPage=document.getElementById('bookingPage');
const step1=document.getElementById('step1');
const step2=document.getElementById('step2');
const review=document.getElementById('review');
const resultPanel=document.getElementById('resultPanel');
const resultTitle=document.getElementById('resultTitle');
const resultMessage=document.getElementById('resultMessage');
const countdownEl=document.getElementById('countdown');
const manualBackBtn=document.getElementById('manualBackBtn');
let countdownInterval;

// --- Welcome page button ---
document.getElementById('startBooking').addEventListener('click', ()=>{
    welcomePage.style.display='none';
    bookingPage.style.display='block';
});

// --- Slideshow ---
let slides=document.querySelectorAll('#slideshow img');
let currentSlide=0;
setInterval(()=>{
    slides[currentSlide].classList.remove('active');
    currentSlide=(currentSlide+1)%slides.length;
    slides[currentSlide].classList.add('active');
},10000); // 10 seconds

// --- Step Navigation ---
document.getElementById('next1').addEventListener('click',()=>{
    const name=document.getElementById('user_name').value.trim();
    const phone=document.getElementById('user_phone').value.trim();
    const type=document.getElementById('maintenance_type').value;
    if(!name||!phone||!type){alert("Fill Name, Phone, Maintenance Type"); return;}
    step1.classList.remove('active'); step2.classList.add('active');
});

document.getElementById('toReview').addEventListener('click',()=>{
    const email=document.getElementById('user_email').value.trim();
    const address=document.getElementById('contact_address').value.trim();
    const priority=document.getElementById('audience_level').value;
    if(!email||!address||!priority){alert("Fill Email, Address, Priority"); return;}
    const data={
        user_name:document.getElementById('user_name').value.trim(),
        user_phone:document.getElementById('user_phone').value.trim(),
        maintenance_type:document.getElementById('maintenance_type').value,
        user_email:email,
        contact_address:address,
        audience_level:priority,
        message:document.getElementById('message').value.trim(),
        preferred_datetime:document.getElementById('preferred_datetime').value
    };
    window.sessionStorage.setItem('smartfix_booking', JSON.stringify(data));
    document.getElementById('reviewBox').innerHTML=Object.entries(data).map(([k,v])=>`<div><strong>${k.replace(/_/g,' ')}:</strong> ${v||'N/A'}</div>`).join('');
    step2.classList.remove('active'); review.classList.add('active');
});

// --- Edit ---
document.getElementById('editBtn').addEventListener('click',()=>{
    review.classList.remove('active'); step2.classList.add('active');
});

// --- Confirm & Send ---
document.getElementById('confirmBtn').addEventListener('click',()=>{
    const params=JSON.parse(window.sessionStorage.getItem('smartfix_booking')||'{}');
    if(!params.user_name){alert("No booking found"); return;}
    document.getElementById('sending').style.display='block';
    emailjs.send("service_972cf37","template_3epza38",params)
    .then(()=>{
        document.getElementById('sending').style.display='none';
        resultTitle.innerText="✅ Request Sent";
        resultMessage.innerText="Thanks for booking with SmartFix electricals. We will contact you soon.";
        resultPanel.classList.add('active');
        startCountdown();
        window.sessionStorage.removeItem('smartfix_booking');
    })
    .catch(()=>{
        document.getElementById('sending').style.display='none';
        resultTitle.innerText="❌ Submission Failed";
        resultMessage.innerText="There was an error sending your request. Please try again.";
        resultPanel.classList.add('active');
        startCountdown();
    });
});

// --- Countdown & Back to Home ---
function startCountdown(){
    let seconds=10;
    countdownEl.innerText=`Returning to home in ${seconds} seconds...`;
    countdownInterval=setInterval(()=>{
        seconds--;
        countdownEl.innerText=`Returning to home in ${seconds} seconds...`;
        if(seconds<=0) resetToHome();
    },1000);
}
manualBackBtn.addEventListener('click', resetToHome);

function resetToHome(){
    clearInterval(countdownInterval);
    resultPanel.classList.remove('active');
    review.classList.remove('active'); step2.classList.remove('active'); step1.classList.add('active');
    bookingPage.style.display='block';
    welcomePage.style.display='none';
    document.getElementById('formMain')?.reset();
}

// --- Quick WhatsApp ---
['user_name','user_phone','maintenance_type'].forEach(id=>{
    document.getElementById(id)?.addEventListener('input',()=>{
        const name=document.getElementById('user_name').value.trim()||'[name]';
        const phone=document.getElementById('user_phone').value.trim()||'[phone]';
        const type=document.getElementById('maintenance_type').value||'electrical assistance';
        document.getElementById('quickwhats').href='https://api.whatsapp.com/send?phone=233543899210&text='+encodeURIComponent(`Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`);
    });
});
