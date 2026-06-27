/**
 * Sarujan Marianesan Portfolio Website
 * Main JavaScript File - Interactive Logic & Multi-Page Navigation
 */

// ==========================================================
// IMMEDIATE THEME & BACKGROUND INITIALIZATION (To avoid flashing)
// ==========================================================
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const savedSettingsStr = localStorage.getItem('portfolio-theme-customizer');
let settings = savedSettingsStr ? JSON.parse(savedSettingsStr) : {
  theme: 'dark',
  bgType: 'preset',
  bgColor: '#0B0F19',
  presetId: 'preset-slate-gradient',
  bgGradient: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1F2937 100%)',
  glowsEnabled: true,
  glow1: '#1e1b4b',
  glow2: '#311042',
  glow3: '#022c22'
};

const applyImmediateSettings = (opts) => {
  const root = document.documentElement;
  
  // Apply Base Theme Class
  if (document.body) {
    if (opts.theme === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }

  // Apply Background style
  if (opts.bgType === 'solid') {
    root.style.setProperty('--bg-dark', opts.bgColor);
    if (document.body) {
      document.body.style.background = opts.bgColor;
    }
    const rgb = hexToRgb(opts.bgColor);
    if (rgb) {
      root.style.setProperty('--bg-dark-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  } else if (opts.bgType === 'preset') {
    if (document.body) {
      document.body.style.background = opts.bgGradient;
      document.body.style.backgroundAttachment = 'fixed';
    }
    const rgb = opts.theme === 'dark' ? {r:11, g:15, b:25} : {r:248, g:250, b:252};
    root.style.setProperty('--bg-dark-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  }

  // Apply Glow Circles
  root.style.setProperty('--glow-1', opts.glow1);
  root.style.setProperty('--glow-2', opts.glow2);
  root.style.setProperty('--glow-3', opts.glow3);
  
  const glowContainer = document.querySelector('.bg-glow-container');
  if (glowContainer) {
    if (opts.glowsEnabled) {
      glowContainer.classList.remove('hide-glows');
    } else {
      glowContainer.classList.add('hide-glows');
    }
  }
};

// Execute immediately if body is parsed, else wait for DOM
if (document.body) {
  applyImmediateSettings(settings);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    applyImmediateSettings(settings);
  });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. PRELOADER & PAGE LOAD HANDLING
     ========================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });

    // Fallback: hide preloader after 3 seconds in case load event takes too long
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }
    }, 3000);
  }

  /* ==========================================
     2. READING PROGRESS BAR & ACTIVE NAVBAR HIGHLIGHT
     ========================================== */
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.querySelector('.navbar-portfolio');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  // 2.1 Highlight active link based on current filename
  const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentFilename || 
        (currentFilename === '' && linkHref === 'index.html') ||
        (currentFilename === 'index.html' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 2.2 Update Reading Progress Bar
    if (scrollProgress && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    // 2.3 Sticky Navbar styling
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run on page load to set correct initial states
  handleScroll();

  // 2.4 Auto-collapse mobile navigation menu on link click
  const navCollapse = document.querySelector('.navbar-collapse');
  const toggler = document.querySelector('.navbar-toggler');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        toggler.click();
      }
    });
  });

  /* ==========================================
     3. TYPED.JS INITIALIZATION (Home Page Only)
     ========================================== */
  const typedTarget = document.querySelector('.hero-typed-text');
  if (typedTarget && typeof Typed !== 'undefined') {
    new Typed('.hero-typed-text', {
      strings: [
        'Software Engineering Undergraduate',
        'Java Developer',
        'Web Developer',
        'Problem Solver'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      cursorChar: '|'
    });
  }

  /* ==========================================
     4. AOS SCROLL ANIMATION LIBRARY INITIALIZATION
     ========================================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
      easing: 'ease-out-cubic',
      delay: 50
    });
  }

  /* ==========================================
     5. ANIMATED STATS COUNTERS (Home Page Only)
     ========================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * target);
        
        stat.textContent = currentCount + (stat.getAttribute('data-suffix') || '');
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          stat.textContent = target + (stat.getAttribute('data-suffix') || '');
        }
      };
      
      window.requestAnimationFrame(step);
    });
  };

  const statsSection = document.querySelector('.achievements-section');
  if (statsSection && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }

  /* ==========================================
     6. ANIMATED SKILL PROGRESS BARS (Skills Page Only)
     ========================================== */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.querySelector('#skills');
  
  if (skillsSection && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = targetWidth;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    skillsObserver.observe(skillsSection);
  }

  /* ==========================================
     7. CONTACT FORM VALIDATION & FEEDBACK TOAST (Contact Page Only)
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  const feedbackToast = document.getElementById('feedbackToast');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-glass-input');
      
      inputs.forEach(input => {
        const value = input.value.trim();
        const feedback = input.nextElementSibling;
        
        if (!value) {
          isValid = false;
          input.classList.add('is-invalid');
          if (feedback && feedback.classList.contains('invalid-feedback-custom')) {
            feedback.textContent = 'This field is required.';
            feedback.style.display = 'block';
          }
        } else if (input.type === 'email' && !validateEmail(value)) {
          isValid = false;
          input.classList.add('is-invalid');
          if (feedback && feedback.classList.contains('invalid-feedback-custom')) {
            feedback.textContent = 'Please enter a valid email address.';
            feedback.style.display = 'block';
          }
        } else {
          input.classList.remove('is-invalid');
          if (feedback && feedback.classList.contains('invalid-feedback-custom')) {
            feedback.style.display = 'none';
          }
        }
      });
      
      if (isValid) {
        const submitBtn = contactForm.querySelector('.btn-premium');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
        
        // -------------------------------------------------------------
        // Formspree Integration
        // 1. Create a free account at https://formspree.io
        // 2. Create a form and copy the "Form ID" (e.g. xknkyjgr)
        // 3. Replace the email/ID in the 'formspreeId' variable below:
        // -------------------------------------------------------------
        const formspreeId = "xnjkdenw"; // Replace with your Formspree Form ID (e.g. 'xknkyjgr')
        
        const formData = {
          name: document.getElementById('contactName').value.trim(),
          email: document.getElementById('contactEmail').value.trim(),
          _subject: document.getElementById('contactSubject').value.trim(),
          message: document.getElementById('contactMessage').value.trim()
        };

        const endpoint = formspreeId.includes('@') 
          ? `https://formspree.io/${formspreeId}` 
          : `https://formspree.io/f/${formspreeId}`;

        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(async (response) => {
          if (response.ok) {
            if (feedbackToast) {
              feedbackToast.classList.add('show');
              setTimeout(() => {
                feedbackToast.classList.remove('show');
              }, 4000);
            }
            contactForm.reset();
          } else {
            const data = await response.json();
            console.error("Formspree Error:", data);
            alert("Something went wrong: " + (data.error || "Failed to send message."));
          }
        })
        .catch(error => {
          console.error("Formspree Fetch Error:", error);
          alert("Submission failed. Please check your internet connection.");
        })
        .finally(() => {
          submitBtn.removeAttribute('disabled');
          submitBtn.innerHTML = originalBtnText;
        });
      }
    });

    const inputs = contactForm.querySelectorAll('.form-glass-input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.remove('is-invalid');
          const feedback = input.nextElementSibling;
          if (feedback && feedback.classList.contains('invalid-feedback-custom')) {
            feedback.style.display = 'none';
          }
        }
      });
    });
  }

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /* ==========================================
     8. SCROLL TO TOP BUTTON BEHAVIOR
     ========================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================
     9. THEME & BACKGROUND CUSTOMIZER HANDLERS
     ========================================== */
  
  // Presets definition
  const lightPresets = [
    { id: 'preset-default', name: 'Default Theme', gradient: '', bgHex: '#F8FAFC' },
    { id: 'preset-sunset', name: 'Sunset Rose', gradient: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 50%, #F9A8D4 100%)', bgHex: '#FFE4E6' },
    { id: 'preset-sky', name: 'Ocean Breeze', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)', bgHex: '#E0F2FE' },
    { id: 'preset-emerald', name: 'Emerald Mist', gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #6EE7B7 100%)', bgHex: '#D1FAE5' },
    { id: 'preset-aurora', name: 'Northern Light', gradient: 'linear-gradient(135deg, #EEF2F6 0%, #E0E7FF 50%, #F5F3FF 100%)', bgHex: '#EEF2F6' },
    { id: 'preset-cyber', name: 'Cyber Candy', gradient: 'linear-gradient(135deg, #FAE8FF 0%, #F5D0FE 50%, #F0ABFC 100%)', bgHex: '#FAE8FF' }
  ];

  const darkPresets = [
    { id: 'preset-slate-gradient', name: 'Midnight Slate (Grad)', gradient: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1F2937 100%)', bgHex: '#0B0F19' },
    { id: 'preset-slate', name: 'Midnight Slate', gradient: '', bgHex: '#0B0F19' },
    { id: 'preset-deep-forest', name: 'Emerald Forest', gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)', bgHex: '#022c22' },
    { id: 'preset-royal-purple', name: 'Royal Violet', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #4c1d95 100%)', bgHex: '#1e1b4b' },
    { id: 'preset-deep-space', name: 'Deep Space', gradient: 'linear-gradient(135deg, #030712 0%, #111827 50%, #1f2937 100%)', bgHex: '#030712' },
    { id: 'preset-cyberpunk', name: 'Neon Cyberpunk', gradient: 'linear-gradient(135deg, #1a0b2e 0%, #3b0764 50%, #083344 100%)', bgHex: '#1a0b2e' },
    { id: 'preset-crimson', name: 'Crimson Shadow', gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 50%, #78716c 100%)', bgHex: '#1c1917' }
  ];

  const injectCustomizer = () => {
    if (document.getElementById('customizerPanel')) return;

    const customizerHTML = `
      <div class="customizer-toggle" id="customizerToggleBtn" title="Theme Customizer">
        <i class="fas fa-palette"></i>
      </div>

      <div class="customizer-panel" id="customizerPanel">
        <div class="customizer-header">
          <h3 class="customizer-title">Theme Customizer</h3>
          <button class="customizer-close" id="customizerCloseBtn" aria-label="Close Customizer">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Base Theme -->
        <div class="customizer-section">
          <h4 class="customizer-section-title">Base Theme</h4>
          <div class="theme-switch-group">
            <button class="theme-switch-btn ${settings.theme === 'light' ? 'active' : ''}" id="themeLightBtn">
              <i class="fas fa-sun"></i> Light
            </button>
            <button class="theme-switch-btn ${settings.theme === 'dark' ? 'active' : ''}" id="themeDarkBtn">
              <i class="fas fa-moon"></i> Dark
            </button>
          </div>
        </div>
        
        <!-- Custom Solid Color -->
        <div class="customizer-section">
          <h4 class="customizer-section-title">Background Color</h4>
          <div class="customizer-row">
            <span class="customizer-label">Custom Solid</span>
            <div class="color-picker-wrapper">
              <span class="color-hex-display" id="bgHexDisplay">${settings.bgColor}</span>
              <input type="color" class="color-input-custom" id="bgColorInput" value="${settings.bgColor}">
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div class="customizer-section">
          <h4 class="customizer-section-title">Gradient Presets</h4>
          <div class="preset-grid" id="presetGrid"></div>
        </div>

        <!-- Glow Blobs -->
        <div class="customizer-section">
          <h4 class="customizer-section-title">Glow Circles</h4>
          <div class="customizer-row">
            <span class="customizer-label">Enable Glows</span>
            <label class="switch-custom">
              <input type="checkbox" id="glowToggleInput" ${settings.glowsEnabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
          <div id="glowColorControls" style="${settings.glowsEnabled ? '' : 'display: none;'}">
            <div class="customizer-row">
              <span class="customizer-label">Blob 1 (Top-Left)</span>
              <div class="color-picker-wrapper">
                <span class="color-hex-display" id="glow1HexDisplay">${settings.glow1}</span>
                <input type="color" class="color-input-custom" id="glow1ColorInput" value="${settings.glow1}">
              </div>
            </div>
            <div class="customizer-row">
              <span class="customizer-label">Blob 2 (Bottom-Right)</span>
              <div class="color-picker-wrapper">
                <span class="color-hex-display" id="glow2HexDisplay">${settings.glow2}</span>
                <input type="color" class="color-input-custom" id="glow2ColorInput" value="${settings.glow2}">
              </div>
            </div>
            <div class="customizer-row">
              <span class="customizer-label">Blob 3 (Center)</span>
              <div class="color-picker-wrapper">
                <span class="color-hex-display" id="glow3HexDisplay">${settings.glow3}</span>
                <input type="color" class="color-input-custom" id="glow3ColorInput" value="${settings.glow3}">
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="customizer-actions">
          <button class="btn-customizer-action btn-customizer-reset" id="customizerResetBtn">
            <i class="fas fa-undo-alt"></i> Reset All
          </button>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = customizerHTML;
    while (div.children.length > 0) {
      document.body.appendChild(div.children[0]);
    }
  };

  const renderPresets = () => {
    const grid = document.getElementById('presetGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const presets = settings.theme === 'dark' ? darkPresets : lightPresets;
    
    presets.forEach(p => {
      const btn = document.createElement('button');
      
      let isActive = false;
      if (settings.bgType === 'preset' && settings.presetId === p.id) {
        isActive = true;
      } else if (settings.bgType === 'solid' && p.id === 'preset-default' && settings.bgColor === '#F8FAFC' && settings.theme === 'light') {
        isActive = true;
      } else if (settings.bgType === 'solid' && p.id === 'preset-slate' && settings.bgColor === '#0B0F19' && settings.theme === 'dark') {
        isActive = true;
      }
      
      btn.className = `preset-btn ${isActive ? 'active' : ''}`;
      btn.dataset.id = p.id;
      btn.title = p.name;
      btn.style.background = p.gradient || p.bgHex;
      
      grid.appendChild(btn);
    });
  };

  const setupCustomizerEventListeners = () => {
    const panel = document.getElementById('customizerPanel');
    const toggleBtn = document.getElementById('customizerToggleBtn');
    const closeBtn = document.getElementById('customizerCloseBtn');
    
    if (!panel || !toggleBtn || !closeBtn) return;

    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('open');
    });
    
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (panel.classList.contains('open') && 
          !panel.contains(e.target) && 
          !toggleBtn.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    const lightBtn = document.getElementById('themeLightBtn');
    const darkBtn = document.getElementById('themeDarkBtn');
    const colorInput = document.getElementById('bgColorInput');
    const hexDisplay = document.getElementById('bgHexDisplay');
    
    const setBaseTheme = (theme) => {
      settings.theme = theme;
      if (theme === 'dark') {
        lightBtn.classList.remove('active');
        darkBtn.classList.add('active');
        settings.bgColor = '#0B0F19';
        settings.presetId = 'preset-slate';
        settings.bgType = 'solid';
        
        settings.glow1 = '#1e1b4b';
        settings.glow2 = '#311042';
        settings.glow3 = '#022c22';
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
        settings.bgColor = '#F8FAFC';
        settings.presetId = 'preset-default';
        settings.bgType = 'solid';
        
        settings.glow1 = '#E0E7FF';
        settings.glow2 = '#FFE4E6';
        settings.glow3 = '#E0F2FE';
      }
      
      colorInput.value = settings.bgColor;
      hexDisplay.textContent = settings.bgColor.toUpperCase();
      
      document.getElementById('glow1ColorInput').value = settings.glow1;
      document.getElementById('glow1HexDisplay').textContent = settings.glow1.toUpperCase();
      document.getElementById('glow2ColorInput').value = settings.glow2;
      document.getElementById('glow2HexDisplay').textContent = settings.glow2.toUpperCase();
      document.getElementById('glow3ColorInput').value = settings.glow3;
      document.getElementById('glow3HexDisplay').textContent = settings.glow3.toUpperCase();

      renderPresets();
      applyImmediateSettings(settings);
      localStorage.setItem('portfolio-theme-customizer', JSON.stringify(settings));
    };

    lightBtn.addEventListener('click', () => setBaseTheme('light'));
    darkBtn.addEventListener('click', () => setBaseTheme('dark'));

    colorInput.addEventListener('input', (e) => {
      const val = e.target.value;
      hexDisplay.textContent = val.toUpperCase();
      
      settings.bgType = 'solid';
      settings.bgColor = val;
      settings.presetId = '';
      
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      
      applyImmediateSettings(settings);
      localStorage.setItem('portfolio-theme-customizer', JSON.stringify(settings));
    });

    const grid = document.getElementById('presetGrid');
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-btn');
      if (!btn) return;
      
      const presetId = btn.dataset.id;
      const presets = settings.theme === 'dark' ? darkPresets : lightPresets;
      const preset = presets.find(p => p.id === presetId);
      
      if (preset) {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        settings.presetId = presetId;
        if (preset.gradient) {
          settings.bgType = 'preset';
          settings.bgGradient = preset.gradient;
        } else {
          settings.bgType = 'solid';
          settings.bgColor = preset.bgHex;
          colorInput.value = preset.bgHex;
          hexDisplay.textContent = preset.bgHex.toUpperCase();
        }
        
        applyImmediateSettings(settings);
        localStorage.setItem('portfolio-theme-customizer', JSON.stringify(settings));
      }
    });

    const glowToggle = document.getElementById('glowToggleInput');
    const glowControls = document.getElementById('glowColorControls');
    glowToggle.addEventListener('change', (e) => {
      settings.glowsEnabled = e.target.checked;
      glowControls.style.display = settings.glowsEnabled ? '' : 'none';
      
      applyImmediateSettings(settings);
      localStorage.setItem('portfolio-theme-customizer', JSON.stringify(settings));
    });

    const glow1Input = document.getElementById('glow1ColorInput');
    const glow2Input = document.getElementById('glow2ColorInput');
    const glow3Input = document.getElementById('glow3ColorInput');
    
    const glow1Hex = document.getElementById('glow1HexDisplay');
    const glow2Hex = document.getElementById('glow2HexDisplay');
    const glow3Hex = document.getElementById('glow3HexDisplay');

    const handleGlowColorChange = (inputEl, displayEl, key) => {
      inputEl.addEventListener('input', (e) => {
        const val = e.target.value;
        displayEl.textContent = val.toUpperCase();
        settings[key] = val;
        
        applyImmediateSettings(settings);
        localStorage.setItem('portfolio-theme-customizer', JSON.stringify(settings));
      });
    };
    
    handleGlowColorChange(glow1Input, glow1Hex, 'glow1');
    handleGlowColorChange(glow2Input, glow2Hex, 'glow2');
    handleGlowColorChange(glow3Input, glow3Hex, 'glow3');

    const resetBtn = document.getElementById('customizerResetBtn');
    resetBtn.addEventListener('click', () => {
      settings = {
        theme: 'dark',
        bgType: 'preset',
        bgColor: '#0B0F19',
        presetId: 'preset-slate-gradient',
        bgGradient: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1F2937 100%)',
        glowsEnabled: true,
        glow1: '#1e1b4b',
        glow2: '#311042',
        glow3: '#022c22'
      };
      
      lightBtn.classList.remove('active');
      darkBtn.classList.add('active');
      
      colorInput.value = settings.bgColor;
      hexDisplay.textContent = settings.bgColor.toUpperCase();
      
      glowToggle.checked = true;
      glowControls.style.display = '';
      
      glow1Input.value = '#1e1b4b';
      glow1Hex.textContent = '#1E1B4B';
      glow2Input.value = '#311042';
      glow2Hex.textContent = '#311042';
      glow3Input.value = '#022c22';
      glow3Hex.textContent = '#022C22';
      
      renderPresets();
      applyImmediateSettings(settings);
      localStorage.setItem('portfolio-theme-customizer', JSON.stringify(settings));
    });
  };

  // Run Customizer Injections
  if (document.body) {
    applyImmediateSettings(settings);
    injectCustomizer();
    renderPresets();
    setupCustomizerEventListeners();
  }

});
