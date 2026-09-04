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
    <div class="modal-inner">
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

document.querySelector("#year").textContent = new Date().getFullYear();

renderProjects();
renderCompetitions();
renderPublications();
renderArchive();
runTypewriter();