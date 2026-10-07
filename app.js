/* ---------- Animated anime avatar ---------- */
(function () {
  const wrap = document.getElementById('portrait');
  const $ = id => document.getElementById(id);
  const head = $('head'), bangs = $('bangs'), body = $('body'), hairBack = $('hairBack'), locks = $('locks');
  const irises = document.querySelectorAll('.iris'), eyes = document.querySelectorAll('.eye');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mx = 0, my = 0, tx = 0, ty = 0, last = performance.now();

  addEventListener('pointermove', e => {
    const r = wrap.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
    ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
    last = performance.now();
  });

  // blink at random intervals
  function blink() {
    eyes.forEach(e => e.classList.add('blink'));
    setTimeout(() => eyes.forEach(e => e.classList.remove('blink')), 130);
    setTimeout(blink, 2200 + Math.random() * 3200);
  }
  if (!reduce) setTimeout(blink, 1800);

  (function loop(now) {
    if (!reduce && now - last > 2500) { tx = Math.sin(now / 1800) * 0.5; ty = Math.cos(now / 2300) * 0.2; }
    mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
    const t = reduce ? 0 : now / 1000, breathe = Math.sin(t * 1.6) * 2;
    head.style.transform = `translate(${mx * 10}px,${my * 6 + breathe * .5}px) rotate(${mx * 2.5}deg)`;
    head.style.transformOrigin = '200px 340px';
    bangs.style.transform = `translate(${mx * 2.5}px,${my * 1.5}px)`;
    hairBack.style.transform = `translate(${-mx * 6}px,${-my * 2}px)`;
    locks.style.transform = `translate(${mx * 3}px,${breathe * .4}px)`;
    body.style.transform = `translate(${mx * 3}px,${breathe}px)`;
    irises.forEach(i => i.style.transform = `translate(${mx * 8}px,${my * 6}px)`);
    wrap.style.setProperty('--gx', 50 + mx * 30 + '%'); wrap.style.setProperty('--gy', 30 + my * 30 + '%');
    requestAnimationFrame(loop);
  })(performance.now());
})();

/* ---------- Scroll story: team growth ---------- */
(function () {
  const sec = document.getElementById('story');
  const dotsEl = document.getElementById('dots');
  const person = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8z"/></svg>';
  for (let i = 0; i < 25; i++) { const d = document.createElement('div'); d.className = 'dot'; d.innerHTML = person; dotsEl.appendChild(d); }
  const dots = [...dotsEl.children], num = document.getElementById('teamNum');
  const title = document.getElementById('teamTitle'), sub = document.getElementById('teamSub');
  const steps = [
    [0, 'It started with two.', 'Botree Software, 2019. A small mobile team and a lot of ownership.'],
    [.35, 'Then the products grew.', 'Enterprise sales and distribution apps reached tens of thousands of users.'],
    [.7, 'So did the scope.', 'From leading Android to managing backend teams too, and training engineers across stacks.']
  ];
  const progress = el => { const r = el.getBoundingClientRect(); return Math.max(0, Math.min(1, -r.top / (r.height - innerHeight))); };
  function update() {
    const p = progress(sec), n = Math.round(2 + Math.min(1, p / 0.85) * 23);
    dots.forEach((d, i) => d.classList.toggle('on', i < n));
    num.textContent = n;
    let s = steps[0]; steps.forEach(x => { if (p >= x[0]) s = x; });
    title.textContent = s[1]; sub.textContent = s[2];
  }
  addEventListener('scroll', update, { passive: true }); update();
})();

/* ---------- Counters ---------- */
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, suf = el.dataset.suffix || '', t0 = performance.now();
    (function tick(t) { const k = Math.min(1, (t - t0) / 1300), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = v + (k === 1 ? suf : ''); if (k < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: .6 });
  document.querySelectorAll('.n[data-to]').forEach(n => io.observe(n));
})();

