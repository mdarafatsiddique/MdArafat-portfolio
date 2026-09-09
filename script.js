(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-link')];
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
    if (!navMenu || window.innerWidth > 760) {
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
    if (!menuToggle || !navMenu || window.innerWidth > 760) {
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

    const roles = ['Front-End Developer', 'Website Designer', 'Landing Page Designer', 'Freelance Developer'];
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

  const setupContactDetails = () => {
    const details = document.querySelector('.contact-details');
    if (!details) {
      return;
    }

    const updateDetail = (selector, href, value) => {
      const detail = details.querySelector(selector);
      const valueContainer = detail?.querySelector('span');
      if (!detail || !valueContainer) {
        return;
      }

      detail.href = href;
      const valueNode = valueContainer.lastChild;
      if (valueNode) {
        valueNode.nodeValue = value;
      }
    };

    updateDetail('a[href^="mailto:"]', 'mailto:arafat848141@gmail.com', 'arafat848141@gmail.com');
    updateDetail('a[href^="tel:"]', 'tel:+8801927835212', '01927835212');

    const locationValue = details.querySelector(':scope > div span');
    const locationText = locationValue?.lastChild;
    if (locationText) {
      locationText.nodeValue = 'Dhaka, Bangladesh';
    }
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
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  setHeaderState();
  setActiveNavigation('home');
  setupSectionObserver();
  setupTypingAnimation();
  setupScrollReveal();
  setupProjectFilters();
  setupContactForm();
  setupContactDetails();
  setupCopyright();
  setupSocialIcons();
  setupConfirmedSocialLinks();
})();
