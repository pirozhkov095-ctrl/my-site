# T-Unleash

Site statique prêt pour GitHub Pages. Le fichier `index.html` suffit pour publier le site.

1. Créez un dépôt GitHub et ajoutez-y `index.html` à sa racine.
2. Dans **Settings → Pages**, choisissez **Deploy from a branch**, puis la branche et le dossier `/ (root)` contenant le fichier.
3. Enregistrez et ouvrez l’adresse GitHub Pages affichée après le déploiement.

Les liens et versions proviennent du fichier apps.txt fourni. L’onglet Wiring renvoie vers les dépôts en attendant des schémas de câblage propres à chaque configuration.

## ESP32 web flasher

The Flasher tab uses ESP Web Tools and requires HTTPS (GitHub Pages provides it) and a desktop browser with Web Serial support. Firmware manifests are deliberately not supplied yet; all combinations remain unavailable until configured.

To enable a verified board and firmware combination, add its ESP Web Tools manifest URL in `flasher-config.js`. The manifest must specify the correct `chipFamily`, firmware binary paths, and flash offsets for that exact build. Host the manifest and binaries where the browser can fetch them, with CORS configured if they are on another origin. The site's relative paths work under a GitHub Pages project URL. Configure only combinations whose firmware and board compatibility have been verified. Test the manifest and installation on the actual board before publishing it.

Example manifest structure (replace the chip family, file name and offset with values confirmed for your build):

```json
{
  "name": "Firmware name",
  "version": "version",
  "builds": [{
    "chipFamily": "ESP32-S3",
    "parts": [{ "path": "firmware.bin", "offset": 0 }]
  }]
}
```
