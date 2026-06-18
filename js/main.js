const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 2 });

const nav = document.querySelector('nav');

lenis.on('scroll', ({ scroll }) => {
  nav?.classList.toggle('scrolled', scroll > 60);
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Hero scroll button
const scrollBtn = document.querySelector('.hero-scroll-arrow');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => lenis.scrollTo('#google-checkout', { offset: -80 }));
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 0.04, 0.25)}s`;
  observer.observe(el);
});

// Word marker highlight
document.querySelectorAll('mark.word-marker').forEach(mark => {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.8 }).observe(mark);
});

// Impact stat countup
document.querySelectorAll('.impact-stat-number').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  let started = false;
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        el.classList.add('counting');
        const duration = 1400;
        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + '%';
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.3 }).observe(el);
});

// Video player
document.querySelectorAll('.video-player').forEach(player => {
  const video = player.querySelector('video');
  player.addEventListener('click', () => {
    if (video.paused) { video.play(); player.classList.add('playing'); }
    else { video.pause(); player.classList.remove('playing'); }
  });
  video.addEventListener('ended', () => player.classList.remove('playing'));
});
