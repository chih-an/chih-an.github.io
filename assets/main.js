const data = window.PORTFOLIO_DATA;
const modal = document.querySelector("#detail-modal");
const modalContent = document.querySelector("#modal-content");
const modalClose = document.querySelector("#modal-close");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function linksHTML(links = []) {
  if (!links.length) return "";
  return `<div class="modal-actions">${links.map(link => `
    <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener">${escapeHTML(link.label)} ↗</a>
  `).join("")}</div>`;
}

function openDetail(type, index) {
  const collection = {
    project: data.projects,
    competition: data.competitions,
    publication: data.publications
  }[type];

  const item = collection?.[index];
  if (!item) return;

  const kicker =
    type === "project" ? `PROJECT ${String(index + 1).padStart(2, "0")}` :
    type === "competition" ? `COMPETITION / ${item.year}` :
    `${item.type.toUpperCase()} / ${item.year}`;

  const meta = type === "publication"
    ? [item.authors, item.venue, item.year]
    : (item.tags || [item.result, item.year]).filter(Boolean);

  modalContent.innerHTML = `
    <div class="modal-inner modal-${type}">
      <span class="modal-kicker">${escapeHTML(kicker)}</span>
      <h2>${escapeHTML(item.title)}</h2>
      ${item.image ? `<img class="modal-image" src="${escapeHTML(item.image)}" alt="">` : ""}
      <p class="modal-description">${escapeHTML(item.detail || item.description || "")}</p>
      ${item.highlights?.length ? `
        <ul class="modal-highlights">
          ${item.highlights.map(point => `<li>${escapeHTML(point)}</li>`).join("")}
        </ul>` : ""}
      <div class="modal-meta">
        ${meta.filter(Boolean).map(value => `<span>${escapeHTML(value)}</span>`).join("")}
      </div>
      ${linksHTML(item.links)}
    </div>
  `;

  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

modalClose.addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.open) modal.close();
});

function renderProjects() {
  document.querySelector("#projects-grid").innerHTML = data.projects.map((item, i) => `
    <article class="project-folder clickable-card" tabindex="0" role="button"
      data-open-type="project" data-open-index="${i}"
      aria-label="Open project: ${escapeHTML(item.title)}">
      <span class="project-index">PROJECT ${String(i + 1).padStart(2, "0")}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <div class="tag-row">${item.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
      <span class="card-open-label">Open file →</span>
    </article>
  `).join("");
}

function renderCompetitions() {
  document.querySelector("#competitions-grid").innerHTML = data.competitions.map((item, i) => `
    <article class="competition-card clickable-card" tabindex="0" role="button"
      data-open-type="competition" data-open-index="${i}"
      aria-label="Open competition: ${escapeHTML(item.title)}">
      <span class="competition-year">${escapeHTML(item.year)}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <span class="competition-result">${escapeHTML(item.result)}</span>
      <p>${escapeHTML(item.description)}</p>
      <span class="card-open-label">Open entry →</span>
    </article>
  `).join("");
}

function renderPublications(filter = "all") {
  const filtered = data.publications
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => filter === "all" || item.type === filter);

  document.querySelector("#publications-list").innerHTML = filtered.map(({ item, index }) => `
    <article class="publication-card clickable-card" tabindex="0" role="button"
      data-open-type="publication" data-open-index="${index}"
      aria-label="Open publication: ${escapeHTML(item.title)}">
      <div class="pub-type">${escapeHTML(item.type)}<br>${escapeHTML(item.year)}</div>
      <div>
        <div class="pub-title">${escapeHTML(item.title)}</div>
        <div class="pub-meta">${escapeHTML(item.authors)}<br><em>${escapeHTML(item.venue)}</em></div>
      </div>
      <span class="card-open-label">Open ↗</span>
    </article>
  `).join("");
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-open-type]");
  if (!button) return;
  openDetail(button.dataset.openType, Number(button.dataset.openIndex));
});

document.addEventListener("keydown", event => {
  const card = event.target.closest?.(".clickable-card[data-open-type]");
  if (!card) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openDetail(card.dataset.openType, Number(card.dataset.openIndex));
  }
});

