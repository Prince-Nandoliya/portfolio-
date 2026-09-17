/* ==========================================================================
   Prince Nandoliya | Portfolio JavaScript
   Features:
   1. Sticky / scrolled navbar
   2. Mobile navbar close on link click
   3. Smooth scrolling
   4. Active navbar link while scrolling
   5. Scroll reveal animations
   6. Typing animation
   7. Back-to-top button
   8. Contact form validation
   9. Success / error messages
   10. Current year in footer
   ========================================================================== */

/* ----------------------------------------------------------
   1 & 7. Sticky navbar + Back-to-top visibility
   ---------------------------------------------------------- */
const mainNav = document.getElementById('mainNav');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    // Darken navbar background after scrolling a bit
    if (mainNav) {
        mainNav.classList.toggle('scrolled', window.scrollY > 50);
    }

    // Show back-to-top button after scrolling down
    if (backToTop) {
        backToTop.classList.toggle('show', window.scrollY > 400);
    }
});

/* ----------------------------------------------------------
   2. Close the mobile navbar when a link is clicked
   ---------------------------------------------------------- */
const navCollapse = document.getElementById('navbarNav');
const navLinks = document.querySelectorAll('#navbarNav .nav-link');

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        if (navCollapse && navCollapse.classList.contains('show')) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
            collapse.hide();
        }
    });
});

/* ----------------------------------------------------------
   3. Smooth scrolling with navbar offset
   ---------------------------------------------------------- */
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');

        // Ignore plain "#" links
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();

        // Scroll with an offset so the fixed navbar doesn't cover the heading
        const navHeight = mainNav ? mainNav.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    });
});

/* ----------------------------------------------------------
   4. Highlight the active navbar link while scrolling
   ---------------------------------------------------------- */
const sections = document.querySelectorAll('section[id], header[id]');
const scrollLinks = document.querySelectorAll('#navbarNav .nav-link');

window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = 'home';

    sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
            currentId = section.id;
        }
    });

    scrollLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + currentId);
    });
});

/* ----------------------------------------------------------
   5. Scroll reveal animations using IntersectionObserver
   ---------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing after it reveals once
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});

/* ----------------------------------------------------------
   6. Typing animation for the hero role
   ---------------------------------------------------------- */
const typedElement = document.getElementById('typed-text');
const roles = ['Full Stack Developer', 'Web Developer', 'Node.js Developer'];

if (typedElement) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeWriter() {
        const currentRole = roles[roleIndex];

        if (deleting) {
            charIndex--;
            typedElement.textContent = currentRole.substring(0, charIndex);
        } else {
            charIndex++;
            typedElement.textContent = currentRole.substring(0, charIndex);
        }

        let delay = deleting ? 45 : 90;

        if (!deleting && charIndex === currentRole.length) {
            // Finished typing a word: pause, then delete
            delay = 1800;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            // Finished deleting: move to next role
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(typeWriter, delay);
    }

    // Start the animation (skip if the user prefers reduced motion)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        typedElement.textContent = roles[0];
    } else {
        typeWriter();
    }
}

/* ----------------------------------------------------------
   7. Back-to-top button click handler
   ---------------------------------------------------------- */
if (backToTop) {
    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ----------------------------------------------------------
   8 & 9. Contact form validation + messages
   ---------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formAlert = document.getElementById('formAlert');

    // Helper: check one field and toggle the "invalid" state
    function validateField(input, isValid) {
        input.classList.toggle('is-invalid', !isValid);
        return isValid;
    }

    // Clear the error state as soon as the user starts typing again
    [nameInput, emailInput, messageInput].forEach(function (input) {
        input.addEventListener('input', function () {
            input.classList.remove('is-invalid');
        });
    });

    // Helper: show a success or error alert box
    function showAlert(type, message) {
        formAlert.classList.remove('d-none', 'alert-success', 'alert-danger');
        formAlert.classList.add('alert-' + type);
        formAlert.textContent = message;
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Basic validation rules
        const nameValid = nameInput.value.trim().length >= 2;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
        const messageValid = messageInput.value.trim().length >= 10;

        const formValid = validateField(nameInput, nameValid) &
            validateField(emailInput, emailValid) &
            validateField(messageInput, messageValid);

        if (!formValid) {
            showAlert('danger', 'Please fix the highlighted fields and try again.');
            return;
        }

        // Valid submission: this demo just shows a success message.
        // Connect this to a backend / form service (e.g. Formspree) later.
        showAlert('success', 'Thank you! Your message has been sent successfully. I will get back to you soon.');

        contactForm.reset();
    });
}

/* ----------------------------------------------------------
   10. Footer current year
   ---------------------------------------------------------- */
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}