/* ---------- Stack explorer ---------- */
(function () {
  const L = [
    { n: 'Applied AI', s: 'LLMs · semantic search · RAG', h: 'Building with LLMs', p: 'The newest layer: using language models to make products smarter.', b: ['Built an app that summarizes documents and answers questions with semantic search (embeddings, vector store, retrieval-augmented generation).', 'This site\'s "Ask Godlin" assistant is a live LLM application with a rate-limited API.', 'Certified: NVIDIA NCA-GENL, Azure AI-102, AWS AI Practitioner.'], t: ['LLMs', 'RAG', 'Embeddings', 'Summarization'] },
    { n: 'Web full stack', s: 'Frontend + API, end to end', h: 'Shipping the whole thing', p: 'From the page in the browser to the API behind it.', b: ['Build web frontends and backend APIs end to end, working with AI-assisted development.', 'Owns the path from idea to something a user can open: this website and its API are an example.'], t: ['Web frontend', 'APIs', 'AI-assisted dev'] },
    { n: 'Java backend', s: 'APIs, teams, training', h: 'Behind the API', p: 'Where the data and the rules live.', b: ['Grew from leading Android to also managing backend teams.', 'Started Java backend training so mobile engineers could work across the stack.', 'Delivered 30 enterprise projects from scratch under strict security requirements; cut SonarQube vulnerabilities by 90%.'], t: ['Java', 'Backend APIs', 'Secure coding', 'SonarQube'] },
    { n: 'Native Android', s: 'Kotlin · Java · Android SDK', h: 'Where it started, and still my home turf', p: 'About 10 years of native Android development, for consumers and enterprises.', b: ['Built native Android apps in Java and Kotlin from the start of my career, and led Android teams for years.', 'Owned the DraftKings Casino and Sportsbook migration from Xamarin to native Android.', 'Shipped apps with 300+ screens and 20+ product flavors; published about 20 apps on the Play Store averaging 10,000 users each.', 'Exploring Flutter at a beginner level.'], t: ['Kotlin', 'Java', 'Android SDK', 'Migrations', 'Flutter (beginner)'] }
  ];
  const rungs = document.getElementById('rungs'), panel = document.getElementById('panel'), sec = document.getElementById('stack');
  const DUR = 5500; let cur = 0, timer = null, userPicked = false, visible = false;
  rungs.style.setProperty('--dur', DUR + 'ms');
  L.forEach((l, i) => {
    const b = document.createElement('button'); b.className = 'rung'; b.type = 'button'; b.setAttribute('role', 'tab');
    b.innerHTML = '<b>' + l.n + '</b><span>' + l.s + '</span>'; b.onclick = () => { userPicked = true; stop(); select(i); };
    rungs.appendChild(b);
  });
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function select(i) {
    cur = i; const l = L[i];
    [...rungs.children].forEach((r, k) => { r.setAttribute('aria-selected', k === i); r.classList.toggle('paused', userPicked); });
    panel.innerHTML = '<h3>' + esc(l.h) + '</h3><p class="lede">' + esc(l.p) + '</p><ul>' + l.b.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><div class="tags">' + l.t.map(x => '<span>' + esc(x) + '</span>').join('') + '</div>';
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  }
  function stop() { clearTimeout(timer); timer = null; }
  function loop() { stop(); if (userPicked || !visible) return; timer = setTimeout(() => { select((cur + 1) % L.length); loop(); }, DUR); }
  select(0);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) { if (!userPicked) { select(cur); loop(); } } else stop(); }, { threshold: .35 }).observe(sec);
})();

