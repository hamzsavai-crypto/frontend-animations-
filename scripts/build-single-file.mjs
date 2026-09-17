import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function readAsset(rel) {
  return fs.readFileSync(path.join(dist, rel));
}

function toBase64(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function main() {
  const indexHtmlPath = path.join(dist, 'index.html');
  let html = fs.readFileSync(indexHtmlPath, 'utf-8');

  // find css and js assets from dist/index.html or from dist folder
  const files = fs.readdirSync(path.join(dist, 'assets'));
  const cssFile = files.find(f => f.endsWith('.css'));
  const jsFile = files.find(f => f.endsWith('.js'));

  if (!cssFile || !jsFile) {
    console.error('CSS or JS not found in dist/assets');
    process.exit(1);
  }

  let css = fs.readFileSync(path.join(dist, 'assets', cssFile), 'utf-8');
  let js = fs.readFileSync(path.join(dist, 'assets', jsFile), 'utf-8');

  // inline fonts as base64 in css
  const fontMap = {
    '/assets/Geist-Variable-CrgPqtmy.woff2': path.join(dist, 'assets', 'Geist-Variable-CrgPqtmy.woff2'),
    '/assets/Geist-Italic_wght_-vKc54d3Z.woff2': path.join(dist, 'assets', 'Geist-Italic_wght_-vKc54d3Z.woff2'),
    '/assets/GeistMono-Variable-BNLlm6Cd.woff2': path.join(dist, 'assets', 'GeistMono-Variable-BNLlm6Cd.woff2'),
    '/assets/GeistMono-Italic_wght_-MBthCoE1.woff2': path.join(dist, 'assets', 'GeistMono-Italic_wght_-MBthCoE1.woff2'),
  };

  for (const [urlPath, filePath] of Object.entries(fontMap)) {
    if (fs.existsSync(filePath)) {
      const b64 = toBase64(filePath, 'font/woff2');
      // css may contain url("/assets/...") or url(/assets/...) without quotes
      css = css.split(`url(${urlPath})`).join(`url(${b64})`);
      css = css.split(`url("${urlPath}")`).join(`url(${b64})`);
      css = css.split(`url('${urlPath}')`).join(`url(${b64})`);
    }
  }

  // inline interference image in JS and CSS (if any)
  const imgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'));
  for (const img of imgFiles) {
    const assetPath = path.join(dist, 'assets', img);
    const mime = img.endsWith('.png') ? 'image/png' : img.endsWith('.jpg') ? 'image/jpeg' : 'image/webp';
    const b64 = toBase64(assetPath, mime);
    const url1 = `/assets/${img}`;
    const url2 = `/assets/${img}`; // same
    js = js.split(url1).join(b64);
    // also css might reference? unlikely
    css = css.split(url1).join(b64);
  }

  // also need to handle favicon-lab.svg etc? Those are in public, not in assets. For single-file, we can embed a simple favicon or leave as is but self-contained ideally not need.
  // We'll replace favicon links with data uri for a simple dot.
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><ellipse cx="13" cy="13" rx="11" ry="4.6" stroke="rgba(148,163,184,0.55)" stroke-width="1.1" transform="rotate(-24 13 13)" fill="none"/><ellipse cx="13" cy="13" rx="11" ry="4.6" stroke="rgba(148,163,184,0.35)" stroke-width="1.1" transform="rotate(38 13 13)" fill="none"/><circle cx="13" cy="13" r="2.4" fill="#FFB224"/></svg>`;
  const faviconB64 = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString('base64')}`;

  // Build final HTML
  // Remove original link and script tags, then inject inlined
  // Keep meta tags from original but simplify

  const finalHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#0B0D12"/>
<meta name="description" content="Physics Lab — a premium interactive physics education platform. Understand physics by playing with it: live simulations of projectile motion, harmonic motion and optics."/>
<meta name="keywords" content="physics, interactive simulations, education, projectile motion, simple harmonic motion, optics, physics lab"/>
<link rel="icon" type="image/svg+xml" href="${faviconB64}"/>
<title>Physics Lab — Understand physics by playing with it</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet"/>
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script type="module">
${js}
</script>
</body>
</html>
`;

  // Write to multiple locations
  const outPaths = [
    path.join(root, 'public', 'physics-lab-single-file.html'),
    path.join(root, 'standalone', 'physics-lab-single-file.html'),
    path.join('/home/user', 'physics-lab-single-file.html'),
    path.join(dist, 'physics-lab-single-file.html')
  ];

  for (const p of outPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, finalHtml, 'utf-8');
    console.log(`Wrote ${p} (${(finalHtml.length/1024).toFixed(1)} KB)`);
  }

  // Also create a more lightweight vanilla standalone version for true offline (no React) as alternative?
  // We'll also generate a second version that is hand-crafted vanilla with same design but no external deps, to ensure it works even if JS bundle fails.
  // For now, the inlined build is sufficient as single-file build.

  console.log('Single-file build done.');
}

main();
