(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const mobileBreakpoint = 768;
  const sections = [...document.querySelectorAll('main section[id]')];
  const heroRole = document.querySelector('.hero-role');
  const projectGrid = document.querySelector('.projects-grid');
  const contactForm = document.querySelector('.contact-form');
  const footerCopyright = document.querySelector('.footer-inner p');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setHeaderState = () => {
    if (!header) {
      return;
    }

    const isScrolled = window.scrollY > 24;
    header.classList.toggle('is-scrolled', isScrolled);
    header.style.background = isScrolled ? 'rgba(8, 11, 20, 0.9)' : 'rgba(8, 11, 20, 0.58)';
    header.style.borderBottomColor = isScrolled ? 'rgba(178, 141, 255, 0.18)' : 'rgba(255, 255, 255, 0.07)';
    header.style.boxShadow = isScrolled ? '0 10px 35px rgba(0, 0, 0, 0.2)' : 'none';
  };

  const setMenuButtonState = (isOpen) => {
    if (!menuToggle) {
      return;
    }

    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

    const bars = [...menuToggle.querySelectorAll('span')];
    if (bars.length !== 3) {
      return;
    }

    bars[0].style.transform = isOpen ? 'translateY(6px) rotate(45deg)' : '';
    bars[1].style.opacity = isOpen ? '0' : '';
    bars[2].style.transform = isOpen ? 'translateY(-6px) rotate(-45deg)' : '';
  };

  const setMobileMenuStyles = (isOpen) => {
    if (!navMenu || window.innerWidth > mobileBreakpoint) {
      return;
    }

    navMenu.style.visibility = isOpen ? 'visible' : 'hidden';
    navMenu.style.opacity = isOpen ? '1' : '0';
    navMenu.style.transform = isOpen ? 'translateY(0)' : 'translateY(-8px)';
  };

  const closeMenu = () => {
    setMenuButtonState(false);
    setMobileMenuStyles(false);
    body.style.overflow = '';
  };

  const toggleMenu = () => {
    if (!menuToggle || !navMenu || window.innerWidth > mobileBreakpoint) {
      return;
    }

    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuButtonState(!isOpen);
    setMobileMenuStyles(!isOpen);
    body.style.overflow = isOpen ? '' : 'hidden';
  };

  const scrollToTarget = (event) => {
    const targetId = event.currentTarget.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) {
      return;
    }

    if (targetId === '#top') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      closeMenu();
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    closeMenu();
  };

  const setActiveNavigation = (activeId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const setupSectionObserver = () => {
    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) {
      return;
    }

    const visibleSections = new Map();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      const mostVisible = [...visibleSections.entries()].sort((first, second) => second[1] - first[1])[0];
      if (mostVisible) {
        setActiveNavigation(mostVisible[0]);
      }
    }, {
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0, 0.2, 0.5, 1]
    });

    sections.forEach((section) => sectionObserver.observe(section));
  };

  const setupTypingAnimation = () => {
    if (!heroRole) {
      return;
    }

    const roles = ['Web Designer | Landing Page Developer'];
    const typingText = document.createElement('span');
    typingText.className = 'typing-text';
    typingText.style.margin = '0';
    typingText.style.color = 'inherit';
    typingText.setAttribute('aria-live', 'polite');
    heroRole.replaceChildren(typingText);

    if (reducedMotion.matches) {
      typingText.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const typeNextCharacter = () => {
      const currentRole = roles[roleIndex];
      typingText.textContent = deleting
        ? currentRole.slice(0, Math.max(0, characterIndex - 1))
        : currentRole.slice(0, characterIndex + 1);
      characterIndex += deleting ? -1 : 1;

      let delay = deleting ? 42 : 78;
      if (!deleting && characterIndex === currentRole.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 380;
      }

      window.setTimeout(typeNextCharacter, delay);
    };

    typeNextCharacter();
  };

  const setupScrollReveal = () => {
    const revealTargets = [...document.querySelectorAll('.hero-copy, .hero-visual, .section-heading, .about-copy, .principle, .service-card, .skill-item, .project-card, .process-grid article, .contact-copy, .contact-form, .footer-inner')];
    if (!revealTargets.length) {
      return;
    }

    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
      .js-reveal { opacity: 0; transform: translateY(22px); transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1); }
      .js-reveal.is-visible { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) { .js-reveal { opacity: 1; transform: none; transition: none; } }
    `;
    document.head.appendChild(revealStyle);

    revealTargets.forEach((target, index) => {
      target.classList.add('js-reveal');
      target.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
    });

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealTargets.forEach((target) => revealObserver.observe(target));
  };

  const setupProjectFilters = () => {
    if (!projectGrid) {
      return;
    }

    const projects = [...projectGrid.querySelectorAll('.project-card')];
    if (!projects.length) {
      return;
    }

    const filterWrap = document.createElement('div');
    filterWrap.className = 'project-filters';
    filterWrap.setAttribute('aria-label', 'Filter projects by category');

    const filters = [
      ['all', 'All'],
      ['business', 'Business'],
      ['ecommerce', 'E-commerce'],
      ['portfolio', 'Portfolio']
    ];

    filters.forEach(([value, label], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-filter';
      button.textContent = label;
      button.dataset.filter = value;
      button.setAttribute('aria-pressed', String(index === 0));

      filterWrap.appendChild(button);
    });

    projectGrid.parentElement.insertBefore(filterWrap, projectGrid);
    const hideTimers = new Map();

    filterWrap.addEventListener('click', (event) => {
      const button = event.target.closest('.project-filter');
      if (!button) {
        return;
      }

      const selectedFilter = button.dataset.filter;
      filterWrap.querySelectorAll('.project-filter').forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle('is-active', isSelected);
        filterButton.setAttribute('aria-pressed', String(isSelected));
      });

      projects.forEach((project) => {
        const shouldShow = selectedFilter === 'all' || project.dataset.category === selectedFilter;
        const existingTimer = hideTimers.get(project);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
          hideTimers.delete(project);
        }

        project.setAttribute('aria-hidden', String(!shouldShow));

        if (shouldShow) {
          project.hidden = false;
          window.requestAnimationFrame(() => project.classList.remove('is-filtered-out'));
          return;
        }

        project.classList.add('is-filtered-out');
        hideTimers.set(project, window.setTimeout(() => {
          project.hidden = true;
          hideTimers.delete(project);
        }, 220));
      });
    });

    filterWrap.querySelector('[data-filter="all"]')?.classList.add('is-active');
  };

  const setupContactForm = () => {
    if (!contactForm) {
      return;
    }

    const emailInput = contactForm.querySelector('#email');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const statusMessage = document.createElement('p');
    statusMessage.className = 'form-status';
    statusMessage.setAttribute('role', 'status');
    statusMessage.setAttribute('aria-live', 'polite');
    statusMessage.style.margin = '0';
    statusMessage.style.color = '#76e6a7';
    statusMessage.style.fontSize = '0.78rem';
    contactForm.appendChild(statusMessage);

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      statusMessage.textContent = '';

      if (!contactForm.reportValidity()) {
        return;
      }

      if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailInput.value.trim())) {
        if (emailInput) {
          emailInput.setCustomValidity('Please enter a valid email address.');
          emailInput.reportValidity();
          emailInput.addEventListener('input', () => emailInput.setCustomValidity(''), { once: true });
        }
        return;
      }

      const formData = new FormData(contactForm);
      const recipient = 'arafat848141@gmail.com';
      const subject = encodeURIComponent(formData.get('subject')?.toString().trim() || 'New project enquiry');
      const bodyText = [
        `Name: ${formData.get('name')?.toString().trim() || ''}`,
        `Email: ${formData.get('email')?.toString().trim() || ''}`,
        '',
        formData.get('message')?.toString().trim() || ''
      ].join('\n');

      if (submitButton) {
        submitButton.disabled = true;
      }
      statusMessage.textContent = 'Opening your email app...';
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }, 1200);
    });
  };

  const setupCopyright = () => {
    if (footerCopyright) {
      footerCopyright.innerHTML = `&copy; ${new Date().getFullYear()} Md. Arafat Siddique. All rights reserved.`;
    }
  };

  const setupSocialIcons = () => {
    const fiverrIcon = document.querySelector('.social-profile-grid a[aria-label="Fiverr"] i');
    if (fiverrIcon) {
      fiverrIcon.classList.replace('fa-font-awesome', 'fa-fiverr');
    }
  };

  const setupConfirmedSocialLinks = () => {
    const profiles = {
      'fa-github': ['https://github.com/mdarafatsiddique', 'GitHub Profile'],
      'fa-facebook-f': ['https://www.facebook.com/arafat.siddique02', 'Facebook Profile'],
      'fa-instagram': ['https://www.instagram.com/arafat_sissique02/', 'Instagram Profile'],
      'fa-linkedin-in': ['https://www.linkedin.com/in/mdarafatsiddiquebd/', 'LinkedIn Profile']
    };

    document.querySelectorAll('.hero-socials a, .contact-socials a, .footer-socials a').forEach((link) => {
      const icon = link.querySelector('i');
      if (!icon) {
        return;
      }

      const profile = Object.entries(profiles).find(([iconClass]) => icon.classList.contains(iconClass));
      if (!profile) {
        return;
      }

      link.href = profile[1][0];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', profile[1][1]);
    });
  };

  menuToggle?.addEventListener('click', toggleMenu);
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', scrollToTarget));
  window.addEventListener('scroll', setHeaderState, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > mobileBreakpoint) {
      closeMenu();
    }
  });

  setHeaderState();
  setActiveNavigation('home');
  setupSectionObserver();
  setupScrollReveal();
  setupProjectFilters();
  setupContactForm();
  setupCopyright();
  setupSocialIcons();
  setupConfirmedSocialLinks();
})();
