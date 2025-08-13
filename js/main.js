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
// const navLinks = document.querySelectorAll(".nav-links a");

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
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('#navLinks a');
  const sections = [];

  // Menü linklerine karşılık gelen bölümleri alıyoruz
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      sections.push({
        id: link.getAttribute('href'),
        section: section
      });
    }
  });

  // Hamburger menü aç/kapa
  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinksContainer.classList.toggle('show');
    hamburger.classList.toggle('active');
  });

  // Menüdeki linklere tıklanınca menü kapanır ve aktif link güncellenir
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('show');
      hamburger.classList.remove('active');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Menü dışına tıklanınca menü kapanır
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
      navLinksContainer.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });

  // Scroll spy: scroll pozisyonuna göre aktif linki güncelle
  window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY + 400; // Navbar yüksekliği kadar offset

    for (let i = sections.length - 1; i >= 0; i--) {
      const secTop = sections[i].section.offsetTop;
      console.log(secTop);

      if (scrollPosition >= secTop) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`a[href="${sections[i].id}"]`);
        if (activeLink) activeLink.classList.add('active');
        break;
      }
    }
  });
});

// === Galeri Lightbox + Oklarla Geçiş ===
const items = Array.from(document.querySelectorAll('.gallery-item-wrapper'));
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close');
const leftBtn = document.querySelector('.lightbox-arrow.left');
const rightBtn = document.querySelector('.lightbox-arrow.right');

let currentMediaIndex = -1;

function getVisibleItems() {
  return items.filter(item => {
    if (item.style.display === 'none') return false;
    // Eğer filtre "all" ise sadece img içerenleri al
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    if (!activeFilterBtn) return true;
    const filter = activeFilterBtn.getAttribute('data-filter');

    const media = item.querySelector('.gallery-item');

    if (filter === 'all' && media.tagName !== 'IMG') {
      return false;
    }
    // Diğer filtrelerde normal davranış
    return true;
  });
}

let visibleItems = getVisibleItems();

