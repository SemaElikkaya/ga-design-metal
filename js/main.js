// === Navbar Scroll ile Arka Plan Değiştirme ===
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav-menu");

  if (window.scrollY > 50) {
    nav.classList.add("scrolled"); // Scroll olunca arka plan ekle
  } else {
    nav.classList.remove("scrolled"); // En üstteyken kaldır
  }

  // Sayfa başındayken aktif linkleri sıfırla
  if (window.scrollY < 50) {
    document.querySelectorAll(".nav-links a").forEach(link =>
      link.classList.remove("active")
    );
  }
});

// === Aktif Link Takibi - Intersection Observer ===
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === "hero-section") {
          navLinks.forEach(link => link.classList.remove("active"));
        } else {
          navLinks.forEach(link => link.classList.remove("active"));
          const activeLink = [...navLinks].find(
            link => link.getAttribute("href").substring(1) === entry.target.id
          );
          if (activeLink) activeLink.classList.add("active");
        }
      }
    });
  },
  {
    threshold: 0.5 // Görünürlüğün %50'si ile tetiklenir
  }
);

sections.forEach(section => observer.observe(section));

// === Logo Tıklanınca Aktif Linkleri Sıfırla ===
const logoLink = document.querySelector(".logo-link");
if (logoLink) {
  logoLink.addEventListener("click", () => {
    navLinks.forEach(link => link.classList.remove("active"));
  });
}

// === Hero Slider ===
const slidesWrapper = document.querySelector(".slides-wrapper");
const slides = document.querySelectorAll(".slide");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

let currentIndex = 0;
let isTransitioning = false;

function showSlide(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  currentIndex = index;
  isTransitioning = true;

  slidesWrapper.style.transform = `translateX(-${index * 100}%)`;

  slides.forEach((slide, i) => {
    const isActive = i === index;
    slide.classList.toggle("active", isActive);

    const overlay = slide.querySelector(".slider-overlay");
    if (overlay) {
      overlay.classList.remove("animate");
      if (isActive) {
        void overlay.offsetWidth;
        overlay.classList.add("animate");
      }
    }
  });

  // Geçiş tamamlandıktan sonra geçişi aç
  setTimeout(() => {
    isTransitioning = false;
  }, 600); // CSS geçiş süresi ile eşleşmeli
}

function goToPreviousSlide() {
  if (!isTransitioning) {
    showSlide(currentIndex - 1);
  }
}

function goToNextSlide() {
  if (!isTransitioning) {
    showSlide(currentIndex + 1);
  }
}

leftArrow.addEventListener("click", goToPreviousSlide);
rightArrow.addEventListener("click", goToNextSlide);

// Otomatik kaydırma (her 6 saniyede bir)
// setInterval(() => {
//   if (!isTransitioning) {
//     showSlide(currentIndex + 1);
//   }
// }, 8000);

// İlk slaytı göster
showSlide(currentIndex);

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger'); // wrapper
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('#navLinks a');

  // Hamburger'a tıklayınca menü aç/kapa ve border aktifliği değiştir
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
  });

  // Menüde bir linke tıklanırsa menü kapanır ve active class kalkar
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
    });
  });

  // Sayfanın boş bir yerine tıklanırsa menü kapanır ve active class kalkar
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });
});




