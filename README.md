# Wizard Duel — First to Five

A complete static browser game for two players. Two wands per wizard, arm-extension casting, ducking, and head-only scoring. The first player to score **5 points** wins. Includes keyboard play, an autoplay demonstration, touch controls and two-player webcam controls.

## Play locally

Extract this ZIP, open the extracted folder in VS Code and run:

```sh
python3 tools/serve.py
```

On Windows, use `py tools/serve.py` if `python3` is unavailable. Open the exact localhost address printed in the terminal, normally **http://127.0.0.1:8095/**. No npm install, pip install, build or training is needed. Keep the terminal running. Don't double-click index.html: browser modules and camera permission require an HTTP server.

Click **Watch a demo** for a complete computer-controlled duel, or **Start the duel** to play with a friend.

## Keyboard controls

| Action | Violet (left) | Ember (right) |
| --- | --- | --- |
| Left wand | A | J |
| Right wand | D | L |
| Duck (hold) | S | K |
| Aim up (hold) | W | I |
| Aim down (hold) | X | M |

Release a cast key to reload that wand. Space pauses/resumes when focus is outside a button; Escape pauses. Touch controls appear on narrower screens. Aim before pressing a cast key. Both wands share a 0.58-second cooldown.

## Webcam play

1. Use a current desktop Chrome or Edge browser at localhost or an HTTPS address.
2. Select **Webcam**, click **Open camera**, and allow camera access. The model may take a moment to download.
3. Stand side by side **facing the camera**, Violet on the left of the mirrored preview and Ember on the right. Your screen avatars face each other. Keep your face, shoulders, hips, elbows and both wrists visible. Avoid crossing sides.
4. Both players stand upright with elbows bent for two seconds to calibrate.
5. Your live mirrored camera feed appears beside the arena and stays visible during play. Use **Tracking** to show or hide the skeleton overlay. The feed appears as soon as the camera opens, while the model loads. Webcam fullscreen keeps the feed beside the arena.
6. Click **Start the duel**. Extend either arm sideways until nearly straight to shoot; bend the elbow again to reload. Raise/lower your hand to aim. Bend your knees comfortably to lower your head and duck.
7. Tracking loss pauses the duel. Return to your own sides, wait for tracking, and resume. Recalibrate after moving the camera or changing standing positions.

Wands are virtual and follow wrist gestures. Physical wand props are optional and are not detected. The game does not measure real 3D wand direction. Aiming uses the arm's vertical direction in the camera image, and the avatar fires toward its opponent. Different camera angles, occlusion, lighting and device performance affect tracking. Test with two people on the intended computer; webcam play has not been physically verified with two users in the development environment.

Video is processed in the browser without recording or uploads. No microphone is requested. Internet is required for MediaPipe JS/WASM and the pretrained pose model; the keyboard game and original artwork use local assets and work without external downloads. GPU is tried first, with CPU fallback. Two-person inference can be demanding on older devices.

## Rules

- Only head hits score; the head has a faint circular target marker. Body hits do not score or block magic.
- Bolts follow their launch direction; they do not home in on a moving head.
- Each arm extension fires once. Bend, then extend again to fire another shot.
- Ducking moves the actual head collision target. Aiming downward can hit a ducking head.
- A head hit awards one point and gives the defender one second of protection.
- The first to 5 wins. Simultaneous winning hits return the score to 4–4 and replay the deciding point.
- There is no match timer limit. Sound is optional and off by default.

## Upload to GitHub Pages

1. Create a new GitHub repository, for example `wizard-duel`.
2. Extract the ZIP. Upload **the contents of the wizard-duel folder**, including `index.html`, `assets/`, `tools/`, `tests/`, `README.md`, `package.json`, and `LICENSE`, to the repository root. Do not upload the ZIP itself or leave index.html inside an extra nested folder.
3. In the repository, choose **Settings → Pages → Deploy from a branch**.
4. Select your main branch and **/ (root)**, then save.
5. Open the HTTPS Pages URL GitHub provides after deployment.

All asset URLs are relative, so project-repository Pages paths are supported. There are no keys or backend services. `.nojekyll` is included to serve the files directly. No custom GitHub Actions workflow is required.

## Code map

- `index.html`: game interface and help dialog.
- `assets/style.css`: responsive layout and appearance.
- `assets/app.mjs`: controls, canvas artwork, sound, match states and rendering.
- `assets/engine.mjs`: independently testable scoring, projectiles, casting and collisions.
- `assets/camera.mjs`: MediaPipe loading, player assignment, calibration and gestures.
- `tests/engine.test.mjs`: game-rule and pose-input tests.
- `tools/serve.py`: optional local preview server.
- `tools/build.py`: optional `dist/` copy for static preview infrastructure; GitHub Pages does not need it.

Adjust constants in `RULES` in `assets/engine.mjs` to change target size, cooldown or projectile speed. `winScore` is set to 5. Changing it also requires updating the five score pips and instructional text in the interface.

## Developer checks (optional Node.js 18+)

```sh
npm test
npm run check
```

No dependencies are installed. See `VERIFICATION.md` for the checks actually performed.

## Credits and license

Original game code and procedural canvas artwork: MIT, see LICENSE. MediaPipe Tasks Vision (pinned to 0.10.14) and the Pose Landmarker model are external Google dependencies with their own licenses. Source: https://github.com/google-ai-edge/mediapipe . The app uses system fonts. No image generation or externally hosted illustrations are required.
