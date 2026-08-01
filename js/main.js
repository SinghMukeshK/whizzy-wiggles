// Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));

    // Navbar scroll shadow & progress bar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 30
        ? '0 8px 30px rgba(168,85,247,0.15)'
        : '0 4px 20px rgba(168,85,247,0.08)';

      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('rainbow-bar').style.width = scrolled + '%';
    });

    // ===== MOBILE HAMBURGER MENU =====
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const btn = document.getElementById('hamburger');
      menu.classList.toggle('open');
      btn.classList.toggle('open');
    }

    // ===== CURSOR SPARKLE TRAIL =====
    const sparkles = ['⭐', '✨', '🎈', '🌈', '💖', '🍀', '🌟'];
    window.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.18) return;
      const span = document.createElement('span');
      span.className = 'sparkle';
      span.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      span.style.left = e.clientX + 'px';
      span.style.top = e.clientY + 'px';
      const size = 12 + Math.random() * 16;
      span.style.fontSize = size + 'px';
      const xMov = (Math.random() - 0.5) * 60;
      const yMov = -40 - Math.random() * 40;
      span.animate([
        { transform: 'translate(0, 0) rotate(0deg)' },
        { transform: `translate(${xMov}px, ${yMov}px) rotate(${Math.random() * 360}deg)` }
      ], {
        duration: 700,
        easing: 'ease-out'
      });
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 700);
    });

    // ===== STAR & ACHIEVEMENT BADGE SYSTEM =====
    const BADGES = [
      { id: 'first_star', name: 'Bright Start 🌟', emoji: '🌟', desc: 'Earned your very first star!' },
      { id: 'memory_master', name: 'Memory Hero 🧠', emoji: '🧠', desc: 'Completed Memory Match game!' },
      { id: 'alphabet_pro', name: 'ABC Champ 🔤', emoji: '🔤', desc: 'Completed ABC Bubbles Pop!' },
      { id: 'color_wiz', name: 'Color Explorer 🎨', emoji: '🎨', desc: 'Completed Color Sorter!' },
      { id: 'star_counter', name: 'Star Counter ⭐', emoji: '⭐', desc: 'Completed Counting Stars!' },
      { id: 'artist', name: 'Master Artist 🎨🖌️', emoji: '🖌️', desc: 'Saved your first custom drawing!' },
      { id: 'word_wizard', name: 'Word Wizard 🔠', emoji: '🔠', desc: 'Solved a word in Word Builder!' },
      { id: 'magic_cat_champion', name: 'Cat Wizard 🐱🪄', emoji: '🐱', desc: 'Defeated 10+ ghosts in Magic Cat Academy!' },
      { id: 'musician', name: 'Lil Composer 🎵', emoji: '🎵', desc: 'Played all notes in Music Maker!' },
      { id: 'fruit_catcher', name: 'Fruit Collector 🍎', emoji: '🍎', desc: 'Caught 15+ fruits in Fruit Catch!' },
      { id: 'shapes_expert', name: 'Shapes Expert 🎓', emoji: '🎓', desc: 'Got 3 correct quiz answers in a row!' }
    ];

    let userStars = parseInt(localStorage.getItem('ww_stars') || '0');
    let earnedBadges = JSON.parse(localStorage.getItem('ww_badges') || '[]');

    function updateStarDisplay() {
      document.getElementById('star-counter-num').textContent = userStars;
      localStorage.setItem('ww_stars', userStars);
    }

    function addStars(num) {
      userStars += num;
      updateStarDisplay();
      if (userStars >= 1 && !earnedBadges.includes('first_star')) {
        awardBadge('first_star');
      }
      triggerWinConfetti();
    }

    function showToast(title, desc, icon) {
      const toast = document.getElementById('achievement-toast');
      document.getElementById('toast-title').textContent = title;
      document.getElementById('toast-desc').textContent = desc;
      document.getElementById('toast-icon').textContent = icon;
      toast.classList.add('show');

      playBipSound(523.25, 'sine', 0.15); // C5
      setTimeout(() => playBipSound(659.25, 'sine', 0.15), 100); // E5
      setTimeout(() => playBipSound(783.99, 'sine', 0.25), 200); // G5
      setTimeout(() => playBipSound(1046.50, 'sine', 0.4), 300); // C6

      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    function playBipSound(freq, type = 'sine', duration = 0.2) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        // audio context blocked or unsupported
      }
    }

    function awardBadge(id) {
      if (earnedBadges.includes(id)) return;
      earnedBadges.push(id);
      localStorage.setItem('ww_badges', JSON.stringify(earnedBadges));
      const badge = BADGES.find(b => b.id === id);
      if (badge) {
        showToast('Achievement Unlocked!', badge.name + ' - ' + badge.desc, badge.emoji);
        renderBadges();
      }
    }

    function renderBadges() {
      const grid = document.getElementById('badgeGrid');
      if (!grid) return;
      grid.innerHTML = BADGES.map(b => {
        const earned = earnedBadges.includes(b.id);
        return `
          <div class="badge-item ${earned ? 'earned' : ''}" title="${b.desc}">
            <span class="badge-emoji">${earned ? b.emoji : '🔒'}</span>
            <span class="badge-name">${b.name.split(' ')[0]}</span>
            ${earned ? '<span class="badge-earned-lbl">Earned!</span>' : ''}
          </div>
        `;
      }).join('');
    }

    function resetBadges() {
      if (confirm('Are you sure you want to reset all your stars and badges?')) {
        userStars = 0;
        earnedBadges = [];
        localStorage.removeItem('ww_stars');
        localStorage.removeItem('ww_badges');
        updateStarDisplay();
        renderBadges();
        showToast('Reset Complete', 'Your progress has been reset.', '🔄');
      }
    }

    function triggerWinConfetti() {
      for (let i = 0; i < 30; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.zIndex = '9999';
        conf.style.width = (6 + Math.random() * 8) + 'px';
        conf.style.height = (6 + Math.random() * 8) + 'px';
        conf.style.background = ['#FF4455', '#FF8C00', '#FFD700', '#4ADE80', '#38BDF8', '#A855F7', '#FF70B8'][Math.floor(Math.random() * 7)];
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        conf.style.left = '50%';
        conf.style.top = '40%';

        const angle = Math.random() * Math.PI * 2;
        const speed = 100 + Math.random() * 200;
        const xDir = Math.cos(angle) * speed;
        const yDir = Math.sin(angle) * speed;

        conf.animate([
          { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: `translate(${xDir}px, ${yDir}px) scale(0.3) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
          duration: 1000 + Math.random() * 800,
          easing: 'cubic-bezier(.1,.8,.3,1)'
        });

        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 1800);
      }
    }

    // Initialize systems on page load
    window.addEventListener('DOMContentLoaded', () => {
      updateStarDisplay();
      renderBadges();
    });

    // Staggered card animations
    const cards = document.querySelectorAll('.about-card, .playlist-card, .video-card, .game-card, .print-card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          entry.target.style.transitionDelay = `${(idx % 4) * 0.08}s`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'all 0.5s ease';
      cardObserver.observe(card);
    });

    // ===== GAME ENGINE =====
    let gamesPlayedCount = parseInt(localStorage.getItem('ww_games_played') || '0');
    function openGame(id) {
      const modal = document.getElementById('gameModal');
      const title = document.getElementById('gameModalTitle');
      const body = document.getElementById('gameModalBody');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Track games played
      gamesPlayedCount++;
      localStorage.setItem('ww_games_played', gamesPlayedCount);
      const ptGames = document.getElementById('pt-games');
      if (ptGames) ptGames.textContent = gamesPlayedCount;
      if (id === 'memory') { title.textContent = '🧠 Memory Match'; body.innerHTML = buildMemoryGame(); initMemory(); }
      else if (id === 'abc') { title.textContent = '🔤 ABC Bubbles Pop'; body.innerHTML = buildAbcGame(); initAbc(); }
      else if (id === 'colors') { title.textContent = '🎨 Color Sorter'; body.innerHTML = buildColorsGame(); initColors(); }
      else if (id === 'count') { title.textContent = '⭐ Counting Stars'; body.innerHTML = buildCountGame(); initCount(); }
      else if (id === 'draw') { title.textContent = '🎨 Drawing Canvas'; body.innerHTML = buildDrawGame(); initDraw(); }
      else if (id === 'word') { title.textContent = '🔤 Word Builder'; body.innerHTML = buildWordGame(); initWord(); }
      else if (id === 'wzymatch') { title.textContent = '🧩 Whizzy Match'; body.innerHTML = buildWhizzyMatch(); initWhizzyMatch(); }
      else if (id === 'balloon') { title.textContent = '🎈 Balloon Pop!'; body.innerHTML = buildBalloonPop(); initBalloonPop(); }
      else if (id === 'music') { title.textContent = '🎵 Music Maker'; body.innerHTML = buildMusicGame(); initMusic(); }
      else if (id === 'spelling') { title.textContent = '🔡 Spelling Game'; body.innerHTML = buildSpellingGame(); initSpelling(); }
      else if (id === 'puzzle') { title.textContent = '🧩 Puzzle Slide'; body.innerHTML = buildPuzzleGame(); initPuzzle(); }
      else if (id === 'whack') { title.textContent = '🐹 Whack-a-Mole!'; body.innerHTML = buildWhackGame(); initWhack(); }
      else if (id === 'math') { title.textContent = '🔢 Math Magic'; body.innerHTML = buildMathGame(); initMath(); }
    }
    function closeGameModal(e) {
      if (!e || e.target === document.getElementById('gameModal') || e.target.classList.contains('game-modal-close')) {
        document.getElementById('gameModal').classList.remove('active');
        document.getElementById('gameModalBody').innerHTML = '';
        document.body.style.overflow = '';
      }
    }

    /* ===== MEMORY MATCH ===== */
    function buildMemoryGame() {
      return `
        <style>
          .mem-board{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:480px;margin:0 auto;}
          .mem-card{aspect-ratio:1;border-radius:14px;cursor:pointer;perspective:600px;position:relative;transition:transform 0.1s;}
          .mem-card:hover{transform:scale(1.04);}
          .mem-inner{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.5s cubic-bezier(.4,0,.2,1);border-radius:14px;}
          .mem-card.flipped .mem-inner,.mem-card.matched .mem-inner{transform:rotateY(180deg);}
          .mem-front,.mem-back{position:absolute;inset:0;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:2rem;backface-visibility:hidden;}
          .mem-front{background:linear-gradient(135deg,#A855F7,#38BDF8);box-shadow:0 4px 14px rgba(168,85,247,0.3);}
          .mem-back{background:white;border:3px solid #F3E8FF;transform:rotateY(180deg);font-size:2.4rem;box-shadow:0 4px 14px rgba(0,0,0,0.08);}
          .mem-card.matched .mem-back{background:#F0FFF4;border-color:#4ADE80;}
          .mem-score{text-align:center;margin-bottom:20px;font-family:'Fredoka One',cursive;font-size:1.2rem;color:#A855F7;}
          .mem-win{text-align:center;padding:20px;font-family:'Fredoka One',cursive;font-size:1.8rem;color:#22C55E;animation:bounce 0.8s ease;}
        </style>
        <div class="mem-score" id="memScore">Moves: 0 &nbsp;|&nbsp; Pairs: 0/8</div>
        <div class="mem-board" id="memBoard"></div>
        <div id="memWin" style="display:none" class="mem-win">🎉 You Won! Amazing! 🌟</div>`;
    }
    function initMemory() {
      const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
      let deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      let flipped = [], matched = [], moves = 0, lock = false;
      const board = document.getElementById('memBoard');
      board.innerHTML = deck.map((e, i) => `
        <div class="mem-card" data-idx="${i}" data-val="${e}" onclick="memFlip(this)">
          <div class="mem-inner">
            <div class="mem-front">❓</div>
            <div class="mem-back">${e}</div>
          </div></div>`).join('');
      window.memFlip = function (card) {
        if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped');
        flipped.push(card);
        if (flipped.length === 2) {
          lock = true; moves++;
          if (flipped[0].dataset.val === flipped[1].dataset.val) {
            flipped.forEach(c => c.classList.add('matched'));
            matched.push(...flipped);
            flipped = []; lock = false;
            document.getElementById('memScore').innerHTML = `Moves: ${moves} &nbsp;|&nbsp; Pairs: ${matched.length / 2}/8`;
            if (matched.length === 16) { setTimeout(() => { document.getElementById('memWin').style.display = 'block'; }, 300); }
          } else {
            setTimeout(() => {
              flipped.forEach(c => c.classList.remove('flipped')); flipped = []; lock = false;
              document.getElementById('memScore').innerHTML = `Moves: ${moves} &nbsp;|&nbsp; Pairs: ${matched.length / 2}/8`;
            }, 900);
          }
        }
      };
    }

    /* ===== ABC BUBBLES ===== */
    function buildAbcGame() {
      return `
        <style>
          #abcArea{position:relative;width:100%;height:420px;background:linear-gradient(135deg,#1a1a5e,#38BDF8);border-radius:20px;overflow:hidden;}
          .abc-bubble{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fredoka One',cursive;font-size:1.4rem;color:white;cursor:pointer;transition:transform 0.15s;box-shadow:0 4px 18px rgba(0,0,0,0.3);user-select:none;}
          .abc-bubble:hover{transform:scale(1.15)!important;}
          .abc-bubble.correct{animation:pop 0.3s ease forwards;}
          .abc-bubble.wrong{animation:shake 0.4s ease;}
          @keyframes pop{0%{transform:scale(1);}50%{transform:scale(1.4);}100%{transform:scale(0);opacity:0;}}
          @keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-8px);}75%{transform:translateX(8px);}}
          #abcHud{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-family:'Fredoka One',cursive;font-size:1.1rem;color:#A855F7;}
          #abcNext{font-size:1.4rem;background:rgba(168,85,247,0.1);padding:6px 18px;border-radius:50px;}
        </style>
        <div id="abcHud">
          <span id="abcScore">Score: 0</span>
          <span>Next letter: <span id="abcNext">A</span></span>
          <span id="abcLives">❤️❤️❤️</span>
        </div>
        <div id="abcArea"></div>
        <div id="abcWin" style="display:none;text-align:center;padding:20px;font-family:'Fredoka One',cursive;font-size:1.8rem;color:#22C55E;">🎉 A to Z Complete! You're a Star! ⭐</div>`;
    }
    function initAbc() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const colors = ['#FF4455', '#FF8C00', '#4ADE80', '#38BDF8', '#A855F7', '#FF70B8', '#FFD700'];
      let cur = 0, score = 0, lives = 3;
      const area = document.getElementById('abcArea');
      function spawn() {
        area.innerHTML = '';
        const pool = [...letters].sort(() => Math.random() - 0.5).slice(0, 6);
        if (!pool.includes(letters[cur])) pool[0] = letters[cur];
        pool.sort(() => Math.random() - 0.5);
        pool.forEach(l => {
          const b = document.createElement('div');
          b.className = 'abc-bubble';
          b.textContent = l;
          const sz = 60 + Math.random() * 20;
          b.style.cssText = `width:${sz}px;height:${sz}px;left:${5 + Math.random() * 80}%;top:${10 + Math.random() * 75}%;background:${colors[Math.floor(Math.random() * colors.length)]};font-size:${sz * 0.38}px;`;
          b.onclick = () => {
            if (l === letters[cur]) {
              b.classList.add('correct'); score += 10; cur++;
              document.getElementById('abcScore').textContent = `Score: ${score}`;
              document.getElementById('abcNext').textContent = letters[cur] || '🏆';
              setTimeout(() => { if (cur < letters.length) spawn(); else document.getElementById('abcWin').style.display = 'block'; }, 350);
            } else {
              b.classList.add('wrong'); lives--;
              document.getElementById('abcLives').textContent = '❤️'.repeat(lives);
              if (lives <= 0) { area.innerHTML = ''; area.innerHTML = '<div style="color:white;font-family:Fredoka One,cursive;font-size:2rem;text-align:center;padding-top:30%">Game Over! 😢 Try Again!</div>'; return; }
              setTimeout(() => b.classList.remove('wrong'), 400);
            }
          };
          area.appendChild(b);
        });
      }
      spawn();
    }

    /* ===== COLOR SORTER ===== */
    function buildColorsGame() {
      const colorDefs = [{ n: 'Red', c: '#FF4455', e: '🔴' }, { n: 'Blue', c: '#38BDF8', e: '🔵' }, { n: 'Green', c: '#4ADE80', e: '🟢' }, { n: 'Yellow', c: '#FFD700', e: '🟡' }];
      const shapes = ['⭐', '🔶', '🟣', '💠', '🏵️', '🎯'];
      let items = [], score = 0, total = 0;
      colorDefs.forEach(cd => { for (let i = 0; i < 3; i++) items.push({ color: cd, shape: shapes[Math.floor(Math.random() * shapes.length)] }); });
      items.sort(() => Math.random() - 0.5); total = items.length;
      window._csItems = items; window._csScore = 0; window._csTotal = total;
      return `
        <style>
          #csWrap{max-width:500px;margin:0 auto;}
          #csTray{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;min-height:80px;background:#F8F5FF;border-radius:16px;padding:16px;margin-bottom:20px;}
          .cs-item{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;cursor:grab;box-shadow:0 4px 14px rgba(0,0,0,0.1);transition:transform 0.2s;border:3px solid rgba(255,255,255,0.6);}
          .cs-item:hover{transform:scale(1.1);}
          #csBuckets{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
          .cs-bucket{width:100px;min-height:90px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border:3px dashed rgba(255,255,255,0.4);transition:transform 0.2s,border 0.2s;padding:10px;}
          .cs-bucket:hover{transform:scale(1.06);border-style:solid;}
          .cs-bucket-emoji{font-size:2rem;}
          .cs-bucket-name{font-family:'Fredoka One',cursive;font-size:0.85rem;color:white;}
          #csHud{text-align:center;font-family:'Fredoka One',cursive;font-size:1.1rem;color:#A855F7;margin-bottom:14px;}
          .cs-item.dragging{opacity:0.5;}
        </style>
        <div id="csWrap">
          <div id="csHud">Score: 0 / ${total}</div>
          <div id="csTray"></div>
          <div id="csBuckets">
            ${colorDefs.map(cd => `<div class="cs-bucket" style="background:${cd.c};" data-color="${cd.n}" onclick="csDropTo(this)">
              <span class="cs-bucket-emoji">${cd.e}</span>
              <span class="cs-bucket-name">${cd.n}</span>
            </div>`).join('')}
          </div>
        </div>`;
    }
    function initColors() {
      const items = window._csItems;
      const tray = document.getElementById('csTray');
      let selected = null;
      items.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'cs-item';
        el.style.background = item.color.c;
        el.dataset.color = item.color.n;
        el.dataset.idx = i;
        el.textContent = item.shape;
        el.onclick = () => {
          if (selected) { selected.style.outline = ''; }
          if (selected === el) { selected = null; return; }
          selected = el; el.style.outline = '4px solid #1A0A3C';
        };
        tray.appendChild(el);
      });
      window.csDropTo = function (bucket) {
        if (!selected) return;
        const isCorrect = selected.dataset.color === bucket.dataset.color;
        if (isCorrect) {
          window._csScore++;
          document.getElementById('csHud').textContent = `Score: ${window._csScore} / ${window._csTotal}`;
          selected.remove(); selected = null;
          if (window._csScore === window._csTotal) {
            document.getElementById('csBuckets').innerHTML = '';
            document.getElementById('csTray').innerHTML = '';
            document.getElementById('csHud').textContent = '🎉 All sorted! You\'re amazing! ⭐';
          }
        } else {
          selected.style.outline = '4px solid #FF4455';
          setTimeout(() => { if (selected) selected.style.outline = '4px solid #1A0A3C'; }, 600);
        }
      };
    }

    /* ===== COUNTING STARS ===== */
    function buildCountGame() {
      return `
        <style>
          #ctWrap{max-width:500px;margin:0 auto;text-align:center;}
          #ctStage{height:200px;border-radius:20px;background:linear-gradient(135deg,#1A0A3C,#A855F7);display:flex;align-items:center;justify-content:center;font-size:4rem;flex-wrap:wrap;gap:6px;padding:16px;margin-bottom:20px;position:relative;}
          .ct-star{display:inline-block;animation:starPop 0.4s ease both;}
          @keyframes starPop{from{opacity:0;transform:scale(0);}to{opacity:1;transform:scale(1);}}
          #ctQuestion{font-family:'Fredoka One',cursive;font-size:1.3rem;color:#1A0A3C;margin-bottom:14px;}
          #ctChoices{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
          .ct-choice{width:68px;height:68px;border-radius:50%;border:none;font-family:'Fredoka One',cursive;font-size:1.4rem;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(0,0,0,0.15);}
          .ct-choice:hover{transform:scale(1.12);}
          .ct-choice.correct{background:#4ADE80!important;color:white;transform:scale(1.2);}
          .ct-choice.wrong{background:#FF4455!important;color:white;animation:shake 0.4s ease;}
          #ctHud{font-family:'Fredoka One',cursive;font-size:1.1rem;color:#A855F7;margin-bottom:14px;display:flex;justify-content:space-between;}
        </style>
        <div id="ctWrap">
          <div id="ctHud"><span id="ctScore">Score: 0</span><span id="ctRound">Round: 1/10</span></div>
          <div id="ctStage"></div>
          <div id="ctQuestion">How many stars do you see?</div>
          <div id="ctChoices"></div>
          <div id="ctFinish" style="display:none;font-family:'Fredoka One',cursive;font-size:1.8rem;color:#22C55E;padding:20px;">🌟 Brilliant Counter! 🎉</div>
        </div>`;
    }
    function initCount() {
      let round = 1, score = 0, total = 10, locked = false;
      const colors = ['#FF4455', '#FF8C00', '#FFD700', '#4ADE80', '#38BDF8', '#A855F7', '#FF70B8'];
      function nextRound() {
        if (round > total) { document.getElementById('ctFinish').style.display = 'block'; return; }
        locked = false;
        const count = 1 + Math.floor(Math.random() * 20);
        document.getElementById('ctRound').textContent = `Round: ${round}/${total}`;
        const stage = document.getElementById('ctStage');
        stage.innerHTML = '';
        for (let i = 0; i < count; i++) {
          const s = document.createElement('span');
          s.className = 'ct-star';
          s.textContent = '⭐';
          s.style.animationDelay = (i * 0.04) + 's';
          s.style.fontSize = (2.5 - Math.floor(count / 7) * 0.3) + 'rem';
          stage.appendChild(s);
        }
        // choices: correct + 3 wrongs
        let choices = [count];
        while (choices.length < 4) {
          const w = 1 + Math.floor(Math.random() * 20);
          if (!choices.includes(w)) choices.push(w);
        }
        choices.sort(() => Math.random() - 0.5);
        const cc = document.getElementById('ctChoices');
        cc.innerHTML = '';
        choices.forEach((c, i) => {
          const btn = document.createElement('button');
          btn.className = 'ct-choice';
          btn.textContent = c;
          btn.style.background = colors[i % colors.length];
          btn.style.color = 'white';
          btn.onclick = () => {
            if (locked) return; locked = true;
            if (c === count) {
              btn.classList.add('correct'); score += 10;
              document.getElementById('ctScore').textContent = `Score: ${score}`;
              setTimeout(() => { round++; nextRound(); }, 700);
            } else {
              btn.classList.add('wrong');
              cc.querySelectorAll('.ct-choice').forEach(b => { if (parseInt(b.textContent) === count) b.classList.add('correct'); });
              setTimeout(() => { round++; nextRound(); }, 900);
            }
          };
          cc.appendChild(btn);
        });
      }
      nextRound();
    }

    /* ===== PRINTABLE PDF GENERATOR ===== */
    function printActivity(type) {
      if (type === 'animals') {
        const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
        const pages = [
          { img: baseUrl + '/images/safari.png', title: 'Safari Friends', desc: 'Lion \u2022 Giraffe \u2022 Elephant \u2022 Turtle' },
          { img: baseUrl + '/images/zoo.png', title: 'At the Zoo!', desc: 'Giraffe \u2022 Elephant \u2022 Lion \u2022 Zebra' },
          { img: baseUrl + '/images/farm.png', title: 'Fun on the Farm', desc: 'Cow \u2022 Horse \u2022 Sheep \u2022 Pig \u2022 Chicken' },
          { img: baseUrl + '/images/cute-chars.png', title: 'Cute Characters!', desc: 'Bear \u2022 Penguin \u2022 Bunny \u2022 Cat \u2022 Elephant \u2022 and more!' },
          { img: baseUrl + '/images/space.png', title: 'Space Adventure!', desc: 'Rocket \u2022 Dinosaur \u2022 Race Car \u2022 Stars' }
        ];
        const win = window.open('', '_blank');
        win.document.write(`<!DOCTYPE html><html><head><title>Animal Coloring Book &ndash; Whizzy Wiggles</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; background: #fff; color: #1A0A3C; }
          .cover {
            min-height: 100vh; display: flex; flex-direction: column; align-items: center;
            justify-content: center; text-align: center;
            background: linear-gradient(135deg, #FFF9E6, #F3E8FF);
            padding: 40px 20px; page-break-after: always;
          }
          .cover-emoji { font-size: 5rem; margin-bottom: 20px; }
          .cover h1 { font-size: 3rem; margin-bottom: 12px; color: #A855F7; }
          .cover .subtitle { font-size: 1.2rem; color: #666; margin-bottom: 8px; }
          .cover .channel { font-size: 1rem; color: #A855F7; font-weight: bold; margin-top: 16px; }
          .cover .pages-list { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 20px; }
          .cover .page-chip { background: white; border: 2px solid #F3E8FF; border-radius: 50px; padding: 7px 16px; font-size: 0.88rem; font-weight: bold; color: #A855F7; }
          .name-box { display: flex; align-items: center; gap: 10px; margin-top: 14px; font-size: 0.95rem; color: #888; width: 320px; }
          .name-line { flex: 1; height: 2px; background: #ddd; border-radius: 99px; }
          .coloring-page {
            page-break-before: always; display: flex; flex-direction: column;
            align-items: center; padding: 20px 20px 14px; min-height: 100vh;
          }
          .page-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 3px solid #F3E8FF; padding-bottom: 8px; }
          .page-title { font-size: 1.5rem; font-weight: bold; color: #A855F7; }
          .page-num { font-size: 0.85rem; color: #aaa; font-weight: bold; }
          .page-desc { font-size: 0.88rem; color: #888; margin-bottom: 14px; text-align: center; }
          .coloring-img { width: 100%; max-width: 560px; height: auto; border: 3px dashed #F3E8FF; border-radius: 14px; }
          .page-footer { margin-top: auto; padding-top: 10px; font-size: 0.72rem; color: #ccc; text-align: center; width: 100%; border-top: 1px solid #F3E8FF; }
          .toolbar { position: fixed; bottom: 20px; right: 20px; z-index: 999; }
          .btn-print { padding: 14px 28px; border-radius: 50px; border: none; font-size: 1rem; font-weight: bold; cursor: pointer; background: #A855F7; color: white; box-shadow: 0 4px 18px rgba(168,85,247,0.4); transition: all 0.2s; }
          .btn-print:hover { background: #9333EA; transform: scale(1.05); }
          @media print { .toolbar { display: none !important; } }
        </style></head><body>
        <div class="cover">
          <div class="cover-emoji">&#127912;</div>
          <h1>Animal Coloring Book</h1>
          <p class="subtitle">5 Fun Pages to Color In!</p>
          <p class="subtitle" style="font-size:0.95rem;">Lions &bull; Elephants &bull; Giraffes &bull; Farm Animals &bull; Space Friends</p>
          <div class="pages-list">
            <span class="page-chip">&#129409; Safari Friends</span>
            <span class="page-chip">&#127963;&#65039; At the Zoo</span>
            <span class="page-chip">&#128004; Fun on the Farm</span>
            <span class="page-chip">&#128049; Cute Characters</span>
            <span class="page-chip">&#128640; Space Adventure</span>
          </div>
          <p class="channel">&#127752; Whizzy Wiggles Official &mdash; youtube.com/@whizzywigglesofficial</p>
          <div class="name-box"><span>Name:</span><div class="name-line"></div></div>
          <div class="name-box"><span>Date:</span><div class="name-line"></div></div>
        </div>
        ${pages.map((p, i) => `<div class="coloring-page">
            <div class="page-header">
              <span class="page-title">${p.title}</span>
              <span class="page-num">Page ${i + 1} of ${pages.length}</span>
            </div>
            <p class="page-desc">${p.desc}</p>
            <img class="coloring-img" src="${p.img}" alt="${p.title} coloring page" />
            <div class="page-footer">&#127912; Whizzy Wiggles Coloring Book</div>
          </div>`).join('')}
        <div class="toolbar">
          <button class="btn-print" onclick="window.print()">&#128424;&#65039; Print All 5 Pages</button>
        </div>
        </body></html>`);
        win.document.close();
        return;
      }

      if (type === 'maze') {
        const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
        const pages = [
          { img: baseUrl + '/images/maze-easy.png', title: 'Easy Maze: Help the Puppy Reach Home', desc: 'Help the cute puppy 🐶 find the correct path to reach their cozy doghouse 🏡!' },
          { img: baseUrl + '/images/maze-medium.png', title: 'Medium Maze: Guide the Bunny to Carrots', desc: 'Guide the hungry little bunny 🐰 through the stone walls to find the delicious carrots 🥕!' },
          { img: baseUrl + '/images/maze-hard.png', title: 'Hard Maze: Lead the Bee to Flowers', desc: 'Lead the busy bumblebee 🐝 through the garden hedge maze to reach the beautiful blooming flowers 🌸!' }
        ];
        const win = window.open('', '_blank');
        win.document.write(`<!DOCTYPE html><html><head><title>Maze Puzzles &ndash; Whizzy Wiggles</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; background: #fff; color: #1A0A3C; }
          .cover {
            min-height: 100vh; display: flex; flex-direction: column; align-items: center;
            justify-content: center; text-align: center;
            background: linear-gradient(135deg, #E8F5E9, #FFF9E6);
            padding: 40px 20px; page-break-after: always;
          }
          .cover-emoji { font-size: 5rem; margin-bottom: 20px; }
          .cover h1 { font-size: 3rem; margin-bottom: 12px; color: #4ADE80; }
          .cover .subtitle { font-size: 1.2rem; color: #666; margin-bottom: 8px; }
          .cover .channel { font-size: 1rem; color: #22C55E; font-weight: bold; margin-top: 16px; }
          .cover .pages-list { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 20px; }
          .cover .page-chip { background: white; border: 2px solid #E8F5E9; border-radius: 50px; padding: 7px 16px; font-size: 0.88rem; font-weight: bold; color: #22C55E; }
          .name-box { display: flex; align-items: center; gap: 10px; margin-top: 14px; font-size: 0.95rem; color: #888; width: 320px; }
          .name-line { flex: 1; height: 2px; background: #ddd; border-radius: 99px; }
          .maze-page {
            page-break-before: always; display: flex; flex-direction: column;
            align-items: center; padding: 20px 20px 14px; min-height: 100vh;
          }
          .page-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 3px solid #E8F5E9; padding-bottom: 8px; }
          .page-title { font-size: 1.5rem; font-weight: bold; color: #22C55E; }
          .page-num { font-size: 0.85rem; color: #aaa; font-weight: bold; }
          .page-desc { font-size: 0.88rem; color: #888; margin-bottom: 14px; text-align: center; }
          .maze-img { width: 100%; max-width: 750px; height: auto; border: 3px dashed #4ADE80; border-radius: 14px; }
          .page-footer { margin-top: auto; padding-top: 10px; font-size: 0.72rem; color: #ccc; text-align: center; width: 100%; border-top: 1px solid #E8F5E9; }
          .toolbar { position: fixed; bottom: 20px; right: 20px; z-index: 999; }
          .btn-print { padding: 14px 28px; border-radius: 50px; border: none; font-size: 1rem; font-weight: bold; cursor: pointer; background: #4ADE80; color: white; box-shadow: 0 4px 18px rgba(74,222,128,0.4); transition: all 0.2s; }
          .btn-print:hover { background: #22C55E; transform: scale(1.05); }
          @media print { .toolbar { display: none !important; } }
        </style></head><body>
        <div class="cover">
          <div class="cover-emoji">🌀</div>
          <h1>Maze Puzzles</h1>
          <p class="subtitle">3 Fun Mazes to Solve!</p>
          <p class="subtitle" style="font-size:0.95rem;">Easy &bull; Medium &bull; Hard</p>
          <div class="pages-list">
            <span class="page-chip">🐶 Easy: Puppy Maze</span>
            <span class="page-chip">🐰 Medium: Bunny Maze</span>
            <span class="page-chip">🐝 Hard: Bee Maze</span>
          </div>
          <p class="channel">🌈 Whizzy Wiggles Official</p>
          <div class="name-box"><span>Name:</span><div class="name-line"></div></div>
          <div class="name-box"><span>Date:</span><div class="name-line"></div></div>
        </div>
        ${pages.map((p, i) => `<div class="maze-page">
            <div class="page-header">
              <span class="page-title">${p.title}</span>
              <span class="page-num">Page ${i + 1} of ${pages.length}</span>
            </div>
            <p class="page-desc">${p.desc}</p>
            <img class="maze-img" src="${p.img}" alt="${p.title}" />
            <div class="page-footer">🌀 Whizzy Wiggles Maze Puzzles</div>
          </div>`).join('')}
        <div class="toolbar">
          <button class="btn-print" onclick="window.print()">🖨️ Print All 3 Pages</button>
        </div>
        </body></html>`);
        win.document.close();
        return;
      }

      if (type === 'ludo') {
        const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
        const win = window.open('', '_blank');
        win.document.write(
          '<!DOCTYPE html><html><head><title>Whizzy Wiggles Ludo Edition</title>' +
          '<style>' +
          '* { box-sizing: border-box; margin: 0; padding: 0; }' +
          'body { font-family: Arial, sans-serif; background: #fff; color: #1A0A3C; }' +
          '.cover { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:linear-gradient(135deg,#F3E8FF,#EEF4FF,#FFF9E6); padding:40px 20px; page-break-after:always; }' +
          '.cover-title { font-size:2.6rem; font-weight:900; color:#A855F7; margin-bottom:8px; }' +
          '.cover-sub { font-size:1.1rem; color:#888; margin-bottom:6px; }' +
          '.ww-badge { display:inline-block; background:linear-gradient(135deg,#A855F7,#38BDF8); color:white; padding:7px 20px; border-radius:50px; font-size:0.9rem; font-weight:bold; margin:12px 0; }' +
          '.rules-box { background:linear-gradient(135deg,#F3E8FF,#EEF4FF); border:2px solid rgba(168,85,247,0.2); border-radius:16px; padding:20px; max-width:520px; text-align:left; margin-top:16px; }' +
          '.rules-box h3 { color:#A855F7; margin-bottom:10px; font-size:1rem; }' +
          '.rules-box li { color:#555; font-size:0.88rem; margin-bottom:6px; padding-left:4px; }' +
          '.name-box { display:flex; align-items:center; gap:10px; margin-top:14px; font-size:0.95rem; color:#888; width:320px; }' +
          '.name-line { flex:1; height:2px; background:#ddd; border-radius:99px; }' +
          '.board-page { display:flex; flex-direction:column; align-items:center; padding:24px; background:#fff; }' +
          '.board-header { width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:10px; border-bottom:3px solid rgba(168,85,247,0.25); }' +
          '.board-title { font-size:1.4rem; font-weight:900; color:#A855F7; }' +
          '.board-img { width:100%; max-width:680px; height:auto; border:3px solid rgba(168,85,247,0.2); border-radius:16px; display:block; margin:0 auto; }' +
          '.tokens-section { width:100%; max-width:680px; margin:20px auto 0; }' +
          '.tokens-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:10px; }' +
          '.token { height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:bold; border:3px dashed rgba(0,0,0,0.15); }' +
          '.board-footer { margin-top:auto; padding-top:10px; font-size:0.72rem; color:#ccc; text-align:center; width:100%; border-top:1px solid #F3E8FF; }' +
          '.toolbar { position:fixed; bottom:20px; right:20px; z-index:999; }' +
          '.btn-print { padding:14px 28px; border-radius:50px; border:none; font-size:1rem; font-weight:bold; cursor:pointer; background:linear-gradient(135deg,#A855F7,#38BDF8); color:white; box-shadow:0 4px 18px rgba(168,85,247,0.4); }' +
          '@media print { .toolbar { display:none!important; } }' +
          '</style></head><body>' +
          '<div class="cover">' +
          '<div style="font-size:5rem">&#x1F3B2;&#x1F308;&#x1F9F8;</div>' +
          '<div class="cover-title">Whizzy Wiggles Ludo!</div>' +
          '<p class="cover-sub">The most magical Ludo game ever! &#x1F31F;</p>' +
          '<span class="ww-badge">&#x1F308; Whizzy Wiggles Official Edition</span>' +
          '<div class="rules-box"><h3>&#x1F3AE; How to Play:</h3><ul>' +
          '<li>&#x1F7E3; Each player picks a colour: Red, Blue, Green or Yellow</li>' +
          '<li>&#x1F3B2; Roll the dice &mdash; need a 6 to move a token out of home!</li>' +
          '<li>&#x27A1;&#xFE0F; Move your token along the coloured path</li>' +
          '<li>&#x1F40D; Land on another token to send them back to home!</li>' +
          '<li>&#x1F3C6; First to get ALL 4 tokens to the centre WINS!</li>' +
          '</ul></div>' +
          '<div class="name-box"><span>Player 1:</span><div class="name-line"></div></div>' +
          '<div class="name-box"><span>Player 2:</span><div class="name-line"></div></div>' +
          '<div class="name-box"><span>Player 3:</span><div class="name-line"></div></div>' +
          '<div class="name-box"><span>Player 4:</span><div class="name-line"></div></div>' +
          '</div>' +
          '<div class="board-page">' +
          '<div class="board-header"><span class="board-title">&#x1F3B2; Ludo Board &mdash; Whizzy Wiggles Edition</span><span style="font-size:0.8rem;color:#aaa;">whizzywiggles.in</span></div>' +
          '<img class="board-img" src="' + baseUrl + '/images/ludo.png" alt="Whizzy Wiggles Ludo Board" />' +
          '<div class="board-footer">&#x1F308; Whizzy Wiggles Official &mdash; Free Printable &mdash; whizzywiggles.in</div>' +
          '</div>' +
          '</div>' +
          '<div class="toolbar"><button class="btn-print" onclick="window.print()">&#x1F5A8;&#xFE0F; Print Now!</button></div>' +
          '</body></html>'
        );
        win.document.close();
        return;
      }

      if (type === 'snakes') {
        const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
        const win = window.open('', '_blank');
        win.document.write(
          '<!DOCTYPE html><html><head><title>Whizzy Wiggles Snakes &amp; Ladders</title>' +
          '<style>' +
          '* { box-sizing: border-box; margin: 0; padding: 0; }' +
          'body { font-family: Arial, sans-serif; background: #fff; color: #1A0A3C; }' +
          '.cover { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:linear-gradient(135deg,#FFF9E6,#F0FFF4,#EEF4FF); padding:40px 20px; page-break-after:always; }' +
          '.cover-title { font-size:2.6rem; font-weight:900; color:#22C55E; margin-bottom:8px; }' +
          '.cover-sub { font-size:1.1rem; color:#888; margin-bottom:6px; }' +
          '.ww-badge { display:inline-block; background:linear-gradient(135deg,#FF70B8,#A855F7); color:white; padding:7px 20px; border-radius:50px; font-size:0.9rem; font-weight:bold; margin:12px 0; }' +
          '.rules-box { background:linear-gradient(135deg,#F0FFF4,#FFF9E6); border:2px solid rgba(34,197,94,0.2); border-radius:16px; padding:20px; max-width:520px; text-align:left; margin-top:16px; }' +
          '.rules-box h3 { color:#22C55E; margin-bottom:10px; font-size:1rem; }' +
          '.rules-box li { color:#555; font-size:0.88rem; margin-bottom:6px; padding-left:4px; }' +
          '.name-box { display:flex; align-items:center; gap:10px; margin-top:14px; font-size:0.95rem; color:#888; width:320px; }' +
          '.name-line { flex:1; height:2px; background:#ddd; border-radius:99px; }' +
          '.board-page { min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:24px; background:#fff; }' +
          '.board-header { width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:10px; border-bottom:3px solid rgba(34,197,94,0.25); }' +
          '.board-title { font-size:1.4rem; font-weight:900; color:#22C55E; }' +
          '.board-img { width:100%; max-width:700px; height:auto; border:3px solid rgba(34,197,94,0.2); border-radius:16px; display:block; margin:0 auto; }' +
          '.board-footer { margin-top:auto; padding-top:10px; font-size:0.72rem; color:#ccc; text-align:center; width:100%; border-top:1px solid #F0FFF4; }' +
          '.ref-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:680px; margin:20px auto; }' +
          '.ref-box { background:linear-gradient(135deg,#F0FFF4,#FFF9E6); border:2px solid rgba(34,197,94,0.2); border-radius:14px; padding:16px; }' +
          '.ref-box h4 { color:#22C55E; font-size:0.9rem; margin-bottom:8px; }' +
          '.ref-box li { font-size:0.82rem; color:#555; margin-bottom:5px; }' +
          '.toolbar { position:fixed; bottom:20px; right:20px; z-index:999; }' +
          '.btn-print { padding:14px 28px; border-radius:50px; border:none; font-size:1rem; font-weight:bold; cursor:pointer; background:linear-gradient(135deg,#22C55E,#A855F7); color:white; box-shadow:0 4px 18px rgba(34,197,94,0.4); }' +
          '@media print { .toolbar { display:none!important; } }' +
          '</style></head><body>' +
          '<div class="cover">' +
          '<div style="font-size:5rem">&#x1F40D;&#x1F308;&#x1FAA4;</div>' +
          '<div class="cover-title">Snakes &amp; Ladders!</div>' +
          '<p class="cover-sub">Whizzy Wiggles Rainbow Edition &#x1F31F;</p>' +
          '<span class="ww-badge">&#x1F308; Whizzy Wiggles Official Edition</span>' +
          '<div class="rules-box"><h3>&#x1F3AE; How to Play:</h3><ul>' +
          '<li>&#x1F9E9; 2&ndash;4 players can play together</li>' +
          '<li>&#x1F3B2; Take turns rolling the dice and moving forward</li>' +
          '<li>&#x1FAA4; Land on a ladder &mdash; climb UP to a higher square! &#x1F4C8;</li>' +
          '<li>&#x1F40D; Land on a snake &mdash; slide DOWN the snake! &#x1F4C9;</li>' +
          '<li>&#x1F3C6; First to reach square 100 WINS! &#x1F389;</li>' +
          '<li>&#x26A0;&#xFE0F; You must land EXACTLY on 100 to win!</li>' +
          '</ul></div>' +
          '<div class="name-box"><span>Player 1:</span><div class="name-line"></div></div>' +
          '<div class="name-box"><span>Player 2:</span><div class="name-line"></div></div>' +
          '<div class="name-box"><span>Player 3:</span><div class="name-line"></div></div>' +
          '<div class="name-box"><span>Player 4:</span><div class="name-line"></div></div>' +
          '</div>' +
          '<div class="board-page">' +
          '<div class="board-header"><span class="board-title">&#x1F40D; Snakes &amp; Ladders &mdash; Whizzy Wiggles Edition</span><span style="font-size:0.8rem;color:#aaa;">whizzywiggles.in</span></div>' +
          '<img class="board-img" src="' + baseUrl + '/images/snakes.jpg" alt="Whizzy Wiggles Snakes and Ladders Board" />' +
          '<div class="board-footer">&#x1F308; Whizzy Wiggles Official &mdash; Free Printable &mdash; whizzywiggles.in</div>' +
          '</div>' +
          '<div class="toolbar"><button class="btn-print" onclick="window.print()">&#x1F5A8;&#xFE0F; Print Now!</button></div>' +
          '</body></html>'
        );
        win.document.close();
        return;
      }

      const configs = {
        abc: { title: 'ABC Tracing Sheet', emoji: '🔤', lines: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), color: '#FFD700', desc: 'Trace each letter below:' },
        numbers: { title: 'Number Tracing 1–20', emoji: '🔢', lines: Array.from({ length: 20 }, (_, i) => String(i + 1)), color: '#FF70B8', desc: 'Trace each number below:' },
        matching: { title: 'Fruit Matching Game', emoji: '🔗', lines: ['🍎 Apple  ←→  🍎', '🍊 Orange ←→  🍊', '🍋 Lemon  ←→  🍋', '🍇 Grapes ←→  🍇', '🍓 Strawberry ←→ 🍓', '🍌 Banana ←→  🍌'], color: '#A855F7', desc: 'Draw lines to match each fruit:' }
      };
      const cfg = configs[type];
      const win = window.open('', '_blank');
      win.document.write(`<!DOCTYPE html><html><head><title>${cfg.title} &ndash; Whizzy Wiggles</title>
      <style>body{font-family:Arial,sans-serif;max-width:700px;margin:30px auto;padding:20px;color:#1A0A3C;}
      h1{font-size:2rem;text-align:center;margin-bottom:4px;}.sub{text-align:center;color:#888;margin-bottom:24px;font-size:1rem;}
      .logo{text-align:center;font-size:2.5rem;margin-bottom:8px;}.border-top{border-top:4px solid ${cfg.color};border-radius:4px;margin-bottom:28px;}
      .item{display:flex;align-items:center;gap:16px;margin-bottom:20px;}.item-emoji{font-size:2.2rem;flex-shrink:0;}
      .trace-line{flex:1;height:48px;border:2px dashed #ddd;border-radius:8px;display:flex;align-items:center;padding:0 14px;font-size:1.6rem;color:#e0e0e0;letter-spacing:4px;}
      .footer{text-align:center;margin-top:40px;font-size:0.8rem;color:#bbb;border-top:1px solid #eee;padding-top:16px;}
      @media print{button{display:none!important;}}</style></head><body>
      <div class="logo">${cfg.emoji}</div>
      <h1>${cfg.title}</h1>
      <p class="sub">By Whizzy Wiggles &#127752; | whizzywiggles.in</p>
      <div class="border-top"></div>
      <p style="font-weight:bold;margin-bottom:16px;">${cfg.desc}</p>
      ${cfg.lines.map(l => `<div class="item"><span class="item-emoji">${l.split(' ')[0]}</span><div class="trace-line">${l}</div></div>`).join('')}
      <div class="footer">Made with &#128150; by Whizzy Wiggles | Subscribe: youtube.com/@whizzywigglesofficial</div>
      <br><button onclick="window.print()" style="display:block;margin:0 auto;padding:12px 32px;border-radius:50px;background:${cfg.color};color:#1A0A3C;border:none;font-size:1rem;font-weight:bold;cursor:pointer;">&#128424;&#65039; Print This Page</button>
      </body></html>`);
      win.document.close();
    }

    // ===== ABC FLASHCARDS SYSTEM =====
    const FC_CARDS = [
      { l: 'A', w: 'Apple', e: '🍎' },
      { l: 'B', w: 'Bunny', e: '🐰' },
      { l: 'C', w: 'Cat', e: '🐱' },
      { l: 'D', w: 'Dog', e: '🐶' },
      { l: 'E', w: 'Elephant', e: '🐘' },
      { l: 'F', w: 'Fox', e: '🦊' },
      { l: 'G', w: 'Giraffe', e: '🦒' },
      { l: 'H', w: 'Hamster', e: '🐹' },
      { l: 'I', w: 'Ice Cream', e: '🍦' },
      { l: 'J', w: 'Jellyfish', e: '🪼' },
      { l: 'K', w: 'Kangaroo', e: '🦘' },
      { l: 'L', w: 'Lion', e: '🦁' },
      { l: 'M', w: 'Monkey', e: '🐵' },
      { l: 'N', w: 'Nesting Doll', e: '🪆' },
      { l: 'O', w: 'Owl', e: '🦉' },
      { l: 'P', w: 'Panda', e: '🐼' },
      { l: 'Q', w: 'Queen Bee', e: '🐝' },
      { l: 'R', w: 'Rainbow', e: '🌈' },
      { l: 'S', w: 'Strawberry', e: '🍓' },
      { l: 'T', w: 'Turtle', e: '🐢' },
      { l: 'U', w: 'Unicorn', e: '🦄' },
      { l: 'V', w: 'Violin', e: '🎻' },
      { l: 'W', w: 'Watermelon', e: '🍉' },
      { l: 'X', w: 'Xylophone', e: '🪘' },
      { l: 'Y', w: 'Yo-Yo', e: '🪀' },
      { l: 'Z', w: 'Zebra', e: '🦓' }
    ];
    let fcIndex = 0;
    function fcRender() {
      const cardEl = document.getElementById('flashcard');
      if (!cardEl) return;
      cardEl.classList.remove('flipped');
      const cur = FC_CARDS[fcIndex];
      document.getElementById('fc-front-letter').textContent = cur.l;
      document.getElementById('fc-back-emoji').textContent = cur.e;
      document.getElementById('fc-back-word').textContent = cur.w;
      document.getElementById('fc-back-label').textContent = `${cur.l} is for ${cur.w}!`;
      document.getElementById('fcProgress').textContent = `Card ${fcIndex + 1} of ${FC_CARDS.length}`;

      const dots = document.getElementById('fcDots');
      dots.innerHTML = FC_CARDS.map((_, i) => `
        <span class="fc-dot ${i === fcIndex ? 'active' : ''} ${i < fcIndex ? 'visited' : ''}" onclick="fcGoto(${i})"></span>
      `).join('');
    }
    function fcFlip() {
      const card = document.getElementById('flashcard');
      if (card) {
        card.classList.toggle('flipped');
        playBipSound(392, 'sine', 0.1);
      }
    }
    function fcNext() {
      fcIndex = (fcIndex + 1) % FC_CARDS.length;
      fcRender();
    }
    function fcPrev() {
      fcIndex = (fcIndex - 1 + FC_CARDS.length) % FC_CARDS.length;
      fcRender();
    }
    function fcGoto(idx) {
      fcIndex = idx;
      fcRender();
    }
    function fcShuffle() {
      FC_CARDS.sort(() => Math.random() - 0.5);
      fcIndex = 0;
      fcRender();
      showToast('Shuffled! 🔀', 'The flashcards are all mixed up!', '🔀');
    }
    window.addEventListener('DOMContentLoaded', fcRender);

    // ===== COLORS & SHAPES QUIZ SYSTEM =====
    const SQ_COLORS = [
      { name: 'Red', emoji: '🔴', hex: '#FF4455' },
      { name: 'Blue', emoji: '🔵', hex: '#38BDF8' },
      { name: 'Green', emoji: '🟢', hex: '#4ADE80' },
      { name: 'Yellow', emoji: '🟡', hex: '#FFD700' },
      { name: 'Orange', emoji: '🟠', hex: '#FF8C00' },
      { name: 'Purple', emoji: '🟣', hex: '#A855F7' },
      { name: 'Pink', emoji: '🌸', hex: '#FF70B8' },
      { name: 'Brown', emoji: '🟫', hex: '#B8860B' }
    ];
    const SQ_SHAPES = [
      { name: 'Circle', emoji: '⭕' },
      { name: 'Square', emoji: '⬛' },
      { name: 'Triangle', emoji: '🔺' },
      { name: 'Star', emoji: '⭐' },
      { name: 'Heart', emoji: '💖' },
      { name: 'Diamond', emoji: '🔶' }
    ];
    let sqMode = 'colors';
    let sqScore = 0;
    let sqBest = 0;
    let sqStreak = 0;
    let sqCurrentItem = null;

    function sqSetMode(mode) {
      sqMode = mode;
      document.getElementById('tab-colors').classList.toggle('active', mode === 'colors');
      document.getElementById('tab-shapes').classList.toggle('active', mode === 'shapes');
      sqRender();
    }

    function sqRender() {
      const isColors = sqMode === 'colors';
      const items = isColors ? SQ_COLORS : SQ_SHAPES;
      const visualEl = document.getElementById('sqVisual');
      if (!visualEl) return;

      sqCurrentItem = items[Math.floor(Math.random() * items.length)];
      visualEl.textContent = sqCurrentItem.emoji;
      if (isColors) {
        visualEl.style.color = sqCurrentItem.hex;
      } else {
        visualEl.style.color = '';
      }

      document.getElementById('sqQuestion').textContent = isColors ? 'What color is this?' : 'What shape is this?';

      let choices = [sqCurrentItem.name];
      while (choices.length < 3) {
        const other = items[Math.floor(Math.random() * items.length)].name;
        if (!choices.includes(other)) choices.push(other);
      }
      choices.sort(() => Math.random() - 0.5);

      const optionsEl = document.getElementById('sqOptions');
      optionsEl.innerHTML = choices.map(c => `
        <button class="sq-option" onclick="sqAnswer(this, '${c}')">${c}</button>
      `).join('');
    }

    function sqAnswer(btn, value) {
      const options = document.querySelectorAll('.sq-option');
      options.forEach(o => o.disabled = true);

      if (value === sqCurrentItem.name) {
        btn.classList.add('correct');
        sqScore += 10;
        sqStreak++;
        if (sqScore > sqBest) sqBest = sqScore;
        document.getElementById('sqScore').textContent = `Score: ${sqScore} | Best: ${sqBest}`;
        playBipSound(587.33, 'sine', 0.25);
        addStars(5);
        if (sqStreak >= 3) {
          awardBadge('shapes_expert');
        }
        setTimeout(sqRender, 800);
      } else {
        btn.classList.add('wrong');
        sqStreak = 0;
        options.forEach(o => {
          if (o.textContent === sqCurrentItem.name) o.classList.add('correct');
        });
        playBipSound(220, 'triangle', 0.3);
        setTimeout(sqRender, 1500);
      }
    }
    window.addEventListener('DOMContentLoaded', sqRender);

    // ===== GAME 5: DRAWING CANVAS =====
    function buildDrawGame() {
      return `
        <style>
          .draw-controls { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-bottom:14px; align-items:center; }
          .draw-canvas-container { text-align:center; position:relative; }
          #drawCanvas { background:white; border:4px solid #F3E8FF; border-radius:18px; box-shadow:0 8px 24px rgba(0,0,0,0.06); cursor:crosshair; width:100%; max-width:600px; touch-action:none; }
          .palette { display:flex; gap:6px; flex-wrap:wrap; justify-content:center; margin-bottom:10px; }
        </style>
        <div class="draw-controls">
          <div class="palette">
            <div class="draw-color active" style="background:#000000" data-color="#000000"></div>
            <div class="draw-color" style="background:#FF4455" data-color="#FF4455"></div>
            <div class="draw-color" style="background:#FF8C00" data-color="#FF8C00"></div>
            <div class="draw-color" style="background:#FFD700" data-color="#FFD700"></div>
            <div class="draw-color" style="background:#4ADE80" data-color="#4ADE80"></div>
            <div class="draw-color" style="background:#38BDF8" data-color="#38BDF8"></div>
            <div class="draw-color" style="background:#A855F7" data-color="#A855F7"></div>
            <div class="draw-color" style="background:#FF70B8" data-color="#FF70B8"></div>
            <div class="draw-color" style="background:#ffffff; border:3px solid #ccc; display:flex; align-items:center; justify-content:center; font-size:1.1rem;" data-color="#ffffff" title="Eraser">🧽</div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="draw-size-btn active" data-size="5">Small</button>
            <button class="draw-size-btn" data-size="12">Medium</button>
            <button class="draw-size-btn" data-size="22">Big</button>
          </div>
          <div>
            <button class="draw-action-btn draw-clear" style="background:linear-gradient(135deg,#FF8C00,#FF4455); color:white;">Clear</button>
            <button class="draw-action-btn draw-save" style="background:linear-gradient(135deg,#4ADE80,#22C55E); color:white;">Save Painting 🖼️</button>
          </div>
        </div>
        <div class="draw-canvas-container">
          <canvas id="drawCanvas" width="600" height="400"></canvas>
        </div>
      `;
    }
    function initDraw() {
      const canvas = document.getElementById('drawCanvas');
      const ctx = canvas.getContext('2d');
      let drawing = false;
      let brushColor = '#000000';
      let brushSize = 5;

      canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; draw(e); }, { passive: false });
      canvas.addEventListener('touchend', () => { drawing = false; ctx.beginPath(); });
      canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });

      canvas.addEventListener('mousedown', (e) => { drawing = true; draw(e); });
      canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
      canvas.addEventListener('mousemove', draw);

      function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }

      document.querySelectorAll('.draw-color').forEach(item => {
        item.onclick = () => {
          document.querySelectorAll('.draw-color').forEach(c => c.classList.remove('active'));
          item.classList.add('active');
          brushColor = item.dataset.color;
        };
      });

      document.querySelectorAll('.draw-size-btn').forEach(btn => {
        btn.onclick = () => {
          document.querySelectorAll('.draw-size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          brushSize = parseInt(btn.dataset.size);
        };
      });

      document.querySelector('.draw-clear').onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playBipSound(180, 'sawtooth', 0.2);
      };

      document.querySelector('.draw-save').onclick = () => {
        awardBadge('artist');
        addStars(20);
        showToast('Drawing Saved! 🖼️', 'Excellent work, little artist!', '🎨');
      };
    }

    // ===== GAME 6: WORD BUILDER =====
    function buildWordGame() {
      return `
        <style>
          .word-stage{text-align:center;margin-bottom:20px;}
          .word-emoji{font-size:5.5rem;display:block;margin-bottom:8px;animation:wiggle 3s ease-in-out infinite;}
          .word-slots{display:flex;gap:12px;justify-content:center;margin-bottom:24px;}
          .word-slot{width:64px;height:64px;border:3px dashed var(--purple);border-radius:16px;display:flex;align-items:center;justify-content:center;font-family:'Fredoka One',cursive;font-size:2rem;background:#FDFBFF;box-shadow:inset 0 4px 10px rgba(0,0,0,0.05);}
          .word-choices{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
          .word-letter-btn{width:58px;height:58px;border-radius:14px;border:none;background:linear-gradient(135deg,#38BDF8,#0EA5E9);color:white;font-family:'Fredoka One',cursive;font-size:1.8rem;cursor:pointer;box-shadow:0 4px 14px rgba(14,165,233,0.3);transition:all 0.2s;}
          .word-letter-btn:hover{transform:scale(1.1);box-shadow:0 6px 18px rgba(14,165,233,0.45);}
          .word-hud{text-align:center;font-family:'Fredoka One',cursive;font-size:1.1rem;color:#A855F7;margin-bottom:14px;}
          .word-win{text-align:center;font-family:'Fredoka One',cursive;font-size:1.6rem;color:#22C55E;display:none;animation:bounce 0.8s ease;}
        </style>
        <div class="word-hud" id="wordHud">Score: 0 &nbsp;|&nbsp; Word: 1/5</div>
        <div class="word-stage">
          <span class="word-emoji" id="wordEmoji">🐱</span>
          <div class="word-slots" id="wordSlots"></div>
          <div class="word-choices" id="wordChoices"></div>
          <div class="word-win" id="wordWin">🎉 Correct! You're a word master! 🌟</div>
        </div>
      `;
    }
    function initWord() {
      const list = [
        { w: 'CAT', e: '🐱' },
        { w: 'DOG', e: '🐶' },
        { w: 'SUN', e: '☀️' },
        { w: 'FOX', e: '🦊' },
        { w: 'PIG', e: '🐷' },
        { w: 'BEE', e: '🐝' },
        { w: 'COW', e: '🐮' },
        { w: 'TOY', e: '🧸' }
      ];
      list.sort(() => Math.random() - 0.5);

      let round = 0;
      let score = 0;
      let targetWord = '';
      let userWord = [];

      function loadWord() {
        if (round >= 5) {
          document.getElementById('wordChoices').innerHTML = '';
          document.getElementById('wordSlots').innerHTML = '';
          document.getElementById('wordWin').innerHTML = '🏆 Game Complete! You are Super Smart! ⭐';
          document.getElementById('wordWin').style.display = 'block';
          awardBadge('word_wizard');
          return;
        }

        document.getElementById('wordWin').style.display = 'none';
        document.getElementById('wordHud').textContent = `Score: ${score} | Word: ${round + 1}/5`;

        targetWord = list[round].w;
        userWord = Array(targetWord.length).fill('');
        document.getElementById('wordEmoji').textContent = list[round].e;

        const slotsContainer = document.getElementById('wordSlots');
        slotsContainer.innerHTML = targetWord.split('').map((_, i) => `
          <div class="word-slot" id="ws-${i}"></div>
        `).join('');

        let chars = targetWord.split('');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        while (chars.length < 5) {
          const r = alphabet[Math.floor(Math.random() * 26)];
          if (!chars.includes(r)) chars.push(r);
        }
        chars.sort(() => Math.random() - 0.5);

        const choicesContainer = document.getElementById('wordChoices');
        choicesContainer.innerHTML = chars.map(l => `
          <button class="word-letter-btn" onclick="wordChoose(this, '${l}')">${l}</button>
        `).join('');
      }

      window.wordChoose = function (btn, letter) {
        const emptyIdx = userWord.findIndex(c => c === '');
        if (emptyIdx !== -1) {
          userWord[emptyIdx] = letter;
          document.getElementById(`ws-${emptyIdx}`).textContent = letter;
          btn.style.opacity = '0.3';
          btn.disabled = true;
          btn.dataset.slotIdx = emptyIdx;
          btn.onclick = null;

          playBipSound(440 + emptyIdx * 100, 'sine', 0.12);

          if (userWord.findIndex(c => c === '') === -1) {
            const result = userWord.join('');
            if (result === targetWord) {
              score += 10;
              addStars(10);
              document.getElementById('wordWin').style.display = 'block';
              document.getElementById('wordWin').textContent = `🎉 Correct! It is ${targetWord}! ⭐`;
              playBipSound(659.25, 'sine', 0.15);
              setTimeout(() => playBipSound(783.99, 'sine', 0.25), 100);
              setTimeout(() => {
                round++;
                loadWord();
              }, 1800);
            } else {
              playBipSound(180, 'sawtooth', 0.35);
              document.querySelectorAll('.word-slot').forEach(el => {
                el.style.animation = 'shake 0.4s ease';
                setTimeout(() => el.style.animation = '', 400);
              });
              setTimeout(() => {
                loadWord();
              }, 600);
            }
          }
        }
      };

      loadWord();
    }

    // ===== GAME 7: MAGIC CAT ACADEMY =====
    function buildMagicCatGame() {
      return `
        <style>
          .mc-game-wrap { text-align:center; position:relative; }
          #mcCanvas { background:#1e1a3a; border:4px solid var(--purple); border-radius:20px; box-shadow:0 8px 24px rgba(0,0,0,0.2); width:100%; max-width:550px; touch-action:none; }
          .mc-hud { display:flex; justify-content:space-between; max-width:550px; margin:0 auto 12px; font-family:'Fredoka One',cursive; font-size:1.1rem; color:#A855F7; }
        </style>
        <div class="mc-hud">
          <span>Defeat Spooky Ghosts! 👻</span>
          <span style="color:#FF8C00;">Draw: ─, │, ∨, ∧</span>
        </div>
        <div class="mc-game-wrap">
          <canvas id="mcCanvas" width="500" height="350"></canvas>
        </div>
        <div style="text-align:center;font-weight:700;color:#666;margin-top:10px;">Draw symbols above the ghosts anywhere on screen! ─, │, ∨, ∧</div>
      `;
    }
    function initMagicCat() {
      const canvas = document.getElementById('mcCanvas');
      const ctx = canvas.getContext('2d');
      let score = 0;
      let lives = 5;
      let gameActive = true;

      let ghosts = [];
      let particles = [];
      let points = [];
      let isDrawing = false;

      const symbols = ['Horizontal', 'Vertical', 'V', 'Caret'];

      // Background stars
      let starsBg = [];
      for (let i = 0; i < 40; i++) {
        starsBg.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
      }

      function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (e.clientX - rect.left) * (canvas.width / rect.width),
          y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
      }

      function getTouchPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
          y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
        };
      }

      // Listeners
      canvas.addEventListener('mousedown', (e) => {
        if (!gameActive) return;
        isDrawing = true;
        points = [getMousePos(e)];
      });
      canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing || !gameActive) return;
        points.push(getMousePos(e));
      });
      canvas.addEventListener('mouseup', () => {
        if (!isDrawing) return;
        isDrawing = false;
        recognizeStroke();
        points = [];
      });

      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!gameActive) return;
        isDrawing = true;
        points = [getTouchPos(e)];
      }, { passive: false });
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing || !gameActive) return;
        points.push(getTouchPos(e));
      }, { passive: false });
      canvas.addEventListener('touchend', () => {
        if (!isDrawing) return;
        isDrawing = false;
        recognizeStroke();
        points = [];
      });

      // Spawn ghosts
      function spawnGhost() {
        if (!gameActive) return;
        ghosts.push({
          x: 40 + Math.random() * (canvas.width - 80),
          y: -20,
          speed: 0.7 + Math.random() * 0.8 + (score / 150),
          symbol: symbols[Math.floor(Math.random() * symbols.length)]
        });
      }
      const spawnInterval = setInterval(spawnGhost, 2200);

      // Recognize drawing stroke
      function recognizeStroke() {
        if (points.length < 5) return;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (let p of points) {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }

        const W = maxX - minX;
        const H = maxY - minY;
        if (W < 10 && H < 10) return;

        let minYIdx = 0, maxYIdx = 0;
        for (let i = 0; i < points.length; i++) {
          if (points[i].y === minY) minYIdx = i;
          if (points[i].y === maxY) maxYIdx = i;
        }

        const aspect = W / (H || 1);
        const midStart = Math.floor(points.length * 0.25);
        const midEnd = Math.floor(points.length * 0.75);

        const isV = (maxYIdx >= midStart && maxYIdx <= midEnd) &&
          (maxY - points[0].y > H * 0.3) &&
          (maxY - points[points.length - 1].y > H * 0.3);

        const isCaret = (minYIdx >= midStart && minYIdx <= midEnd) &&
          (points[0].y - minY > H * 0.3) &&
          (points[points.length - 1].y - minY > H * 0.3);

        let recognized = '';
        if (isV) {
          recognized = 'V';
        } else if (isCaret) {
          recognized = 'Caret';
        } else if (aspect > 1.6) {
          recognized = 'Horizontal';
        } else if (aspect < 0.6) {
          recognized = 'Vertical';
        }

        if (recognized) {
          checkMatch(recognized);
        }
      }

      function checkMatch(symbol) {
        let matchedGhostIdx = -1;
        let maxValY = -1;

        for (let i = 0; i < ghosts.length; i++) {
          if (ghosts[i].symbol === symbol && ghosts[i].y > maxValY) {
            maxValY = ghosts[i].y;
            matchedGhostIdx = i;
          }
        }

        if (matchedGhostIdx !== -1) {
          const g = ghosts[matchedGhostIdx];
          for (let k = 0; k < 12; k++) {
            particles.push({
              x: g.x,
              y: g.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: 2 + Math.random() * 4,
              color: ['#A855F7', '#38BDF8', '#FF70B8', '#FFD700'][Math.floor(Math.random() * 4)],
              life: 15 + Math.random() * 15
            });
          }
          ghosts.splice(matchedGhostIdx, 1);
          score += 10;
          addStars(5);
          if (score >= 100) {
            awardBadge('magic_cat_champion');
          }
          playBipSound(783.99, 'sine', 0.15); // high correct tone
        } else {
          playBipSound(180, 'sawtooth', 0.12); // wrong tone
        }
      }

      // Game loops
      function update() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#1e1a3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        starsBg.forEach(star => ctx.fillRect(star.x, star.y, 2, 2));

        // Draw wizard cat
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🐱', canvas.width / 2, canvas.height - 15);
        ctx.font = '24px Arial';
        ctx.fillText('🪄', canvas.width / 2 + 25, canvas.height - 35);

        // Update & Draw Ghosts
        for (let i = ghosts.length - 1; i >= 0; i--) {
          const g = ghosts[i];
          g.y += g.speed;

          ctx.font = '36px Arial';
          ctx.fillText('👻', g.x, g.y);

          // Symbol box
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.beginPath();
          ctx.arc(g.x, g.y - 32, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#FFD700';
          ctx.font = 'bold 15px Arial';
          let symbolChar = '';
          if (g.symbol === 'Horizontal') symbolChar = '─';
          else if (g.symbol === 'Vertical') symbolChar = '│';
          else if (g.symbol === 'V') symbolChar = '∨';
          else if (g.symbol === 'Caret') symbolChar = '∧';
          ctx.fillText(symbolChar, g.x, g.y - 27);

          // Reach cat
          if (g.y >= canvas.height - 40) {
            ghosts.splice(i, 1);
            lives--;
            playBipSound(220, 'sawtooth', 0.25);
            if (lives <= 0) {
              gameActive = false;
              clearInterval(spawnInterval);
              ctx.fillStyle = 'rgba(26,10,60,0.8)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 24px Arial';
              ctx.fillText('Game Over! 👻🎒', canvas.width / 2, canvas.height / 2 - 10);
              ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
            }
          }
        }

        // Draw user stroke path
        if (points.length > 1) {
          ctx.strokeStyle = '#C084FC';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          if (p.life <= 0) particles.splice(i, 1);
        }

        // Score & Lives
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 15, 25);
        ctx.textAlign = 'right';
        ctx.fillText('❤️'.repeat(lives), canvas.width - 15, 25);

        requestAnimationFrame(update);
      }

      update();
    }

    // ===== GAME 8: MUSIC MAKER =====
    function buildMusicGame() {
      return `
        <style>
          .music-piano { display:flex; gap:8px; justify-content:center; max-width:550px; margin:20px auto; overflow-x:auto; padding:10px 0; }
          .piano-key { width:56px; height:180px; border-radius:0 0 16px 16px; border:3px solid #1A0A3C; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding-bottom:20px; font-family:'Fredoka One',cursive; font-size:1.1rem; font-weight:800; transition:all 0.15s; box-shadow:0 8px 16px rgba(0,0,0,0.1); }
          .piano-key:active { transform:translateY(8px); box-shadow:0 2px 4px rgba(0,0,0,0.2); background:#FFFBEF!important; }
          .music-modes { display:flex; gap:10px; justify-content:center; margin-bottom:14px; }
          .music-mode-btn { padding:10px 22px; border-radius:50px; border:none; cursor:pointer; font-family:'Fredoka One',cursive; font-size:0.9rem; transition:all 0.2s; }
          .music-mode-btn.active { background:var(--purple); color:white; }
        </style>
        <div class="music-modes">
          <button class="music-mode-btn active" id="mm-sine" onclick="setMusicWave('sine', this)">🎹 Piano</button>
          <button class="music-mode-btn" id="mm-triangle" onclick="setMusicWave('triangle', this)">🎷 Flute</button>
          <button class="music-mode-btn" id="mm-square" onclick="setMusicWave('square', this)">👾 Arcade</button>
        </div>
        <div class="music-piano" id="piano"></div>
        <div style="text-align:center;font-weight:700;color:#666;">Tap keys to play beautiful tunes! 🎵</div>
      `;
    }
    let musicWaveType = 'sine';
    let playedKeys = [];
    function setMusicWave(type, btn) {
      musicWaveType = type;
      document.querySelectorAll('.music-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    function initMusic() {
      playedKeys = [];
      const notes = [
        { note: 'Do', freq: 261.63, color: '#FF4455', emoji: '🐶' },
        { note: 'Re', freq: 293.66, color: '#FF8C00', emoji: '🐱' },
        { note: 'Mi', freq: 329.63, color: '#FFD700', emoji: '🐭' },
        { note: 'Fa', freq: 349.23, color: '#4ADE80', emoji: '🐰' },
        { note: 'Sol', freq: 392.00, color: '#38BDF8', emoji: '🦊' },
        { note: 'La', freq: 440.00, color: '#A855F7', emoji: '🐻' },
        { note: 'Si', freq: 493.88, color: '#FF70B8', emoji: '🐼' },
        { note: 'Do2', freq: 523.25, color: '#BEF264', emoji: '🐨' }
      ];

      const piano = document.getElementById('piano');
      piano.innerHTML = notes.map((n, i) => `
        <div class="piano-key" style="background:${n.color};color:white;" onclick="playNote(${n.freq}, ${i})">
          <div style="font-size:1.8rem;margin-bottom:10px;">${n.emoji}</div>
          <div>${n.note}</div>
        </div>
      `).join('');

      window.playNote = function (freq, index) {
        playBipSound(freq, musicWaveType, 0.45);
        if (!playedKeys.includes(index)) {
          playedKeys.push(index);
          if (playedKeys.length === notes.length) {
            addStars(10);
            awardBadge('musician');
          }
        }
      };
    }

    // ===== GAME 9: FRUIT CATCH =====
    function buildFruitGame() {
      return `
        <style>
          .fruit-game-wrap { text-align:center; position:relative; }
          #fruitCanvas { background:linear-gradient(180deg,#EEF4FF,#FFF0FB); border:4px solid var(--purple); border-radius:20px; box-shadow:0 8px 24px rgba(0,0,0,0.06); width:100%; max-width:550px; touch-action:none; }
          .fruit-hud { display:flex; justify-content:space-between; max-width:550px; margin:0 auto 12px; font-family:'Fredoka One',cursive; font-size:1.1rem; color:#A855F7; }
        </style>
        <div class="fruit-hud">
          <span id="fgScore">Score: 0</span>
          <span id="fgTimer">Time: 30</span>
        </div>
        <div class="fruit-game-wrap">
          <canvas id="fruitCanvas" width="500" height="350"></canvas>
        </div>
        <div style="text-align:center;font-weight:700;color:#666;margin-top:10px;">Move mouse or touch screen to slide the basket! 🍎🍌🍊</div>
      `;
    }
    function initFruit() {
      const canvas = document.getElementById('fruitCanvas');
      const ctx = canvas.getContext('2d');
      let score = 0;
      let timeLeft = 30;
      let basketX = canvas.width / 2 - 40;
      const basketWidth = 80;
      const basketHeight = 20;

      let fruits = [];
      const fruitEmojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍍'];
      let gameActive = true;

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        basketX = mouseX - basketWidth / 2;
        if (basketX < 0) basketX = 0;
        if (basketX > canvas.width - basketWidth) basketX = canvas.width - basketWidth;
      });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touchX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
        basketX = touchX - basketWidth / 2;
        if (basketX < 0) basketX = 0;
        if (basketX > canvas.width - basketWidth) basketX = canvas.width - basketWidth;
      }, { passive: false });

      const timerInterval = setInterval(() => {
        if (!gameActive) return;
        timeLeft--;
        const timerEl = document.getElementById('fgTimer');
        if (timerEl) timerEl.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
          gameActive = false;
          clearInterval(timerInterval);
          clearInterval(spawnInterval);
          ctx.fillStyle = 'rgba(26,10,60,0.75)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Game Over! 🎉', canvas.width / 2, canvas.height / 2 - 10);
          ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 25);
          playBipSound(523.25, 'sine', 0.25);
          setTimeout(() => playBipSound(659.25, 'sine', 0.35), 100);
          addStars(score);
          if (score >= 15) {
            awardBadge('fruit_catcher');
          }
        }
      }, 1000);

      function spawnFruit() {
        if (!gameActive) return;
        fruits.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: -20,
          speed: 2.5 + Math.random() * 2.5,
          emoji: fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)]
        });
      }
      const spawnInterval = setInterval(spawnFruit, 900);

      function update() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#C084FC';
        ctx.beginPath();
        ctx.roundRect(basketX, canvas.height - basketHeight - 10, basketWidth, basketHeight, 10);
        ctx.fill();
        ctx.fillStyle = '#A855F7';
        ctx.font = '16px Arial';
        ctx.fillText('🧺 Basket', basketX + 8, canvas.height - basketHeight + 4);

        fruits.forEach((f, i) => {
          f.y += f.speed;
          ctx.font = '28px Arial';
          ctx.fillText(f.emoji, f.x - 14, f.y + 10);

          if (f.y >= canvas.height - basketHeight - 20 && f.y <= canvas.height - 10) {
            if (f.x >= basketX && f.x <= basketX + basketWidth) {
              score++;
              const scoreEl = document.getElementById('fgScore');
              if (scoreEl) scoreEl.textContent = `Score: ${score}`;
              playBipSound(600, 'sine', 0.08);
              fruits.splice(i, 1);
            }
          }

          if (f.y > canvas.height + 20) {
            fruits.splice(i, 1);
          }
        });

        requestAnimationFrame(update);
      }

      update();
    }

    // ===== AVATAR SELECTOR =====
    function selectAvatar(emoji, name) {
      const overlay = document.getElementById('avatar-overlay');
      const guide = document.getElementById('avatar-guide');
      const bubble = document.getElementById('avatar-guide-bubble');
      overlay.style.animation = 'fadeIn 0.4s ease reverse';
      setTimeout(() => { overlay.style.display = 'none'; }, 380);
      guide.textContent = emoji;
      bubble.textContent = `Hi! I'm ${name}! 🌟 I'll guide you through Whizzy Wiggles!`;
      localStorage.setItem('ww_avatar', JSON.stringify({ emoji, name }));
      showToast(`Welcome, ${name} Friend! 🎉`, `${name} will guide you today!`, emoji);
    }

    function toggleAvatarBubble() {
      const bubble = document.getElementById('avatar-guide-bubble');
      bubble.style.display = bubble.style.display === 'block' ? 'none' : 'block';
      setTimeout(() => { bubble.style.display = 'none'; }, 3000);
    }

    // Restore avatar on page load
    window.addEventListener('DOMContentLoaded', () => {
      const saved = localStorage.getItem('ww_avatar');
      if (saved) {
        const { emoji, name } = JSON.parse(saved);
        document.getElementById('avatar-overlay').style.display = 'none';
        document.getElementById('avatar-guide').textContent = emoji;
        document.getElementById('avatar-guide-bubble').textContent = `Hi! I'm ${name}! 🌟`;
      }
    });

    // ===== WHIZZY CHARACTERS SWITCHER =====
    const WHIZZY_CHARACTERS_DATA = {
      teddy: {
        emoji: '🧸',
        name: 'Whizzy Teddy Bear',
        bio: `<p>I'm Whizzy Teddy Bear — the silliest, fluffiest, most curious bear you'll ever meet! I love rainbows 🌈, learning new things 📚, making friends 🤝, and going on adventures every single week on the Whizzy Wiggles channel!</p>
              <p>I believe every child is SUPER SPECIAL ✨ and that learning is the best adventure of all! Come join me — let's explore, play, and grow together!</p>`,
        badges: ['🌈 Rainbow Lover', '📚 Lifelong Learner', '🎵 Music Fan', '🚀 Adventurer', '💛 Friend to All'],
        facts: [
          { emoji: '🎂', title: 'Birthday', text: 'Born on a rainbow day! Whizzy Teddy Bear celebrates with all his friends every year! 🎉' },
          { emoji: '🍯', title: 'Favourite Food', text: 'Honey on toast 🍞 and rainbow lollipops! Don\'t tell mama! 🤫' },
          { emoji: '🌈', title: 'Favourite Colour', text: 'ALL OF THEM! Whizzy Teddy Bear can\'t choose — every colour makes the world more beautiful! 🎨' },
          { emoji: '🎮', title: 'Hobby', text: 'Playing games with friends, reading storybooks, and making up silly songs! 🎵' },
          { emoji: '🏆', title: 'Superpower', text: 'Whizzy Teddy Bear can make anyone smile! One hug from Whizzy Teddy Bear and all sadness disappears! 💛' },
          { emoji: '💌', title: 'Message to Kids', text: '"Whizzy Teddy Bear says: You are amazing, wonderful, and capable of anything! Keep learning & smiling!" 🌟' }
        ]
      },
      dino: {
        emoji: '🦖',
        name: 'Whizzy Dino Roar',
        bio: `<p>I'm Whizzy Dino Roar — the friendly, energetic dinosaur who loves big adventures, stomping beats, and loud happy roars! 🌿</p>
              <p>I explore prehistoric jungle trails, discover new colors and shapes, and teach little ones to be brave, curious, and kind-hearted!</p>`,
        badges: ['🌿 Leaf Cruncher', '🦕 Prehistoric Pal', '⚡ Super Fast', '🎉 Party Dino', '💚 Big Hearted'],
        facts: [
          { emoji: '🎂', title: 'Birthday', text: 'Dino Discovery Day! Whizzy Dino Roar throws the biggest jungle fiesta every year! 🌴' },
          { emoji: '🍉', title: 'Favourite Food', text: 'Juicy green apples 🍏 and giant watermelon slices! 🍉' },
          { emoji: '🟩', title: 'Favourite Colour', text: 'Emerald Green & Jungle Yellow! 🌿' },
          { emoji: '🎮', title: 'Hobby', text: 'Playing hide and seek in the prehistoric forest and dancing to fun drum beats! 🥁' },
          { emoji: '🏆', title: 'Superpower', text: 'Whizzy Dino Roar has a Mighty Happy Roar that fills everyone with extra courage! ⚡' },
          { emoji: '💌', title: 'Message to Kids', text: '"Whizzy Dino Roar says: Be bold, be brave, and roar with joy every single day!" 🦖✨' }
        ]
      },
      unicorn: {
        emoji: '🦄',
        name: 'Whizzy Unicorn',
        bio: `<p>I'm Whizzy Unicorn — the sparkly, magical friend who brings stardust, sweet dreams, and rainbow colors wherever I trot! 💖</p>
              <p>I love singing happy tunes, painting sky art, and reminding every little friend that magic happens when you believe in yourself!</p>`,
        badges: ['✨ Stardust Sprinkles', '🌈 Cloud Jumper', '🎨 Creative Genius', '🌸 Sweet Heart', '💖 Magic Spreader'],
        facts: [
          { emoji: '🎂', title: 'Birthday', text: 'Starry Magic Night! Whizzy Unicorn dances under glowing shooting stars! ✨' },
          { emoji: '🍦', title: 'Favourite Food', text: 'Fluffy cotton candy clouds ☁️ and fresh strawberry smoothies! 🍓' },
          { emoji: '💖', title: 'Favourite Colour', text: 'Pastel Pink, Purple & Golden Sparkle! 🎨' },
          { emoji: '🎮', title: 'Hobby', text: 'Drawing colorful artwork, painting sky rainbows, and singing sweet lullabies! 🎵' },
          { emoji: '🏆', title: 'Superpower', text: 'Whizzy Unicorn can turn any gloomy day into a sparkling rainbow celebration! 🌈' },
          { emoji: '💌', title: 'Message to Kids', text: '"Whizzy Unicorn says: Never stop dreaming and spreading magic wherever you go!" 💫' }
        ]
      },
      panda: {
        emoji: '🐼',
        name: 'Whizzy Panda Pal',
        bio: `<p>I'm Whizzy Panda Pal — the calm, wise, and super cuddly panda who loves solving puzzles and sharing warm hugs! 🎋</p>
              <p>Whether we are learning numbers, exploring mazes, or taking gentle quiet breaks, I\'m always here as your loyal companion!</p>`,
        badges: ['🎋 Bamboo Master', '🧠 Puzzle Solver', '🧘 Calm Leader', '🐼 Hug Expert', '⭐ Kind Spirit'],
        facts: [
          { emoji: '🎂', title: 'Birthday', text: 'Bamboo Grove Celebration! Whizzy Panda Pal shares delicious baked treats with friends! 🎋' },
          { emoji: '🥟', title: 'Favourite Food', text: 'Crisp bamboo shoots 🎋 and warm sweet dumplings! 🥟' },
          { emoji: '🖤', title: 'Favourite Colour', text: 'Classic Black, Crisp White & Fresh Mint Green! 🍃' },
          { emoji: '🎮', title: 'Hobby', text: 'Solving brainy maze puzzles, reading storybooks, and stargazing! 📖' },
          { emoji: '🏆', title: 'Superpower', text: 'Whizzy Panda Pal has Super Patience & Kindness that solves any puzzle or problem! 🧠' },
          { emoji: '💌', title: 'Message to Kids', text: '"Whizzy Panda Pal says: Take a deep breath, be patient, and always be kind to others!" 🐼💛' }
        ]
      },
      star: {
        emoji: '⭐',
        name: 'Whizzy Shooting Star',
        bio: `<p>I'm Whizzy Shooting Star — the fast, bright, and cheerful star who zooms across space to light up your imagination! 🚀</p>
              <p>I love floating through space loops, discovering shiny constellations, and granting happy wishes to every curious learner!</p>`,
        badges: ['🚀 Cosmic Flyer', '✨ Wish Granter', '💡 Bright Idea', '🌟 Night Light', '🎶 Joyful Spark'],
        facts: [
          { emoji: '🎂', title: 'Birthday', text: 'Cosmic Galactic Night! Whizzy Shooting Star lights up the galaxy! 🌌' },
          { emoji: '🍍', title: 'Favourite Food', text: 'Tropical starfruit ⭐️ and sparkling mango ice pops! 🥭' },
          { emoji: '💛', title: 'Favourite Colour', text: 'Golden Sunshine & Cosmic Neon Blue! ⚡' },
          { emoji: '🎮', title: 'Hobby', text: 'Zooming through space loops, collecting glowing stardust, and making wishes! 💫' },
          { emoji: '🏆', title: 'Superpower', text: 'Whizzy Shooting Star brings instant bright ideas and creative inspiration to all! 💡' },
          { emoji: '💌', title: 'Message to Kids', text: '"Whizzy Shooting Star says: Shine bright like a star — your light makes the whole world glow!" ⭐✨' }
        ]
      }
    };

    function switchWhizzyChar(charKey) {
      const data = WHIZZY_CHARACTERS_DATA[charKey];
      if (!data) return;

      document.querySelectorAll('.char-tab').forEach(tab => tab.classList.remove('active'));
      const activeTab = document.getElementById(`char-tab-${charKey}`);
      if (activeTab) activeTab.classList.add('active');

      const display = document.getElementById('whizzyCharDisplay');
      if (!display) return;

      const badgesHtml = data.badges.map(b => `<span class="teddy-badge">${b}</span>`).join('\n');
      const factsHtml = data.facts.map(f => `
        <div class="teddy-card">
          <span class="teddy-card-emoji">${f.emoji}</span>
          <h4>${f.title}</h4>
          <p>${f.text}</p>
        </div>`).join('\n');

      display.innerHTML = `
        <div class="teddy-hero">
          <div class="teddy-emoji-big">${data.emoji}</div>
          <div class="teddy-intro">
            <h2>Hello, I'm ${data.name}!</h2>
            ${data.bio}
            <div>
              ${badgesHtml}
            </div>
          </div>
        </div>
        <div class="teddy-facts">
          ${factsHtml}
        </div>
      `;
    }
    window.switchWhizzyChar = switchWhizzyChar;

    // ===== NURSERY RHYMES & SING ALONG KARAOKE ENGINE =====
    const NURSERY_RHYMES_DATA = [
      {
        title: "⭐ Twinkle Twinkle Little Star",
        sub: "Sing along with the magical shining star!",
        lines: [
          "Twinkle, twinkle, little star 🌟",
          "How I wonder what you are! 🤔",
          "Up above the world so high 🌍",
          "Like a diamond in the sky 💎",
          "When the blazing sun is gone ☀️",
          "When he nothing shines upon 🌙",
          "Then you show your little light ✨",
          "Twinkle, twinkle, all the night 🌟",
          "Twinkle, twinkle, little star ⭐",
          "How I wonder what you are! 🤔"
        ]
      },
      {
        title: "🚌 Wheels on the Bus",
        sub: "Hop on board and sing along!",
        lines: [
          "The wheels on the bus go round and round 🔄",
          "Round and round, round and round 🌀",
          "The wheels on the bus go round and round 🚌",
          "All through the town! 🏙️",
          "The wipers on the bus go Swish, swish, swish 🌧️",
          "Swish, swish, swish, swish, swish, swish 🧹",
          "The wipers on the bus go Swish, swish, swish 🌧️",
          "All through the town! 🏙️",
          "The horn on the bus goes Beep, beep, beep 📯",
          "Beep, beep, beep, beep, beep, beep 📢",
          "The horn on the bus goes Beep, beep, beep 📯",
          "All through the town! 🏙️",
          "The babies on the bus go Wah, wah, wah 👶",
          "Wah, wah, wah, wah, wah, wah 🍼",
          "The parents on the bus go Shh, shh, shh 🤫",
          "All through the town! 🏙️"
        ]
      },
      {
        title: "👶 Johny Johny Yes Papa",
        sub: "The funniest play-along rhyme!",
        lines: [
          "Johny, Johny, Yes Papa? 👶",
          "Eating sugar? No, Papa! 🍬",
          "Telling lies? No, Papa! ❌",
          "Open your mouth, Ha! Ha! Ha! 😄",
          "Johny, Johny, Yes Papa? 👶",
          "Playing games? Yes, Papa! 🎮",
          "Done your homework? Yes, Papa! 📚",
          "Open your arms, Hug Papa! 🤗"
        ]
      },
      {
        title: "🐑 Baa Baa Black Sheep",
        sub: "Sing along with the fluffy black sheep!",
        lines: [
          "Baa, baa, black sheep, have you any wool? 🐑",
          "Yes sir, yes sir, three bags full! 🎒",
          "One for the master, and one for the dame 🎩",
          "And one for the little boy who lives down the lane 👦",
          "Baa, baa, black sheep, have you any wool? 🐑",
          "Yes sir, yes sir, three bags full! 🎒"
        ]
      },
      {
        title: "🌧️ Rain Rain Go Away",
        sub: "Sing away the rain for sunny playtime!",
        lines: [
          "Rain, rain, go away 🌧️",
          "Come again another day ☀️",
          "Little Johnny wants to play ⚽",
          "Rain, rain, go away! 🌈",
          "Rain, rain, go to Spain 🇪🇸",
          "Never show your face again 🌞",
          "Little Johnny wants to play 🏃",
          "Rain, rain, go away! 🌈"
        ]
      },
      {
        title: "🐎 Lakdi Ki Kathi",
        sub: "Famous Hindi ghoda (horse) rhyme!",
        lines: [
          "Lakdi ki kathi, kathi pe ghoda 🐎",
          "Ghode ki dum pe jo mara hathoda 🔨",
          "Dauda dauda dauda ghoda dum utha ke dauda! 🏃",
          "Ghoda pahuncha chawk mein, chawk mein tha naai ✂️",
          "Ghodeji ki naai ne hajamad jo banai 💈",
          "Chhag-bag chhag-bag dauda ghoda dum utha ke dauda! 🐎",
          "Ghoda tha ghamandi, pahuncha sabji mandi 🥬",
          "Sabji mandi baraf padi thi, ghode ko lag gayi thand ❄️",
          "Dauda dauda dauda ghoda dum utha ke dauda! 🏃"
        ]
      },
      {
        title: "🦚 Nani Teri Morni",
        sub: "Nani's classic peacock & train story song!",
        lines: [
          "Nani teri morni ko mor le gaye 🦚",
          "Baki jo bacha tha kaale chor le gaye 🏃‍♂️",
          "Khaake peeke mote hoke chor baithe rail mein 🚂",
          "Choron wala dabba kat ke pahuncha seedha jail mein 🏛️",
          "Unn choron ki khoob khabar li motey thanedaar ne 👮",
          "Moron ko bhi khoob nachaya jungle ke sardar ne 🕺",
          "Achi nani pyari nani roosam-roosi chhode de 💖",
          "Jaldi se ek paisa de de, tu kanjoosi chhode de! 😄"
        ]
      },
      {
        title: "🐟 Machli Jal Ki Rani",
        sub: "The beloved Hindi fish song!",
        lines: [
          "Machli jal ki rani hai 🐟",
          "Jeevan uska pani hai 💧",
          "Haath lagao dar jayegi 👐",
          "Bahar nikalo mar jayegi 🌊",
          "Paani mein dalo jee jayegi 💦",
          "Sab khana vo kha jayegi 🍽️",
          "Maza bada usko aayega 😄",
          "Khushi se vo tair jayegi! 🏊‍♀️"
        ]
      }
    ];

    let saCurrentSongIndex = 0;
    let saCurrentLineIndex = 0;
    let saIsPlaying = false;
    let saTimer = null;

    function startSingAlong(index) {
      if (index < 0 || index >= NURSERY_RHYMES_DATA.length) return;
      saCurrentSongIndex = index;
      saCurrentLineIndex = 0;
      saIsPlaying = true;

      const modal = document.getElementById('sing-along-modal');
      const song = NURSERY_RHYMES_DATA[saCurrentSongIndex];

      document.getElementById('sa-song-title').textContent = song.title;
      document.getElementById('sa-song-sub').textContent = song.sub;

      renderSaLyrics();
      updateSaControlsUI();
      modal.classList.add('active');

      startSaTimer();
    }

    function renderSaLyrics() {
      const song = NURSERY_RHYMES_DATA[saCurrentSongIndex];
      const display = document.getElementById('saLyricsDisplay');
      if (!display) return;

      display.innerHTML = song.lines.map((line, idx) => `
        <div class="sa-line ${idx === saCurrentLineIndex ? 'active' : (idx < saCurrentLineIndex ? 'passed' : '')}" id="sa-line-${idx}">
          ${idx === saCurrentLineIndex ? '🎵 ' : ''}${line}${idx === saCurrentLineIndex ? ' 🎵' : ''}
        </div>
      `).join('');

      updateSaProgress();
      scrollToActiveSaLine();
    }

    function scrollToActiveSaLine() {
      const activeEl = document.getElementById(`sa-line-${saCurrentLineIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function updateSaProgress() {
      const song = NURSERY_RHYMES_DATA[saCurrentSongIndex];
      const total = song.lines.length;
      const current = saCurrentLineIndex + 1;
      const percentage = Math.min(100, Math.round((current / total) * 100));

      const fill = document.getElementById('saProgressFill');
      const counter = document.getElementById('saLineCounter');
      if (fill) fill.style.width = `${percentage}%`;
      if (counter) counter.textContent = `Line ${current} of ${total}`;
    }

    function startSaTimer() {
      stopSaTimer();
      saTimer = setInterval(() => {
        if (!saIsPlaying) return;
        const song = NURSERY_RHYMES_DATA[saCurrentSongIndex];
        if (saCurrentLineIndex < song.lines.length - 1) {
          saCurrentLineIndex++;
          renderSaLyrics();
        } else {
          stopSaTimer();
          saIsPlaying = false;
          updateSaControlsUI();
        }
      }, 2600);
    }

    function stopSaTimer() {
      if (saTimer) {
        clearInterval(saTimer);
        saTimer = null;
      }
    }

    function toggleSingAlongPlayPause() {
      saIsPlaying = !saIsPlaying;
      if (saIsPlaying) {
        const song = NURSERY_RHYMES_DATA[saCurrentSongIndex];
        if (saCurrentLineIndex >= song.lines.length - 1) {
          saCurrentLineIndex = 0;
          renderSaLyrics();
        }
        startSaTimer();
      } else {
        stopSaTimer();
      }
      updateSaControlsUI();
    }

    function updateSaControlsUI() {
      const playBtn = document.getElementById('saPlayPauseBtn');
      if (playBtn) {
        playBtn.textContent = saIsPlaying ? '⏸️ Pause' : '▶️ Resume';
      }
    }

    function singAlongNext() {
      let nextIdx = (saCurrentSongIndex + 1) % NURSERY_RHYMES_DATA.length;
      startSingAlong(nextIdx);
    }

    function singAlongPrev() {
      let prevIdx = (saCurrentSongIndex - 1 + NURSERY_RHYMES_DATA.length) % NURSERY_RHYMES_DATA.length;
      startSingAlong(prevIdx);
    }

    function singAlongRestart() {
      saCurrentLineIndex = 0;
      saIsPlaying = true;
      renderSaLyrics();
      updateSaControlsUI();
      startSaTimer();
    }

    function closeSingAlong() {
      stopSaTimer();
      saIsPlaying = false;
      const modal = document.getElementById('sing-along-modal');
      if (modal) modal.classList.remove('active');
    }

    window.startSingAlong = startSingAlong;
    window.toggleSingAlongPlayPause = toggleSingAlongPlayPause;
    window.singAlongNext = singAlongNext;
    window.singAlongPrev = singAlongPrev;
    window.singAlongRestart = singAlongRestart;
    window.closeSingAlong = closeSingAlong;

    // ===== FRIENDS ZONE SUBMIT =====
    let selectedFriendEmoji = '🦁';
    document.querySelectorAll('.fz-ep-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fz-ep-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedFriendEmoji = btn.dataset.em;
      });
    });

    // Restore friend emoji pickers after DOM load
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.fz-ep-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.fz-ep-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedFriendEmoji = btn.dataset.em;
        });
      });
    });

    let friendAttachedPhoto = null;
    function triggerFriendPhoto() {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      if (!isMobile) {
        showToast('Info', 'Monitor does not have camera, only attach photo', '🖥️');
      } else {
        showToast('Info', 'Opening Whizzy Wiggles Gallery!', '🖼️');
      }
      document.getElementById('fz-photo-input').click();
    }

    function handleFriendPhoto(e) {
      const file = e.target.files[0];
      if (file) {
        friendAttachedPhoto = URL.createObjectURL(file);
        document.getElementById('fz-photo-name').textContent = '✅ ' + file.name;
      }
    }

    function submitFriendPost() {
      const name = document.getElementById('fz-name').value.trim();
      const msg = document.getElementById('fz-msg').value.trim();
      if (!name && !friendAttachedPhoto) {
        showToast('Oops! 😊', 'Please fill your name or attach a photo!', '✏️');
        return;
      }

      const colors = ['linear-gradient(135deg,#FFD700,#FF8C00)', 'linear-gradient(135deg,#38BDF8,#A855F7)', 'linear-gradient(135deg,#FF70B8,#FF4455)', 'linear-gradient(135deg,#4ADE80,#22C55E)'];
      const col = colors[Math.floor(Math.random() * colors.length)];

      const newPost = {
        name: name || 'Anonymous Friend',
        msg: msg,
        emoji: selectedFriendEmoji,
        color: col,
        photo: friendAttachedPhoto || null,
        timestamp: typeof firebase !== 'undefined' ? firebase.database.ServerValue.TIMESTAMP : Date.now()
      };

      try {
        db.ref('friendsZonePosts').push(newPost);
        
        document.getElementById('fz-name').value = '';
        document.getElementById('fz-msg').value = '';
        document.getElementById('fz-photo-name').textContent = '';
        friendAttachedPhoto = null;
        addStars(10);
        showToast('Friends Post Sent! 🌟', 'Your message is on the live wall!', '💖');
        triggerWinConfetti();
      } catch (error) {
        console.error("Firebase Error:", error);
        showToast('Oops! 🙊', 'Database connection failed. Did you add the Firebase config?', '❌');
      }
    }

    function loadFriendPosts() {
      const wall = document.querySelector('.fz-wall');
      
      try {
        const postsRef = db.ref('friendsZonePosts');
        // Clear existing static posts if connected successfully
        postsRef.once('value').then(() => {
          wall.innerHTML = ''; 
        });

        postsRef.on('child_added', (snapshot) => {
          const data = snapshot.val();
          const card = document.createElement('div');
          card.className = 'fz-card';
          
          let artContent = `<div class="fz-art-box" style="font-size:3rem;">${data.emoji} ⭐ 🌈 💖</div>`;
          if (data.photo) {
            artContent = `<div class="fz-art-box" style="padding:0; overflow:hidden;"><img src="${data.photo}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" /></div>`;
          }
          
          card.innerHTML = `
            <div class="fz-card-header">
              <div class="fz-avatar" style="background:${data.color};">${data.emoji}</div>
              <div>
                <div class="fz-username">${data.name}</div>
                <div class="fz-date">Just now</div>
              </div>
            </div>
            ${artContent}
            ${data.msg ? `<p class="fz-msg">${data.msg}</p>` : ''}
            <div class="fz-likes">❤️ 1 Like</div>
          `;
          wall.prepend(card);
        });
      } catch (error) {
        console.log("Firebase not configured yet. Showing demo posts.");
      }
    }

    function sendWithGmail() {
      const name = document.getElementById('fz-name').value.trim();
      const msg = document.getElementById('fz-msg').value.trim();
      
      if (!name) {
        showToast('Oops! 🙊', 'Please fill your name first!', '⭐');
        return;
      }
      
      const subject = encodeURIComponent(`Message from ${name} to Whizzy Wiggles!`);
      const body = encodeURIComponent(`Hi Whizzy Wiggles!\n\nHere is a message from ${name}:\n\n${msg}\n\n(My favourite emoji is: ${selectedFriendEmoji})`);
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=whizzywigglesofficial@gmail.com&su=${subject}&body=${body}`;
      window.open(gmailUrl, '_blank');
      showToast('Opening Gmail! 📧', 'Redirecting you to Gmail...', '🚀');
    }

    // ===== SOUNDBOARD =====
    const SB_DATA = {
      animals: [
        { emoji: '🦁', name: 'Lion', freq: 80, type: 'sawtooth', dur: 0.8, label: 'ROAR!' },
        { emoji: '🐘', name: 'Elephant', freq: 120, type: 'triangle', dur: 1.0, label: 'Trumpet!' },
        { emoji: '🐶', name: 'Doggy', freq: 520, type: 'square', dur: 0.4, label: 'Woof!' },
        { emoji: '🐱', name: 'Cat', freq: 680, type: 'sine', dur: 0.5, label: 'Meow!' },
        { emoji: '🐮', name: 'Cow', freq: 180, type: 'sawtooth', dur: 0.9, label: 'Moo!' },
        { emoji: '🐸', name: 'Frog', freq: 320, type: 'square', dur: 0.3, label: 'Ribbit!' },
        { emoji: '🐑', name: 'Sheep', freq: 420, type: 'sine', dur: 0.6, label: 'Baa!' },
        { emoji: '🐻', name: 'Bear', freq: 95, type: 'sawtooth', dur: 0.7, label: 'Growl!' }
      ],
      birds: [
        { emoji: '🐦', name: 'Bird', freq: 1200, type: 'sine', dur: 0.3, label: 'Tweet!' },
        { emoji: '🦜', name: 'Parrot', freq: 900, type: 'square', dur: 0.4, label: 'Squawk!' },
        { emoji: '🦉', name: 'Owl', freq: 350, type: 'sine', dur: 0.7, label: 'Hoot!' },
        { emoji: '🐔', name: 'Chicken', freq: 600, type: 'square', dur: 0.35, label: 'Cluck!' },
        { emoji: '🦆', name: 'Duck', freq: 400, type: 'triangle', dur: 0.4, label: 'Quack!' },
        { emoji: '🦅', name: 'Eagle', freq: 750, type: 'sawtooth', dur: 0.6, label: 'Screech!' },
        { emoji: '🐧', name: 'Penguin', freq: 500, type: 'sine', dur: 0.4, label: 'Squeak!' },
        { emoji: '🦢', name: 'Swan', freq: 480, type: 'sine', dur: 0.8, label: 'Honk!' },
        { emoji: '🐦‍⬛', name: 'Crow', freq: 800, type: 'sine', dur: 0.8, label: 'Crowl!' }
      ],
      vehicles: [
        { emoji: '🚂', name: 'Train', freq: 200, type: 'sawtooth', dur: 1.2, label: 'Choo Choo!' },
        { emoji: '🚗', name: 'Car', freq: 150, type: 'sawtooth', dur: 0.9, label: 'Vroom!' },
        { emoji: '🚑', name: 'Ambulance', freq: [880, 660], type: 'square', dur: 0.5, label: 'Wee Woo!' },
        { emoji: '✈️', name: 'Airplane', freq: 180, type: 'triangle', dur: 1.5, label: 'Whoosh!' },
        { emoji: '🚒', name: 'Fire Truck', freq: [770, 550], type: 'square', dur: 0.5, label: 'Wee Woo!' },
        { emoji: '🚀', name: 'Rocket', freq: 100, type: 'sawtooth', dur: 1.8, label: 'Blast Off!' },
        { emoji: '⛵', name: 'Boat', freq: 260, type: 'triangle', dur: 1.0, label: 'Toot!' },
        { emoji: '🚁', name: 'Helicopter', freq: 80, type: 'square', dur: 1.2, label: 'Whirr!' }
      ]
    };

    let sbCurrentTab = 'animals';

    function sbSetTab(tab) {
      sbCurrentTab = tab;
      ['animals', 'birds', 'vehicles'].forEach(t => {
        document.getElementById(`sb-tab-${t}`).classList.toggle('active', t === tab);
      });
      renderSoundboard();
    }

    function renderSoundboard() {
      const grid = document.getElementById('sbGrid');
      if (!grid) return;
      const items = SB_DATA[sbCurrentTab];
      grid.innerHTML = items.map((item, i) => `
        <div class="sb-item" id="sb-item-${i}" onclick="playSbSound(${i})">
          <span class="sb-item-emoji">${item.emoji}</span>
          <div class="sb-item-name">${item.name}</div>
          <div style="font-size:0.75rem;font-weight:800;color:var(--purple);margin-top:4px;">${item.label}</div>
          <div class="sb-wave"></div>
        </div>
      `).join('');
    }

    const REAL_SOUNDS = {
      'Lion': 'https://cdn.freesound.org/previews/611/611721_13511310-lq.mp3',
      'Elephant': 'https://cdn.freesound.org/previews/107/107825_321967-lq.mp3',
      'Doggy': 'https://cdn.freesound.org/previews/853/853723_9051306-lq.mp3',
      'Cat': 'https://cdn.freesound.org/previews/856/856619_18911704-lq.mp3',
      'Cow': 'https://cdn.freesound.org/previews/513/513565_2898771-lq.mp3',
      'Frog': 'https://cdn.freesound.org/previews/451/451635_9391104-lq.mp3',
      'Sheep': 'https://cdn.freesound.org/previews/110/110614_1930766-lq.mp3',
      'Bear': 'https://cdn.freesound.org/previews/728/728102_15231398-lq.mp3',
      'Bird': 'https://cdn.freesound.org/previews/9/9328_23035-lq.mp3',
      'Parrot': 'https://cdn.freesound.org/previews/327/327015_5650790-lq.mp3',
      'Owl': 'https://cdn.freesound.org/previews/698/698684_12812223-lq.mp3',
      'Chicken': 'https://cdn.freesound.org/previews/424/424076_7388661-lq.mp3',
      'Duck': 'https://cdn.freesound.org/previews/719/719115_11244040-lq.mp3',
      'Eagle': 'https://cdn.freesound.org/previews/338/338683_5859905-lq.mp3',
      'Penguin': 'https://cdn.freesound.org/previews/529/529955_10334845-lq.mp3',
      'Swan': 'https://cdn.freesound.org/previews/537/537475_11962275-lq.mp3',
      'Crow': 'https://cdn.freesound.org/previews/813/813115_71257-lq.mp3',
      'Train': 'https://cdn.freesound.org/previews/591/591873_6456158-lq.mp3',
      'Car': 'https://cdn.freesound.org/previews/828/828939_1480854-lq.mp3',
      'Ambulance': 'https://cdn.freesound.org/previews/854/854418_18304356-lq.mp3',
      'Airplane': 'https://cdn.freesound.org/previews/537/537676_2061858-lq.mp3',
      'Fire Truck': 'https://cdn.freesound.org/previews/819/819369_1962855-lq.mp3',
      'Rocket': 'https://cdn.freesound.org/previews/94/94571_1015240-lq.mp3',
      'Boat': 'https://cdn.freesound.org/previews/417/417696_520316-lq.mp3',
      'Helicopter': 'https://cdn.freesound.org/previews/390/390647_2364707-lq.mp3'
    };

    function playSbSound(idx) {
      const item = SB_DATA[sbCurrentTab][idx];
      const el = document.getElementById(`sb-item-${idx}`);
      if (!el) return;

      // Visual feedback
      document.querySelectorAll('.sb-item').forEach(e => e.classList.remove('playing'));
      el.classList.add('playing');
      setTimeout(() => el.classList.remove('playing'), 800);

      // Play sound
      const playSynthesized = () => {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const freqs = Array.isArray(item.freq) ? item.freq : [item.freq];

          freqs.forEach((freq, fi) => {
            setTimeout(() => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = item.type;
              osc.frequency.setValueAtTime(freq, ctx.currentTime);
              gain.gain.setValueAtTime(0.25, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.dur);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + item.dur);
            }, fi * 300);
          });
        } catch (e) { }
      };

      const realSoundUrl = REAL_SOUNDS[item.name];
      if (realSoundUrl) {
        const audio = new Audio(realSoundUrl);
        audio.play().catch(() => playSynthesized());
      } else {
        playSynthesized();
      }

      addStars(1);
    }

    window.addEventListener('DOMContentLoaded', renderSoundboard);

    // ===== WHIZZY MATCH GAME (3-Level Card Flip) =====
    function buildWhizzyMatch() {
      return `
        <style>
          .wm-wrap { max-width: 520px; margin: 0 auto; text-align: center; }
          .wm-level-btns { display:flex; gap:10px; justify-content:center; margin-bottom:16px; flex-wrap:wrap; }
          .wm-lvl-btn { padding:8px 20px; border-radius:50px; border:2px solid #F3E8FF;
            font-family:'Fredoka One',cursive; font-size:0.9rem; cursor:pointer;
            background:white; transition:all 0.2s; }
          .wm-lvl-btn.active { background:linear-gradient(135deg,var(--purple),var(--blue)); color:white; border-color:transparent; }
          .wm-hud { font-family:'Fredoka One',cursive; font-size:1.1rem; color:#A855F7; margin-bottom:16px; display:flex; justify-content:space-between; }
          .wm-board { display:grid; gap:10px; margin:0 auto; }
          .wm-card { aspect-ratio:1; border-radius:14px; cursor:pointer; perspective:600px; position:relative; }
          .wm-card:hover { transform:scale(1.04); }
          .wm-inner { width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.5s cubic-bezier(.4,0,.2,1);border-radius:14px; }
          .wm-card.flipped .wm-inner,.wm-card.matched .wm-inner { transform:rotateY(180deg); }
          .wm-front,.wm-back { position:absolute;inset:0;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:2rem;backface-visibility:hidden; }
          .wm-front { background:linear-gradient(135deg,#A855F7,#38BDF8);box-shadow:0 4px 14px rgba(168,85,247,0.3); }
          .wm-back { background:white;border:3px solid #F3E8FF;transform:rotateY(180deg);font-size:2.4rem;box-shadow:0 4px 14px rgba(0,0,0,0.08); }
          .wm-card.matched .wm-back { background:#F0FFF4;border-color:#4ADE80; animation:wmMatchPop 0.4s ease; }
          @keyframes wmMatchPop { 0%{transform:rotateY(180deg) scale(1);} 50%{transform:rotateY(180deg) scale(1.15);} 100%{transform:rotateY(180deg) scale(1);} }
          .wm-win { text-align:center;padding:24px;font-family:'Fredoka One',cursive;font-size:2rem;color:#22C55E;animation:bounce 0.8s ease; display:none; }
          .wm-win .wm-win-stars { font-size:2.5rem;display:block;margin-bottom:8px; }
        </style>
        <div class="wm-wrap">
          <div class="wm-level-btns">
            <button class="wm-lvl-btn active" id="wm-l1" onclick="wmSetLevel(1)">🐶 Level 1: Animals</button>
            <button class="wm-lvl-btn" id="wm-l2" onclick="wmSetLevel(2)">🔴 Level 2: Shapes</button>
            <button class="wm-lvl-btn" id="wm-l3" onclick="wmSetLevel(3)">🚂 Level 3: Tracks</button>
          </div>
          <div class="wm-hud">
            <span id="wmMoves">Moves: 0</span>
            <span id="wmPairs">Pairs: 0/4</span>
          </div>
          <div class="wm-board" id="wmBoard" style="grid-template-columns:repeat(4,1fr);max-width:420px;"></div>
          <div class="wm-win" id="wmWin">
            <span class="wm-win-stars">⭐🌟⭐</span>
            YOU WIN! 🎉 Amazing!
          </div>
        </div>
      `;
    }

    const WM_LEVELS = {
      1: ['🐶', '🦁', '🐘', '🦆'],
      2: ['🔴', '🔵', '🟡', '🔺'],
      3: ['🚂', '🚀', '🚗', '🏎️']
    };
    let wmLevel = 1;

    function wmSetLevel(lvl) {
      wmLevel = lvl;
      [1, 2, 3].forEach(l => document.getElementById(`wm-l${l}`).classList.toggle('active', l === lvl));
      initWhizzyMatch();
    }

    function initWhizzyMatch() {
      const emojis = WM_LEVELS[wmLevel];
      let deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      let flipped = [], matched = [], moves = 0, lock = false;
      const board = document.getElementById('wmBoard');
      if (!board) return;
      board.innerHTML = deck.map((e, i) => `
        <div class="wm-card" data-idx="${i}" data-val="${e}" onclick="wmFlip(this)">
          <div class="wm-inner">
            <div class="wm-front">⭐</div>
            <div class="wm-back">${e}</div>
          </div>
        </div>`).join('');
      document.getElementById('wmWin').style.display = 'none';
      document.getElementById('wmMoves').textContent = 'Moves: 0';
      document.getElementById('wmPairs').textContent = `Pairs: 0/${emojis.length}`;

      window.wmFlip = function (card) {
        if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped');
        flipped.push(card);
        playBipSound(520 + flipped.length * 80, 'sine', 0.1);
        if (flipped.length === 2) {
          lock = true; moves++;
          document.getElementById('wmMoves').textContent = `Moves: ${moves}`;
          if (flipped[0].dataset.val === flipped[1].dataset.val) {
            flipped.forEach(c => c.classList.add('matched'));
            matched.push(...flipped);
            flipped = []; lock = false;
            document.getElementById('wmPairs').textContent = `Pairs: ${matched.length / 2}/${emojis.length}`;
            addStars(10);
            if (matched.length === deck.length) {
              setTimeout(() => {
                document.getElementById('wmWin').style.display = 'block';
                awardBadge('memory_master');
                triggerWinConfetti();
                playBipSound(659.25, 'sine', 0.2);
                setTimeout(() => playBipSound(783.99, 'sine', 0.3), 120);
                setTimeout(() => playBipSound(1046.50, 'sine', 0.4), 240);
              }, 400);
            }
          } else {
            setTimeout(() => {
              flipped.forEach(c => c.classList.remove('flipped'));
              flipped = []; lock = false;
            }, 900);
          }
        }
      };
    }

    // ===== BALLOON POP GAME (3 Levels) =====
    function buildBalloonPop() {
      return `
        <style>
          .bp-wrap { position:relative; max-width:560px; margin:0 auto; }
          .bp-level-btns { display:flex; gap:10px; justify-content:center; margin-bottom:14px; flex-wrap:wrap; }
          .bp-lvl-btn { padding:8px 18px; border-radius:50px; border:2px solid #F3E8FF;
            font-family:'Fredoka One',cursive; font-size:0.88rem; cursor:pointer;
            background:white; transition:all 0.2s; }
          .bp-lvl-btn.active { background:linear-gradient(135deg,#FF4455,#FF70B8); color:white; border-color:transparent; }
          .bp-hud { display:flex; justify-content:space-between; font-family:'Fredoka One',cursive;
            font-size:1.1rem; color:#A855F7; margin-bottom:8px; }
          #bpStage { position:relative; width:100%; height:420px;
            background:linear-gradient(180deg,#EEF4FF 0%,#F3E8FF 50%,#FFF0FB 100%);
            border-radius:20px; overflow:hidden; border:3px solid #F3E8FF;
            box-shadow:0 8px 24px rgba(168,85,247,0.12); }
          .bp-balloon { position:absolute; cursor:pointer; user-select:none;
            transition:transform 0.1s; will-change:transform; font-size:2.4rem;
            text-align:center; line-height:1; filter:drop-shadow(0 4px 12px rgba(0,0,0,0.2)); }
          .bp-balloon:hover { transform:scale(1.1) !important; }
          .bp-balloon.popped { animation:bpPop 0.35s ease forwards; }
          @keyframes bpPop { 0%{transform:scale(1)opacity:1;} 50%{transform:scale(1.6);opacity:0.6;} 100%{transform:scale(0);opacity:0;} }
          .bp-target-bar { text-align:center; font-family:'Fredoka One',cursive; font-size:1rem;
            color:#A855F7; margin-bottom:10px; background:rgba(168,85,247,0.08);
            padding:8px 16px; border-radius:50px; display:inline-block; }
          .bp-confetti { position:absolute; pointer-events:none; font-size:1.4rem;
            animation:bpConf 0.8s ease forwards; }
          @keyframes bpConf { 0%{opacity:1;transform:translate(0,0) scale(1);} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0.3);} }
        </style>
        <div class="bp-wrap">
          <div class="bp-level-btns">
            <button class="bp-lvl-btn active" id="bp-l1" onclick="bpSetLevel(1)">🔴 Colors</button>
            <button class="bp-lvl-btn" id="bp-l2" onclick="bpSetLevel(2)">🔠 Alphabet</button>
            <button class="bp-lvl-btn" id="bp-l3" onclick="bpSetLevel(3)">✨ Characters</button>
          </div>
          <div class="bp-hud">
            <span id="bpScore">Score: 0</span>
            <span id="bpTarget"></span>
            <span id="bpLives">❤️❤️❤️</span>
          </div>
          <div style="text-align:center;margin-bottom:8px;">
            <span class="bp-target-bar" id="bpTargetBar">Pop the balloons! 🎈</span>
          </div>
          <div id="bpStage"></div>
        </div>
      `;
    }

    let bpLevel = 1;
    let bpGameActive = false;
    let bpIntervalId = null;
    let bpBalloons = [];
    let bpScore = 0;
    let bpLives = 3;
    let bpSpeed = 1;
    let bpAlphaIdx = 0;
    const BP_COLORS = [
      { name: 'Red', emoji: '🔴', col: '#FF4455' },
      { name: 'Blue', emoji: '🔵', col: '#38BDF8' },
      { name: 'Green', emoji: '🟢', col: '#4ADE80' },
      { name: 'Yellow', emoji: '🟡', col: '#FFD700' },
      { name: 'Pink', emoji: '🌸', col: '#FF70B8' },
      { name: 'Purple', emoji: '🟣', col: '#A855F7' }
    ];
    const BP_CHARS = ['🦁', '🐘', '🐶', '🦕', '🌟', '🎨', '🚂', '🦄', '🐱', '🌈'];
    const BP_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    function bpSetLevel(lvl) {
      bpLevel = lvl;
      [1, 2, 3].forEach(l => document.getElementById(`bp-l${l}`).classList.toggle('active', l === lvl));
      initBalloonPop();
    }

    function initBalloonPop() {
      if (bpIntervalId) clearInterval(bpIntervalId);
      bpBalloons = [];
      bpScore = 0; bpLives = 3; bpSpeed = 1; bpAlphaIdx = 0;
      bpGameActive = true;
      const stage = document.getElementById('bpStage');
      if (!stage) return;
      stage.innerHTML = '';
      document.getElementById('bpScore').textContent = 'Score: 0';
      document.getElementById('bpLives').textContent = '❤️❤️❤️';

      let targetColor = BP_COLORS[Math.floor(Math.random() * BP_COLORS.length)];

      if (bpLevel === 1) {
        document.getElementById('bpTargetBar').textContent = `Pop the ${targetColor.name.toUpperCase()} balloon! ${targetColor.emoji}`;
      } else if (bpLevel === 2) {
        document.getElementById('bpTargetBar').textContent = `Pop: "${BP_ALPHABET[bpAlphaIdx]}" 🔠`;
      } else {
        document.getElementById('bpTargetBar').textContent = 'Pop any Whizzy character! ✨';
      }

      function spawnBalloon() {
        if (!bpGameActive || !document.getElementById('bpStage')) {
          clearInterval(bpIntervalId); return;
        }
        const st = document.getElementById('bpStage');
        if (!st) return;

        let emoji, isTarget, label;
        if (bpLevel === 1) {
          const isT = Math.random() > 0.5;
          const pick = isT ? targetColor : BP_COLORS[Math.floor(Math.random() * BP_COLORS.length)];
          emoji = pick.emoji; isTarget = (pick.name === targetColor.name); label = pick.name;
        } else if (bpLevel === 2) {
          const letter = BP_ALPHABET[Math.floor(Math.random() * 26)];
          emoji = letter; isTarget = (letter === BP_ALPHABET[bpAlphaIdx]); label = letter;
        } else {
          const pick = BP_CHARS[Math.floor(Math.random() * BP_CHARS.length)];
          emoji = pick; isTarget = true; label = '';
        }

        const size = 48 + Math.random() * 20;
        const x = 10 + Math.random() * (st.offsetWidth - 70);
        const balloon = document.createElement('div');
        balloon.className = 'bp-balloon';
        balloon.style.left = x + 'px';
        balloon.style.bottom = '-60px';
        balloon.style.fontSize = size + 'px';
        balloon.dataset.target = isTarget ? '1' : '0';
        balloon.dataset.label = label;
        balloon.textContent = emoji;
        balloon.style.transform = `rotate(${(Math.random() - 0.5) * 15}deg)`;

        balloon.onclick = () => {
          if (!bpGameActive || balloon.classList.contains('popped')) return;
          if (balloon.dataset.target === '1') {
            balloon.classList.add('popped');
            bpScore += bpLevel * 10;
            document.getElementById('bpScore').textContent = `Score: ${bpScore}`;
            addStars(bpLevel * 5);
            playBipSound(700 + bpScore * 2, 'sine', 0.15);
            bpSpeed += 0.1;

            // Firework burst
            for (let k = 0; k < 8; k++) {
              const conf = document.createElement('div');
              conf.className = 'bp-confetti';
              conf.textContent = ['⭐', '🌟', '✨', '💫', '🎉'][Math.floor(Math.random() * 5)];
              conf.style.left = (x + 25) + 'px';
              conf.style.bottom = (st.offsetHeight - parseFloat(balloon.style.bottom || 0) - 40) + 'px';
              const angle = (k / 8) * Math.PI * 2;
              conf.style.setProperty('--tx', Math.cos(angle) * 60 + 'px');
              conf.style.setProperty('--ty', Math.sin(angle) * 60 + 'px');
              st.appendChild(conf);
              setTimeout(() => conf.remove(), 800);
            }

            setTimeout(() => balloon.remove(), 350);

            if (bpLevel === 2) {
              bpAlphaIdx++;
              if (bpAlphaIdx >= 26) {
                bpGameActive = false;
                clearInterval(bpIntervalId);
                showToast('A-Z Complete! 🏆', 'You know the whole alphabet!', '🔠');
                return;
              }
              const tBar = document.getElementById('bpTargetBar');
              if (tBar) tBar.textContent = `Pop: "${BP_ALPHABET[bpAlphaIdx]}" 🔠`;
            }
            if (bpLevel === 1) {
              targetColor = BP_COLORS[Math.floor(Math.random() * BP_COLORS.length)];
              const tBar = document.getElementById('bpTargetBar');
              if (tBar) tBar.textContent = `Pop the ${targetColor.name.toUpperCase()} balloon! ${targetColor.emoji}`;
            }
          } else {
            bpLives--;
            const livesEl = document.getElementById('bpLives');
            if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, bpLives));
            playBipSound(200, 'sawtooth', 0.2);
            balloon.style.opacity = '0.4';
            setTimeout(() => balloon.remove(), 300);
            if (bpLives <= 0) {
              bpGameActive = false;
              clearInterval(bpIntervalId);
              st.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:'Fredoka One',cursive;font-size:1.8rem;color:var(--purple);">🎈 Game Over! Score: ${bpScore}</div>`;
              addStars(bpScore);
            }
          }
        };

        st.appendChild(balloon);

        // Float up
        let posY = -60;
        const floatId = setInterval(() => {
          if (!bpGameActive || !balloon.parentNode) { clearInterval(floatId); return; }
          posY += bpSpeed * 1.2;
          balloon.style.bottom = posY + 'px';
          if (posY > st.offsetHeight + 40) {
            clearInterval(floatId);
            balloon.remove();
          }
        }, 30);
      }

      bpIntervalId = setInterval(spawnBalloon, 1800 - bpLevel * 200);
      spawnBalloon();
    }




    // ===== PROGRESS TRACKER INIT =====
    (function initProgressTracker() {
      const saved = parseInt(localStorage.getItem('ww_games_played') || '0');
      const ptGames = document.getElementById('pt-games');
      if (ptGames) ptGames.textContent = saved;
      gamesPlayedCount = saved;
      // Stars sync
      const syncStars = () => {
        const stars = document.getElementById('star-counter-num');
        const ptStars = document.getElementById('pt-stars');
        if (stars && ptStars) ptStars.textContent = stars.textContent;
      };
      setInterval(syncStars, 2000);
      syncStars();
    })();

    // ===== DARK / NIGHT MODE =====
    function toggleNightMode() {
      document.body.classList.toggle('dark-mode');
      const isOn = document.body.classList.contains('dark-mode');
      localStorage.setItem('ww_dark_mode', isOn ? '1' : '0');
      const btn = document.getElementById('nightToggle');
      if (btn) btn.textContent = isOn ? '☀️' : '🌙';
    }
    // Restore preference on load
    if (localStorage.getItem('ww_dark_mode') === '1') {
      document.body.classList.add('dark-mode');
      const btn = document.getElementById('nightToggle');
      if (btn) btn.textContent = '☀️';
    }

    // ===== STORY NAVIGATION =====
    let currentStory = 'lion';
    let currentStoryPage = 1;
    const storyPages = { lion: 3, rainbow: 3, rocket: 3 };

    function selectStory(name) {
      currentStory = name;
      currentStoryPage = 1;
      document.querySelectorAll('.story-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.story-btn').forEach(b => { if (b.textContent.toLowerCase().includes(name) || b.getAttribute('onclick').includes(name)) b.classList.add('active'); });
      showStoryPage();
    }
    function showStoryPage() {
      document.querySelectorAll('.story-page').forEach(p => p.classList.remove('active'));
      const page = document.getElementById(`story-${currentStory}-${currentStoryPage}`);
      if (page) page.classList.add('active');
      const total = storyPages[currentStory] || 3;
      const num = document.getElementById('storyPageNum');
      if (num) num.textContent = `Page ${currentStoryPage} of ${total}`;
      const prev = document.getElementById('storyPrevBtn');
      const next = document.getElementById('storyNextBtn');
      if (prev) prev.disabled = currentStoryPage <= 1;
      if (next) next.disabled = currentStoryPage >= total;
    }
    function storyNext() {
      const total = storyPages[currentStory] || 3;
      if (currentStoryPage < total) { currentStoryPage++; showStoryPage(); }
    }
    function storyPrev() {
      if (currentStoryPage > 1) { currentStoryPage--; showStoryPage(); }
    }
    showStoryPage();

    // ===== RHYMES: LYRICS TOGGLE + SING-ALONG =====
    function toggleLyrics(id) {
      const el = document.getElementById('lyrics-' + id);
      if (el) el.classList.toggle('open');
    }
    const rhymeMelodies = {
      twinkle: [{ note: 261.63, dur: 0.4 }, { note: 261.63, dur: 0.4 }, { note: 392, dur: 0.4 }, { note: 392, dur: 0.4 }, { note: 440, dur: 0.4 }, { note: 440, dur: 0.4 }, { note: 392, dur: 0.8 }, { note: 349.23, dur: 0.4 }, { note: 349.23, dur: 0.4 }, { note: 329.63, dur: 0.4 }, { note: 329.63, dur: 0.4 }, { note: 293.66, dur: 0.4 }, { note: 293.66, dur: 0.4 }, { note: 261.63, dur: 0.8 }],
      wheels: [{ note: 261.63, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 440, dur: 0.6 }, { note: 392, dur: 0.3 }, { note: 349.23, dur: 0.3 }, { note: 329.63, dur: 0.6 }],
      johnnyjohnny: [{ note: 329.63, dur: 0.3 }, { note: 349.23, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 349.23, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 293.66, dur: 0.6 }],
      baa: [{ note: 392, dur: 0.4 }, { note: 392, dur: 0.4 }, { note: 392, dur: 0.4 }, { note: 349.23, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 293.66, dur: 0.8 }, { note: 261.63, dur: 0.4 }, { note: 261.63, dur: 0.4 }, { note: 293.66, dur: 0.4 }, { note: 329.63, dur: 0.4 }],
      abc: [{ note: 261.63, dur: 0.3 }, { note: 261.63, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 440, dur: 0.3 }, { note: 440, dur: 0.3 }, { note: 392, dur: 0.5 }, { note: 349.23, dur: 0.3 }, { note: 349.23, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 329.63, dur: 0.3 }],
      incy: [{ note: 293.66, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 349.23, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 392, dur: 0.3 }, { note: 349.23, dur: 0.3 }, { note: 329.63, dur: 0.3 }, { note: 293.66, dur: 0.5 }]
    };
    function playRhyme(id) {
      const melody = rhymeMelodies[id];
      if (!melody) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        let time = ctx.currentTime + 0.1;
        melody.forEach(({ note, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(note, time);
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.18, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
          osc.start(time); osc.stop(time + dur + 0.05);
          time += dur;
        });
      } catch (e) { }
    }

    // ===== NEW PRINTABLE ACTIVITIES =====
    const origPrintActivity = window.printActivity;
    window.printActivity = function (type) {
      if (type === 'vehicles') { openVehiclesColoringBook(); return; }
      if (type === 'alpha-tracing') { openAlphaTracing(); return; }
      if (type === 'num-tracing') { openNumTracing(); return; }
      if (type === 'dotdot') { openDotDot(); return; }
      if (origPrintActivity) origPrintActivity(type);
    };
    function openVehiclesColoringBook() {
      const base = window.location.href.replace(/[^\/]*$/, '');
      const imgs = {
        car: base + 'images/vehicle-car.png',
        motorcycle: base + 'images/vehicle-motorcycle.png',
        train: base + 'images/vehicle-train.png',
        bus: base + 'images/vehicle-bus.png',
        airplane: base + 'images/vehicle-airplane.png'
      };
      const win = window.open('', '_blank');
      if (!win) return;
      const html = '<!DOCTYPE html><html><head><title>Vehicle Coloring Book - Whizzy Wiggles</title><style>'
        + '*{box-sizing:border-box;margin:0;padding:0;}body{font-family:Arial,sans-serif;background:#fff;}'
        + '.cover{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#EEF4FF,#FFF9E6);padding:40px 20px;page-break-after:always;}'
        + '.cover h1{font-size:2.8rem;margin-bottom:10px;color:#38BDF8;font-weight:900;}'
        + '.cover .sub{color:#888;font-size:1.05rem;margin-bottom:6px;}'
        + '.cover .brand{font-size:0.95rem;color:#38BDF8;font-weight:bold;margin-top:14px;}'
        + '.cover .pages-list{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:20px;}'
        + '.cover .page-chip{background:white;border:2px solid #EEF4FF;border-radius:50px;padding:7px 16px;font-size:0.88rem;font-weight:bold;color:#38BDF8;}'
        + '.name-box{display:flex;align-items:center;gap:10px;margin-top:14px;font-size:0.95rem;color:#888;width:320px;}'
        + '.name-line{flex:1;height:2px;background:#ddd;border-radius:99px;}'
        + '.col-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:32px 24px;page-break-after:always;background:#fff;position:relative;}'
        + '.col-page .page-num{position:absolute;top:16px;left:20px;font-size:0.8rem;color:#bbb;font-weight:bold;}'
        + '.col-page .col-title{font-size:1.5rem;font-weight:900;color:#38BDF8;margin-bottom:6px;text-align:center;}'
        + '.col-page .col-desc{font-size:0.9rem;color:#aaa;margin-bottom:16px;text-align:center;}'
        + '.col-page .col-img{width:100%;max-width:560px;height:auto;border:3px solid #F0F8FF;border-radius:16px;display:block;margin:0 auto;}'
        + '.col-page .page-footer{margin-top:24px;padding-top:14px;font-size:0.72rem;color:#ccc;text-align:center;width:100%;border-top:1px solid #EEF4FF;}'
        + '.toolbar{position:fixed;bottom:20px;right:20px;z-index:999;}'
        + '.btn-print{padding:14px 28px;border-radius:50px;border:none;font-size:1rem;font-weight:bold;cursor:pointer;background:#38BDF8;color:white;box-shadow:0 4px 18px rgba(56,189,248,0.4);}'
        + '@media print{.toolbar{display:none!important;}}'
        + '</style></head><body>'
        + '<div class="cover"><div style="font-size:5rem">&#x1F697;&#x2708;&#xFE0F;&#x1F682;&#x1F6FA;&#x1F68C;</div>'
        + '<h1>Vehicle Coloring Book</h1>'
        + '<p class="sub">5 Fun Pages to Color In!</p>'
        + '<p class="sub" style="font-size:0.95rem;">Cars &bull; Motorcycles &bull; Trains &bull; Buses &bull; Airplanes</p>'
        + '<div class="pages-list">'
        + '<span class="page-chip">&#x1F697; Race Car</span>'
        + '<span class="page-chip">&#x1F3CD;&#xFE0F; Motorcycle</span>'
        + '<span class="page-chip">&#x1F682; Steam Train</span>'
        + '<span class="page-chip">&#x1F68C; School Bus</span>'
        + '<span class="page-chip">&#x2708;&#xFE0F; Airplane</span>'
        + '</div>'
        + '<p class="brand">&#x1F308; Whizzy Wiggles Official &mdash; whizzywiggles.in</p>'
        + '<div class="name-box"><span>Name:</span><div class="name-line"></div></div>'
        + '<div class="name-box"><span>Date:</span><div class="name-line"></div></div>'
        + '</div>';
      const pages = [
        { num: '1', title: '&#x1F697; Race Car', desc: 'Color this speedy car any color you like!', key: 'car' },
        { num: '2', title: '&#x1F3CD;&#xFE0F; Motorcycle', desc: 'Vroom! Give this cool bike your favorite colors!', key: 'motorcycle' },
        { num: '3', title: '&#x1F682; Steam Train', desc: 'Choo choo! Color this amazing locomotive!', key: 'train' },
        { num: '4', title: '&#x1F68C; School Bus', desc: 'Color this friendly school bus yellow and more!', key: 'bus' },
        { num: '5', title: '&#x2708;&#xFE0F; Airplane', desc: 'Up in the sky! Color this airplane and the clouds!', key: 'airplane' }
      ];
      let pagesHtml = '';
      pages.forEach(function (p) {
        pagesHtml += '<div class="col-page">'
          + '<div class="page-num">Page ' + p.num + ' of 5</div>'
          + '<div class="col-title">' + p.title + '</div>'
          + '<div class="col-desc">' + p.desc + '</div>'
          + '<img class="col-img" src="' + imgs[p.key] + '" alt="' + p.title + ' Coloring Page" />'
          + '<div class="page-footer">&#x1F308; Whizzy Wiggles &mdash; whizzywiggles.in &nbsp;|&nbsp; Free Printable</div>'
          + '</div>';
      });
      const toolbar = '<div class="toolbar"><button class="btn-print" onclick="window.print()">&#x1F5A8;&#xFE0F; Print All Pages!</button></div>';
      win.document.write(html + pagesHtml + toolbar + '</body></html>');
      win.document.close();
    }
    function openAlphaTracing() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const words = ['Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Fish', 'Giraffe', 'Hat', 'Ice cream', 'Jellyfish', 'Kite', 'Lion', 'Mango', 'Nest', 'Orange', 'Penguin', 'Queen', 'Rainbow', 'Sun', 'Tiger', 'Umbrella', 'Violin', 'Whale', 'Xylophone', 'Yak', 'Zebra'];
      const win = window.open('', '_blank');
      if (!win) return;
      const pages = letters.map((l, i) => `
        <div class="trace-page">
          <div class="trace-letter">${l} ${l.toLowerCase()}</div>
          <div class="trace-word">${l} is for ${words[i]}</div>
          <div class="trace-lines">${[1, 2, 3].map(() => `<div class="trace-line"><span class="dotted">${l} ${l} ${l} ${l} ${l}</span></div>`).join('')}</div>
        </div>`).join('');
      win.document.write(`<!DOCTYPE html><html><head><title>Alphabet Tracing A-Z – Whizzy Wiggles</title><style>
        *{box-sizing:border-box;margin:0;padding:0;}body{font-family:Arial,sans-serif;}
        .cover{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#FFF5FA,#F3E8FF);padding:40px;page-break-after:always;}
        .cover h1{font-size:2.5rem;color:#A855F7;margin-bottom:12px;}.cover p{color:#888;margin-bottom:8px;}
        .trace-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;page-break-after:always;}
        .trace-letter{font-size:7rem;color:#A855F7;font-weight:bold;margin-bottom:10px;}
        .trace-word{font-size:1.4rem;color:#555;margin-bottom:30px;}
        .trace-line{border-bottom:3px dashed #ddd;margin-bottom:24px;width:100%;max-width:500px;padding:10px 0;}
        .dotted{color:#d0c0ff;font-size:2rem;letter-spacing:8px;}
        .toolbar{position:fixed;bottom:20px;right:20px;}.btn-print{padding:14px 28px;border-radius:50px;border:none;font-size:1rem;font-weight:bold;cursor:pointer;background:#A855F7;color:white;box-shadow:0 4px 18px rgba(168,85,247,0.4);}
        @media print{.toolbar{display:none!important;}}
      </style></head><body>
      <div class="cover"><div style="font-size:4rem">✏️🔤</div><h1>Alphabet Tracing A–Z</h1><p>Trace every letter from A to Z!</p><p>🌈 Whizzy Wiggles — whizzywiggles.in</p></div>
      ${pages}
      <div class="toolbar"><button class="btn-print" onclick="window.print()">🖨️ Print Now!</button></div>
      </body></html>`);
      win.document.close();
    }
    function openNumTracing() {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const emojis = ['🍎', '🐶', '🌟', '🎈', '🐠', '🌸', '🦋', '🍕', '🎉', '🌈'];
      const win = window.open('', '_blank');
      if (!win) return;
      const pages = nums.map((n, i) => `
        <div class="trace-page">
          <div class="trace-num">${n}</div>
          <div class="emoji-row">${emojis.slice(0, n).join(' ')}</div>
          <div class="trace-lines">${[1, 2, 3].map(() => `<div class="trace-line"><span class="dotted">${n}   ${n}   ${n}   ${n}   ${n}</span></div>`).join('')}</div>
        </div>`).join('');
      win.document.write(`<!DOCTYPE html><html><head><title>Number Tracing 1-10 – Whizzy Wiggles</title><style>
        *{box-sizing:border-box;margin:0;padding:0;}body{font-family:Arial,sans-serif;}
        .cover{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#FFF9E6,#EEF4FF);padding:40px;page-break-after:always;}
        .cover h1{font-size:2.5rem;color:#FF8C00;margin-bottom:12px;}.cover p{color:#888;margin-bottom:8px;}
        .trace-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;page-break-after:always;background:white;}
        .trace-num{font-size:8rem;color:#FF8C00;font-weight:bold;margin-bottom:10px;}
        .emoji-row{font-size:2rem;margin-bottom:30px;letter-spacing:4px;}
        .trace-line{border-bottom:3px dashed #FFD700;margin-bottom:24px;width:100%;max-width:500px;padding:10px 0;}
        .dotted{color:#FFD70066;font-size:2.5rem;letter-spacing:16px;font-weight:bold;}
        .toolbar{position:fixed;bottom:20px;right:20px;}.btn-print{padding:14px 28px;border-radius:50px;border:none;font-size:1rem;font-weight:bold;cursor:pointer;background:#FF8C00;color:white;box-shadow:0 4px 18px rgba(255,140,0,0.4);}
        @media print{.toolbar{display:none!important;}}
      </style></head><body>
      <div class="cover"><div style="font-size:4rem">🖊️🔢</div><h1>Number Tracing 1–10</h1><p>Trace the numbers and count!</p><p>🌈 Whizzy Wiggles — whizzywiggles.in</p></div>
      ${pages}
      <div class="toolbar"><button class="btn-print" onclick="window.print()">🖨️ Print Now!</button></div>
      </body></html>`);
      win.document.close();
    }
    function openDotDot() {
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html><head><title>Dot-to-Dot Fun – Whizzy Wiggles</title><style>
        *{box-sizing:border-box;margin:0;padding:0;}body{font-family:Arial,sans-serif;}
        .cover{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#F0FFF4,#EEF4FF);padding:40px;page-break-after:always;}
        .cover h1{font-size:2.5rem;color:#22C55E;margin-bottom:12px;}.cover p{color:#888;margin-bottom:8px;}
        .dot-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;page-break-after:always;text-align:center;}
        .dot-page h2{font-size:1.8rem;color:#22C55E;margin-bottom:20px;}.dot-page p{color:#888;font-size:1rem;margin-bottom:30px;}
        .dot-grid{position:relative;width:400px;height:400px;border:2px dashed #ddd;border-radius:20px;margin:0 auto;}
        .dot{position:absolute;width:24px;height:24px;background:#22C55E;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem;font-weight:bold;}
        .toolbar{position:fixed;bottom:20px;right:20px;}.btn-print{padding:14px 28px;border-radius:50px;border:none;font-size:1rem;font-weight:bold;cursor:pointer;background:#22C55E;color:white;box-shadow:0 4px 18px rgba(34,197,94,0.4);}
        @media print{.toolbar{display:none!important;}}
      </style></head><body>
      <div class="cover"><div style="font-size:4rem">🔵•••🐬</div><h1>Dot-to-Dot Fun!</h1><p>Connect the dots to reveal the picture!</p><p>🌈 Whizzy Wiggles — whizzywiggles.in</p></div>
      <div class="dot-page"><h2>🐬 The Dolphin</h2><p>Connect dots 1–12 to see the dolphin!</p><div class="dot-grid">
        <div class="dot" style="left:180px;top:20px">1</div><div class="dot" style="left:240px;top:50px">2</div>
        <div class="dot" style="left:300px;top:100px">3</div><div class="dot" style="left:330px;top:160px">4</div>
        <div class="dot" style="left:310px;top:220px">5</div><div class="dot" style="left:260px;top:270px">6</div>
        <div class="dot" style="left:200px;top:300px">7</div><div class="dot" style="left:140px;top:280px">8</div>
        <div class="dot" style="left:80px;top:240px">9</div><div class="dot" style="left:50px;top:180px">10</div>
        <div class="dot" style="left:70px;top:120px">11</div><div class="dot" style="left:120px;top:60px">12</div>
      </div></div>
      <div class="dot-page"><h2>⭐ The Star</h2><p>Connect dots 1–10 to see the star!</p><div class="dot-grid">
        <div class="dot" style="left:188px;top:20px">1</div><div class="dot" style="left:300px;top:100px">2</div>
        <div class="dot" style="left:360px;top:240px">3</div><div class="dot" style="left:260px;top:240px">4</div>
        <div class="dot" style="left:220px;top:360px">5</div><div class="dot" style="left:188px;top:260px">6</div>
        <div class="dot" style="left:140px;top:360px">7</div><div class="dot" style="left:100px;top:240px">8</div>
        <div class="dot" style="left:20px;top:240px">9</div><div class="dot" style="left:80px;top:100px">10</div>
      </div></div>
      <div class="dot-page"><h2>🐰 The Bunny</h2><p>Connect dots 1–14 to see the bunny!</p><div class="dot-grid">
        <div class="dot" style="left:140px;top:20px">1</div><div class="dot" style="left:140px;top:80px">2</div>
        <div class="dot" style="left:240px;top:20px">3</div><div class="dot" style="left:240px;top:80px">4</div>
        <div class="dot" style="left:100px;top:130px">5</div><div class="dot" style="left:280px;top:130px">6</div>
        <div class="dot" style="left:80px;top:180px">7</div><div class="dot" style="left:300px;top:180px">8</div>
        <div class="dot" style="left:80px;top:250px">9</div><div class="dot" style="left:300px;top:250px">10</div>
        <div class="dot" style="left:100px;top:310px">11</div><div class="dot" style="left:280px;top:310px">12</div>
        <div class="dot" style="left:140px;top:360px">13</div><div class="dot" style="left:240px;top:360px">14</div>
      </div></div>
      <div class="dot-page"><h2>🐘 The Elephant</h2><p>Connect dots 1–16 to see the elephant!</p><div class="dot-grid">
        <div class="dot" style="left:60px;top:40px">1</div><div class="dot" style="left:120px;top:20px">2</div>
        <div class="dot" style="left:220px;top:20px">3</div><div class="dot" style="left:300px;top:40px">4</div>
        <div class="dot" style="left:340px;top:100px">5</div><div class="dot" style="left:330px;top:170px">6</div>
        <div class="dot" style="left:290px;top:230px">7</div><div class="dot" style="left:230px;top:260px">8</div>
        <div class="dot" style="left:160px;top:260px">9</div><div class="dot" style="left:100px;top:240px">10</div>
        <div class="dot" style="left:60px;top:200px">11</div><div class="dot" style="left:40px;top:150px">12</div>
        <div class="dot" style="left:50px;top:290px">13</div><div class="dot" style="left:100px;top:340px">14</div>
        <div class="dot" style="left:180px;top:320px">15</div><div class="dot" style="left:240px;top:330px">16</div>
      </div></div>
      <div class="toolbar"><button class="btn-print" onclick="window.print()">🖨️ Print Now!</button></div>
      </body></html>`);
      win.document.close();
    }

    // ===== NEW GAMES =====

    /* ---- SPELLING GAME ---- */
    function buildSpellingGame() {
      return `<style>
        .spell-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;}
        .spell-emoji{font-size:5rem;filter:drop-shadow(0 4px 12px rgba(168,85,247,0.2));}
        .spell-hint{font-family:'Fredoka One',cursive;font-size:1.4rem;color:#A855F7;}
        .spell-slots{display:flex;gap:10px;margin:10px 0;}
        .spell-slot{width:48px;height:56px;border-radius:12px;border:3px solid #F3E8FF;background:white;display:flex;align-items:center;justify-content:center;font-family:'Fredoka One',cursive;font-size:1.8rem;color:#A855F7;transition:all 0.2s;}
        .spell-slot.correct{background:#F0FFF4;border-color:#4ADE80;}
        .spell-slot.wrong{background:#FFF0F0;border-color:#FF4455;}
        .spell-letters{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:10px 0;}
        .spell-letter{width:44px;height:44px;border-radius:10px;border:2px solid #F3E8FF;background:white;font-family:'Fredoka One',cursive;font-size:1.3rem;cursor:pointer;transition:all 0.2s;color:#1A0A3C;}
        .spell-letter:hover{background:rgba(168,85,247,0.1);border-color:#A855F7;transform:scale(1.1);}
        .spell-letter:disabled{opacity:0.4;cursor:not-allowed;}
        .spell-score{font-family:'Fredoka One',cursive;font-size:1rem;color:#888;}
        .spell-msg{font-family:'Fredoka One',cursive;font-size:1.6rem;color:#22C55E;min-height:2rem;text-align:center;}
        .spell-next{padding:10px 24px;border:none;border-radius:50px;background:linear-gradient(135deg,#A855F7,#38BDF8);color:white;font-family:'Fredoka One',cursive;font-size:1rem;cursor:pointer;margin-top:6px;display:none;}
      </style>
      <div class="spell-wrap">
        <div class="spell-score" id="spellScore">Word 1 of 10 | Score: 0</div>
        <div class="spell-emoji" id="spellEmoji">🐶</div>
        <div class="spell-hint" id="spellHint">Spell the animal:</div>
        <div class="spell-slots" id="spellSlots"></div>
        <div class="spell-msg" id="spellMsg"></div>
        <div class="spell-letters" id="spellLetters"></div>
        <button class="spell-next" id="spellNextBtn" onclick="spellNext()">Next Word ▶</button>
      </div>`;
    }
    function initSpelling() {
      const words = [
        { word: 'DOG', emoji: '🐶' }, { word: 'CAT', emoji: '🐱' }, { word: 'COW', emoji: '🐄' },
        { word: 'HEN', emoji: '🐔' }, { word: 'FOX', emoji: '🦊' }, { word: 'BEE', emoji: '🐝' },
        { word: 'APE', emoji: '🦍' }, { word: 'OWL', emoji: '🦉' }, { word: 'ANT', emoji: '🐜' },
        { word: 'BUG', emoji: '🐛' }
      ];
      let idx = 0, score = 0, typed = [];
      function renderWord() {
        const w = words[idx];
        document.getElementById('spellEmoji').textContent = w.emoji;
        document.getElementById('spellScore').textContent = `Word ${idx + 1} of ${words.length} | Score: ${score}`;
        document.getElementById('spellMsg').textContent = '';
        document.getElementById('spellNextBtn').style.display = 'none';
        typed = [];
        const slots = document.getElementById('spellSlots');
        slots.innerHTML = w.word.split('').map((_, i) => `<div class="spell-slot" id="sslot-${i}"></div>`).join('');
        const allLetters = [...w.word.split(''), ...('AEIOU'.split('').filter(l => !w.word.includes(l)).slice(0, 3))].sort(() => Math.random() - 0.5);
        document.getElementById('spellLetters').innerHTML = allLetters.map((l, i) => `<button class="spell-letter" id="sltr-${i}" onclick="spellType('${l}',${i})">${l}</button>`).join('');
      }
      window.spellType = function (letter, btnIdx) {
        if (typed.length >= words[idx].word.length) return;
        typed.push(letter);
        const slotEl = document.getElementById(`sslot-${typed.length - 1}`);
        if (slotEl) slotEl.textContent = letter;
        document.getElementById(`sltr-${btnIdx}`).disabled = true;
        if (typed.length === words[idx].word.length) {
          const correct = typed.join('') === words[idx].word;
          typed.forEach((_, i) => {
            const el = document.getElementById(`sslot-${i}`);
            if (el) el.classList.add(correct ? 'correct' : 'wrong');
          });
          if (correct) { score++; document.getElementById('spellMsg').textContent = '🎉 Correct! Amazing!'; }
          else { document.getElementById('spellMsg').textContent = `❌ It was: ${words[idx].word}`; }
          document.getElementById('spellNextBtn').style.display = idx < words.length - 1 ? 'inline-block' : 'none';
          if (idx === words.length - 1) { setTimeout(() => { document.getElementById('spellMsg').textContent = `🏆 Done! Score: ${score}/${words.length}`; addStars(score); }, 800); }
        }
      };
      window.spellNext = function () { idx++; if (idx < words.length) renderWord(); };
      renderWord();
    }

    /* ---- PUZZLE SLIDE GAME ---- */
    function buildPuzzleGame() {
      return `<style>
        .puzzle-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;}
        .puzzle-board{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:270px;margin:0 auto;}
        .puzzle-tile{width:82px;height:82px;border-radius:12px;background:linear-gradient(135deg,#A855F7,#38BDF8);color:white;font-family:'Fredoka One',cursive;font-size:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.25s;box-shadow:0 4px 14px rgba(168,85,247,0.25);}
        .puzzle-tile:hover{transform:scale(1.05);}
        .puzzle-tile.empty{background:rgba(168,85,247,0.07);box-shadow:none;cursor:default;}
        .puzzle-info{font-family:'Fredoka One',cursive;font-size:1rem;color:#888;}
        .puzzle-msg{font-family:'Fredoka One',cursive;font-size:1.6rem;color:#22C55E;min-height:2rem;text-align:center;}
        .puzzle-reset{padding:10px 22px;border:none;border-radius:50px;background:linear-gradient(135deg,#A855F7,#38BDF8);color:white;font-family:'Fredoka One',cursive;font-size:0.95rem;cursor:pointer;}
      </style>
      <div class="puzzle-wrap">
        <div class="puzzle-info" id="puzzleMoves">Moves: 0</div>
        <div class="puzzle-board" id="puzzleBoard"></div>
        <div class="puzzle-msg" id="puzzleMsg"></div>
        <button class="puzzle-reset" onclick="initPuzzle()">🔀 New Puzzle</button>
      </div>`;
    }
    function initPuzzle() {
      const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
      let tiles = [...emojis, ''];
      for (let i = tiles.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
      let moves = 0;
      const board = document.getElementById('puzzleBoard');
      document.getElementById('puzzleMsg').textContent = '';
      function render() {
        board.innerHTML = tiles.map((t, i) => `<div class="puzzle-tile${t === '' ? ' empty' : ''}" onclick="puzzleClick(${i})">${t}</div>`).join('');
        document.getElementById('puzzleMoves').textContent = `Moves: ${moves}`;
        const goal = [...emojis, ''];
        if (tiles.every((t, i) => t === goal[i])) { document.getElementById('puzzleMsg').textContent = '🎉 Solved! You did it!'; addStars(3); }
      }
      window.puzzleClick = function (idx) {
        const emptyIdx = tiles.indexOf('');
        const validMoves = [emptyIdx - 1, emptyIdx + 1, emptyIdx - 3, emptyIdx + 3];
        const samRow = (i) => Math.floor(i / 3) === Math.floor(emptyIdx / 3);
        if (!validMoves.includes(idx)) return;
        if ((idx === emptyIdx - 1 || idx === emptyIdx + 1) && !samRow(idx)) return;
        [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
        moves++;
        render();
      };
      render();
    }

    /* ---- WHACK-A-MOLE GAME ---- */
    function buildWhackGame() {
      return `<style>
        .whack-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;}
        .whack-info{display:flex;gap:24px;font-family:'Fredoka One',cursive;font-size:1.1rem;color:#A855F7;}
        .whack-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:10px 0;}
        .whack-hole{width:96px;height:96px;border-radius:50%;background:linear-gradient(180deg,#c0a070,#8B5E3C);box-shadow:inset 0 6px 20px rgba(0,0,0,0.4);display:flex;align-items:flex-end;justify-content:center;overflow:hidden;cursor:pointer;position:relative;}
        .whack-animal{font-size:2.8rem;transition:transform 0.2s;transform:translateY(100%);position:absolute;bottom:0;}
        .whack-animal.visible{transform:translateY(0);}
        .whack-animal.hit{animation:whackHit 0.3s ease;}
        @keyframes whackHit{0%{transform:scale(1.3)}100%{transform:translateY(100%)}}
        .whack-msg{font-family:'Fredoka One',cursive;font-size:1.5rem;color:#22C55E;min-height:2rem;text-align:center;}
        .whack-start{padding:12px 28px;border:none;border-radius:50px;background:linear-gradient(135deg,#FF8C00,#FFD700);color:white;font-family:'Fredoka One',cursive;font-size:1.1rem;cursor:pointer;box-shadow:0 4px 18px rgba(255,140,0,0.35);}
      </style>
      <div class="whack-wrap">
        <div class="whack-info"><span>⏱️ <span id="whackTime">30</span>s</span><span>🎯 Score: <span id="whackScore">0</span></span></div>
        <div class="whack-grid" id="whackGrid">
          ${Array(9).fill(0).map((_, i) => `<div class="whack-hole" id="whack-hole-${i}" onclick="whackMole(${i})"><div class="whack-animal" id="whack-animal-${i}"></div></div>`).join('')}
        </div>
        <div class="whack-msg" id="whackMsg">Press Start to Play!</div>
        <button class="whack-start" onclick="startWhack()">▶ Start!</button>
      </div>`;
    }
    function initWhack() { }
    function startWhack() {
      const animals = ['🐹', '🐭', '🐰', '🐸', '🐿️', '🦔', '🐾', '🦝', '🐇'];
      let score = 0, timeLeft = 30, activeHole = -1, gameOver = false;
      document.getElementById('whackScore').textContent = '0';
      document.getElementById('whackMsg').textContent = '';
      document.querySelector('.whack-start').style.display = 'none';
      function showMole() {
        if (gameOver) return;
        if (activeHole >= 0) {
          const prev = document.getElementById(`whack-animal-${activeHole}`);
          if (prev) prev.classList.remove('visible');
        }
        activeHole = Math.floor(Math.random() * 9);
        const animal = document.getElementById(`whack-animal-${activeHole}`);
        if (animal) { animal.textContent = animals[activeHole]; animal.classList.add('visible'); }
        setTimeout(() => {
          if (animal && !gameOver) animal.classList.remove('visible');
        }, 900);
      }
      window.whackMole = function (idx) {
        if (gameOver || idx !== activeHole) return;
        const animal = document.getElementById(`whack-animal-${idx}`);
        if (!animal || !animal.classList.contains('visible')) return;
        animal.classList.remove('visible'); animal.classList.add('hit');
        setTimeout(() => animal.classList.remove('hit'), 300);
        score++; activeHole = -1;
        document.getElementById('whackScore').textContent = score;
      };
      const moleInt = setInterval(showMole, 800);
      const timerInt = setInterval(() => {
        timeLeft--;
        document.getElementById('whackTime').textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(moleInt); clearInterval(timerInt); gameOver = true;
          document.getElementById('whackMsg').textContent = `🏆 Time's up! Score: ${score}`;
          document.querySelector('.whack-start').style.display = 'inline-block';
          document.querySelector('.whack-start').textContent = '🔄 Play Again!';
          addStars(Math.floor(score / 2));
        }
      }, 1000);
    }

    /* ---- MATH MAGIC GAME ---- */
    function buildMathGame() {
      return `<style>
        .math-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;}
        .math-score{font-family:'Fredoka One',cursive;font-size:1rem;color:#888;}
        .math-question{font-family:'Fredoka One',cursive;font-size:3rem;color:#A855F7;text-align:center;margin:10px 0;}
        .math-emojis{font-size:2.2rem;text-align:center;min-height:3.5rem;letter-spacing:2px;margin-bottom:8px;}
        .math-choices{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:320px;width:100%;}
        .math-choice{padding:18px;border-radius:16px;border:3px solid #F3E8FF;background:white;font-family:'Fredoka One',cursive;font-size:1.8rem;color:#1A0A3C;cursor:pointer;transition:all 0.2s;text-align:center;}
        .math-choice:hover{background:rgba(168,85,247,0.1);border-color:#A855F7;transform:scale(1.05);}
        .math-choice.correct{background:#F0FFF4;border-color:#4ADE80;color:#22C55E;}
        .math-choice.wrong{background:#FFF0F0;border-color:#FF4455;color:#FF4455;}
        .math-msg{font-family:'Fredoka One',cursive;font-size:1.5rem;min-height:2.2rem;text-align:center;}
        .math-next{padding:10px 24px;border:none;border-radius:50px;background:linear-gradient(135deg,#A855F7,#38BDF8);color:white;font-family:'Fredoka One',cursive;font-size:1rem;cursor:pointer;display:none;}
      </style>
      <div class="math-wrap">
        <div class="math-score" id="mathScore">Question 1 of 10 | Score: 0</div>
        <div class="math-question" id="mathQ">2 + 3 = ?</div>
        <div class="math-emojis" id="mathEmojis"></div>
        <div class="math-choices" id="mathChoices"></div>
        <div class="math-msg" id="mathMsg"></div>
        <button class="math-next" id="mathNextBtn" onclick="mathNext()">Next ▶</button>
      </div>`;
    }
    function initMath() {
      const emSet = ['🍎', '⭐', '🌸', '🎈', '🐶', '🍕', '🌟', '🎉', '💛', '🦋'];
      let idx = 0, score = 0;
      const questions = Array.from({ length: 10 }, () => {
        const op = Math.random() > 0.5 ? '+' : '-';
        let a = Math.floor(Math.random() * 6) + 1;
        let b = op === '-' ? Math.floor(Math.random() * a) + 1 : Math.floor(Math.random() * 6) + 1;
        if (op === '-' && b > a) b = a;
        const ans = op === '+' ? a + b : a - b;
        return { a, b, op, ans };
      });
      function renderQ() {
        const q = questions[idx];
        document.getElementById('mathScore').textContent = `Question ${idx + 1} of 10 | Score: ${score}`;
        document.getElementById('mathQ').textContent = `${q.a} ${q.op} ${q.b} = ?`;
        const em = emSet[idx % emSet.length];
        document.getElementById('mathEmojis').textContent = q.op === '+' ? em.repeat(q.a) + ' + ' + em.repeat(q.b) : em.repeat(q.a);
        document.getElementById('mathMsg').textContent = '';
        document.getElementById('mathNextBtn').style.display = 'none';
        const wrongs = new Set([q.ans]);
        while (wrongs.size < 4) { let w = q.ans + Math.floor(Math.random() * 5) - 2; if (w >= 0) wrongs.add(w); }
        const choices = [...wrongs].sort(() => Math.random() - 0.5);
        document.getElementById('mathChoices').innerHTML = choices.map(c => `<button class="math-choice" onclick="mathAnswer(${c},${q.ans})">${c}</button>`).join('');
      }
      window.mathAnswer = function (chosen, correct) {
        document.querySelectorAll('.math-choice').forEach(b => { b.disabled = true; if (parseInt(b.textContent) === correct) b.classList.add('correct'); if (parseInt(b.textContent) === chosen && chosen !== correct) b.classList.add('wrong'); });
        if (chosen === correct) { score++; document.getElementById('mathMsg').textContent = '🎉 Correct! Great job!'; }
        else { document.getElementById('mathMsg').textContent = `❌ Answer was ${correct}`; }
        document.getElementById('mathScore').textContent = `Question ${idx + 1} of 10 | Score: ${score}`;
        if (idx < questions.length - 1) { document.getElementById('mathNextBtn').style.display = 'inline-block'; }
        else { setTimeout(() => { document.getElementById('mathMsg').textContent = `🏆 Finished! Score: ${score}/10`; addStars(score); }, 800); }
      };
      window.mathNext = function () { idx++; if (idx < questions.length) renderQ(); };
      renderQ();
    }

    // ===== NEW CREATIVE ZONES JS =====

    // Board Game
    function changeBgLayout(type) {
      const path = document.getElementById('bg-path');
      if (type === 'snake') {
        path.style.background = 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 20px, #ffffff 20px, #ffffff 40px)';
        path.style.borderRadius = '40px';
      } else {
        path.style.background = 'repeating-radial-gradient(circle, #f0f0f0, #f0f0f0 20px, #ffffff 20px, #ffffff 40px)';
        path.style.borderRadius = '50%';
      }
    }

    function addStickerToBg(emoji) {
      const layer = document.getElementById('bg-stickers-layer');
      const sticker = document.createElement('div');
      sticker.textContent = emoji;
      sticker.style.position = 'absolute';
      sticker.style.fontSize = '3rem';
      sticker.style.left = (Math.random() * 80 + 10) + '%';
      sticker.style.top = (Math.random() * 80 + 10) + '%';
      sticker.style.cursor = 'grab';
      sticker.style.userSelect = 'none';

      let isDragging = false;
      sticker.onmousedown = function (e) {
        isDragging = true;
        sticker.style.cursor = 'grabbing';
      };
      window.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; sticker.style.cursor = 'grab'; }
      });
      window.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const rect = layer.getBoundingClientRect();
          let x = e.clientX - rect.left - 24;
          let y = e.clientY - rect.top - 24;
          sticker.style.left = x + 'px';
          sticker.style.top = y + 'px';
        }
      });

      layer.appendChild(sticker);
    }

    function clearBgStickers() {
      document.getElementById('bg-stickers-layer').innerHTML = '';
    }

    function printCustomBoardGame() {
      const content = document.getElementById('bg-canvas').outerHTML;
      const win = window.open('', '_blank');
      win.document.write(`<html><head><title>My Custom Board Game</title></head><body style="display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">${content}</body></html>`);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }

    // Emoji Maker
    function updateEmoji(part, val) {
      document.getElementById('em-' + part).textContent = val;
    }

    // Secret Decoder
    const cipher = {
      'a': '🍎', 'b': '🎈', 'c': '🐱', 'd': '🐶', 'e': '🐘', 'f': '🦊', 'g': '🦒', 'h': '🐹',
      'i': '🍦', 'j': '🧩', 'k': '🪁', 'l': '🦁', 'm': '🐭', 'n': '🥜', 'o': '🦉', 'p': '🐼',
      'q': '👑', 'r': '🚀', 's': '⭐', 't': '🐢', 'u': '🦄', 'v': '🌋', 'w': '🐳', 'x': '❌',
      'y': '⛵', 'z': '🦓', ' ': '⬜'
    };
    const reverseCipher = Object.fromEntries(Object.entries(cipher).map(([k, v]) => [v, k]));

    function encodeMessage() {
      const input = document.getElementById('decoder-input').value.toLowerCase();
      let output = '';
      for (let char of input) {
        output += cipher[char] || char;
      }
      document.getElementById('decoder-output').textContent = output;
    }

    function decodeMessage() {
      let input = document.getElementById('decoder-input').value;
      let output = '';
      for (let i = 0; i < input.length; i++) {
        let char = input.codePointAt(i) > 0xFFFF ? input.substring(i, i + 2) : input[i];
        if (input.codePointAt(i) > 0xFFFF) i++;
        output += reverseCipher[char] || char;
      }
      document.getElementById('decoder-output').textContent = output;
    }

    // Print Origami
    function printOrigami(src) {
      const win = window.open('', '_blank');
      win.document.write(`<html><head><title>Print Origami</title></head><body style="display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; padding:20px;"><img src="${src}" style="max-width:100%; max-height:100vh; object-fit:contain;" /></body></html>`);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }

// ===== FIREBASE CONFIG =====
    // TODO: PASTE YOUR FIREBASE CONFIG HERE
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    
    // Initialize Firebase
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      var db = firebase.database();
      
      // Load live posts when page loads
      window.addEventListener('DOMContentLoaded', () => {
        if(typeof loadFriendPosts === 'function') {
          loadFriendPosts();
        }
      });
    } catch(e) {
      console.warn("Firebase not properly configured yet.");
    }