/* ---------- Ask Godlin ---------- */
(function () {
  // To use a real LLM backend, set this to your serverless endpoint (POST {question} -> {answer}).
  const ENDPOINT = 'https://ask-godlin-api.godlinjosheela.workers.dev';
  const KB = [
    { k: ['draftkings', 'xamarin', 'migration', 'native', 'presidio', 'casino', 'sportsbook'], a: 'At Presidio (client: DraftKings, US), Godlin owned the migration of DraftKings Casino and Sportsbook from Xamarin to native Android, from technical planning through production rollout. Godlin is now an Associate Architect there, after starting as Lead Engineer in Nov 2023.' },
    { k: ['team', 'lead', 'manage', 'people', 'grow', '25', 'hire', 'leadership'], a: 'At Botree Godlin grew a team from 2 to 25 engineers and expanded from leading Android to also managing backend teams. Godlin also started Java backend training for mobile engineers to build cross-functional skills. At Presidio, Godlin leads a team of 5.' },
    { k: ['product', 'ssfa', 'smdms', 'users', 'scale', 'botree', 'enterprise', 'client'], a: 'At Botree, Godlin owned SSFA (Stocky Sales Force Automation, ~60K active users) and SMDMS (Distribution Management System, ~20K users) for clients such as Nestlé, Amul, Dabur, Tata Consumer Products, CavinKare and TTK. That is about 80,000 active users.' },
    { k: ['quality', 'sonar', 'security', 'review', 'vulnerab'], a: 'Godlin cut SonarQube vulnerabilities by 90% and streamlined the code review process so issues are caught earlier. Projects were built under strict security requirements.' },
    { k: ['ai', 'llm', 'rag', 'semantic', 'search', 'summar', 'machine'], a: 'Godlin builds AI applications that summarize documents with LLMs and answer questions using semantic search (embeddings, vector store, retrieval-augmented generation), with a web frontend and backend API. Godlin holds three AI certifications: NVIDIA-Certified Associate Generative AI LLMs (NCA-GENL), Microsoft Azure AI Engineer (AI-102) and AWS Certified AI Practitioner.' },
    { k: ['tech', 'stack', 'skill', 'java', 'kotlin', 'android', 'native', 'flutter', 'mobile', 'backend', 'full stack', 'web'], a: 'Native Android is Godlin\'s core strength: about 10 years in Kotlin, Java and the Android SDK, including large modular apps with 300+ screens and 20+ product flavors, performance tuning and Play Store releases. On top of that: Java backend APIs, web full stack and applied AI. Flutter is at a beginner level.' },
    { k: ['award', 'recogn', 'best', 'hackathon', 'prize', 'promot'], a: 'Best Performer of the Year at Botree in 2022 and 2023, first prize in the Botree hackathon, promoted to Associate Architect at Presidio within 14 months, and invited onsite by a US client.' },
    { k: ['certif', 'education', 'degree', 'study', 'aws', 'azure', 'nvidia', 'nca', 'ai-102', 'pmi', 'ibm'], a: 'B.E. from SMK Fomra Institute of Technology (2011-2015). Certifications: NVIDIA-Certified Associate Generative AI LLMs (NCA-GENL), Microsoft Azure AI Engineer (AI-102), AWS Certified AI Practitioner, PMI Agile Fundamentals, IBM Design Thinking Practitioner, Google Play Store Listing.' },
    { k: ['looking', 'next', 'role', 'want', 'goal', 'hire', 'job', 'available', 'seek'], a: 'Godlin is looking for an Engineering Manager or Technical Lead role in a product company, where owning outcomes end to end across mobile, backend and AI is valued.' },
    { k: ['contact', 'email', 'reach', 'linkedin', 'github', 'phone'], a: 'Email godlinjosheela@gmail.com, or find Godlin on LinkedIn (linkedin.com/in/godlin-josheela-rani) and GitHub (github.com/GodlinJosheela).' }
  ];
  const sugg = ['What did she do at DraftKings?', 'How big a team has she led?', 'What AI work has she done?', 'What is she looking for?'];
  const msgs = document.getElementById('msgs'), form = document.getElementById('form'), q = document.getElementById('q'), box = document.getElementById('suggest'), mode = document.getElementById('mode');
  const add = (t, c) => { const d = document.createElement('div'); d.className = 'msg ' + c; d.textContent = t; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; };
  const local = text => {
    const s = text.toLowerCase(); let best = null, sc = 0;
    KB.forEach(e => { const n = e.k.filter(w => s.includes(w)).length; if (n > sc) { sc = n; best = e; } });
    return best ? best.a : "I don't have that in Godlin's resume. Try asking about leadership, DraftKings, products, AI work, tech stack or awards, or email godlinjosheela@gmail.com.";
  };
  const history = [];
  async function ask(text) {
    add(text, 'me'); const b = add('…', 'bot');
    try {
      if (ENDPOINT) {
        const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text, history: history.slice(-6) }) });
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.answer) {
          b.textContent = data.answer;
          history.push({ role: 'user', content: text }, { role: 'assistant', content: data.answer });
        } else if (r.status === 429 || r.status === 503) {
          b.textContent = data.error || 'Too many questions right now. Please try again in a minute.';
        } else { b.textContent = local(text); } // API down: fall back to the built-in answers
      } else { await new Promise(r => setTimeout(r, 450)); b.textContent = local(text); }
    } catch { b.textContent = local(text); }
  }
  if (ENDPOINT) mode.textContent = 'Answers are generated by an LLM from my resume and may contain mistakes.';
  sugg.forEach(s => { const b = document.createElement('button'); b.type = 'button'; b.textContent = s; b.onclick = () => ask(s); box.appendChild(b); });
  form.addEventListener('submit', e => { e.preventDefault(); const t = q.value.trim(); if (t) { q.value = ''; ask(t); } });
})();
