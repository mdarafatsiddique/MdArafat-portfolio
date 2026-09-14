(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const mobileBreakpoint = 768;
  const sections = [...document.querySelectorAll('main section[id]')];
  const projectGrid = document.querySelector('.projects-grid');
  const contactForm = document.querySelector('.contact-form');
  const footerCopyright = document.querySelector('.footer-inner p');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobileViewport = () => window.innerWidth <= mobileBreakpoint;

  const setHeaderState = () => {
    if (!header) {
      return;
    }

    const isScrolled = window.scrollY > 24;
    header.classList.toggle('is-scrolled', isScrolled);
  };

  const setMenuState = (isOpen) => {
    if (!menuToggle || !navMenu) {
      return;
    }

    menuToggle.classList.toggle('is-open', isOpen);
    navMenu.classList.toggle('is-open', isOpen);
    body.classList.toggle('is-menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    const wasOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
    setMenuState(false);

    if (returnFocus && wasOpen && isMobileViewport()) {
      menuToggle.focus();
    }
  };

  const toggleMenu = () => {
    if (!menuToggle || !navMenu || !isMobileViewport()) {
      return;
    }

    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
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

  const setupScrollReveal = () => {
    const revealTargets = [...document.querySelectorAll('.hero-copy, .hero-visual, .section-heading, .about-copy, .principle, .service-card, .skill-item, .project-card, .contact-copy, .contact-form, .footer-inner')];
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

  const getProjectCategory = (project) => {
    if (project.classList.contains('project-portfolio')) {
      return 'portfolio';
    }
    if (project.classList.contains('project-coffee') || project.classList.contains('project-shop')) {
      return 'ecommerce';
    }
    return 'business';
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
    filterWrap.style.display = 'flex';
    filterWrap.style.flexWrap = 'wrap';
    filterWrap.style.justifyContent = 'center';
    filterWrap.style.gap = '0.55rem';
    filterWrap.style.margin = '0 auto 2rem';

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
      button.style.padding = '0.6rem 1rem';
      button.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      button.style.borderRadius = '999px';
      button.style.color = index === 0 ? '#ffffff' : '#9ba3b9';
      button.style.background = index === 0 ? 'linear-gradient(120deg, #8f65ff, #5d61e9)' : 'rgba(255, 255, 255, 0.035)';
      button.style.font = '600 0.72rem/1.2 "DM Sans", sans-serif';
      button.style.cursor = 'pointer';
      button.style.transition = 'color 180ms ease, background 180ms ease, border-color 180ms ease, transform 180ms ease';

      button.addEventListener('mouseenter', () => {
        if (button.getAttribute('aria-pressed') !== 'true') {
          button.style.color = '#ffffff';
          button.style.borderColor = 'rgba(178, 141, 255, 0.45)';
          button.style.transform = 'translateY(-2px)';
        }
      });
      button.addEventListener('mouseleave', () => {
        if (button.getAttribute('aria-pressed') !== 'true') {
          button.style.color = '#9ba3b9';
          button.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          button.style.transform = '';
        }
      });
      button.addEventListener('click', () => {
        [...filterWrap.querySelectorAll('.project-filter')].forEach((filterButton) => {
          const isSelected = filterButton === button;
          filterButton.setAttribute('aria-pressed', String(isSelected));
          filterButton.style.color = isSelected ? '#ffffff' : '#9ba3b9';
          filterButton.style.background = isSelected ? 'linear-gradient(120deg, #8f65ff, #5d61e9)' : 'rgba(255, 255, 255, 0.035)';
          filterButton.style.borderColor = isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.1)';
          filterButton.style.transform = '';
        });

        projects.forEach((project) => {
          const shouldShow = value === 'all' || getProjectCategory(project) === value;
          project.hidden = !shouldShow;
          project.setAttribute('aria-hidden', String(!shouldShow));
        });
      });

      filterWrap.appendChild(button);
    });

    projectGrid.parentElement.insertBefore(filterWrap, projectGrid);
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

  const setupConfirmedSocialLinks = () => {
    const profiles = {
      'fa-github': ['https://github.com/mdarafatsiddique', 'GitHub Profile'],
      'fa-facebook-f': ['https://www.facebook.com/arafat.siddique02', 'Facebook Profile'],
      'fa-instagram': ['https://www.instagram.com/mdarafatsiddiqueai/', 'Instagram Profile'],
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
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu({ returnFocus: true });
    }
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', scrollToTarget));
  window.addEventListener('scroll', setHeaderState, { passive: true });
  window.addEventListener('resize', () => {
    if (!isMobileViewport()) {
      closeMenu({ returnFocus: false });
    }
  });

  setHeaderState();
  setActiveNavigation('home');
  setupSectionObserver();
  setupScrollReveal();
  setupProjectFilters();
  setupContactForm();
  setupCopyright();
  setupConfirmedSocialLinks();
})();
