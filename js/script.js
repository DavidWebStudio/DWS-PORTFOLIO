const CONFIG = {
  whatsapp: "2347085408445",
  instagram: "https://www.instagram.com/davidwebstudio1/",
  facebook: "https://web.facebook.com/profile.php?id=61595532427266"
};
/* ============ ADD NEW PROJECTS HERE ============
   Copy one block, paste it below, and change the text.
   images: add screenshots to images/optimized/ and list their paths in display order.
   url: leave "" if the site is not live yet (the button will show "Coming soon"). */
const PROJECTS = [
    { 
        name: "Luxe Scents NG", 
        category: "Luxury Perfume E-commerce Website",
        description: "A luxury fragrance storefront with responsive design, premium branding and a curated collection experience.",
        images: ["images/optimized/LUXESCENTS.webp", "images/optimized/LUXESCENTS2.webp", "images/optimized/LUXESCENTS3.webp"],
        brandLogo: "images/optimized/LOGO.jpg",
        url: "https://davidwebstudio.github.io/luxe-scents-ng/" 
    },
    { 
        name: "LUXE DISTRICT", 
        category: "Fashion and Lifestyle E-commerce Website",
        description: "A modern fashion storefront presenting clothing, accessories and fragrances in a polished shopping experience.",
        images: ["images/optimized/LUXEDISTRICT.webp", "images/optimized/LUXEDISTRICT2.webp", "images/optimized/LUXEDISTRICT3.webp"],
        url: "https://davidwebstudio.github.io/luxe-district/"
    },
    { 
        name: "David Isaac Portfolio", 
        category: "Personal Portfolio Website",
        description: "A clean, professional portfolio showcasing custom web design and development work.",
        images: ["images/optimized/DavidISaac.webp"],
        url: "" /* paste live URL here if you have one */ 
    }
];

/* ================================================= */
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Social + WhatsApp links
$$("[data-wa]").forEach(a => a.href = "https://wa.me/" + CONFIG.whatsapp);
$$('[data-social="instagram"]').forEach(a => a.href = CONFIG.instagram);
$$('[data-social="facebook"]').forEach(a => a.href = CONFIG.facebook);
$("#year").textContent = new Date().getFullYear();

// Render projects
$("#projectGrid").innerHTML = PROJECTS.map(p => {
  const live = p.url ? `<a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">View Live Website</a>`
    : `<span class="btn off" aria-disabled="true">Live link coming soon</span>`;
  const images = p.images || [];
  const logo = p.brandLogo ? `<img class="brand-logo" src="${esc(p.brandLogo)}" alt="DAVIDWEBSTUDIO logo">` : "";
  const shot = `<div class="bar"><i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>${logo}</div><div class="shot" data-gallery data-images="${esc(images.join("|"))}"><div class="gallery-fallback"><b>${esc(p.name)}</b><small>Screenshot unavailable</small></div><img src="${esc(images[0] || "")}" alt="Screenshot of the ${esc(p.name)} website" loading="lazy"></div>`;
  const frame = p.url ? `<a class="browser" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.name)} in a new tab">${shot}</a>` : `<div class="browser">${shot}</div>`;
  const controls = images.length > 1 ? `<div class="gallery-controls" aria-label="${esc(p.name)} screenshots"><button class="gallery-btn" type="button" data-gallery-prev aria-label="Previous screenshot">Previous</button><span data-gallery-count aria-live="polite">1 / ${images.length}</span><button class="gallery-btn" type="button" data-gallery-next aria-label="Next screenshot">Next</button></div>` : "";
  return `<article class="project reveal"><div class="shot-wrap">${frame}${controls}${live}</div><div><p class="cat">${esc(p.category)}</p><h3>${esc(p.name)}</h3><p class="d">${esc(p.description)}</p></div></article>`;
}).join("");

