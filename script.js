/* ============================
   Shared helpers & DOM ready
   ============================ */
document.addEventListener('DOMContentLoaded', ()=>{

  /* --------- Welcome page logic --------- */
  const welcomeBtn = document.getElementById('welcomeBtn');
  const liveDateTime = document.getElementById('liveDateTime');

  if(welcomeBtn){
    welcomeBtn.addEventListener('click', ()=> location.href = 'booking.html');
  }
  if(liveDateTime){
    const update = ()=> liveDateTime.innerText = new Date().toLocaleString();
    update();
    setInterval(update, 1000);
  }

  /* --------- Slideshow (booking page) --------- */
  const slides = Array.from(document.querySelectorAll('.slide'));
  let current = 0;
  function showSlide(index){
    if(slides.length===0) return;
    slides.forEach((s,i)=> s.classList.toggle('active', i===index));
  }
  if(slides.length>0){
    showSlide(current);
    setInterval(()=>{ current = (current+1) % slides.length; showSlide(current); }, 10000); // 10s
  }

  /* --------- Booking steps elements --------- */
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const review = document.getElementById('review');

  // Step1 -> next
  document.getElementById('next1')?.addEventListener('click', ()=>{
    const name = document.getElementById('user_name').value.trim();
    const phone = document.getElementById('user_phone').value.trim();
    const type = document.getElementById('maintenance_type').value;
    if(!name || !phone || !type){
      alert('Please fill Full Name, Phone and Maintenance Type.');
      return;
    }
    step1.classList.remove('active');
    step2.classList.add('active');
    step2.scrollIntoView({behavior:'smooth'});
  });

  // Back to welcome from step1
  document.getElementById('backToWelcome')?.addEventListener('click', ()=> location.href = 'index.html');

  // Step2 -> back
  document.getElementById('back1')?.addEventListener('click', ()=>{
    step2.classList.remove('active');
    step1.classList.add('active');
    step1.scrollIntoView({behavior:'smooth'});
  });

  // Step2 -> Review
  document.getElementById('toReview')?.addEventListener('click', ()=>{
    const email = document.getElementById('user_email').value.trim();
    const priority = document.getElementById('audience_level').value;
    const address = document.getElementById('contact_address').value.trim();
    if(!email || !priority || !address){
      alert('Please fill Email, Priority and Contact Address before reviewing.');
      return;
    }

    const data = {
      user_name: document.getElementById('user_name').value.trim(),
      user_phone: document.getElementById('user_phone').value.trim(),
      maintenance_type: document.getElementById('maintenance_type').value,
      user_email: email,
      audience_level: priority,
      preferred_datetime: document.getElementById('preferred_datetime').value || '',
      message: document.getElementById('message').value.trim() || '',
      contact_address: address
    };

    // Save to session so confirm button can get it
    window.sessionStorage.setItem('smartfix_booking', JSON.stringify(data));

    // Render review box
    const reviewBox = document.getElementById('reviewBox');
    if(reviewBox){
      reviewBox.innerHTML = `
        <div><strong>Name:</strong> ${escapeHtml(data.user_name)}</div>
        <div><strong>Phone:</strong> ${escapeHtml(data.user_phone)}</div>
        <div><strong>Maintenance Type:</strong> ${escapeHtml(data.maintenance_type)}</div>
        <div><strong>Email:</strong> ${escapeHtml(data.user_email)}</div>
        <div><strong>Priority:</strong> ${escapeHtml(data.audience_level)}</div>
        <div><strong>Preferred Date & Time:</strong> ${escapeHtml(data.preferred_datetime || 'Not specified')}</div>
        <div><strong>Address:</strong> ${escapeHtml(data.contact_address)}</div>
        <div><strong>Description:</strong> ${escapeHtml(data.message || 'No description provided')}</div>
      `;
    }

    step2.classList.remove('active');
    review.classList.add('active');
    review.scrollIntoView({behavior:'smooth'});
  });

  // Edit back to step2
  document.getElementById('editBtn')?.addEventListener('click', ()=>{
    review.classList.remove('active');
    step2.classList.add('active');
    step2.scrollIntoView({behavior:'smooth'});
  });

  /* Quick WhatsApp dynamic link */
  ['user_name','user_phone','maintenance_type'].forEach(id=>{
    const el = document.getElementById(id);
    el?.addEventListener('input', ()=>{
      const name = document.getElementById('user_name').value.trim() || '[name]';
      const phone = document.getElementById('user_phone').value.trim() || '[phone]';
      const type = document.getElementById('maintenance_type').value || 'electrical assistance';
      const text = `Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`;
      const a = document.getElementById('quickwhats');
      if(a) a.href = 'https://api.whatsapp.com/send?phone=233543899210&text=' + encodeURIComponent(text);
    });
  });

  /* --------- Confirm & Send (EmailJS) --------- */
  // Initialize EmailJS - replace placeholders with your IDs
  if(typeof emailjs !== 'undefined'){
    try{
      emailjs.init('ad1dHGUf_gonZ5ERG'); // <-- replace with your EmailJS public key
    }catch(e){
      console.warn('EmailJS init error:', e);
    }
  }

  document.getElementById('confirmBtn')?.addEventListener('click', ()=>{
    const raw = window.sessionStorage.getItem('smartfix_booking');
    if(!raw){
      alert('No booking data. Please review your form.');
      return;
    }
    const params = JSON.parse(raw);

    // show spinner
    const sending = document.getElementById('sending');
    if(sending) sending.style.display = '';

    // if emailjs not present, simulate success
    if(typeof emailjs === 'undefined' || !emailjs.send){
      setTimeout(()=>{
        if(sending) sending.style.display = 'none';
        showResultPage(true, 'Thanks for booking with SmartFix. We will contact you soon.');
        window.sessionStorage.removeItem('smartfix_booking');
      }, 900);
      return;
    }

    // send via EmailJS - replace SERVICE ID and TEMPLATE ID
    emailjs.send('service_972cf37','template_3epza38', params)
      .then(()=>{
        if(sending) sending.style.display = 'none';
        showResultPage(true, 'Thanks for booking with SmartFix. We will contact you soon.');
        window.sessionStorage.removeItem('smartfix_booking');
      })
      .catch((err)=>{
        console.error('EmailJS error:', err);
        if(sending) sending.style.display = 'none';
        showResultPage(false, 'There was an error sending your request. Please try again.');
      });
  });

  /* --------- Result / Count-down / Back to Home --------- */
  const resultPage = document.getElementById('resultPage');
  const resultTitle = document.getElementById('resultTitle');
  const resultMessage = document.getElementById('resultMessage');
  const countdownEl = document.getElementById('countdown');

  let countdownTimer = null;
  function showResultPage(success, message){
    if(!resultPage) return;
    resultTitle.innerText = success ? '✅ Request Sent' : '❌ Submission Failed';
    resultMessage.innerText = message;
    resultPage.classList.add('active');
    resultPage.setAttribute('aria-hidden','false');

    // start countdown to reset to step1
    let seconds = 10;
    if(countdownEl) countdownEl.innerText = `Returning to home in ${seconds} seconds...`;
    countdownTimer = setInterval(()=>{
      seconds--;
      if(countdownEl) countdownEl.innerText = `Returning to home in ${seconds} seconds...`;
      if(seconds <= 0){
        clearInterval(countdownTimer);
        resetToStep1();
      }
    }, 1000);
  }

  // Manual back
  document.getElementById('manualBack')?.addEventListener('click', ()=>{
    if(countdownTimer) clearInterval(countdownTimer);
    resetToStep1();
  });

  function resetToStep1(){
    // hide result
    if(resultPage) { resultPage.classList.remove('active'); resultPage.setAttribute('aria-hidden','true'); }
    // reset steps
    step1.classList.add('active');
    step2.classList.remove('active');
    review.classList.remove('active');

    // clear fields (optional: keep some if you want)
    const fields = ['user_name','user_phone','maintenance_type','user_email','audience_level','contact_address','preferred_datetime','message'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      if(el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = '';
    });
    window.sessionStorage.removeItem('smartfix_booking');
    // scroll to top
    window.scrollTo({top:0,behavior:'smooth'});
  }

  /* escape helper */
  function escapeHtml(s){
    if(!s) return '';
    return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }

}); // DOMContentLoaded end
