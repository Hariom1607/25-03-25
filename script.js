// Wrap all init in DOMContentLoaded to be safe
document.addEventListener('DOMContentLoaded', () => {
  // --- Typewriter for main message ---
  (function typewriter() {
    const el = document.getElementById('typing');
    if (!el) return;
    const text = el.getAttribute('data-text') || '';
    let i = 0;
    const speed = 35; // ms per character

    function step() {
      el.style.width = `${Math.min(i + 1, text.length)}ch`;
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        requestAnimationFrame(() => setTimeout(step, speed));
      } else {
        // pause caret
        el.style.borderRightColor = 'transparent';
      }
    }
    step();
  })();

  // --- Confetti --- 
  function burstConfetti() {
    if (typeof confetti !== 'function') return;
    const duration = 1200;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0 } });
      confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // --- Elements ---
  const startBtn = document.getElementById('startBtn');
  const audioEl = document.getElementById('bg-music');
  const balloonContainer = document.getElementById('balloon-container');
  const balloonMessages = [
    "You are my sunshine ☀️",
    "Forever yours 💖",
    "Best day with you 🌸",
    "I love you endlessly ❤️",
    "Our memories are forever 🌹"
  ];

  // --- Floating hearts on pointer move ---
  window.addEventListener('pointermove', (e) => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1600);
  });

  // --- Slideshow with caption typewriter ---
  let slideIndex = 0;
  const slides = document.getElementsByClassName("slides");
  let slideInterval;

  function showSlides(n) {
    if (slides.length === 0) return;

    // Hide all slides
    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";

    slideIndex = typeof n === 'number' ? n : slideIndex + 1;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;

    const currentSlide = slides[slideIndex];
    currentSlide.style.display = "block";

    // Typewriter caption
    const caption = currentSlide.querySelector(".caption");
    if (!caption) return;
    const text = caption.getAttribute("data-text") || "";
    caption.textContent = "";
    let i = 0;
    function typeWriter() {
      if (i <= text.length) {
        caption.textContent = text.slice(0, i);
        i++;
        setTimeout(typeWriter, 40);
      }
    }
    typeWriter();
  }

  function plusSlides(n) {
    showSlides(slideIndex + n);
    resetInterval();
  }

  function autoSlides() { showSlides(slideIndex + 1); }
  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlides, 5000);
  }

  // initialize slideshow
  showSlides(0);
  slideInterval = setInterval(autoSlides, 5000);

  // expose prev/next for inline arrows
  window.plusSlides = plusSlides;

  // --- Surprise Card handlers ---
  const openCardBtn = document.getElementById("openCardBtn");
  const closeCardBtn = document.getElementById("closeCardBtn");
  const surpriseCard = document.getElementById("surpriseCard");

  function floatHearts(count = 5) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-card";
      heart.style.left = `${Math.random() * 80 + 10}%`;
      heart.style.bottom = "0";
      surpriseCard.appendChild(heart);
      setTimeout(() => heart.remove(), 2000 + Math.random() * 1000);
    }
  }

  openCardBtn?.addEventListener("click", () => {
    surpriseCard.style.display = "block";
    surpriseCard.style.transform = "translate(-50%, -50%) scale(0.5)";
    surpriseCard.style.opacity = "0";
    surpriseCard.setAttribute('aria-hidden', 'false');
    floatHearts(8);
    setTimeout(() => {
      surpriseCard.style.transition = "transform 0.5s ease, opacity 0.5s ease";
      surpriseCard.style.transform = "translate(-50%, -50%) scale(1)";
      surpriseCard.style.opacity = "1";
    }, 50);
  });
  closeCardBtn?.addEventListener("click", () => {
    surpriseCard.style.display = "none";
    surpriseCard.setAttribute('aria-hidden', 'true');
  });

  // --- Balloon bursting logic (centralized) ---
  function burstBalloon(balloon) {
    if (!balloon || !balloon.parentElement) return;
    const rect = balloon.getBoundingClientRect();

    // Show message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'balloon-message';
    msgDiv.textContent = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
    msgDiv.style.left = rect.left + rect.width / 2 + 'px';
    msgDiv.style.top = rect.top + rect.height / 2 + 'px';
    document.body.appendChild(msgDiv);
    // fade in
    setTimeout(() => msgDiv.style.opacity = 1, 30);
    setTimeout(() => msgDiv.remove(), 3800);

    // Create particles
    for (let j = 0; j < 12; j++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = Math.random() * 2 * Math.PI;
      const distance = 30 + Math.random() * 20;
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 900);
    }

    // burst animation + remove
    balloon.classList.add('burst');
    setTimeout(() => balloon.remove(), 520);
  }

  // Create side balloons once (keeps original look)
  function createSideBalloons() {
    const sides = ['left', 'right'];
    sides.forEach(side => {
      for (let i = 0; i < 3; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        // left or right side distribution
        balloon.style.left = side === 'left' ? `${10 + Math.random() * 15}%` : `${60 + Math.random() * 15}%`;
        balloon.style.top = `${10 + Math.random() * 50}%`;

        const colors = [
          ['#ff5f6d','#ffc371'],
          ['#36d1dc','#5b86e5'],
          ['#ff758c','#ff7eb3'],
          ['#43cea2','#185a9d'],
          ['#f7971e','#ffd200']
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.background = `radial-gradient(circle at 30% 30%, ${randomColor[0]}, ${randomColor[1]})`;

        // gentle float animation
        balloon.style.animation = `floatFloat ${4 + Math.random() * 2}s ease-in-out ${Math.random()*2}s infinite`;

        // Click to burst (use centralized function)
        balloon.addEventListener('click', () => burstBalloon(balloon));

        balloonContainer.appendChild(balloon);
      }
    });
  }

  // Clear & recreate initial balloons
  balloonContainer.innerHTML = '';
  createSideBalloons();

  // (NO erroneous global 'balloon.addEventListener' — removed)

  // --- Start Button: music + confetti + light candles + auto burst balloons ---
  startBtn?.addEventListener('click', async () => {
    burstConfetti();

    // Play audio (user gesture required)
    try {
      await audioEl.play();
    } catch (e) {
      console.log('Add an MP3 at assets/audio/song.mp3 to enable background music.');
    }

    // Show & light candles (container id kept as "candles" to minimize change)
    const candlesContainer = document.getElementById("candles");
    if (candlesContainer) {
      candlesContainer.style.display = "block";
      candlesContainer.setAttribute('aria-hidden', 'false');
      const flames = candlesContainer.querySelectorAll(".flame");
      flames.forEach((flame, i) => {
        // stagger lighting
        setTimeout(() => {
          flame.style.animation = "flicker 0.6s infinite";
          flame.style.transform = "translateX(-50%) scale(1)";
          flame.style.opacity = "1";
        }, i * 500);
      });
    }

    // Auto burst all CURRENT balloons after a small delay
    setTimeout(() => {
      const currentBalloons = Array.from(document.querySelectorAll(".balloon"));
      currentBalloons.forEach((b, idx) => {
        setTimeout(() => burstBalloon(b), idx * 300);
      });
    }, 1600);
  });

  // --- Falling petals generation ---
  function createPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (6 + Math.random() * 5) + "s";
    petal.style.opacity = (0.6 + Math.random() * 0.4).toString();
    document.getElementById("petals").appendChild(petal);
    setTimeout(() => petal.remove(), 11000);
  }
  setInterval(createPetal, 650);

  // small float-keyframes (already in CSS)
  // nothing else to init here
});