/* Archive carousel */
let archiveIndex = 0;
const archiveTrack = document.querySelector("#archive-track");
const archiveDots = document.querySelector("#archive-dots");
const archiveCounter = document.querySelector("#archive-counter");

function renderArchive() {
  archiveTrack.innerHTML = data.archive.map((item, i) => `
    <article class="archive-slide" role="button" tabindex="0"
      data-archive-open="${i}" aria-label="Open ${escapeHTML(item.title)}">
      <img src="${escapeHTML(item.image)}" alt="">
      <div class="archive-caption">
        <span>${escapeHTML(item.subtitle)}</span>
        <h3>${escapeHTML(item.title)}</h3>
      </div>
    </article>
  `).join("");

  archiveDots.innerHTML = data.archive.map((_, i) =>
    `<button class="archive-dot ${i === 0 ? "active" : ""}" data-archive-dot="${i}" aria-label="Go to archive slide ${i + 1}"></button>`
  ).join("");

  updateArchive();
}

function updateArchive() {
  archiveTrack.style.transform = `translateX(-${archiveIndex * 100}%)`;
  archiveCounter.textContent = `${String(archiveIndex + 1).padStart(2, "0")} / ${String(data.archive.length).padStart(2, "0")}`;
  document.querySelectorAll(".archive-dot").forEach((dot, i) => dot.classList.toggle("active", i === archiveIndex));
}

function archiveStep(direction) {
  archiveIndex = (archiveIndex + direction + data.archive.length) % data.archive.length;
  updateArchive();
}

document.querySelector("#archive-prev").addEventListener("click", () => archiveStep(-1));
document.querySelector("#archive-next").addEventListener("click", () => archiveStep(1));

document.addEventListener("click", event => {
  const dot = event.target.closest("[data-archive-dot]");
  if (dot) {
    archiveIndex = Number(dot.dataset.archiveDot);
    updateArchive();
  }

  const slide = event.target.closest("[data-archive-open]");
  if (slide) {
    const item = data.archive[Number(slide.dataset.archiveOpen)];
    openDetail(item.targetType, item.targetIndex);
  }
});

document.addEventListener("keydown", event => {
  const slide = event.target.closest?.("[data-archive-open]");
  if (slide && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    const item = data.archive[Number(slide.dataset.archiveOpen)];
    openDetail(item.targetType, item.targetIndex);
  }
});

let archiveTimer = setInterval(() => archiveStep(1), 5200);
document.querySelector(".archive-shell").addEventListener("mouseenter", () => clearInterval(archiveTimer));
document.querySelector(".archive-shell").addEventListener("mouseleave", () => {
  archiveTimer = setInterval(() => archiveStep(1), 5200);
});

/* ID badge tilt */
const badgeStage = document.querySelector("#badge-stage");
const badge = document.querySelector("#id-badge");
let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;

function animateBadge() {
  currentRX += (targetRX - currentRX) * 0.11;
  currentRY += (targetRY - currentRY) * 0.11;
  badge.style.setProperty("--rx", `${currentRX}deg`);
  badge.style.setProperty("--ry", `${currentRY}deg`);
  requestAnimationFrame(animateBadge);
}
animateBadge();

badgeStage.addEventListener("pointermove", event => {
  const rect = badgeStage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  targetRY = x * 8;
  targetRX = y * -6;
});

badgeStage.addEventListener("pointerleave", () => {
  targetRX = 0;
  targetRY = 0;
});

/* Hero typewriter */
const typewriterPhrases = [
  "Projects.",
  "Achievements.",
  "Competitions.",
  "About me..."
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function runTypewriter() {
  const el = document.querySelector("#typewriter");
  const phrase = typewriterPhrases[phraseIndex];

  if (!deleting) {
    el.textContent = phrase.slice(0, ++charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(runTypewriter, 1150);
      return;
    }
  } else {
    el.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    }
  }
  setTimeout(runTypewriter, deleting ? 30 : 58);
}

/* Publication filter */
document.querySelectorAll(".pub-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".pub-tab").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    renderPublications(button.dataset.filter);
  });
});

/* Mobile nav */
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

