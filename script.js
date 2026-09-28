const screen = document.getElementById("screen");
const levelLabel = document.getElementById("levelLabel");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const ARCHETYPE_ORDER = ["creator","connector","explorer","catalyst","solver","nurturer"];

const ARCHETYPES = {
  creator:{
    name:"The Creator",
    image:"assets/creator.svg",
    tagline:"You bring ideas to life.",
    color:"#F4A84C",
    description:"You tend to light up when you can imagine, express, design, or make something feel uniquely yours."
  },
  connector:{
    name:"The Connector",
    image:"assets/connector.svg",
    tagline:"You make people feel seen.",
    color:"#8B73DF",
    description:"You tend to notice people, conversations, emotions, and the invisible bridges that help others feel understood."
  },
  explorer:{
    name:"The Explorer",
    image:"assets/explorer.svg",
    tagline:"You grow by discovering.",
    color:"#5CAEE8",
    description:"You tend to gain energy from curiosity, trying new things, learning, and seeing what exists beyond the obvious."
  },
  catalyst:{
    name:"The Catalyst",
    image:"assets/catalyst.svg",
    tagline:"You turn ideas into action.",
    color:"#EF706F",
    description:"You tend to move first, initiate, encourage momentum, and help a group go from thinking to doing."
  },
  solver:{
    name:"The Solver",
    image:"assets/solver.svg",
    tagline:"You find a way through.",
    color:"#7F75C9",
    description:"You tend to enjoy patterns, structure, practical fixes, and making confusing situations feel manageable."
  },
  nurturer:{
    name:"The Nurturer",
    image:"assets/nurturer.svg",
    tagline:"You help people grow.",
    color:"#5BBD9E",
    description:"You tend to care deeply about growth, support, patience, community, and helping others feel safe enough to develop."
  }
};

const CHOICES = {
  love: [
    ["Creating","creator",2,"explorer",1],
    ["Helping people","nurturer",2,"connector",1],
    ["Competing","catalyst",2,"solver",1],
    ["Learning","explorer",2,"solver",1],
    ["Performing","creator",2,"catalyst",1],
    ["Leading","catalyst",2,"connector",1],
    ["Exploring","explorer",2,"creator",1],
    ["Solving problems","solver",2,"explorer",1],
    ["Connecting with people","connector",2,"nurturer",1],
    ["Organizing things","solver",2,"catalyst",1],
    ["Making people laugh","connector",2,"creator",1],
    ["Trying something new","explorer",2,"catalyst",1]
  ],
  good: [
    ["Communicating","connector",2,"catalyst",1],
    ["Creating","creator",2,"explorer",1],
    ["Analyzing","solver",2,"explorer",1],
    ["Organizing","solver",2,"catalyst",1],
    ["Listening","connector",2,"nurturer",1],
    ["Leading","catalyst",2,"connector",1],
    ["Performing","creator",2,"catalyst",1],
    ["Problem solving","solver",2,"explorer",1],
    ["Encouraging others","nurturer",2,"connector",1],
    ["Adapting quickly","explorer",2,"catalyst",1],
    ["Coming up with ideas","creator",2,"solver",1],
    ["Taking care of people","nurturer",2,"connector",1]
  ],
  care: [
    ["Creativity","creator",2,"explorer",1],
    ["People","connector",2,"nurturer",1],
    ["Education","nurturer",2,"explorer",1],
    ["Fairness","connector",2,"catalyst",1],
    ["Environment","nurturer",2,"explorer",1],
    ["Technology","solver",2,"explorer",1],
    ["Community","connector",2,"nurturer",1],
    ["Achievement","catalyst",2,"solver",1],
    ["Innovation","creator",2,"solver",1],
    ["Helping others grow","nurturer",2,"connector",1],
    ["Making change happen","catalyst",2,"creator",1],
    ["Understanding how things work","solver",2,"explorer",1]
  ],
  become: [
    ["Creative","creator",2,"explorer",1],
    ["Empathetic","connector",2,"nurturer",1],
    ["Curious","explorer",2,"creator",1],
    ["Brave","catalyst",2,"explorer",1],
    ["Dependable","nurturer",2,"solver",1],
    ["Confident","catalyst",2,"connector",1],
    ["Independent","explorer",2,"catalyst",1],
    ["Impactful","catalyst",2,"nurturer",1],
    ["Wise","solver",2,"explorer",1],
    ["Kind","nurturer",2,"connector",1],
    ["Expressive","creator",2,"connector",1],
    ["Calm under pressure","solver",2,"nurturer",1]
  ]
};

