document.addEventListener("DOMContentLoaded", () => {
  const circle = document.querySelector(".hero .circle");
  const circleWrap = document.querySelector(".circle-wrap");
  const term = document.querySelector(".hero-lock .term");
  const preface = document.querySelector(".preface-dark");

  const LOAD_HOLD = 3400;
  const FLIP_DURATION = 2400;

  setTimeout(() => {
    const before = circle.getBoundingClientRect().top;
    document.body.classList.add("loaded");
    const after = circle.getBoundingClientRect().top;
    const delta = before - after;

    if (delta !== 0) {
      circleWrap.style.transition = "none";
      circleWrap.style.transform = `translateY(${delta}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circleWrap.style.transition = `transform ${FLIP_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          circleWrap.style.transform = "translateY(0)";
        });
      });
    }

    setTimeout(() => {
      requestAnimationFrame(() => {
        term.classList.add("visible");
        preface.classList.add("visible");
      });
    }, 1400);

    setTimeout(() => {
      document.body.classList.add("settled");
    }, FLIP_DURATION);
  }, LOAD_HOLD);

  const reveals = document.querySelectorAll(".reveal:not(.hero)");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));
});
