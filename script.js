const screen = document.getElementById("screen");
const levelLabel = document.getElementById("levelLabel");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const ARCHETYPES = {
  creator: {name:"The Creator", emoji:"🎨", tagline:"You bring ideas to life.", color:"var(--creator)", description:"You tend to light up when you can imagine, express, design, or make something feel uniquely yours."},
  connector:{name:"The Connector",emoji:"🫂",tagline:"You make people feel seen.",color:"var(--connector)",description:"You tend to notice people, conversations, emotions, and the invisible bridges that help others feel understood."},
  explorer:{name:"The Explorer",emoji:"🧭",tagline:"You grow by discovering.",color:"var(--explorer)",description:"You tend to gain energy from curiosity, trying new things, learning, and seeing what exists beyond the obvious."},
  catalyst:{name:"The Catalyst",emoji:"🔥",tagline:"You turn ideas into action.",color:"var(--catalyst)",description:"You tend to move first, initiate, encourage momentum, and help a group go from thinking to doing."},
  solver:{name:"The Solver",emoji:"🧩",tagline:"You find a way through.",color:"var(--solver)",description:"You tend to enjoy patterns, structure, practical fixes, and making confusing situations feel manageable."},
  nurturer:{name:"The Nurturer",emoji:"🌱",tagline:"You help people grow.",color:"var(--nurturer)",description:"You tend to care deeply about growth, support, patience, community, and helping others feel safe enough to develop."}
};

const CHOICES = {
  love: [
    ["Creating","creator",2,"explorer",1],["Helping people","nurturer",2,"connector",1],["Competing","catalyst",2,"solver",1],
    ["Learning","explorer",2,"solver",1],["Performing","creator",2,"catalyst",1],["Leading","catalyst",2,"connector",1],
    ["Exploring","explorer",2,"creator",1],["Solving problems","solver",2,"explorer",1],["Connecting with people","connector",2,"nurturer",1],
    ["Organizing things","solver",2,"catalyst",1],["Making people laugh","connector",2,"creator",1],["Trying something new","explorer",2,"catalyst",1]
  ],
  good: [
    ["Communicating","connector",2,"catalyst",1],["Creating","creator",2,"explorer",1],["Analyzing","solver",2,"explorer",1],
    ["Organizing","solver",2,"catalyst",1],["Listening","connector",2,"nurturer",1],["Leading","catalyst",2,"connector",1],
    ["Performing","creator",2,"catalyst",1],["Problem solving","solver",2,"explorer",1],["Encouraging others","nurturer",2,"connector",1],
    ["Adapting quickly","explorer",2,"catalyst",1],["Coming up with ideas","creator",2,"solver",1],["Taking care of people","nurturer",2,"connector",1]
  ],
  care: [
    ["Creativity","creator",2,"explorer",1],["People","connector",2,"nurturer",1],["Education","nurturer",2,"explorer",1],
    ["Fairness","connector",2,"catalyst",1],["Environment","nurturer",2,"explorer",1],["Technology","solver",2,"explorer",1],
    ["Community","connector",2,"nurturer",1],["Achievement","catalyst",2,"solver",1],["Innovation","creator",2,"solver",1],
    ["Helping others grow","nurturer",2,"connector",1],["Making change happen","catalyst",2,"creator",1],["Understanding how things work","solver",2,"explorer",1]
  ],
  become: [
    ["Creative","creator",2,"explorer",1],["Empathetic","connector",2,"nurturer",1],["Curious","explorer",2,"creator",1],
    ["Brave","catalyst",2,"explorer",1],["Dependable","nurturer",2,"solver",1],["Confident","catalyst",2,"connector",1],
    ["Independent","explorer",2,"catalyst",1],["Impactful","catalyst",2,"nurturer",1],["Wise","solver",2,"explorer",1],
    ["Kind","nurturer",2,"connector",1],["Expressive","creator",2,"connector",1],["Calm under pressure","solver",2,"nurturer",1]
  ]
};

const state = {
  step:0,name:"",strength:"",weakness:"",opportunity:"",threat:"",
  love:[],good:[],care:[],become:[],quest:"",scores:{creator:0,connector:0,explorer:0,catalyst:0,solver:0,nurturer:0}
};

const totalSteps = 10;
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function setProgress(step,label){
  const pct=Math.round((step/totalSteps)*100);
  levelLabel.textContent=label;progressText.textContent=`${pct}%`;progressBar.style.width=`${pct}%`;
}
function next(){state.step++;render()}
function resetGame(){Object.assign(state,{step:0,name:"",strength:"",weakness:"",opportunity:"",threat:"",love:[],good:[],care:[],become:[],quest:"",scores:{creator:0,connector:0,explorer:0,catalyst:0,solver:0,nurturer:0}});render()}

