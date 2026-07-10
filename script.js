// --------------------------------------------------
// PORTFOLIO-VERSE INTERACTIVE LOGIC (APPLE & BENTO MODERNIZED)
// --------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  // 1. CUSTOM CURSOR
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
      cursor.style.borderColor = 'var(--color-yellow)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'var(--color-red)';
    });

    // Add hover states for interactive elements
    const setupCursorHovers = () => {
      const interactiveElements = document.querySelectorAll('a, button, .polaroid-card, .skill-tag, .project-action-btn');
      interactiveElements.forEach(el => {
        // Prevent duplicate bindings
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "true";

        el.addEventListener('mouseenter', () => {
          cursor.style.width = '28px';
          cursor.style.height = '28px';
          cursor.style.borderColor = 'var(--color-blue)';
          cursorDot.style.backgroundColor = 'var(--color-yellow)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '18px';
          cursor.style.height = '18px';
          cursor.style.borderColor = 'var(--color-red)';
          cursorDot.style.backgroundColor = 'var(--color-blue)';
        });
      });
    };
    setupCursorHovers();
    
    // Periodically re-run to capture dynamically loaded elements if any
    setInterval(setupCursorHovers, 2000);
  }

  // 2. CANVAS BACKGROUND (Digital Spider-Web Nodes)
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Node class for the web particles
    class WebNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255, 59, 48, 0.2)';
      }

      update(mouseX, mouseY) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interaction with mouse (attraction/repulsion)
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            // Soft drift towards mouse
            this.x += (dx / dist) * 0.5;
            this.y += (dy / dist) * 0.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const nodes = Array.from({ length: 45 }, () => new WebNode());
    let mouseX, mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouseX = undefined;
      mouseY = undefined;
    });

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw lines between nodes close to each other
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(mouseX, mouseY);
        nodes[i].draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            // Linear fade matching distance
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Random spider-sense glitches on canvas background
      if (Math.random() > 0.995) {
        drawRandomGlitchLine();
      }

      requestAnimationFrame(animate);
    }

    function drawRandomGlitchLine() {
      ctx.beginPath();
      ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(0, 122, 255, 0.3)' : 'rgba(255, 59, 48, 0.3)';
      ctx.lineWidth = Math.random() * 2 + 1;
      const y = Math.random() * height;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + (Math.random() - 0.5) * 50);
      ctx.stroke();
    }

    animate();
  }

  // 3. BENTO CARD MOUSE GLOW EFFECT
  const bentoCards = document.querySelectorAll('.bento-card, .project-bento-card, .timeline-item');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });





  // 6. FLOATING NAVBAR ACTIVE SECTION SYNCRONIZER
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('#about, #experience, #projects, #photography');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Smooth scroll click handler
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Trigger a subtle screen glitch on section switch
        const container = document.querySelector('.portfolio-container');
        if (container) {
          container.classList.add('screen-glitch');
          setTimeout(() => container.classList.remove('screen-glitch'), 250);
        }
        
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 7. PHOTOGRAPHY LIGHTBOX SYSTEM
  const polaroids = document.querySelectorAll('.polaroid-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', () => {
      const imgElement = polaroid.querySelector('.real-photo');
      const captionText = polaroid.querySelector('.polaroid-caption').textContent;

      if (imgElement && lightbox && lightboxPlaceholder && lightboxCaption) {
        const clonedImg = imgElement.cloneNode(true);
        lightboxPlaceholder.innerHTML = '';
        lightboxPlaceholder.appendChild(clonedImg);
        
        lightboxCaption.textContent = captionText;
        lightbox.style.display = 'flex';
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  // 8. GLOBAL CLICK WEB-SHOOTER ACTION (Explosion triggered on any click)
  document.addEventListener('click', (e) => {
    // Avoid triggering web shooter if clicking links, buttons, lightbox, or music player
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('#lightbox') || e.target.closest('#music-player')) {
      return;
    }
    triggerWebExplosion(e.clientX, e.clientY);
  });

  function triggerWebExplosion(ox, oy) {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    const particleCount = 25; // elegant small particle count
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      particles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: Math.random() > 0.5 ? '#ff3b30' : '#007aff'
      });
    }

    function drawWebExplosion() {
      let alive = false;
      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.03; 

           ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, p.life * 2.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          
          // Connect trails back to click center
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, p.life * 0.1)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      if (alive) {
        requestAnimationFrame(drawWebExplosion);
      }
    }

    drawWebExplosion();
  }

  // 9. iOS MUSIC PLAYER CONTROL SYSTEM
  const musicPlayer = document.getElementById('music-player');
  const bgAudio = document.getElementById('bg-audio');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeLabel = document.getElementById('current-time');
  const volumeBtn = document.getElementById('volume-btn');
  const volOnIcon = document.getElementById('vol-on-icon');
  const volMuteIcon = document.getElementById('vol-mute-icon');
  const albumArt = document.getElementById('player-album-art');
  const visualizer = document.getElementById('visualizer');

  // Slide-in player animation
  setTimeout(() => {
    if (musicPlayer) {
      musicPlayer.classList.add('visible');
    }
  }, 1000);

  // Play/Pause actions
  if (playPauseBtn && bgAudio) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          albumArt.classList.add('playing');
          visualizer.classList.add('playing');
        }).catch(err => {
          console.error("Audio playback error:", err);
        });
      } else {
        bgAudio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        albumArt.classList.remove('playing');
        visualizer.classList.remove('playing');
      }
    });
  }

  // Seek timeline actions
  if (progressContainer && bgAudio) {
    progressContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const duration = bgAudio.duration;
      if (duration) {
        bgAudio.currentTime = (clickX / width) * duration;
      }
    });
  }

  // Update seek timeline & progress bar
  if (bgAudio) {
    bgAudio.addEventListener('timeupdate', () => {
      const duration = bgAudio.duration;
      const currentTime = bgAudio.currentTime;
      if (duration && progressBar) {
        const percentage = (currentTime / duration) * 100;
        progressBar.style.width = `${percentage}%`;
      }
      
      if (currentTimeLabel) {
        const mins = Math.floor(currentTime / 60);
        const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
        currentTimeLabel.textContent = `${mins}:${secs}`;
      }
    });
  }

  // Volume toggle actions
  if (volumeBtn && bgAudio) {
    volumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgAudio.muted) {
        bgAudio.muted = false;
        volOnIcon.style.display = 'block';
        volMuteIcon.style.display = 'none';
      } else {
        bgAudio.muted = true;
        volOnIcon.style.display = 'none';
        volMuteIcon.style.display = 'block';
      }
    });
  }
});
