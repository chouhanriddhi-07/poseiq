# 🧘 PoseIQ — AI-Powered Yoga Pose Analyzer

> Real-time yoga pose analysis using your webcam and AI. Get instant feedback on your form, track your score, and improve your practice — no equipment needed.


[![Live Demo](https://img.shields.io/badge/Live%20Demo-poseiq--riddhi.vercel.app-1D9E75?style=for-the-badge)](https://poseiq-riddhi.vercel.app/)

**🚧 Active Development** — Core features are live. Hold timer, score history, and more poses are in progress.

---

## ✨ Features

- **Live pose detection** — MediaPipe tracks 33 body landmarks at 30fps directly in your browser
- **Real-time feedback** — instant joint-by-joint corrections with a live accuracy score
- **3 poses supported** — Warrior II, Tree Pose, Mountain Pose (more coming)
- **No backend required** — all AI inference runs client-side using WebAssembly + GPU
- **Privacy first** — your camera feed never leaves your device

---

## 🎯 Supported Poses

| Pose | Level | Key Checks |
|------|-------|-----------|
| 🥋 Warrior II | Intermediate | Front knee 90°, arms parallel, hips open |
| 🌳 Tree Pose | Beginner | Standing leg straight, raised knee bent, arms overhead |
| ⛰️ Mountain Pose | Beginner | Both legs straight, shoulders level, arms at sides |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| AI / Pose Detection | MediaPipe Pose Landmarker (Google) |
| Build tool | Vite |
| Styling | CSS-in-JS (inline styles) |
| Deployment | Vercel |
| CI/CD | GitHub Actions (auto-deploy on push) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A webcam
- A modern browser (Chrome recommended for best GPU performance)

### Installation

```bash
# Clone the repo
git clone https://github.com/chouhanriddhi-07/poseiq.git
cd poseiq

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` — allow camera access when prompted.

### Build for production

```bash
npm run build
npm run preview
```
## 🌐 Live Demo 👉 [poseiq-riddhi.vercel.app](https://poseiq-riddhi.vercel.app/)
---

## 📁 Project Structure

```
src/
├── components/
│   ├── Camera.tsx          # Webcam feed + canvas overlay
│   ├── FeedbackPanel.tsx   # Live score + joint feedback UI
│   ├── PoseSidebar.tsx     # Pose selector
│   └── Header.tsx          # App header + nav
├── hooks/
│   └── useMediaPipe.ts     # MediaPipe initialization + animation loop
├── poses/
│   ├── index.ts            # Pose registry
│   ├── warrior2.ts         # Warrior II analysis
│   ├── tree.ts             # Tree Pose analysis
│   └── mountain.ts         # Mountain Pose analysis
└── utils/
    └── angles.ts           # Joint angle calculation math
```

---

## 🧠 How It Works

```
Webcam frame
    ↓
MediaPipe Pose Landmarker
    ↓
33 body landmark coordinates (x, y, z)
    ↓
Joint angle calculations (shoulder→elbow→wrist, hip→knee→ankle)
    ↓
Pose-specific rules engine
    ↓
Live score (0–100) + correction feedback
```

Each pose is defined as a set of angle thresholds. For example, Warrior II requires:
- Front knee angle: 85–95°
- Both arm angles: >160° (straight)
- Hip level difference: <5% of frame height

---

## 🗺️ Roadmap

- [x] Live webcam feed with MediaPipe skeleton overlay
- [x] Warrior II pose analysis
- [x] Tree Pose analysis
- [x] Mountain Pose analysis
- [x] Pose selector sidebar
- [x] Real-time score + feedback panel
- [x] App header + navigation
- [ ] Hold timer (30s target with progress bar)
- [ ] Session score history
- [ ] Warrior I pose
- [ ] Mobile responsive layout
- [ ] Dark mode

---

## 🤝 Contributing

This project is actively being built. If you'd like to contribute a new pose definition, check `src/poses/warrior2.ts` as a reference — each pose is a pure function that takes 33 landmarks and returns a score + feedback array.

---

## 👩‍💻 Author

**Riddhi Chouhan** — Lead Software Engineer  
[LinkedIn](https://www.linkedin.com/in/chouhanriddhi) · [GitHub](https://github.com/chouhanriddhi-07)

---

## 📄 License

MIT — feel free to use this for learning or building your own pose analyzer.

---

> Built with React, MediaPipe, and TypeScript as a portfolio project demonstrating AI-assisted development, real-time computer vision, and modern frontend architecture.
