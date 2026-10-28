const chatForm  = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox   = document.getElementById('chat-box');
const autoBtn   = document.getElementById('auto-toggle');

const greetingHTML = chatBox.innerHTML;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- chat logic ---------- */
chatForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const message = userInput.value.trim();
  if (message === '') return;

  addMessage('user', message);
  respond(message.toLowerCase());
  userInput.value = '';
});

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
  messageDiv.innerText = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getResponse(message) {
  let response = "Hmm... I'm still learning. Try asking something else";

  if (/\b(hello|hi|hey)\b/.test(message)) {
    response = 'Hey! How can I assist you today?';
  } else if (message.includes('your name')) {
    response = "I'm CyberCampass AI - your friendly digital assistant 😊";
  } else if (message.includes('how are you')) {
    response = "I'm feeling like a million bytes! Thanks for asking.";
  } else if (message.includes('start to learn') || message.includes('learn to code') || message.includes('learn coding')) {
    response = "Great question! To start learning how to code, first you'd need to select a beginner friendly language like Python or HTML, which are user friendly.";
  } else if (message.includes('thank')) {
    response = 'You are very much welcome!';
  } else if (/\b(bye|goodbye)\b/.test(message)) {
    response = 'Goodbye! Stay curious 🙂';
  } else if (message.includes('what can you do') || message.includes('help')) {
    response = 'Right now, I can answer basic questions, but I am learning every day.';
  }
  return response;
}

// shows animated "typing" dots, then the answer; resolves when the answer is shown
function respond(message) {
  return new Promise((resolve) => {
    const typing = document.createElement('div');
    typing.className = 'bot-message typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addMessage('bot', getResponse(message));
      resolve();
    }, 700 + Math.random() * 300);
  });
}

/* ---------- automatic motion: a demo conversation plays by itself ---------- */
const demoQuestions = ['hello', 'what is your name', 'how are you', 'how can I start to learn', 'thank you', 'bye'];
let demoOn = !reduceMotion;
let demoToken = 0;

async function resetChat() {
  chatBox.classList.add('fading');
  await sleep(450);
  chatBox.innerHTML = greetingHTML;
  chatBox.classList.remove('fading');
}

async function runDemo(token) {
  const alive = () => token === demoToken;
  await sleep(1200);

  while (alive()) {
    for (const q of demoQuestions) {
      if (!alive()) return;
      userInput.value = '';
      chatForm.classList.add('demo-typing');
      for (const ch of q) {                       // type letter by letter
        if (!alive()) return;
        userInput.value += ch;
        await sleep(55 + Math.random() * 50);
      }
      await sleep(350);
      if (!alive()) return;
      chatForm.classList.remove('demo-typing');
      addMessage('user', q);
      userInput.value = '';
      await respond(q.toLowerCase());
      await sleep(1300);
    }
    await sleep(2500);
    if (!alive()) return;
    await resetChat();                            // start over
    await sleep(800);
  }
}

function updateButton() {
  autoBtn.textContent = demoOn ? '❚❚ Auto' : '▶ Auto';
  autoBtn.setAttribute('aria-pressed', String(demoOn));
}

function stopDemo() {
  demoToken++;
  demoOn = false;
  chatForm.classList.remove('demo-typing');
  updateButton();
}

// the user takes over as soon as they touch the input
function userTookOver() {
  if (!demoOn) return;
  stopDemo();
  userInput.value = '';
}
userInput.addEventListener('focus', userTookOver);
userInput.addEventListener('keydown', userTookOver);

autoBtn.addEventListener('click', async () => {
  if (demoOn) { stopDemo(); return; }
  demoOn = true;
  updateButton();
  userInput.value = '';
  userInput.blur();
  await resetChat();
  runDemo(++demoToken);
});

updateButton();
if (demoOn) runDemo(++demoToken);

/* ---------- footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