function button(label,onClick,secondary=false){
  const b=document.createElement("button");b.type="button";b.className=secondary?"secondary-btn":"primary-btn";b.textContent=label;b.addEventListener("click",onClick);return b;
}

function renderIntro(){
  setProgress(0,"WELCOME");
  screen.innerHTML=`
    <div class="hero">
      <div class="hero-badge">🔓</div>
      <h2>Ready to unlock your character?</h2>
      <p class="lead">A short self-discovery quest about your strengths, challenges, interests, values, and the person you want to become.</p>
      <label class="label" for="name">Name or nickname</label>
      <input id="name" class="text-input" maxlength="30" placeholder="What should we call you?" />
      <div class="actions" id="actions"></div>
      <p class="small">Your answers stay on this device and are not uploaded anywhere.</p>
    </div>`;
  document.getElementById("actions").append(button("Start quest →",()=>{
    state.name=document.getElementById("name").value.trim()||"Player";next();
  }));
}

function renderTextQuestion({label,icon,title,desc,key,placeholder}){
  setProgress(state.step,label);
  screen.innerHTML=`
    <div class="question-icon">${icon}</div>
    <h2>${title}</h2>
    <p class="question-meta">${desc}</p>
    <textarea id="answer" class="text-area" maxlength="180" placeholder="${placeholder}"></textarea>
    <div class="actions" id="actions"></div>`;
  document.getElementById("actions").append(button("Continue →",()=>{
    state[key]=document.getElementById("answer").value.trim()||"Still discovering";next();
  }));
}

function renderChoiceQuestion({label,icon,title,desc,key}){
  setProgress(state.step,label);
  const max=3, selected=new Set(state[key]);
  screen.innerHTML=`
    <div class="question-icon">${icon}</div>
    <h2>${title}</h2>
    <p class="question-meta">${desc}</p>
    <div id="choices" class="choice-grid"></div>
    <p id="hint" class="hint">Choose up to 3.</p>
    <div class="actions" id="actions"></div>`;
  const wrap=document.getElementById("choices");
  CHOICES[key].forEach(item=>{
    const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=item[0];
    if(selected.has(item[0])) b.classList.add("selected");
    b.addEventListener("click",()=>{
      if(selected.has(item[0])){selected.delete(item[0]);b.classList.remove("selected")}
      else if(selected.size<max){selected.add(item[0]);b.classList.add("selected")}
    });wrap.appendChild(b);
  });
  document.getElementById("actions").append(button("Lock it in →",()=>{
    if(!selected.size){document.getElementById("hint").textContent="Pick at least one option that feels like you.";return}
    state[key]=[...selected];next();
  }));
}

function calculateScores(){
  const scores={creator:0,connector:0,explorer:0,catalyst:0,solver:0,nurturer:0};
  ["love","good","care","become"].forEach(group=>{
    state[group].forEach(label=>{
      const item=CHOICES[group].find(x=>x[0]===label);
      if(item){scores[item[1]]+=item[2];scores[item[3]]+=item[4]}
    });
  });
  state.scores=scores;
  return Object.entries(scores).sort((a,b)=>b[1]-a[1]);
}

function renderLoading(){
  setProgress(9,"ANALYZING YOUR PATTERN");
  screen.innerHTML=`
    <div class="reveal">
      <div class="orbit">✨</div>
      <h2>Connecting the dots...</h2>
      <p class="lead">Looking at what energizes you, what you're good at, what you care about, and who you want to become.</p>
    </div>`;
  setTimeout(()=>{state.step=10;render()},1400);
}