const emptyScores = () => ({
  creator:0, connector:0, explorer:0, catalyst:0, solver:0, nurturer:0
});

const state = {
  step:0,
  name:"",
  strength:"",
  weakness:"",
  opportunity:"",
  threat:"",
  friendName:"",
  friendStrength:"",
  friendOpportunity:"",
  love:[],
  good:[],
  care:[],
  become:[],
  quest:"",
  scores:emptyScores()
};

const lastQuestionStep = 9;

function escapeHTML(value=""){
  return String(value).replace(/[&<>"']/g,m=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function setProgress(step,label){
  const pct = step <= 0 ? 0 : Math.min(100, Math.round((step / lastQuestionStep) * 100));
  levelLabel.textContent = label;
  progressText.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;
}

function next(){ state.step += 1; render(); }

function resetGame(){
  Object.assign(state,{
    step:0,name:"",strength:"",weakness:"",opportunity:"",threat:"",
    friendName:"",friendStrength:"",friendOpportunity:"",
    love:[],good:[],care:[],become:[],quest:"",scores:emptyScores()
  });
  render();
}

function createButton(label,onClick,secondary=false){
  const b=document.createElement("button");
  b.type="button";
  b.className=secondary ? "secondary-btn" : "primary-btn";
  b.textContent=label;
  b.addEventListener("click",onClick);
  return b;
}

function renderIntro(){
  setProgress(0,"WELCOME");
  screen.innerHTML=`
    <div class="hero">
      <div class="hero-badge">🔓</div>
      <p class="eyebrow">A MINI SELF-DISCOVERY QUEST</p>
      <h2>Ready to unlock your character?</h2>
      <p class="lead">
        You'll reflect on yourself, ask a friend for their perspective,
        and map the things you love, do well, care about, and want to become.
      </p>

      <label class="label" for="name">Your name or nickname</label>
      <input id="name" class="text-input" maxlength="30" placeholder="What should we call you?" />

      <div class="actions" id="actions"></div>
      <p class="small">
        No login. No database. Your answers stay in this browser and disappear when you refresh or restart.
      </p>
    </div>
  `;

  document.getElementById("actions").append(
    createButton("Start the quest →",()=>{
      state.name=document.getElementById("name").value.trim() || "Player";
      next();
    })
  );
}

function renderTextQuestion({label,icon,title,desc,key,placeholder,chip}){
  setProgress(state.step,label);
  screen.innerHTML=`
    <section class="question-wrap">
      <div class="question-icon">${icon}</div>
      <h2>${title}</h2>
      <p class="question-meta">${desc}</p>
      ${chip ? `<span class="prompt-chip">${chip}</span>` : ""}
      <textarea id="answer" class="text-area" maxlength="200" placeholder="${placeholder}"></textarea>
      <div class="actions" id="actions"></div>
    </section>
  `;

  document.getElementById("actions").append(
    createButton("Continue →",()=>{
      state[key]=document.getElementById("answer").value.trim() || "Still discovering";
      next();
    })
  );
}

function renderFriendStage(){
  setProgress(5,"LEVEL 1 · FRIEND CHECK");
  screen.innerHTML=`
    <section class="friend-stage">
      <span class="friend-kicker">📱 PASS THE PHONE!</span>
      <h2 style="margin-top:14px">Let a friend add their perspective.</h2>
      <p class="question-meta">
        Give your phone to a classmate who knows you. Their job is not to roast you —
        it's to notice something useful that you might not see in yourself yet.
      </p>

      <label class="label" for="friendName">Friend's name or nickname <span class="small">(optional)</span></label>
      <input id="friendName" class="text-input" maxlength="30" placeholder="Who's giving the feedback?" />

      <div class="friend-grid">
        <div class="friend-card">
          <label for="friendStrength">💪 A strength I see in ${escapeHTML(state.name)}</label>
          <textarea id="friendStrength" class="text-area" maxlength="200"
            placeholder="Example: You're good at making people feel included."></textarea>
        </div>
        <div class="friend-card">
          <label for="friendOpportunity">🚪 An opportunity I think could help ${escapeHTML(state.name)} grow</label>
          <textarea id="friendOpportunity" class="text-area" maxlength="200"
            placeholder="Example: You should try joining something that lets you speak in front of people."></textarea>
        </div>
      </div>

      <p id="friendHint" class="friend-rule">Be specific, kind, and useful. Then give the phone back ✨</p>
      <div class="actions" id="actions"></div>
    </section>
  `;

  document.getElementById("actions").append(
    createButton("Give it back & continue →",()=>{
      const strength=document.getElementById("friendStrength").value.trim();
      const opportunity=document.getElementById("friendOpportunity").value.trim();

      if(!strength || !opportunity){
        document.getElementById("friendHint").textContent =
          "Fill both friend-feedback boxes first — this part only works if another person adds their view 👀";
        return;
      }

      state.friendName=document.getElementById("friendName").value.trim() || "A friend";
      state.friendStrength=strength;
      state.friendOpportunity=opportunity;
      next();
    })
  );
}

function renderChoiceQuestion({label,icon,title,desc,key}){
  setProgress(state.step,label);
  const selected=new Set(state[key]);
  const max=3;

  screen.innerHTML=`
    <section class="question-wrap">
      <div class="question-icon">${icon}</div>
      <h2>${title}</h2>
      <p class="question-meta">${desc}</p>
      <div id="choices" class="choice-grid"></div>
      <p id="hint" class="hint">Choose up to 3.</p>
      <div class="actions" id="actions"></div>
    </section>
  `;

  const wrap=document.getElementById("choices");

  CHOICES[key].forEach(item=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="choice";
    b.textContent=item[0];

    if(selected.has(item[0])) b.classList.add("selected");

    b.addEventListener("click",()=>{
      if(selected.has(item[0])){
        selected.delete(item[0]);
        b.classList.remove("selected");
      }else if(selected.size < max){
        selected.add(item[0]);
        b.classList.add("selected");
      }else{
        document.getElementById("hint").textContent="Maximum 3 — choose the ones that feel most like you.";
      }
    });

    wrap.appendChild(b);
  });

  document.getElementById("actions").append(
    createButton("Lock it in →",()=>{
      if(!selected.size){
        document.getElementById("hint").textContent="Pick at least one option that feels like you.";
        return;
      }
      state[key]=[...selected];
      next();
    })
  );
}

function calculateScores(){
  const scores=emptyScores();
  const primaryHits=emptyScores();

  ["love","good","care","become"].forEach(group=>{
    state[group].forEach(label=>{
      const item=CHOICES[group].find(x=>x[0]===label);
      if(item){
        scores[item[1]] += item[2];
        scores[item[3]] += item[4];
        primaryHits[item[1]] += 1;
      }
    });
  });

  state.scores=scores;

  return ARCHETYPE_ORDER
    .map(key=>({key,score:scores[key],primaryHits:primaryHits[key]}))
    .sort((a,b)=> b.score-a.score || b.primaryHits-a.primaryHits || ARCHETYPE_ORDER.indexOf(a.key)-ARCHETYPE_ORDER.indexOf(b.key));
}

function renderLoading(){
  setProgress(lastQuestionStep,"CONNECTING THE DOTS");
  screen.innerHTML=`
    <div class="reveal">
      <div class="orbit">✨</div>
      <p class="eyebrow">ANALYZING YOUR PATTERN</p>
      <h2>Connecting the dots...</h2>
      <p class="lead">
        Looking at what energizes you, what you're good at, what you care about,
        and the person you want to grow into.
      </p>
    </div>
  `;

  setTimeout(()=>{
    state.step=10;
    render();
  },1350);
}

function renderResult(){
  setProgress(lastQuestionStep,"CHARACTER UNLOCKED");

  const ranked=calculateScores();
  const primary=ARCHETYPES[ranked[0].key];
  const secondary=ARCHETYPES[ranked[1].key];
  const friendLabel=escapeHTML(state.friendName || "A friend");

  screen.innerHTML=`
    <div class="reveal">
      <p class="eyebrow">YOUR REFLECTION MAP</p>
      <h2>${escapeHTML(state.name)}'s Character</h2>
      <p class="lead">
        This is a snapshot of how you see yourself today, plus one friend's perspective.
        It can change as you grow.
      </p>
    </div>

    <div class="section-title"><span>🧭</span> Personal SWOT</div>
    <section class="swot-grid" aria-label="Personal SWOT summary">
      <article class="swot-card strength">
        <h3>💪 Strength</h3>
        <span class="who">My view</span>
        <p>${escapeHTML(state.strength)}</p>
        <div class="peer-note">
          <strong>${friendLabel}'s view:</strong><br>
          ${escapeHTML(state.friendStrength)}
        </div>
      </article>

      <article class="swot-card weakness">
        <h3>👾 Weakness / Boss Battle</h3>
        <span class="who">My view</span>
        <p>${escapeHTML(state.weakness)}</p>
      </article>

      <article class="swot-card opportunity">
        <h3>🚪 Opportunity</h3>
        <span class="who">My view</span>
        <p>${escapeHTML(state.opportunity)}</p>
        <div class="peer-note">
          <strong>${friendLabel}'s view:</strong><br>
          ${escapeHTML(state.friendOpportunity)}
        </div>
      </article>

      <article class="swot-card threat">
        <h3>🧱 Threat / What Gets in the Way</h3>
        <span class="who">My view</span>
        <p>${escapeHTML(state.threat)}</p>
      </article>
    </section>

    <div class="section-title"><span>✦</span> My Identity Map</div>
    <section class="mindmap-shell" aria-label="Identity mind map">
      <div class="mindmap">
        <svg class="mindmap-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="27" y1="25" x2="47" y2="45"></line>
          <line x1="73" y1="25" x2="53" y2="45"></line>
          <line x1="27" y1="75" x2="47" y2="55"></line>
          <line x1="73" y1="75" x2="53" y2="55"></line>
        </svg>

        <article class="mind-node node-love">
          <h3>❤️ What makes me feel alive</h3>
          <p>${state.love.map(escapeHTML).join(" · ")}</p>
        </article>

        <article class="mind-node node-good">
          <h3>⭐ What I'm good at</h3>
          <p>${state.good.map(escapeHTML).join(" · ")}</p>
        </article>

        <article class="center-node" style="--arch-color:${primary.color}">
          <img class="character-img" src="${primary.image}" alt="${primary.name} character illustration">
          <p class="eyebrow">PRIMARY ARCHETYPE</p>
          <h2>${primary.name}</h2>
          <p class="center-tagline">“${primary.tagline}”</p>
          <p class="center-desc">${primary.description}</p>
          <div class="tag-row">
            <span class="tag">Secondary: ${secondary.name}</span>
            <span class="tag">Reflection archetype</span>
          </div>
          <p class="score-note">The archetype comes from the pattern across your four identity answers — not from the SWOT boxes.</p>
        </article>

        <article class="mind-node node-care">
          <h3>🌍 What I care about</h3>
          <p>${state.care.map(escapeHTML).join(" · ")}</p>
        </article>

        <article class="mind-node node-become">
          <h3>🌱 Who I want to become</h3>
          <p>${state.become.map(escapeHTML).join(" · ")}</p>
        </article>
      </div>
    </section>

    <section class="quest">
      <strong>🎯 Your Next Quest</strong>
      <p class="question-meta">
        What's one small thing you can do this week to move closer to the person you want to become?
      </p>
      <textarea id="quest" class="text-area" maxlength="200" placeholder="My next quest is..."></textarea>
      <div class="actions" id="actions"></div>
      <p class="small">Tip: screenshot your SWOT + Identity Map so you can keep it.</p>
    </section>
  `;

  const actions=document.getElementById("actions");

  actions.append(
    createButton("Save my next quest",()=>{
      state.quest=document.getElementById("quest").value.trim();
      if(state.quest){
        alert(`Your next quest: ${state.quest}`);
      }else{
        alert("Write one small next step first.");
      }
    })
  );

  actions.append(createButton("Restart",resetGame,true));
}

function render(){
  window.scrollTo({top:0,behavior:"smooth"});

  switch(state.step){
    case 0:
      return renderIntro();

    case 1:
      return renderTextQuestion({
        label:"LEVEL 1 · MY VIEW",
        icon:"💪",
        title:"What strength do you see in yourself?",
        desc:"Think of a quality that genuinely helps you move through life — not the answer that sounds most impressive.",
        key:"strength",
        placeholder:"Example: I stay calm when people need help.",
        chip:"Strength = an internal advantage you already have"
      });

    case 2:
      return renderTextQuestion({
        label:"LEVEL 1 · MY VIEW",
        icon:"👾",
        title:"What's your biggest boss battle?",
        desc:"A pattern, habit, or challenge in yourself that you're still learning to handle.",
        key:"weakness",
        placeholder:"Example: I overthink before I start.",
        chip:"Weakness = an internal challenge you can work on"
      });

    case 3:
      return renderTextQuestion({
        label:"LEVEL 1 · MY VIEW",
        icon:"🚪",
        title:"What opportunity could help you level up?",
        desc:"Think of a person, environment, activity, resource, or chance around you that could help you grow.",
        key:"opportunity",
        placeholder:"Example: joining a club where I can practice speaking.",
        chip:"Opportunity = something outside you that can support growth"
      });

    case 4:
      return renderTextQuestion({
        label:"LEVEL 1 · MY VIEW",
        icon:"🧱",
        title:"What usually gets in your way?",
        desc:"Think of something around you that can make growth harder if you don't manage it well.",
        key:"threat",
        placeholder:"Example: comparing myself with other people.",
        chip:"Threat = an outside obstacle or pressure"
      });

    case 5:
      return renderFriendStage();

    case 6:
      return renderChoiceQuestion({
        label:"LEVEL 2 · IDENTITY MAP",
        icon:"❤️",
        title:"What makes you feel alive?",
        desc:"Choose up to 3 things that genuinely energize you — the things you enjoy doing even when nobody is grading you.",
        key:"love"
      });

    case 7:
      return renderChoiceQuestion({
        label:"LEVEL 2 · IDENTITY MAP",
        icon:"⭐",
        title:"What are you good at?",
        desc:"Think about what feels natural, what you've practiced, or what other people often rely on you for.",
        key:"good"
      });

    case 8:
      return renderChoiceQuestion({
        label:"LEVEL 2 · IDENTITY MAP",
        icon:"🌍",
        title:"What do you care about?",
        desc:"Pick the things that matter enough that you notice them, talk about them, or wish they could be better.",
        key:"care"
      });

    case 9:
      return renderChoiceQuestion({
        label:"LEVEL 2 · IDENTITY MAP",
        icon:"🌱",
        title:"Who do you want to become?",
        desc:"Not a job title. What kind of person do you want to grow into?",
        key:"become"
      });

    case 10:
      return renderLoading();

    case 11:
      return renderResult();

    default:
      return renderIntro();
  }
}

render();
