// Navbar scroll ile arka plan değiştirme
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav-menu");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }

  // Scroll pozisyonuna göre aktif link sıfırlama (sayfa başındayken)
  if(window.scrollY < 50) {
    navLinks.forEach(link => link.classList.remove("active"));
  }
});

// Aktif link takibi - Intersection Observer ile
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === "hero-section") {
        // hero-section görünürken link aktif olmasın
        navLinks.forEach(link => link.classList.remove("active"));
      } else {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = [...navLinks].find(link => link.getAttribute("href").substring(1) === entry.target.id);
        if (activeLink) activeLink.classList.add("active");
      }
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));

// Logo tıklanınca aktif linkleri temizle
document.querySelector('.logo-link').addEventListener('click', () => {
  navLinks.forEach(link => link.classList.remove('active'));
});
