// drawtale renderer. Frames come from the page's canvas (no screenshots), ffmpeg packs them.
//   node render.mjs film.html                 full render -> out/<name>.mp4 (+ -final.mp4 if out/mix.wav exists)
//   node render.mjs film.html --grid 36       one contact sheet of 36 evenly spaced frames
//   node render.mjs film.html --strip 480,24  24 consecutive frames from frame 480
//   node render.mjs film.html --only 12,300   just those frames as PNGs
//   --width 1280   smaller output for quick checks     --out DIR   output folder (default ./out)
import puppeteer from 'puppeteer-core';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const argv = process.argv.slice(2), opt = {}; let file;
for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (opt[argv[i].slice(2)] = argv[++i]) : (file = argv[i]);
if (!file) { console.error('usage: node render.mjs film.html [--grid N | --strip A,N | --only a,b,c] [--width px] [--out dir]'); process.exit(1); }
const name = path.basename(file, '.html'), out = path.resolve(opt.out || path.join(path.dirname(file), 'out')), frames = path.join(out, name + '-frames');
const preview = 'grid' in opt || 'strip' in opt || 'only' in opt;
mkdirSync(out, {recursive: true});
const url = pathToFileURL(path.resolve(file)); url.searchParams.set('bare', '1'); if (opt.width) url.searchParams.set('w', opt.width);
const chrome = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('No Chrome found; set CHROME=/path/to/chrome');
const save = (f, dataUrl) => writeFileSync(f, Buffer.from(dataUrl.split(',')[1], 'base64'));
const ff = a => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], {stdio: 'inherit'});
const browser = await puppeteer.launch({executablePath: chrome, headless: true, protocolTimeout: 0});
let N, fps;
try {
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url.href, {waitUntil: 'load'});
  await page.waitForFunction('window.DT && (window.DT.ready === true || window.DT.error)', {timeout: 60000});
  const meta = await page.evaluate(() => ({N: window.DT.frames, fps: window.DT.fps, size: window.DT.size, error: window.DT.error}));
  if (meta.error || errors.length) throw new Error(meta.error || errors.join('\n'));
  ({N, fps} = meta); console.log(`${name}: ${N} frames, ${fps} fps, ${meta.size.w}x${meta.size.h}, ${(N / fps).toFixed(1)} s`);
  if ('grid' in opt) save(path.join(out, `${name}-grid.jpg`), await page.evaluate(n => window.DT.grid(n), +opt.grid || 24));
  else if ('strip' in opt) { const [a, n] = opt.strip.split(',').map(Number); save(path.join(out, `${name}-strip-${a}.jpg`), await page.evaluate(([a, n]) => window.DT.strip(a, n), [a, n || 12])); }
  else {
    if (!('only' in opt)) rmSync(frames, {recursive: true, force: true});
    mkdirSync(frames, {recursive: true});
    const list = 'only' in opt ? opt.only.split(',').map(Number) : Array.from({length: N}, (_, i) => i);
    for (const [k, i] of list.entries()) { save(path.join(frames, `${String(i).padStart(4, '0')}.png`), await page.evaluate(i => window.DT.frame(i), i)); if (errors.length) throw new Error(`frame ${i}: ${errors.join('\n')}`); if (!preview && ((k + 1) % 240 === 0 || k === list.length - 1)) console.log(`  ${k + 1}/${N}`); }
  }
} finally { await browser.close(); }
if (!preview) {
  const mp4 = path.join(out, `${name}.mp4`);
  ff(['-framerate', String(fps), '-i', path.join(frames, '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', mp4]);
  ff(['-i', mp4, '-vf', `fps=1/3,scale=240:-2,tile=6x${Math.max(1, Math.ceil(N / fps / 3 / 6))}`, '-frames:v', '1', path.join(out, `${name}-contact.jpg`)]);
  const mix = path.join(out, 'mix.wav');
  if (existsSync(mix)) { const fin = path.join(out, `${name}-final.mp4`); ff(['-i', mp4, '-i', mix, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-t', String(N / fps), fin]); console.log(`final: ${fin}`); }
  else console.log(`video (no audio): ${mp4}  — run mix.mjs first for the narrated version`);
} else console.log(`preview in ${out}`);
