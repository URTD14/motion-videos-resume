function fmtDur(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const brandingVideos = [
  { file: "videos/branding/black-scholes.mp4", title: "Black-Scholes Model", label: "Options Pricing", duration: 27.6 },
  { file: "videos/branding/monte-carlo.mp4", title: "Monte Carlo 10K Futures", label: "Risk Simulation", duration: 40.0 },
  { file: "videos/branding/kelly-criterion.mp4", title: "Kelly Criterion", label: "Position Sizing", duration: 37.3 },
  { file: "videos/branding/volatility-drag.mp4", title: "Volatility Drag", label: "Portfolio Decay", duration: 36.4 },
  { file: "videos/branding/correlation-breaks.mp4", title: "Correlation Breaks", label: "Market Regimes", duration: 28.9 },
  { file: "videos/branding/gamblers-ruin.mp4", title: "Gambler's Ruin", label: "Probability / Risk", duration: 27.7 }
];

const motionVideos = [
  { file: "videos/motion-design/backpropagation.mp4", title: "Backpropagation in 60 Seconds", label: "AI / Deep Learning", duration: 40.5 },
  { file: "videos/motion-design/attention.mp4", title: "Attention Is All You Need", label: "Transformers / LLMs", duration: 44.4 },
  { file: "videos/motion-design/neural-network-child.mp4", title: "A Neural Network Learns Like a Child", label: "AI / Human Learning", duration: 114.2 },
  { file: "videos/motion-design/ai-broke-math.mp4", title: "AI Broke Math", label: "Erdős Problem / 2026", duration: 43.2 },
  { file: "videos/motion-design/entropy.mp4", title: "Why Entropy Always Increases", label: "Physics / Information Theory", duration: 43.9 },
  { file: "videos/motion-design/riemann.mp4", title: "Riemann Hypothesis", label: "Number Theory", duration: 143.3 }
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

function buildVideoCard(video) {
  const card = document.createElement("div");
  card.className = "video-card";

  const vid = document.createElement("video");
  vid.src = video.file;
  vid.muted = true;
  vid.loop = true;
  vid.playsInline = true;
  vid.preload = "auto";

  const badge = document.createElement("span");
  badge.className = "video-duration-badge";
  badge.textContent = fmtDur(video.duration);

  const overlay = document.createElement("div");
  overlay.className = "video-card-overlay";
  overlay.innerHTML = `
    <span class="video-card-label">${video.label}</span>
    <span class="video-card-title">${video.title}</span>
  `;

  card.appendChild(vid);
  card.appendChild(badge);
  card.appendChild(overlay);

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

function buildDemoCard(video) {
  const container = document.createElement("div");
  container.className = "demo-container";

  const vid = document.createElement("video");
  vid.src = video.file;
  vid.muted = true;
  vid.loop = true;
  vid.playsInline = true;
  vid.preload = "metadata";
  vid.controls = true;

  container.appendChild(vid);
  return container;
}

document.addEventListener("DOMContentLoaded", () => {
  const brandingGrid = document.getElementById("branding-grid");
  brandingVideos.forEach((v) => {
    brandingGrid.appendChild(buildVideoCard(v));
  });

  const demoContainer = document.getElementById("demo-container");
  demoContainer.appendChild(
    buildDemoCard({ file: "videos/product-demos/blackbird.mp4" })
  );

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

    document.querySelectorAll(".video-card").forEach((card) => {
      observer.observe(card);
    });
  }
});
