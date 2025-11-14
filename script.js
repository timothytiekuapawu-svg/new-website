// Steps
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const review = document.getElementById("review");

const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");
const back1 = document.getElementById("back1");
const back2 = document.getElementById("back2");
const confirmSend = document.getElementById("confirmSend");

const bar = document.getElementById("bar");

// Review fields
const r_name = document.getElementById("r_name");
const r_phone = document.getElementById("r_phone");
const r_type = document.getElementById("r_type");
const r_address = document.getElementById("r_address");

// Result panel
const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const backHome = document.getElementById("backHome");

// Sending loader
const sending = document.getElementById("sending");

// STEP 1 → STEP 2
next1.onclick = () => {
  if (!user_name.value || !user_phone.value || !maintenance_type.value) {
    alert("Please fill all fields");
    return;
  }
  step1.classList.remove("active");
  step2.classList.add("active");
  bar.style.width = "66%";
};

// STEP 2 → REVIEW
next2.onclick = () => {
  if (!contact_address.value.trim()) {
    alert("Please enter your full address");
    return;
  }

  r_name.textContent = user_name.value;
  r_phone.textContent = user_phone.value;
  r_type.textContent = maintenance_type.value;
  r_address.textContent = contact_address.value;

  step2.classList.remove("active");
  review.classList.add("active");
  bar.style.width = "100%";
};

// BACK BUTTONS
back1.onclick = () => {
  step2.classList.remove("active");
  step1.classList.add("active");
  bar.style.width = "33%";
};

back2.onclick = () => {
  review.classList.remove("active");
  step2.classList.add("active");
  bar.style.width = "66%";
};

// CONFIRM & SEND
confirmSend.onclick = () => {
  sending.style.display = "block";

  const params = {
    name: user_name.value,
    phone: user_phone.value,
    type: maintenance_type.value,
    address: contact_address.value
  };

  emailjs
    .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
    .then(() => {
      sending.style.display = "none";
      resultTitle.textContent = "Request Sent Successfully!";
      resultMessage.textContent = "Our team will contact you shortly.";
      result.classList.remove("hidden");

      setTimeout(resetAll, 3000);
    })
    .catch(() => {
      sending.style.display = "none";
      resultTitle.textContent = "Error Sending Request";
      resultMessage.textContent = "Please try again.";
      result.classList.remove("hidden");

      setTimeout(resetAll, 3000);
    });
};

// Back Home button
backHome.onclick = resetAll;

// Reset Everything
function resetAll() {
  result.classList.add("hidden");

  step1.classList.add("active");
  step2.classList.remove("active");
  review.classList.remove("active");

  bar.style.width = "33%";

  document.getElementById("user_name").value = "";
  document.getElementById("user_phone").value = "";
  document.getElementById("maintenance_type").value = "";
  document.getElementById("contact_address").value = "";
}

// WhatsApp Quick Contact Auto-update
["user_name", "user_phone", "maintenance_type"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updateWhatsApp);
});

function updateWhatsApp() {
  const name = user_name.value || "[name]";
  const phone = user_phone.value || "[phone]";
  const type = maintenance_type.value || "electrical service";

  quickwhats.href =
    "https://api.whatsapp.com/send?phone=233543899210&text=" +
    encodeURIComponent(
      `Hello SmartFix, my name is ${name} (${phone}). I need ${type}.`
    );
}
