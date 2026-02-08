Ldiax

# Special Torch

A small Minecraft Bedrock Edition add-on (behavior + resource pack) that provides a custom "special torch" block and supporting scripts. This repository contains both the behavior and resource packs plus helper build scripts to package and deploy the add-on for local testing.

**Repository structure**
- **Behavior pack:** `behavior_packs/mc_myad/`
- **Resource pack:** `resource_packs/mc_myad/`
- **Source scripts:** `scripts/` and `lib/scripts/`

**Features**
- Custom torch block with special visuals and behavior
- Scripted interactions via Minecraft server scripting APIs
- Build helpers to package as a `.mcaddon` and deploy locally

**Prerequisites**
- Minecraft Bedrock Edition (latest supported version)
- Node.js (16+ recommended) and `npm`
- Windows only: developer Loopback isolation commands (for testing with local Minecraft) — see below

**Quick Install (for players)**
1. Open your Minecraft `behavior_packs` and `resource_packs` folders (platform dependent).
2. Copy the contents of `behavior_packs/mc_myad/` into your world's `behavior_packs` folder.
3. Copy the contents of `resource_packs/mc_myad/` into your world's `resource_packs` folder.
4. Enable both packs in the world settings and launch the world.

**Development & Build**
1. Install dependencies:

```powershell
npm install
```

2. Common scripts (defined in `package.json`):

```powershell
npm run lint         # run linter
npm run build        # build the project
npm run clean        # clean build artifacts
npm run local-deploy # deploy locally to Minecraft (if configured)
npm run mcaddon      # package into a .mcaddon file
```

3. Windows: add loopback exemptions for Minecraft to allow local testing (run as Administrator):

```powershell
CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436
CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-424268864-5579737-879501358-346833251-474568803-887069379-4040235476
```

**How to Test Locally**
- Use `npm run local-deploy` to copy the built packs to your local Minecraft folders (project may prompt or require additional configuration).
- Alternatively, run `npm run mcaddon` to create a `.mcaddon` file and import it into Minecraft.

**Contributing**
- Fork the repository and create a feature branch for changes.
- Open a PR with a clear description and testing steps.

**License**
- This project does not include a license file by default. Add a `LICENSE` if you want to open-source the project under a specific license.

**Notes**
- Many files and names in this repo are Portuguese (e.g., `tocha_especial`); consider renaming for wider audience if desired.
- If you want, I can translate in-repo strings to English or improve packaging scripts.

---
Ldiax
