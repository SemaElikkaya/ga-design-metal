window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  history.replaceState(null, "", window.location.pathname); // hash'i temizle
});

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

const sections = document.querySelectorAll("section[id]");

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


const logoLink = document.querySelector(".logo-link");
if (logoLink) {
  logoLink.addEventListener("click", () => {
    navLinks.forEach(link => link.classList.remove("active"));
  });
}


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

let autoSlideInterval = setInterval(() => {
  if (!isTransitioning) {
    showSlide(currentIndex + 1);
  }
}, 3000);

[leftArrow, rightArrow].forEach(arrow => {
  arrow?.addEventListener("click", () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isTransitioning) {
        showSlide(currentIndex + 1);
      }
    }, 3000);
  });
});

let startX = 0;
let endX = 0;

slidesWrapper.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slidesWrapper.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

slidesWrapper.addEventListener("touchend", () => {
  if (startX && endX) {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPreviousSlide();
      }
    }
  }
  startX = 0;
  endX = 0;
});

function goToPreviousSlide() {
  if (!isTransitioning) showSlide(currentIndex - 1);
}

function goToNextSlide() {
  if (!isTransitioning) showSlide(currentIndex + 1);
}

leftArrow?.addEventListener("click", goToPreviousSlide);
rightArrow?.addEventListener("click", goToNextSlide);
showSlide(currentIndex);


document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('#navLinks a');
  const sections = [];
  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, "", window.location.pathname); // hash'i temizle
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(link => link.classList.remove('active'));
    });
  }

  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      sections.push({
        id: link.getAttribute('href'),
        section: section
      });
    }
  });


  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinksContainer.classList.toggle('show');
    hamburger.classList.toggle('active');
  });


  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('show');
      hamburger.classList.remove('active');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });


  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
      navLinksContainer.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });
  window.addEventListener("scroll", () => {
    const navLinksContainer = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinksContainer.classList.contains('show')) {
      navLinksContainer.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });

  window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY + 400;

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
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    if (!activeFilterBtn) return true;
    const filter = activeFilterBtn.getAttribute('data-filter');

    const media = item.querySelector('.gallery-item');

    if (filter === 'all' && media.tagName !== 'IMG') {
      return false;
    }
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
      video.muted = true;
      video.playsInline = true;
      lightboxContent.appendChild(video);
    }
  }

  leftBtn.classList.toggle('hidden', index === 0);
  rightBtn.classList.toggle('hidden', index === visibleItems.length - 1);
}


items.forEach((item, i) => {
  item.addEventListener('click', () => {
    visibleItems = getVisibleItems();
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


const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
const slider = document.querySelector('.filter-slider');

function moveSlider(button) {
  const rect = button.getBoundingClientRect();
  const parentRect = button.parentElement.getBoundingClientRect();
  slider.style.left = (rect.left - parentRect.left) + 'px';
  slider.style.width = rect.width + 'px';
}

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

const filterBtnsContainer = document.querySelector('.gallery-filters');
const gallerySection = document.getElementById('gallery');
const contactSection = document.getElementById('contact');

const navbarHeight = 74.5;

let galleryVisible = false;
let contactVisible = false;

window.addEventListener('resize', () => {
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) moveSlider(activeBtn);
});

const showMoreBtn = document.getElementById('show-more-btn');
const showLessBtn = document.getElementById('show-less-btn');
const filterButtons = document.getElementById('filter-buttons');
const descriptionText = document.querySelector('.gallery-description');

showMoreBtn.addEventListener('click', () => {
  const hiddenItems = document.querySelectorAll('.gallery-item-wrapper.hidden');
  hiddenItems.forEach(item => {
    item.classList.remove('hidden');
  });

  filterButtons.classList.add('visible');

  if (descriptionText) {
    descriptionText.textContent = 'Daha az görmek için butona tıklayın.';
  }


  filterBtns.forEach(btn => btn.classList.remove('active'));
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
    moveSlider(allBtn);
  }

  galleryItems.forEach(item => {
    const media = item.querySelector('.gallery-item');
    if (media && media.tagName === 'IMG') {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
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

window.addEventListener('scroll', () => {
  if (!filterButtons.classList.contains('visible')) return;

  const rect = gallerySection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  if (!isInView) {
    resetGalleryView();
  }
});

const navLinksForFilterClose = document.querySelectorAll('nav a, .logo');
navLinksForFilterClose.forEach(link => {
  link.addEventListener('click', () => {
    if (filterButtons.classList.contains('visible')) {
      resetGalleryView();
    }
  });
});

new Swiper(".products-swiper", {
  slidesPerView: "auto",
  spaceBetween: 16,
  centeredSlides: false,
  loop: false,
  // mobilde kenarda boşluk bırak
  breakpoints: {
    0: { slidesPerView: 1.1, spaceBetween: 12 },
    480: { slidesPerView: 1.3, spaceBetween: 14 },
    768: { slidesPerView: 2.5, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 20 }
  }
});

document.querySelectorAll(".fiyat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.getAttribute("data-product");
    const modal = document.getElementById("contactModal");
    modal.style.display = "flex";


    const instaBtn = document.getElementById("instaBtn");
    instaBtn.href = "https://www.instagram.com/ga_designmetal/";
    instaBtn.onclick = () => {
      closeContactModal();
    };

    const formBtn = document.getElementById("formBtn");
    formBtn.onclick = () => {
      const konuInput = document.querySelector("input[name='konu']");
      konuInput.value = `${product} hakkında bilgi almak istiyorum.`;
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      closeContactModal();
    };
  });
});

function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
}

window.addEventListener("click", (e) => {
  const modal = document.getElementById("contactModal");
  if (e.target === modal) {
    closeContactModal();
  }
});

const form = document.querySelector("#contactForm");
const sendPopup = document.getElementById("sendPopup");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      // Popup göster
      sendPopup.classList.add("show");
      setTimeout(() => sendPopup.classList.remove("show"), 4000);
      form.reset();
    } else {
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }).catch(error => {
    alert("Bir hata oluştu, lütfen tekrar deneyin.");
  });
});


