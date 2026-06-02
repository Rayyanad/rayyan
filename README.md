# Spider-Man: Into the Spider-Verse Themed Personal Portfolio

An interactive, immersive personal portfolio website designed with the iconic visuals of the movie *Spider-Man: Into the Spider-Verse*. Built using high-fidelity modern vanilla web technologies (HTML5, CSS3, ES6 Javascript).

---

## 🎨 Visual Features & Aesthetics

1. **Halftone Comic Patterns**: Overlay textures that recreate classic comic book print patterns utilizing pure CSS gradients.
2. **Chromatic Aberration & Glitches**: Visual hover/focus feedback elements that offset RGB values.
3. **Subway Journey Timeline**: An interactive NYC subway-inspired route map detailing work experience.
4. **Active Spider-Web Canvas**: Interactive floating nodes in the background that connect with lines, move with the mouse, and spark random glitch scanlines.
5. **3D Card Tilting**: Project panels and photo items that rotate on a 3D plane following cursor motion.
6. **Polaroid Gallery & Lightbox**: Interactive visual photography wall showcasing exposures across the multiverse.

---

## 📂 File Structure

```
spiderverse-portfolio/
├── index.html       # Structural markup for hero, navigation, experience, projects, and photography
├── style.css        # Design tokens, keyframe animations, halftone patterns, custom scrollbars, and grid/flex layout rules
├── script.js        # Global click web shooter effect, background canvas particles, 3D card calculations, and subway stop details logic
└── README.md        # Project overview and quickstart guide
```

---

## 🚀 How to Run Locally

Since this project has no heavy framework dependencies or build scripts, it runs instantly with any static server.

### Option 1: Python Web Server (Recommended)
Open your terminal, navigate to this project folder, and run:

```bash
python3 -m http.server 8000
```

Then open your browser and navigate to: **`http://localhost:8000`**

### Option 2: Live Server (VS Code Extension)
If you are using VS Code, right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Double-click
You can also open the `index.html` file directly in any modern browser by double-clicking it. Note: some browser security policies may restrict loading file resources directly via `file://` protocols, so running a local web server is highly recommended for full canvas and script capabilities!

---

## 🌟 Customizing Your Content

- **Projects**: Edit `.projects-grid` in `index.html` to add/remove projects. Set custom `data-category` types (e.g. `web`, `systems`, `ai`) to enable automatic filtering.
- **Experience & Learnings**: Update `experienceData` inside `script.js` to change titles, bullet points, locations, durations, and your job learnings. You can also modify coordinates in the `<svg>` stops in `index.html`.
- **Photography**: Customize `.photography-gallery` in `index.html`. You can replace the placeholder graphics with real image paths by adding `img` tags or setting CSS backgrounds.

