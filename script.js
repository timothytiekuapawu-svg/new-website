document.addEventListener('DOMContentLoaded', ()=>{

  /* ============ Welcome page ============ */
  const welcomeBtn = document.getElementById('welcomeBtn');
  const dateEl = document.getElementById('liveDateTime');
  if(dateEl){
    const tick = ()=> dateEl.innerText = new Date().toLocaleString();
    tick();
    setInterval(tick, 1000);
  }
  if(welcomeBtn){
    welcomeBtn.addEventListener('click', ()=> location.href = 'booking.html');
  }

  /* ============ Slideshow ============ */
  const slides = Array.from(document.querySelectorAll('.slide'));
  let idx = 0;
  function showSlide(i){
    if(slides.length === 0) return;
    slides.forEach((s, n)=> s.classList.toggle('active', n === i));
  }
  if(slides.length > 0){
    showSlide(idx);
    setInterval(()=>{ idx = (idx + 1) % slides.length; showSlide(idx); }, 10000);
  }

  /* ============ Steps logic ============ */
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const review = document.getElementById('review');

  // Step1 next
  document.getElementById('next1')?.addEventListener('click', ()=>{
    const n = document.getElementById('user_name').value.trim();
    const p = document.getElementById('user_phone').value.trim();
    const t = document.getElementById('maintenance_type').value;
    if(!n || !p || !t){
      alert('Please fill Full Name, Phone and Maintenance Type.');
      return;
    }
    step1.classList.remove('active'); step2.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // Back to welcome
  document.getElementById('backToWelcome')?.addEventListener('click', ()=> location.href = 'index.html');

  // Step2 back
  document.getElementById('back1')?.addEventListener('click', ()=>{
    step2.classList.remove('active'); step1.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // Step2 to review
  document.getElementById('toReview')?.addEventListener('click', ()=>{
    const email = document.getElementById('user_email').value.trim();
    const priority = document.getElementById('audience_level').value;
    const address = document.getElementById('contact_address').value.trim();
    if(!email || !priority || !address){
      alert('Please fill Email, Priority and Contact Address.');
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

    window.sessionStorage.setItem('smartfix_booking', JSON.stringify(data));

    const reviewBox = document.getElementById('reviewBox');
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

    step2.classList.remove('active'); review.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // Edit (back to step2)
  document.getElementById('editBtn')?.addEventListener('click', ()=>{
    review.classList.remove('active'); step2.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  });

  /* ============ Quick WhatsApp dynamic update ============ */
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

  /* ============ EmailJS send & result page ============ */
  // Init EmailJS (replace with your public user key)
  if(typeof emailjs !== 'undefined'){
    try{ emailjs.init('ad1dHGUf_gonZ5ERG'); }catch(e){ console.warn('EmailJS init failed',e); }
  }

  document.getElementById('confirmBtn')?.addEventListener('click', ()=>{
    const raw = window.sessionStorage.getItem('smartfix_booking');
    if(!raw){ alert('No booking found.'); return; }
    const params = JSON.parse(raw);

    // show spinner
    const spinner = document.getElementById('sending');
    if(spinner) spinner.style.display = '';

    // If emailjs not available, simulate success
    if(typeof emailjs === 'undefined' || !emailjs.send){
      setTimeout(()=>{ if(spinner) spinner.style.display='none'; showResult(true, 'Thanks for booking with SmartFix. We will contact you soon.'); window.sessionStorage.removeItem('smartfix_booking'); }, 900);
      return;
    }

    // send with emailjs (replace service/template)
    emailjs.send('service_972cf37','template_3epza38', params)
      .then(()=>{ if(spinner) spinner.style.display='none'; showResult(true, 'Thanks for booking with SmartFix. We will contact you soon.'); window.sessionStorage.removeItem('smartfix_booking'); })
      .catch((err)=>{ console.error('EmailJS error', err); if(spinner) spinner.style.display='none'; showResult(false, 'There was an error sending your request. Please try again.'); });

  });

  /* Result page & countdown */
  const resultPage = document.getElementById('resultPage');
  const resultTitle = document.getElementById('resultTitle');
  const resultMessage = document.getElementById('resultMessage');
  const countdownText = document.getElementById('countdownText');
  let timer = null;

  function showResult(success, message){
    if(!resultPage) return;
    resultTitle.innerText = success ? '✅ Request Sent' : '❌ Submission Failed';
    resultMessage.innerText = message;
    resultPage.classList.add('active');
    resultPage.setAttribute('aria-hidden','false');

    let seconds = 10;
    if(countdownText) countdownText.innerText = `Returning to home in ${seconds} seconds...`;
    timer = setInterval(()=>{
      seconds--;
      if(countdownText) countdownText.innerText = `Returning to home in ${seconds} seconds...`;
      if(seconds <= 0){
        clearInterval(timer);
        resetToStep1();
      }
    }, 1000);
  }

  document.getElementById('manualBack')?.addEventListener('click', ()=>{
    if(timer) clearInterval(timer);
    resetToStep1();
  });

  function resetToStep1(){
    // hide result
    if(resultPage){ resultPage.classList.remove('active'); resultPage.setAttribute('aria-hidden','true'); }
    // reset steps
    step1.classList.add('active');
    step2.classList.remove('active');
    review.classList.remove('active');
    // clear inputs
    ['user_name','user_phone','maintenance_type','user_email','audience_level','contact_address','preferred_datetime','message'].forEach(id=>{
      const el = document.getElementById(id); if(!el) return; el.value = '';
    });
    window.sessionStorage.removeItem('smartfix_booking');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  /* small helper */
  function escapeHtml(s){ if(!s) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

}); // DOMContentLoaded
