# Kanika & Devang — Our Little Diwali World 🪔

A modular, browser-based 3D Diwali neighbourhood experience. The visual reference video was used for broad creative direction: a colourful Indian gali, two stylised sibling characters, third-person exploration, glowing diyas, discoverable stops and a festive sky. This implementation is original and uses procedural Three.js geometry rather than copying the reference.

## Run locally
1. Extract `kanika-diwali.zip`.
2. Open the folder in VS Code.
3. Install Node.js LTS if it is not already installed.
4. In a terminal opened in the project folder, run `npm install`, then `npm start`.
5. Open `http://localhost:8000`. `npm start` serves the project on your local network, too.
6. Internet is needed for Google Fonts; Three.js is installed locally through npm.

Do not open `index.html` as a `file://` URL: browsers block ES module imports from local files.

### Open on a phone
For a phone on the same Wi-Fi as your computer, run `npm start` on the computer, then open the LAN address printed by the server (for example `http://192.168.1.25:8000`) on the phone. Allow Node.js through the computer's firewall if prompted. A phone cannot use the computer's `localhost` or open its local `file://` page.

## Controls
- Desktop: W/A/S/D or arrow keys to walk; drag the 3D canvas to rotate the camera.
- Mobile: use the on-screen joystick to walk and drag the right side of the scene to look.
- The **PERF** button toggles reduced rendering resolution, frame rate and dynamic lighting. Phones and lower-powered devices start in this mode automatically.
- Tap **GALLERY** in the top-right to browse your photos, videos and reels.
- Festive instrumental music starts when you enter the world; use **MUSIC ON/OFF** to control music and sound effects.
- Completing all ten discoveries starts the fireworks finale and reveals: “happy diwali kanika,with lots of love from devang”.
- Walk close to a glowing golden marker and tap **Explore nearby**.
- Click the brand label in the top-left to read a separate personal letter for each of the five Diwali festivals.
- Light seven small diyas by approaching them and tapping **Explore nearby**.

## Personalising characters
Edit `js/characters.js`. `makeCharacter(name, mainColor, skin)` builds the placeholder characters from Three.js primitives. Change clothing colours, skin-tone placeholder, hair cap geometry and accessories there. These are deliberately stylised placeholders and do not claim to reproduce either person's real appearance.

## Photo, video and reel gallery
Drop media directly into `gallery/` (no subfolders). Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.mp4`, `.webm`, and `.mov`. Filenames appear as captions. Start the server with `npm start` and tap **GALLERY** in the top-right; new files appear after refreshing the gallery. Before static hosting, run `npm run build` again and redeploy `dist/` so the gallery manifest includes the new media.

## Edit words and memories
- Ten location stories: `memories` in `js/data.js`.
- Five separate festival wishes: `festivals` in `js/data.js`.
- Main personal letter: `letter` in `js/data.js`.
- The wish box stores its text only in the browser's `localStorage` under `kanika-private-wish`; it is not transmitted to a server.

## Deploy to GitHub Pages
1. Run `npm install` and `npm run build`.
2. Deploy the generated `dist/` directory to a static host such as GitHub Pages.
3. Open the published HTTPS URL on the phone.

## Technical notes / honest limitations
- The neighbourhood, houses, lanterns, diyas, rangoli, two characters and ten markers are generated from original Three.js geometry at runtime. Three.js is installed locally with npm; no external 3D models are downloaded.
- Movement, camera follow, keyboard/touch joystick controls, marker discovery, local wish storage, procedural lantern release and canvas fireworks are implemented.
- The festive melody, firework booms and sparkle sounds are synthesised with Web Audio after a user gesture; browser autoplay restrictions are respected. This is original procedural sound design, not recorded music.
- The ten story locations are interactive markers placed along the lane; the street is freely explorable, but it is a compact stylised game environment rather than a photorealistic city. Character models are cute editable placeholders, not rigged imported humanoids.
- A dedicated 12–15-photo editorial gallery layout is not yet wired into the in-world navigation; the `images/photo1.jpg`–`photo15.jpg` naming convention and extension point are documented. This is the clearest remaining enhancement before calling the project feature-complete.
- Shadows and high-end post-processing are intentionally restrained for mobile performance. A WebGL-capable modern browser is required.
