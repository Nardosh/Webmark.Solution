// ——— INIT AOS ———
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

// ——— CURSOR ———
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 6 + 'px'; cursor.style.top = my - 6 + 'px';
});
function animateRing() {
  rx += (mx - rx - 18) * .1; ry += (my - ry - 18) * .1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();
document.querySelectorAll('a,button,.service-card,.pricing-card,.portfolio-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; ring.style.transform = 'scale(1.4)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; ring.style.transform = 'scale(1)'; });
});

// ——— SCROLL PROGRESS ———
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  bar.style.width = pct + '%';
  // navbar
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 60);
  // counters
  triggerCounters();
});

// ——— NAV ———
function toggleNav() {
  document.getElementById('nav-links').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// ——— PARTICLES ———
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + .5,
    dx: (Math.random() - .5) * .4,
    dy: (Math.random() - .5) * .4,
    o: Math.random() * .5 + .1
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${p.o})`; ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  // connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (d < 100) {
        ctx.beginPath(); ctx.strokeStyle = `rgba(124,58,237,${.15 * (1 - d / 100)})`;
        ctx.lineWidth = .5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ——— ABOUT DOTS ———
const dotsEl = document.getElementById('about-dots');
const activeIndices = [1, 4, 7, 10, 12, 15, 18, 20, 23, 25, 28, 30];
for (let i = 0; i < 36; i++) {
  const d = document.createElement('div');
  d.className = 'about-dot' + (activeIndices.includes(i) ? ' active' : '');
  dotsEl.appendChild(d);
}

// ——— COUNTERS ———
let counted = false;
function triggerCounters() {
  if (counted) return;
  const aboutSec = document.getElementById('about');
  if (!aboutSec) return;
  const rect = aboutSec.getBoundingClientRect();
  if (rect.top < window.innerHeight * .85) {
    counted = true;
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = +el.getAttribute('data-target');
      let cur = 0;
      const inc = target / 60;
      const step = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.floor(cur) + (target >= 100 ? '+' : '');
        if (cur < target) requestAnimationFrame(step);
      };
      step();
    });
  }
}

// ——— PORTFOLIO FILTER ———
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ——— TESTIMONIALS ———
let testiIdx = 0;
const track = document.getElementById('testimonials-track');
const dots = document.querySelectorAll('.testi-dot');
function goToTestimonial(i) {
  testiIdx = i;
  track.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
}
function nextTestimonial() { goToTestimonial((testiIdx + 1) % 3); }
function prevTestimonial() { goToTestimonial((testiIdx + 2) % 3); }
setInterval(nextTestimonial, 5000);

// ——— CONTACT FORM ———
function showNotif(msg, success = true) {
  const n = document.getElementById('notif');
  const t = document.getElementById('notif-text');
  t.textContent = msg;
  n.querySelector('.icon').textContent = success ? '✅' : '❌';
  n.style.borderColor = success ? 'rgba(6,255,165,.3)' : 'rgba(239,68,68,.3)';
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3500);
}
function submitForm() {
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const service = document.getElementById('form-service').value;
  if (!name || !email) { showNotif('Please fill in required fields.', false); return; }
  showNotif(`Thanks ${name}! We'll reach out to you soon.`);
  document.getElementById('form-name').value = '';
  document.getElementById('form-email').value = '';
  document.getElementById('form-phone').value = '';
  document.getElementById('form-service').value = '';
  document.getElementById('form-message').value = '';
}

// ——— CHATBOT ———
const chatWindow = document.getElementById('chat-window');
const chatToggle = document.getElementById('chat-toggle');
const chatMessages = document.getElementById('chat-messages');
let chatOpen = false, firstOpen = true;

const botReplies = {
  pricing: `Our plans start at ₹9,999/mo:\n• Starter – ₹9,999/mo (5-page site + basic SEO)\n• Growth – ₹24,999/mo (full digital marketing suite)\n• Enterprise – ₹49,999/mo (custom solutions)\n\nWant a custom quote? Just ask! 🎯`,
  services: `We offer 6 core services:\n🌐 Web Design & Development\n🔍 SEO Optimization\n📱 Social Media Marketing\n🎨 Brand Identity Design\n📧 Content Marketing\n📊 PPC Advertising\n\nWhich service interests you most?`,
  contact: `You can reach us via:\n📞 WhatsApp: +91 70510 86745\n📧 Email: hello@webmarksolution.com\n⏰ Hours: Mon–Sat, 9AM–7PM IST\n\nOr click the WhatsApp button at the bottom left! 💬`,
  portfolio: `We've worked on 500+ projects across:\n🛒 E-Commerce platforms\n📈 SEO campaigns (+340% traffic results)\n🎨 Brand identity systems\n📱 Mobile app design\n🍽️ Restaurant & hospitality sites\n\nCheck our Portfolio section above! 🚀`,
  hello: `Hi there! 👋 I'm the Webmark AI Assistant.\n\nI can help you with:\n• 💰 Pricing & packages\n• ⚡ Our services\n• 📞 Contact details\n• 🎨 Portfolio\n\nWhat would you like to know?`,
  hi: `Hello! 😊 Great to hear from you. How can I help you grow your business today?`,
  default: `That's a great question! For detailed answers, I'd recommend reaching out to our team directly.\n\n📞 WhatsApp: +91 70510 86745\n📧 hello@webmarksolution.com\n\nOr ask about: pricing, services, contact, or portfolio! 🚀`
};