/* Gallery */
/* Gallery carousel：桌機 3 張 / 平板 2 張 / 手機 1 張，自動輪播 */
const GALLERY_INTERVAL = 4500;
let galleryIndex = 0;
let galleryPerView = 1;
let galleryTimer = null;
let galleryPaused = false;
let galleryTouchX = null;
const galleryMQ = {
  desktop: window.matchMedia("(min-width: 1024px)"),
  tablet: window.matchMedia("(min-width: 640px)")
};
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function galleryGetPerView() {
  return galleryMQ.desktop.matches ? 3 : galleryMQ.tablet.matches ? 2 : 1;
}
function galleryMaxIndex() {
  return Math.max(0, (data.gallery || []).length - galleryPerView);
}

/* 接受影片 ID、網址（watch / youtu.be / embed / shorts），或整段 <iframe> 嵌入碼 */
function youtubeId(input = "") {
  const s = String(input).trim();
  const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|live\/|watch\?(?:.*&)?v=))([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(s) ? s : s;
}

function renderGallery() {
  const root = document.querySelector("#gallery-carousel");
  const items = data.gallery || [];
  if (!items.length) { root.innerHTML = ""; return; }

  const slides = items.map((item, i) => {
    const media = item.type === "youtube"
      ? `<div class="gallery-media">
           <iframe data-src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId(item.id || item.url))}"
             title="${escapeHTML(item.title)}"
             allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
             referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
           <span class="gallery-badge">VIDEO</span>
         </div>`
      : `<div class="gallery-media is-image" role="button" tabindex="0"
             data-gallery-open="${i}" aria-label="View larger: ${escapeHTML(item.title)}">
           <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.title)}" loading="lazy">
         </div>`;
    return `
      <figure class="gallery-slide" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}">
        ${media}
        <figcaption>
          ${item.date ? `<span class="gallery-date">${escapeHTML(item.date)}</span>` : ""}
          <h3>${escapeHTML(item.title)}</h3>
          ${item.description ? `<p>${escapeHTML(item.description)}</p>` : ""}
        </figcaption>
      </figure>`;
  }).join("");

  root.classList.add("glass-panel");
  root.setAttribute("aria-roledescription", "carousel");
  root.innerHTML = `
    <div class="gallery-viewport" id="gallery-viewport">
      <div class="gallery-track" id="gallery-track">${slides}</div>
    </div>
    <div class="gallery-controls" id="gallery-controls">
      <button class="gallery-arrow" id="gallery-prev" aria-label="Previous">←</button>
      <div class="gallery-dots" id="gallery-dots"></div>
      <button class="gallery-arrow" id="gallery-next" aria-label="Next">→</button>
    </div>`;

  document.querySelector("#gallery-prev").addEventListener("click", () => galleryGo(galleryIndex - 1, true));
  document.querySelector("#gallery-next").addEventListener("click", () => galleryGo(galleryIndex + 1, true));
  document.querySelector("#gallery-dots").addEventListener("click", e => {
    const dot = e.target.closest("[data-gallery-dot]");
    if (dot) galleryGo(Number(dot.dataset.galleryDot), true);
  });

  const viewport = document.querySelector("#gallery-viewport");
  viewport.addEventListener("touchstart", e => { galleryTouchX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener("touchend", e => {
    if (galleryTouchX === null) return;
    const dx = e.changedTouches[0].clientX - galleryTouchX;
    galleryTouchX = null;
    if (Math.abs(dx) > 50) galleryGo(galleryIndex + (dx < 0 ? 1 : -1), true);
  });
  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", e => {
    if (e.target !== root) return;
    if (e.key === "ArrowLeft") galleryGo(galleryIndex - 1, true);
    if (e.key === "ArrowRight") galleryGo(galleryIndex + 1, true);
  });

  // 滑鼠移入 / 鍵盤聚焦時暫停，避免正在看的內容被切走
  root.addEventListener("mouseenter", () => { galleryPaused = true; });
  root.addEventListener("mouseleave", () => { galleryPaused = false; });
  root.addEventListener("focusin", () => { galleryPaused = true; });
  root.addEventListener("focusout", () => { galleryPaused = false; });
  // 點進 YouTube iframe 時（觸控裝置也適用）暫停，直到焦點離開
  window.addEventListener("blur", () => {
    setTimeout(() => {
      if (document.activeElement?.closest?.("#gallery-carousel")) galleryPaused = true;
    }, 0);
  });
  window.addEventListener("focus", () => { galleryPaused = false; });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) galleryRestartTimer(); });

  Object.values(galleryMQ).forEach(mq => mq.addEventListener("change", galleryLayout));
  galleryIndex = 0;
  galleryLayout();
}

