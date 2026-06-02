// --------------------------------------------------
// SPIDER-VERSE PORTFOLIO INTERACTIVE LOGIC
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
    const interactiveElements = document.querySelectorAll('a, button, .polaroid-card, .filter-bubble, .skill-node');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '36px';
        cursor.style.height = '36px';
        cursor.style.borderColor = 'var(--color-blue)';
        cursorDot.style.backgroundColor = 'var(--color-yellow)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.borderColor = 'var(--color-red)';
        cursorDot.style.backgroundColor = 'var(--color-blue)';
      });
    });
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
        this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 0, 85, 0.2)';
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
      ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 0, 85, 0.4)';
      ctx.lineWidth = Math.random() * 3 + 1;
      const y = Math.random() * height;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + (Math.random() - 0.5) * 50);
      ctx.stroke();
    }

    animate();
  }

  // 3. 3D CARD TILT EFFECT
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt degrees (-10 to 10 degrees)
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // Specialized Parallax + 3D Tilt for Leap of Faith Hero Card
  const leapPanel = document.getElementById('leap-panel');
  const leapImage = leapPanel ? leapPanel.querySelector('.leap-image') : null;
  const spiderSense = document.getElementById('spider-sense');
  
  if (leapPanel && leapImage) {
    let isHoveringLeap = false;
    
    leapPanel.addEventListener('mouseenter', () => {
      isHoveringLeap = true;
      if (spiderSense) spiderSense.classList.add('tingle');
      
      if (cursor) {
        cursor.style.width = '36px';
        cursor.style.height = '36px';
        cursor.style.borderColor = 'var(--color-blue)';
        cursorDot.style.backgroundColor = 'var(--color-yellow)';
      }
    });

    leapPanel.addEventListener('mousemove', (e) => {
      const rect = leapPanel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate 3D tilt angles (rotate up to 12 degrees)
      const rotateX = ((centerY - y) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      // Parallax offset for internal background image in opposite direction (shift up to 15px)
      const moveX = ((centerX - x) / centerX) * 15;
      const moveY = ((centerY - y) / centerY) * 15;
      
      leapPanel.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
      leapImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.15)`;
    });

    leapPanel.addEventListener('mouseleave', () => {
      isHoveringLeap = false;
      if (spiderSense) spiderSense.classList.remove('tingle');
      
      leapPanel.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
      leapImage.style.transform = 'translate(0px, 0px) scale(1.05)';
      
      if (cursor) {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.borderColor = 'var(--color-red)';
        cursorDot.style.backgroundColor = 'var(--color-blue)';
      }
    });

    // Scroll-driven tingle effect when scrolling over Miles
    window.addEventListener('scroll', () => {
      const rect = leapPanel.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Tingle if the cutout is in the middle 40% of screen height
      const inCenter = rect.top < viewHeight * 0.7 && rect.bottom > viewHeight * 0.3;
      
      if (inCenter || isHoveringLeap) {
        if (spiderSense) spiderSense.classList.add('tingle');
      } else {
        if (spiderSense) spiderSense.classList.remove('tingle');
      }
    });
  }

  // 4. DIMENSION HOP GLITCH ON NAV NAVIGATION
  const navLinks = document.querySelectorAll('.nav-panel');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Add screen-glitch animation to container
      const container = document.querySelector('.portfolio-container');
      if (container) {
        container.classList.add('screen-glitch');
        setTimeout(() => {
          container.classList.remove('screen-glitch');
        }, 300);
      }
    });
  });

  // 5. PROJECTS FILTERING AND DETAILED VIEW
  const filterBubbles = document.querySelectorAll('.filter-bubble');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsGrid = document.getElementById('projects-grid');
  const filterContainer = document.querySelector('.filter-container');
  const projectDetailView = document.getElementById('project-detail-view');
  const backToGridBtn = document.getElementById('back-to-grid');
  
  const detailTitle = document.getElementById('detail-title');
  const detailDescription = document.getElementById('detail-description');

  const projectDetails = {
    'boundr': {
      title: 'Boundr',
      description: 'We found that students were increasingly reaching out to recruiters through personal channels like LinkedIn messages, emails, and social media DMs, creating a fragmented and often inefficient experience for both sides. Students struggled to effectively showcase their value beyond a cold message, while recruiters had no structured way to manage or evaluate inbound outreach.\n\nTo solve this, we built Boundr, a platform that centralizes student-to-recruiter outreach into a dedicated professional channel. Students can create a concise personal pitch, attach their resume, and send personalized messages in a structured format, giving recruiters a consistent and organized way to discover talent while reducing noise across their personal communication channels.',
      videoSrc: 'Boundr.MOV'
    },
    'loraxai': {
      title: 'LoraxAI',
      description: 'We identified a major gap in wildfire detection systems after seeing how destructive the 2023 Alberta wildfires were, with millions of hectares burned, thousands displaced, and billions in losses, yet detection still heavily relied on delayed reporting and limited sensor coverage. The core problem was that existing systems were reactive, fragmented, and often too slow to catch early-stage fire or illegal logging activity in remote forest regions.\n\nTo address this, we built LoraxAI, a distributed wildfire and forest monitoring system that uses low-cost edge devices deployed across forest areas. Each node captures ambient sound through a sensor, detects anomalies like fire crackling or chainsaw activity, and sends data to a centralized model that classifies events using audio-based machine learning. Alerts, GPS locations, and predictions are surfaced through a real-time dashboard with notification systems for rapid response, creating a proactive detection network instead of a reactive alert system.',
      videoSrc: 'LoraxAI.mov'
    }
  };

  filterBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      // Clear active filter state
      filterBubbles.forEach(b => b.classList.remove('active'));
      bubble.classList.add('active');

      const filterValue = bubble.getAttribute('data-filter');

      // Glitch visual flash when filter updates
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.classList.add('screen-glitch');
        setTimeout(() => projectsSection.classList.remove('screen-glitch'), 200);
      }

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'glitch-reveal 0.3s forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  projectCards.forEach(card => {
    // Making the whole card trigger the detail view
    card.addEventListener('click', (e) => {
      // Prevent default if they clicked the 'READ ISSUE' link explicitly
      if (e.target.tagName.toLowerCase() === 'a') {
        e.preventDefault();
      }
      
      const projectId = card.getAttribute('data-project-id');
      const details = projectDetails[projectId];
      
      if (details) {
        detailTitle.textContent = details.title;
        detailDescription.textContent = details.description;
        
        const videoElement = document.getElementById('detail-video');
        const videoPlaceholder = document.getElementById('detail-video-placeholder');
        
        if (details.videoSrc) {
          videoElement.src = details.videoSrc;
          videoElement.style.display = 'block';
          videoPlaceholder.style.display = 'none';
        } else {
          videoElement.style.display = 'none';
          videoElement.src = '';
          videoPlaceholder.style.display = 'block';
        }
        
        // Hide grid and filters
        projectsGrid.style.display = 'none';
        filterContainer.style.display = 'none';
        
        // Show detail view
        projectDetailView.classList.remove('hidden');
      }
    });
  });

  if (backToGridBtn) {
    backToGridBtn.addEventListener('click', () => {
      // Hide detail view
      projectDetailView.classList.add('hidden');
      
      const videoElement = document.getElementById('detail-video');
      if (videoElement) {
        videoElement.pause();
        videoElement.src = '';
      }
      
      // Show grid and filters (removing inline styles restores CSS defaults)
      projectsGrid.style.display = '';
      filterContainer.style.display = '';
    });
  }
  
  // Pause background music when video plays
  const detailVideo = document.getElementById('detail-video');
  const bgAudioRef = document.getElementById('bg-audio');
  if (detailVideo && bgAudioRef) {
    detailVideo.addEventListener('play', () => {
      if (!bgAudioRef.paused) {
        bgAudioRef.pause();
        
        // Update the player UI state
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        const albumArt = document.querySelector('.player-album-art');
        const visualizer = document.querySelector('.player-visualizer');
        
        if (playIcon && pauseIcon) {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
        if (albumArt) albumArt.classList.remove('playing');
        if (visualizer) visualizer.classList.remove('playing');
      }
    });
  }



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
        // Clone the photo
        const clonedImg = imgElement.cloneNode(true);
        lightboxPlaceholder.innerHTML = '';
        lightboxPlaceholder.appendChild(clonedImg);
        
        // Inject Caption & show
        lightboxCaption.textContent = captionText;
        lightbox.style.display = 'flex';
        lightbox.style.animation = 'glitch-reveal 0.3s forwards';
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
    // Avoid triggering web shooter if clicking close button, music player, or project links
    if (e.target.closest('.lightbox-close') || e.target.closest('.project-link') || e.target.closest('#music-player')) {
      return;
    }
    triggerWebExplosion(e.clientX, e.clientY);
  });

  function triggerWebExplosion(ox, oy) {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    const particleCount = 40; // slightly reduced count to keep it smooth and elegant for frequent clicks
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: Math.random() > 0.5 ? '#ff0055' : '#00f0ff'
      });
    }

    function drawWebExplosion() {
      let alive = false;
      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.025; // decays slightly faster for visual efficiency

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();
          ctx.globalAlpha = 1.0;
          
          // Connect trails back to center click point
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.12})`;
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

  // Splash Screen controls
  const splashScreen = document.getElementById('splash-screen');
  const enterBtn = document.getElementById('enter-universe-btn');

  // Slide-in player animation
  setTimeout(() => {
    if (musicPlayer) {
      musicPlayer.classList.add('visible');
    }
  }, 1000);

  // Splash Screen click handler to start audio automatically
  if (enterBtn && splashScreen) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent web click trigger
      
      // Screen shake glitch visual
      const container = document.querySelector('.portfolio-container');
      if (container) {
        container.classList.add('screen-glitch');
        setTimeout(() => container.classList.remove('screen-glitch'), 350);
      }
      
      // Attempt play audio
      if (bgAudio) {
        bgAudio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          albumArt.classList.add('playing');
          visualizer.classList.add('playing');
        }).catch(err => {
          console.log("Audio play failed or was blocked by device parameters", err);
        });
      }
      
      // Hide splash screen
      splashScreen.classList.add('hidden');
    });
    
    // Add custom cursor styling to splash enter button
    enterBtn.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.style.width = '36px';
        cursor.style.height = '36px';
        cursor.style.borderColor = 'var(--color-blue)';
        cursorDot.style.backgroundColor = 'var(--color-yellow)';
      }
    });
    enterBtn.addEventListener('mouseleave', () => {
      if (cursor) {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.borderColor = 'var(--color-red)';
        cursorDot.style.backgroundColor = 'var(--color-blue)';
      }
    });
  }

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

  // Make sure player controls trigger custom cursor updates
  if (musicPlayer && cursor) {
    const controls = musicPlayer.querySelectorAll('button, .timeline-slider');
    controls.forEach(control => {
      control.addEventListener('mouseenter', () => {
        cursor.style.width = '36px';
        cursor.style.height = '36px';
        cursor.style.borderColor = 'var(--color-blue)';
        cursorDot.style.backgroundColor = 'var(--color-yellow)';
      });
      control.addEventListener('mouseleave', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.borderColor = 'var(--color-red)';
        cursorDot.style.backgroundColor = 'var(--color-blue)';
      });
    });
  }
});
