// === Navbar Scroll ile Arka Plan Değiştirme ===
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav-menu");

  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }

  if (window.scrollY < 50) {
    document.querySelectorAll(".nav-links a").forEach(link =>
      link.classList.remove("active")
    );
  }
});

// === Aktif Link Takibi ===
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(entries => {
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
}, { threshold: 0.5 });

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

  setTimeout(() => {
    isTransitioning = false;
  }, 600);
}

function goToPreviousSlide() {
  if (!isTransitioning) showSlide(currentIndex - 1);
}

function goToNextSlide() {
  if (!isTransitioning) showSlide(currentIndex + 1);
}

leftArrow?.addEventListener("click", goToPreviousSlide);
rightArrow?.addEventListener("click", goToNextSlide);
showSlide(currentIndex);

// === Hamburger Menü ===
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('#navLinks a');

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
  });

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });
});

// === Galeri Lightbox + Oklarla Geçiş ===
const items = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close');
const leftBtn = document.querySelector('.lightbox-arrow.left');
const rightBtn = document.querySelector('.lightbox-arrow.right');

let currentMediaIndex = -1;

function updateLightbox(index) {
  currentMediaIndex = index;
  lightboxContent.innerHTML = "";

  const item = items[index];

  if (item.tagName === "IMG") {
    const img = document.createElement("img");
    img.src = item.src;
    lightboxContent.appendChild(img);
  } else if (item.tagName === "VIDEO") {
    const source = item.querySelector("source");
    if (source) {
      const video = document.createElement("video");
      video.src = source.src;
      video.controls = true;
      video.autoplay = true;
      video.muted = false;
      video.playsInline = true;
      lightboxContent.appendChild(video);
    }
  }

  leftBtn.classList.toggle('hidden', index === 0);
  rightBtn.classList.toggle('hidden', index === items.length - 1);
}

items.forEach((item, i) => {
  item.addEventListener('click', () => {
    lightbox.classList.remove('hidden');
    updateLightbox(i);
  });
});

closeBtn?.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  lightboxContent.innerHTML = "";
});

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.add('hidden');
    lightboxContent.innerHTML = "";
  }
});

leftBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentMediaIndex > 0) {
    updateLightbox(currentMediaIndex - 1);
  }
});

rightBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentMediaIndex < items.length - 1) {
    updateLightbox(currentMediaIndex + 1);
  }
});

// === Filtreleme ve Slider ===
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const slider = document.querySelector('.filter-slider');

function moveSlider(button) {
  const rect = button.getBoundingClientRect();
  const parentRect = button.parentElement.getBoundingClientRect();
  slider.style.left = (rect.left - parentRect.left) + 'px';
  slider.style.width = rect.width + 'px';
}

// Sayfa yüklendiğinde Tümü filtresi aktif, sadece görseller gösterilir
window.addEventListener('DOMContentLoaded', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
    moveSlider(allBtn);
  }

  galleryItems.forEach(item => {
    if (item.tagName === 'IMG') {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    moveSlider(btn);

    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-category');

      if (filter === 'all') {
        if (item.tagName === 'IMG') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      } else if (filter === 'video') {
        if (item.tagName === 'VIDEO') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      } else {
        if (cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      }
    });
  });
});

// === Buton Görünürlüğü: Galeri & İletişim Section ===
const filterBtnsContainer = document.querySelector('.gallery-filters');
const gallerySection = document.getElementById('gallery');
const contactSection = document.getElementById('contact');

const navbarHeight = 74.5; // navbar yüksekliğin

let galleryVisible = false;
let contactVisible = false;

function updateButtonVisibility() {
  if (galleryVisible && !contactVisible) {
    filterBtnsContainer.classList.add('visible');
  } else {
    filterBtnsContainer.classList.remove('visible');
  }
}

const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    galleryVisible = entry.isIntersecting;
    updateButtonVisibility();
  });
}, {
  root: null,
  rootMargin: `-${navbarHeight}px 0px 0px 0px`,
  threshold: 0.1,
});

const contactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    contactVisible = entry.isIntersecting;
    updateButtonVisibility();
  });
}, {
  root: null,
  threshold: 0.1,
});

if (gallerySection) galleryObserver.observe(gallerySection);
if (contactSection) contactObserver.observe(contactSection);