function renderResult(){
  setProgress(10,"CHARACTER UNLOCKED");
  const ranked=calculateScores();
  const primaryKey=ranked[0][0], secondaryKey=ranked[1][0];
  const primary=ARCHETYPES[primaryKey], secondary=ARCHETYPES[secondaryKey];
  screen.innerHTML=`
    <div class="reveal">
      <p class="eyebrow">YOU UNLOCKED</p>
      <h2>${escapeHTML(state.name)}'s Character</h2>
      <p class="lead">This is a snapshot of how you see yourself today — not a permanent label.</p>
    </div>
    <section class="archetype-panel">
      <div class="character-art" style="background:${primary.color}22">
        <span aria-label="${primary.name}">${primary.emoji}</span>
      </div>
      <div>
        <p class="eyebrow">PRIMARY ARCHETYPE</p>
        <h2 style="margin-top:.2rem">${primary.name}</h2>
        <p><strong>“${primary.tagline}”</strong></p>
        <p class="question-meta">${primary.description}</p>
        <div class="tag-row">
          <span class="tag">Secondary: ${secondary.name} ${secondary.emoji}</span>
          <span class="tag">Reflection archetype</span>
        </div>
        <p class="score-note">Primary and secondary results come from the choices you selected across the identity questions.</p>
      </div>
    </section>

    <div class="result-grid">
      <div class="result-card"><strong>💪 Core Strength</strong><span>${escapeHTML(state.strength)}</span></div>
      <div class="result-card"><strong>👾 Boss Battle</strong><span>${escapeHTML(state.weakness)}</span></div>
      <div class="result-card"><strong>🚪 Level-Up Opportunity</strong><span>${escapeHTML(state.opportunity)}</span></div>
      <div class="result-card"><strong>🧱 What Gets in the Way</strong><span>${escapeHTML(state.threat)}</span></div>
      <div class="result-card"><strong>❤️ Energized By</strong><span>${state.love.map(escapeHTML).join(" · ")}</span></div>
      <div class="result-card"><strong>⭐ Good At</strong><span>${state.good.map(escapeHTML).join(" · ")}</span></div>
      <div class="result-card"><strong>🌍 Cares About</strong><span>${state.care.map(escapeHTML).join(" · ")}</span></div>
      <div class="result-card"><strong>🌱 Becoming</strong><span>${state.become.map(escapeHTML).join(" · ")}</span></div>
    </div>

    <div class="quest">
      <strong>🎯 Your Next Quest</strong>
      <p class="question-meta">What is one small thing you can do this week to become closer to the person you want to be?</p>
      <textarea id="quest" class="text-area" maxlength="180" placeholder="My next quest is..."></textarea>
      <div class="actions" id="actions"></div>
      <p class="small">Tip: screenshot this page if you want to keep your result.</p>
    </div>`;
  const actions=document.getElementById("actions");
  actions.append(button("Save my reflection",()=>{
    state.quest=document.getElementById("quest").value.trim();
    alert(state.quest ? `Saved on this page: ${state.quest}` : "Write one small next step first.");
  }));
  actions.append(button("Restart",resetGame,true));
}

function render(){
  window.scrollTo({top:0,behavior:"smooth"});
  switch(state.step){
    case 0:return renderIntro();
    case 1:return renderTextQuestion({label:"LEVEL 1 · KNOW YOUR CHARACTER",icon:"💪",title:"What is your strongest trait?",desc:"Think of a quality that genuinely helps you move through life — not the answer that sounds most impressive.",key:"strength",placeholder:"Example: I stay calm when people need help."});
    case 2:return renderTextQuestion({label:"LEVEL 1 · KNOW YOUR CHARACTER",icon:"👾",title:"What is your biggest boss battle?",desc:"A pattern or challenge in yourself that you are still learning to handle.",key:"weakness",placeholder:"Example: I overthink before I start."});
    case 3:return renderTextQuestion({label:"LEVEL 1 · KNOW YOUR CHARACTER",icon:"🚪",title:"What could help you level up?",desc:"An opportunity, person, habit, environment, or resource that could help you grow.",key:"opportunity",placeholder:"Example: joining a club where I can practice speaking."});
    case 4:return renderTextQuestion({label:"LEVEL 1 · KNOW YOUR CHARACTER",icon:"🧱",title:"What usually gets in your way?",desc:"Something outside or around you that can make growth harder.",key:"threat",placeholder:"Example: comparing myself with other people."});
    case 5:return renderChoiceQuestion({label:"LEVEL 2 · FIND YOUR PATTERN",icon:"❤️",title:"What makes you feel alive?",desc:"Pick up to 3 things that genuinely energize you.",key:"love"});
    case 6:return renderChoiceQuestion({label:"LEVEL 2 · FIND YOUR PATTERN",icon:"⭐",title:"What are you good at?",desc:"Think about what feels natural or what other people often rely on you for.",key:"good"});
    case 7:return renderChoiceQuestion({label:"LEVEL 2 · FIND YOUR PATTERN",icon:"🌍",title:"What do you care about?",desc:"Pick the things that matter enough that you want them to be better.",key:"care"});
    case 8:return renderChoiceQuestion({label:"LEVEL 2 · FIND YOUR PATTERN",icon:"🌱",title:"Who do you want to become?",desc:"Not a job title. What kind of person do you want to grow into?",key:"become"});
    case 9:return renderLoading();
    case 10:return renderResult();
  }
}
render();