function updateLightbox(index) {
  currentMediaIndex = index;
  lightboxContent.innerHTML = "";

  const item = visibleItems[index];
  if (!item) return;

  const media = item.querySelector('.gallery-item');

  if (media.tagName === "IMG") {
    const img = document.createElement("img");
    img.src = media.src;
    lightboxContent.appendChild(img);
  } else if (media.tagName === "VIDEO") {
    const source = media.querySelector("source");
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
  rightBtn.classList.toggle('hidden', index === visibleItems.length - 1);
}

// Wrapperlar için tıklama event'i:
items.forEach((item, i) => {
  item.addEventListener('click', () => {
    visibleItems = getVisibleItems(); // o an görünür olanları al
    const visibleIndex = visibleItems.indexOf(item);

    if (visibleIndex === -1) return;

    lightbox.classList.remove('hidden');
    updateLightbox(visibleIndex);
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
  if (currentMediaIndex < visibleItems.length - 1) {
    updateLightbox(currentMediaIndex + 1);
  }
});

visibleItems = getVisibleItems();

// === Filtreleme ve Slider ===
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item-wrapper'); // sadece wrapper'lar
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

  // Başlangıçta filtre butonları gizli
  filterButtons.classList.remove('visible');

  galleryItems.forEach(item => {
    const media = item.querySelector('.gallery-item');
    if (media && media.tagName === 'IMG') {
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
      const media = item.querySelector('.gallery-item');
      const cat = item.getAttribute('data-category');

      if (filter === 'all') {
        // sadece img'ler
        if (media && media.tagName === 'IMG') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      } else if (filter === 'video') {
        if (media && media.tagName === 'VIDEO') {
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

const navbarHeight = 74.5; // navbar yüksekliği

let galleryVisible = false;
let contactVisible = false;

// function updateButtonVisibility() {
//   if (galleryVisible && !contactVisible) {
//     filterBtnsContainer.classList.add('visible');
//   } else {
//     filterBtnsContainer.classList.remove('visible');
//   }
// }
// silmelisin

// const galleryObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     galleryVisible = entry.isIntersecting;
//     updateButtonVisibility();
//   });
// }, {
//   root: null,
//   rootMargin: `-${navbarHeight}px 0px 0px 0px`,
//   threshold: 0.1,
// });

// const contactObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     contactVisible = entry.isIntersecting;
//     updateButtonVisibility();
//   });
// }, {
//   root: null,
//   threshold: 0.1,
// });

// if (gallerySection) galleryObserver.observe(gallerySection);
// if (contactSection) contactObserver.observe(contactSection);

window.addEventListener('resize', () => {
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) moveSlider(activeBtn);
});


// === "Daha Fazla" ve "Daha Az" Butonları ===
const showMoreBtn = document.getElementById('show-more-btn');
const showLessBtn = document.getElementById('show-less-btn');
const filterButtons = document.getElementById('filter-buttons');
const descriptionText = document.querySelector('.gallery-description');

showMoreBtn.addEventListener('click', () => {
  const hiddenItems = document.querySelectorAll('.gallery-item-wrapper.hidden');
  hiddenItems.forEach(item => {
    item.classList.remove('hidden'); // Tümünü kaldır — video dahil
  });

  filterButtons.classList.add('visible'); // SADECE burada görünür

  if (descriptionText) {
    descriptionText.textContent = 'Daha az görmek için butona tıklayın.';
  }

  // 'Tümü' butonunu aktif hale getir ve slider'ı kaydır
  filterBtns.forEach(btn => btn.classList.remove('active'));
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
    moveSlider(allBtn);
  }

  // 'Tümü' filtre davranışı (videolar hariç göster)
  galleryItems.forEach(item => {
    const media = item.querySelector('.gallery-item');
    if (media && media.tagName === 'IMG') {
      item.style.display = 'block';
    } else {
      item.style.display = 'none'; // videoları filtrelemede gizli tut
    }
  });

  showMoreBtn.style.display = 'none';
  showLessBtn.style.display = 'inline-block';
});

showLessBtn.addEventListener('click', () => {
  galleryItems.forEach((item, index) => {
    const media = item.querySelector('.gallery-item');
    if (index < 6 && media && media.tagName === 'IMG') {
      item.classList.remove('hidden');
      item.style.display = 'block';
    } else {
      item.classList.add('hidden');
      item.style.display = 'none';
    }
  });

  filterButtons.classList.remove('visible');

  // Tümü filtresini aktif hale getir
  filterBtns.forEach(btn => btn.classList.remove('active'));
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
    moveSlider(allBtn);
  }

  showMoreBtn.style.display = 'inline-block';
  showLessBtn.style.display = 'none';

  if (descriptionText) {
    descriptionText.textContent = 'Galeriye göz atmak için aşağıdaki butona tıklayın.';
  }
});

function resetGalleryView() {
  galleryItems.forEach((item, index) => {
    const media = item.querySelector('.gallery-item');
    if (index < 6 && media && media.tagName === 'IMG') {
      item.classList.remove('hidden');
      item.style.display = 'block';
    } else {
      item.classList.add('hidden');
      item.style.display = 'none';
    }
  });

  filterButtons.classList.remove('visible');
  showMoreBtn.style.display = 'inline-block';
  showLessBtn.style.display = 'none';

  if (descriptionText) {
    descriptionText.textContent = 'Galeriye göz atmak için aşağıdaki butona tıklayın.';
  }
}

// === Scroll ile Galeriden Çıkınca Her Şeyi Sıfırla ===
window.addEventListener('scroll', () => {
  if (!filterButtons.classList.contains('visible')) return;

  const rect = gallerySection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  if (!isInView) {
    resetGalleryView();
  }
});

// === Navbar Linklerine ve Logoya Tıklanınca Her Şeyi Sıfırla ===
const navLinksForFilterClose = document.querySelectorAll('nav a, .logo');
navLinksForFilterClose.forEach(link => {
  link.addEventListener('click', () => {
    if (filterButtons.classList.contains('visible')) {
      resetGalleryView();
    }
  });
});

new Swiper(".products-swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    1024: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    0: { slidesPerView: 1.2 }
  }
});