function galleryLayout() {
  const root = document.querySelector("#gallery-carousel");
  const total = (data.gallery || []).length;
  galleryPerView = galleryGetPerView();
  root.style.setProperty("--per-view", galleryPerView);
  galleryIndex = Math.min(galleryIndex, galleryMaxIndex());

  const pages = galleryMaxIndex() + 1;
  document.querySelector("#gallery-dots").innerHTML = Array.from({ length: pages }, (_, i) =>
    `<button class="gallery-dot" data-gallery-dot="${i}" aria-label="Go to position ${i + 1}"></button>`).join("");
  document.querySelector("#gallery-controls").style.display = total > galleryPerView ? "" : "none";
  document.querySelector("#gallery-track").classList.toggle("is-static", total <= galleryPerView);
  updateGallery();
  galleryRestartTimer();
}

function galleryGo(index, manual = false) {
  const max = galleryMaxIndex();
  if (max === 0) return;
  galleryIndex = index > max ? 0 : index < 0 ? max : index;
  updateGallery();
  if (manual) galleryRestartTimer();
}

function galleryRestartTimer() {
  clearInterval(galleryTimer);
  galleryTimer = null;
  if (reducedMotion.matches || galleryMaxIndex() === 0) return;
  galleryTimer = setInterval(() => {
    if (!galleryPaused && !document.hidden) galleryGo(galleryIndex + 1);
  }, GALLERY_INTERVAL);
}

function updateGallery() {
  document.querySelector("#gallery-track").style.transform =
    `translateX(-${(galleryIndex * 100) / galleryPerView}%)`;
  document.querySelectorAll(".gallery-dot").forEach((d, i) => d.classList.toggle("active", i === galleryIndex));
  // 影片不自動播放：只有在畫面內的影片才載入 iframe（仍需手動按播放）；移出畫面即清除 src 停止播放
  document.querySelectorAll(".gallery-slide").forEach((slide, i) => {
    const visible = i >= galleryIndex && i < galleryIndex + galleryPerView;
    slide.setAttribute("aria-hidden", String(!visible));
    const frame = slide.querySelector("iframe");
    if (!frame) return;
    if (visible) { if (!frame.getAttribute("src")) frame.src = frame.dataset.src; }
    else frame.removeAttribute("src");
  });
}

function openGalleryImage(index) {
  const item = (data.gallery || [])[index];
  if (!item) return;
  modalContent.innerHTML = `
    <div class="modal-inner">
      <span class="modal-kicker">GALLERY${item.date ? " / " + escapeHTML(item.date) : ""}</span>
      <h2>${escapeHTML(item.title)}</h2>
      <img class="gallery-lightbox-img" src="${escapeHTML(item.src)}" alt="${escapeHTML(item.title)}">
      <p class="modal-description">${escapeHTML(item.description || "")}</p>
    </div>`;
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

document.addEventListener("click", event => {
  const el = event.target.closest("[data-gallery-open]");
  if (el) openGalleryImage(Number(el.dataset.galleryOpen));
});
document.addEventListener("keydown", event => {
  const el = event.target.closest?.("[data-gallery-open]");
  if (el && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openGalleryImage(Number(el.dataset.galleryOpen));
  }
});

/* Back to top */
const backToTop = document.querySelector("#back-to-top");
function toggleBackToTop() {
  backToTop.classList.toggle("show", window.scrollY > 500);
}
window.addEventListener("scroll", toggleBackToTop, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
toggleBackToTop();

document.querySelector("#year").textContent = new Date().getFullYear();

renderProjects();
renderCompetitions();
renderPublications();
renderArchive();
renderGallery();
runTypewriter();