function toggleChat() {
  chatOpen = !chatOpen;
  chatWindow.classList.toggle('open', chatOpen);
  chatToggle.classList.toggle('open', chatOpen);
  if (chatOpen && firstOpen) {
    firstOpen = false;
    setTimeout(() => addBotMessage("Hi there! 👋 I'm Webmark's AI Assistant. How can I help you today?\n\nYou can ask about our **services**, **pricing**, **portfolio**, or **contact** info!"), 600);
  }
}

function addBotMessage(text) {
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  setTimeout(() => {
    typing.remove();
    const msg = document.createElement('div');
    msg.className = 'msg bot';
    msg.style.whiteSpace = 'pre-wrap';
    msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msg.appendChild(time);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000 + Math.random() * 500);
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'msg user';
  msg.textContent = text;
  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msg.appendChild(time);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getReply(input) {
  const t = input.toLowerCase();
  if (t.includes('price') || t.includes('pricing') || t.includes('cost') || t.includes('plan')) return botReplies.pricing;
  if (t.includes('service') || t.includes('offer') || t.includes('what do')) return botReplies.services;
  if (t.includes('contact') || t.includes('phone') || t.includes('email') || t.includes('reach')) return botReplies.contact;
  if (t.includes('portfolio') || t.includes('work') || t.includes('project')) return botReplies.portfolio;
  if (t.includes('hello') || t.includes('hey')) return botReplies.hello;
  if (t.includes('hi')) return botReplies.hi;
  if (t.includes('seo')) return `We're SEO experts! 🔍\n\nOur SEO service includes:\n• Technical SEO audit\n• Keyword research & strategy\n• On-page + off-page optimization\n• Monthly ranking reports\n• Link building campaigns\n\nClients typically see results in 2-3 months. Want to know pricing?`;
  if (t.includes('web') || t.includes('website') || t.includes('design')) return `We build stunning websites! 🌐\n\nOur web service includes:\n• Custom design (no templates)\n• Mobile-first responsive layout\n• Fast loading & SEO-ready\n• CMS integration (WordPress etc.)\n• 3 months free support\n\nStarts from ₹9,999. Interested?`;
  return botReplies.default;
}


// old
// function sendChat(){
//   const input=document.getElementById('chat-input');
//   const text=input.value.trim();
//   if(!text)return;
//   addUserMessage(text);
//   input.value='';
//   addBotMessage(getReply(text));
// }


function addMessage(text, type) {
  const chat = document.getElementById("chat-messages");

  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerHTML = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


// new

async function sendChat() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  // typing indicator
  addMessage("Typing...", "bot");

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      // headers: {
      //   "Authorization": "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",
      //   "Content-Type": "application/json"
      // },
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5500",
        "X-Title": "Webmark Chatbot"

      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        // model: "openchat/openchat-3.5",
        messages: [

          { role: "system", content: "You are a sales assistant for Webmark Solution. Convert visitors into clients. Be short, persuasive and helpful." },

          { role: "user", content: msg }

        ]
      })
    });

    const data = await res.json();

    const lastMsg = document.querySelector(".msg.bot:last-child");
    if (lastMsg) lastMsg.remove();

    const reply = data?.choices?.[0]?.message?.content || "No response from AI";
    addMessage(reply, "bot");

  } catch (err) {
    addMessage("Error connecting AI. Try again.", "bot");
  }
}



// async function sendChat() {
//   const msg = "hello test";

//   try {
//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer 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",
//         "Content-Type": "application/json",
//         "HTTP-Referer": "http://localhost:5500",
//         "X-Title": "Test"
//       },
//       body: JSON.stringify({
//         model: "openchat/openchat-3.5",
//         messages: [
//           { role: "user", content: msg }
//         ]
//       })
//     });

//     console.log("STATUS:", res.status);

//     const data = await res.json();
//     console.log("DATA:", data);

//   } catch (err) {
//     console.error(err);
//   }
// }


function quickReply(topic) {
  addUserMessage(topic.charAt(0).toUpperCase() + topic.slice(1));
  addBotMessage(botReplies[topic] || botReplies.default);
}

// Auto-open chat after 8s
setTimeout(() => {
  if (!chatOpen) {
    toggleChat();
  }
}, 8000);



// formsubmit 


function showNotification(text) {
  const notif = document.getElementById("notif");
  const notifText = document.getElementById("notif-text");

  notifText.innerText = text;
  notif.classList.add("show");

  setTimeout(() => {
    notif.classList.remove("show");
  }, 3000);
}



async function submitForm() {

  const name = document.getElementById("form-name").value.trim();
  const email = document.getElementById("form-email").value.trim();
  const phone = document.getElementById("form-phone").value.trim();
  const service = document.getElementById("form-service").value;
  const message = document.getElementById("form-message").value.trim();

  // validation
  if (!name || !email) {
    showNotification("❌ Name & Email required");
    return;
  }

  showNotification("⏳ Sending...");

  try {
    const res = await fetch("https://formsubmit.co/ajax/a276bd769ca66e0e20ce9f17afe705ee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        service,
        message,
        _subject: "🔥 New Lead from Webmark"
      })
    });

    const data = await res.json();

    if (data.success) {
      showNotification("✅ Message sent!");

      // reset fields
      document.getElementById("form-name").value = "";
      document.getElementById("form-email").value = "";
      document.getElementById("form-phone").value = "";
      document.getElementById("form-service").value = "";
      document.getElementById("form-message").value = "";
    } else {
      showNotification("❌ Failed to send");
    }

  } catch (err) {
    console.error(err);
    showNotification("❌ Error sending");
  }
}