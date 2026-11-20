/**
 * MEDICAL COLLEGE WEBSITE - CLIENT-SIDE SCRIPT
 * Pure Vanilla JavaScript (ES6+)
 * No external frameworks, zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Sticky Header & Back-To-Top Button
     ========================================================================== */
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header shadow toggle
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. Mobile Navigation Drawer
     ========================================================================== */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  const openMobileMenu = () => {
    if (mobileNavToggle) mobileNavToggle.classList.add('active');
    if (mobileNavDrawer) mobileNavDrawer.classList.add('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (mobileNavToggle) mobileNavToggle.classList.remove('active');
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer && mobileNavDrawer.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking a link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-list .nav-link, .mobile-drawer-cta a');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeLightbox();
      closeSuccessModal();
    }
  });

  /* ==========================================================================
     3. Active Navigation Highlighting
     ========================================================================== */
  const highlightCurrentNav = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link');

    allNavLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref) {
        const linkPage = linkHref.split('/').pop();
        if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
          link.classList.add('active');

          // If this link is inside a dropdown, also activate the parent toggle
          const parentDropdown = link.closest('.nav-item-dropdown');
          if (parentDropdown) {
            const toggle = parentDropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.classList.add('active');
          }
        } else {
          link.classList.remove('active');
        }
      }
    });
  };

  highlightCurrentNav();

  /* ==========================================================================
     4. Animated Statistics Counters
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1800; // 1.8 seconds
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutQuad
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });

    countersAnimated = true;
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsSection);
  } else {
    // Fallback if no observer
    animateCounters();
  }

  /* ==========================================================================
     5. FAQ Accordion Interaction
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items for single accordion behavior
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherPanel = otherItem.querySelector('.faq-answer-panel');
            if (otherPanel) {
              otherPanel.style.maxHeight = null;
            }
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answerPanel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
        }
      });
    }
  });

  /* ==========================================================================
     6. Campus Gallery Lightbox & Filter
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  const openLightbox = (imgSrc, captionText) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = captionText || 'Medical Campus Gallery Visual';
    if (lightboxCaption) lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title');
      const imgSrc = img ? img.getAttribute('src') : '';
      const caption = title ? title.textContent : '';
      if (imgSrc) {
        openLightbox(imgSrc, caption);
      }
    });
  });

  // Gallery category filtering
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter') || 'all';

        galleryItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     7. Admission Enquiry Form Validation & Submission
     ========================================================================== */
  const admissionForm = document.getElementById('admissionEnquiryForm');
  const successModal = document.getElementById('successModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

  const closeSuccessModal = () => {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeSuccessModalBtn) {
    closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  if (admissionForm) {
    const validateField = (input, validator, errorMsgId, customMsg) => {
      const errorEl = document.getElementById(errorMsgId);
      const val = input.value.trim();
      const isValid = validator(val);

      if (!isValid) {
        input.classList.add('error');
        if (errorEl) {
          if (customMsg) errorEl.textContent = customMsg;
          errorEl.classList.add('visible');
        }
        return false;
      } else {
        input.classList.remove('error');
        if (errorEl) {
          errorEl.classList.remove('visible');
        }
        return true;
      }
    };

    // Indian Mobile regex: 10 digits starting with 6, 7, 8, or 9
    const isValidIndianMobile = (phone) => {
      const cleaned = phone.replace(/[\s\-\+]/g, '');
      const tenDigit = cleaned.length === 12 && cleaned.startsWith('91') ? cleaned.slice(2) : cleaned;
      return /^[6-9]\d{9}$/.test(tenDigit);
    };

    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isNotEmpty = (val) => val.length >= 2;

    // Attach real-time input listeners
    const nameInput = document.getElementById('fullName');
    const mobileInput = document.getElementById('mobileNumber');
    const emailInput = document.getElementById('emailAddress');
    const cityInput = document.getElementById('city');
    const programSelect = document.getElementById('preferredProgram');
    const qualificationSelect = document.getElementById('academicQualification');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        validateField(nameInput, isNotEmpty, 'nameError', 'Please enter your full name (minimum 2 characters).');
      });
    }

    if (mobileInput) {
      mobileInput.addEventListener('input', () => {
        validateField(mobileInput, isValidIndianMobile, 'mobileError', 'Please enter a valid 10-digit Indian mobile number (starts with 6-9).');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        validateField(emailInput, isValidEmail, 'emailError', 'Please enter a valid email address.');
      });
    }

    if (cityInput) {
      cityInput.addEventListener('input', () => {
        validateField(cityInput, isNotEmpty, 'cityError', 'Please enter your current city.');
      });
    }

    if (programSelect) {
      programSelect.addEventListener('change', () => {
        validateField(programSelect, (val) => val !== '', 'programError', 'Please select a preferred medical program.');
      });
    }

    if (qualificationSelect) {
      qualificationSelect.addEventListener('change', () => {
        validateField(qualificationSelect, (val) => val !== '', 'qualificationError', 'Please select your current qualification.');
      });
    }

    // Submit handler
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;

      if (nameInput && !validateField(nameInput, isNotEmpty, 'nameError', 'Please enter your full name.')) {
        isFormValid = false;
      }

      if (mobileInput && !validateField(mobileInput, isValidIndianMobile, 'mobileError', 'Please enter a valid 10-digit Indian mobile number.')) {
        isFormValid = false;
      }

      if (emailInput && !validateField(emailInput, isValidEmail, 'emailError', 'Please enter a valid email address.')) {
        isFormValid = false;
      }

      if (cityInput && !validateField(cityInput, isNotEmpty, 'cityError', 'Please enter your city.')) {
        isFormValid = false;
      }

      if (qualificationSelect && !validateField(qualificationSelect, (val) => val !== '', 'qualificationError', 'Please select your current qualification.')) {
        isFormValid = false;
      }

      if (programSelect && !validateField(programSelect, (val) => val !== '', 'programError', 'Please select a preferred program.')) {
        isFormValid = false;
      }

      if (isFormValid) {
        // Show demo success popup
        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        // Reset form fields
        admissionForm.reset();

        // Clear any leftover error states
        document.querySelectorAll('.field-error-msg').forEach((el) => el.classList.remove('visible'));
        document.querySelectorAll('.form-input, .form-select').forEach((el) => el.classList.remove('error'));
      }
    });
  }

  /* ==========================================================================
     8. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     9. Image Fallback Graceful Handling
     ========================================================================== */
  const allImages = document.querySelectorAll('img');
  allImages.forEach((img) => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      if (this.classList.contains('faculty-photo')) return;
      const parent = this.parentElement;
      if (parent && !parent.querySelector('.img-fallback-box')) {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback-box';
        fallback.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <span class="img-fallback-label">Demonstration Medical Visual</span>
        `;
        parent.appendChild(fallback);
      }
    });
  });
});
