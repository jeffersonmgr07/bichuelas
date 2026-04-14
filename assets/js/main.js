document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  initMobileMenu();
  initHeroSlider();
});

async function loadComponents() {
  const headerTarget = document.getElementById("header");
  const footerTarget = document.getElementById("footer");

  try {
    if (headerTarget) {
      const headerResponse = await fetch("./components/header/header.html");
      if (!headerResponse.ok) {
        throw new Error(`Error cargando header: ${headerResponse.status}`);
      }
      headerTarget.innerHTML = await headerResponse.text();
    }

    if (footerTarget) {
      const footerResponse = await fetch("./components/footer/footer.html");
      if (!footerResponse.ok) {
        throw new Error(`Error cargando footer: ${footerResponse.status}`);
      }
      footerTarget.innerHTML = await footerResponse.text();
    }
  } catch (error) {
    console.error("Error cargando componentes:", error);
  }
}

function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const userToggle = document.querySelector(".user-toggle");
  const userDropdown = document.querySelector(".mobile-user-dropdown");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      if (userDropdown) userDropdown.classList.remove("open");
    });
  }

  if (userToggle && userDropdown) {
    userToggle.addEventListener("click", () => {
      userDropdown.classList.toggle("open");
      if (mobileMenu) mobileMenu.classList.remove("open");
    });
  }
}

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".hero-arrow.prev");
  const nextBtn = document.querySelector(".hero-arrow.next");

  if (!slides.length) return;

  let current = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  function startAutoSlide() {
    interval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(interval);
    startAutoSlide();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });
  });

  showSlide(0);
  startAutoSlide();
}