// Rotate each project's screenshots independently.
$$("[data-gallery]").forEach(gallery => {
  const images = gallery.dataset.images.split("|").filter(Boolean);
  const image = $("img", gallery), count = $("[data-gallery-count]", gallery.parentElement.parentElement);
  if (!image || images.length === 0) return;

  let current = 0, changeTimer;
  const show = index => {
    current = (index + images.length) % images.length;
    gallery.classList.remove("is-ready", "is-missing");
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => {
      image.src = images[current];
      image.alt = `Screenshot ${current + 1} of ${images.length} for ${gallery.closest(".project").querySelector("h3").textContent}`;
      if (count) count.textContent = `${current + 1} / ${images.length}`;
    }, 220);
  };
  image.addEventListener("load", () => {
    gallery.classList.add("is-ready");
    gallery.classList.remove("is-missing");
  });
  image.addEventListener("error", () => {
    gallery.classList.add("is-missing");
    gallery.classList.remove("is-ready");
  });
  if (image.complete) {
    gallery.classList.toggle("is-ready", image.naturalWidth > 0);
    gallery.classList.toggle("is-missing", image.naturalWidth === 0);
  }
  gallery.parentElement.parentElement.querySelector("[data-gallery-prev]")?.addEventListener("click", () => show(current - 1));
  gallery.parentElement.parentElement.querySelector("[data-gallery-next]")?.addEventListener("click", () => show(current + 1));
  if (images.length > 1) setInterval(() => show(current + 1), 5000);
});

// Loader
addEventListener("load", () => setTimeout(() => $("#loader").classList.add("done"), reduce ? 0 : 500));

// Mobile menu
const btn = $("#menuBtn"), menu = $("#menu");
const setMenu = o => { menu.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); btn.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
btn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// Scroll reveal with stagger
$$(".cards,.skills").forEach(g => $$(".reveal", g).forEach((el, i) => el.style.setProperty("--d", i * 0.08 + "s")));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
$$(".reveal").forEach(el => reduce ? el.classList.add("in") : io.observe(el));

// Active nav link
const links = $$(".menu a[href^='#']:not(.btn)");
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
$$("main section").forEach(s => spy.observe(s));

// Header, progress bar, parallax
const header = $("#header"), bar = $("#progress"), orbs = $$(".orb");
let tick = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle("solid", y > 30);
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (!reduce && y < innerHeight * 1.2) orbs.forEach(o => o.style.transform = `translateY(${y * o.dataset.speed}px)`);
  tick = false;
}
addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Type and rotate the highlighted headline phrases.
const rot = $("#rotator"), words = rot.dataset.words.split("|");
let wordIndex = 0, charIndex = words[0].length, deleting = true;
const type = () => {
  const word = words[wordIndex];
  rot.textContent = word.slice(0, charIndex);
  if (deleting) {
    charIndex--;
    if (charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      charIndex = 0;
    }
  } else {
    charIndex++;
    if (charIndex > words[wordIndex].length) {
      deleting = true;
      charIndex = words[wordIndex].length;
      return setTimeout(type, 2200);
    }
  }
  setTimeout(type, deleting ? 28 : 55);
};
type();

// Contact form: opens WhatsApp with the message filled in
const form = $("#form"), msg = $("#formMsg");
$("#emailBtn").addEventListener("click", () => {
  if (!form.checkValidity()) { form.reportValidity(); msg.textContent = "Please fill in your name, a valid email and a message."; return; }
  const d = Object.fromEntries(new FormData(form));
  const subject = `Website enquiry from ${d.name}`;
  const body = `Hello David,\n\nI'm ${d.name} (${d.email}).\nI'm interested in: ${d.service}.\n\n${d.message}`;
  const recipient = "dominionetse28@gmail.com";
  const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, "_blank", "noopener,noreferrer");
  msg.textContent = "Opening a new Gmail compose window...";
});
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); msg.textContent = "Please fill in your name, a valid email and a message."; return; }
  const d = Object.fromEntries(new FormData(form));
  const text = `Hello David, I'm ${d.name} (${d.email}).\nI'm interested in: ${d.service}.\n\n${d.message}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  msg.textContent = "Opening WhatsApp with your message...";
  form.reset();
});
