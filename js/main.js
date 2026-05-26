const motionVideos = [
  {
    file: "videos/motion-design/backpropagation.mp4",
    title: "Backpropagation in 60 Seconds",
    label: "AI / Deep Learning"
  },
  {
    file: "videos/motion-design/attention.mp4",
    title: "Attention Is All You Need",
    label: "Transformers / LLMs"
  },
  {
    file: "videos/motion-design/neural-network-child.mp4",
    title: "A Neural Network Learns Like a Child",
    label: "AI / Human Learning"
  },
  {
    file: "videos/motion-design/ai-broke-math.mp4",
    title: "AI Broke Math",
    label: "Erdős Problem / 2026"
  },
  {
    file: "videos/motion-design/entropy.mp4",
    title: "Why Entropy Always Increases",
    label: "Physics / Information Theory"
  },
  {
    file: "videos/motion-design/free-will.mp4",
    title: "Free Will Is Bayesian",
    label: "Probability / Philosophy"
  }
];

const brandingVideos = [
  {
    file: "videos/branding/black-scholes.mp4",
    title: "Black-Scholes Model",
    label: "Options Pricing"
  },
  {
    file: "videos/branding/monte-carlo.mp4",
    title: "Monte Carlo 10K Futures",
    label: "Risk Simulation"
  },
  {
    file: "videos/branding/kelly-criterion.mp4",
    title: "Kelly Criterion",
    label: "Position Sizing"
  },
  {
    file: "videos/branding/volatility-drag.mp4",
    title: "Volatility Drag",
    label: "Portfolio Decay"
  },
  {
    file: "videos/branding/correlation-breaks.mp4",
    title: "Correlation Breaks",
    label: "Market Regimes"
  },
  {
    file: "videos/branding/gamblers-ruin.mp4",
    title: "Gambler's Ruin",
    label: "Probability / Risk"
  }
];

function buildVideoCard(video) {
  const card = document.createElement("div");
  card.className = "video-card";

  const vid = document.createElement("video");
  vid.src = video.file;
  vid.muted = true;
  vid.loop = true;
  vid.playsInline = true;
  vid.preload = "auto";
  vid.load();

  const overlay = document.createElement("div");
  overlay.className = "video-card-overlay";
  overlay.innerHTML = `
    <span class="video-card-label">${video.label}</span>
    <span class="video-card-title">${video.title}</span>
  `;

  card.appendChild(vid);
  card.appendChild(overlay);

  card.addEventListener("mouseenter", () => {
    vid.currentTime = 0;
    vid.play().catch(() => {});
  });

  card.addEventListener("mouseleave", () => {
    vid.pause();
    vid.currentTime = 0;
  });

  card.addEventListener("click", () => {
    if (vid.paused) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
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
  const motionGrid = document.getElementById("motion-grid");
  motionVideos.forEach((v) => {
    const card = buildVideoCard(v);
    motionGrid.appendChild(card);
  });

  const brandingGrid = document.getElementById("branding-grid");
  brandingVideos.forEach((v) => {
    const card = buildVideoCard(v);
    brandingGrid.appendChild(card);
  });

  const demoContainer = document.getElementById("demo-container");
  demoContainer.appendChild(
    buildDemoCard({ file: "videos/product-demos/blackbird.mp4" })
  );
});
