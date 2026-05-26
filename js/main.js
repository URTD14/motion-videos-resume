function fmtDur(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const longformVideos = [
  { file: "videos/long-form/black-scholes-to-mamba.mp4", title: "Black-Scholes to Mamba", label: "Mathematical Finance / Deep Learning", duration: 531.3 },
  { file: "videos/long-form/mean-reversion.mp4", title: "Mean Reversion", label: "Statistical Arbitrage", duration: 236.2 }
];

const modal = document.createElement("div");
modal.className = "video-modal";
modal.innerHTML = `
  <div class="video-modal-backdrop"></div>
  <div class="video-modal-inner">
    <button class="video-modal-close" aria-label="Close">&times;</button>
    <div class="video-modal-player">
      <video controls playsinline></video>
    </div>
    <div class="video-modal-info">
      <span class="video-modal-label"></span>
      <span class="video-modal-title"></span>
    </div>
  </div>
`;
document.body.appendChild(modal);

const modalVideo = modal.querySelector("video");
const modalLabel = modal.querySelector(".video-modal-label");
const modalTitle = modal.querySelector(".video-modal-title");

function openModal(video) {
  modalVideo.src = video.file;
  modalVideo.load();

  modalVideo.addEventListener("loadedmetadata", function setRatio() {
    modalVideo.removeEventListener("loadedmetadata", setRatio);
    const ratio = modalVideo.videoWidth / modalVideo.videoHeight;
    modal.classList.toggle("is-wide", ratio > 1);
    modal.classList.toggle("is-tall", ratio <= 1);
    modalVideo.play().catch(() => {});
  }, { once: true });

  modalLabel.textContent = video.label;
  modalTitle.textContent = video.title + " \u2014 " + fmtDur(video.duration);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

modal.querySelector(".video-modal-close").addEventListener("click", closeModal);
modal.querySelector(".video-modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function buildLongFormCard(video) {
  const card = document.createElement("div");
  card.className = "longform-card";

  const vid = document.createElement("video");
  vid.src = video.file;
  vid.muted = true;
  vid.loop = true;
  vid.playsInline = true;
  vid.preload = "auto";

  const info = document.createElement("div");
  info.className = "longform-info";
  info.innerHTML = `
    <span class="longform-label">${video.label}</span>
    <span class="longform-title">${video.title}</span>
    <span class="longform-duration">${fmtDur(video.duration)}</span>
  `;

  card.appendChild(vid);
  card.appendChild(info);

  if (!isTouch) {
    card.addEventListener("mouseenter", () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      vid.pause();
      vid.currentTime = 0;
    });
  }

  card.addEventListener("click", () => {
    openModal(video);
  });

  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  const longformGrid = document.getElementById("longform-grid");
  longformVideos.forEach((v) => {
    longformGrid.appendChild(buildLongFormCard(v));
  });

  if (isTouch) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const vid = entry.target.querySelector("video");
        if (!vid) return;
        if (entry.isIntersecting) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll(".longform-card").forEach((card) => {
      observer.observe(card);
    });
  }
});
