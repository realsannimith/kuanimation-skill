// Builds out/mix.wav: the film's score (rendered offline by the page) with the
// narrator's voice clips placed at their cues, music ducked under the voice.
//   node mix.mjs film.html
import puppeteer from 'puppeteer-core';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const file = process.argv[2] || 'film.html', out = path.join(path.dirname(file), 'out'); mkdirSync(out, {recursive: true});
const url = pathToFileURL(path.resolve(file)); url.searchParams.set('bare', '1');
const chrome = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
const browser = await puppeteer.launch({executablePath: chrome, headless: true, protocolTimeout: 0});
let cues, dur, hasScore;
try {
  const page = await browser.newPage(); await page.goto(url.href, {waitUntil: 'load'});
  await page.waitForFunction('window.DT && (window.DT.ready === true || window.DT.error)', {timeout: 60000});
  ({cues, dur, hasScore} = await page.evaluate(() => ({cues: window.DT.cues || [], dur: window.DT.dur, hasScore: !!window.DT.wav})));
  if (hasScore) writeFileSync(path.join(out, 'score.wav'), Buffer.from(await page.evaluate(() => window.DT.wav()), 'base64'));
} finally { await browser.close(); }
const ff = a => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], {stdio: 'inherit'});
const voice = path.join(out, 'voice.wav'), score = path.join(out, 'score.wav'), mix = path.join(out, 'mix.wav');
if (cues.length) {
  const args = []; for (const c of cues) args.push('-i', path.resolve(path.dirname(file), c.file));
  const parts = cues.map((c, i) => `[${i}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay=${Math.round(c.t * 1000)}|${Math.round(c.t * 1000)}[v${i}]`);
  ff([...args, '-filter_complex', parts.join(';') + ';' + cues.map((_, i) => `[v${i}]`).join('') + `amix=inputs=${cues.length}:normalize=0,apad,atrim=0:${dur}[vo]`, '-map', '[vo]', voice]);
}
if (cues.length && hasScore) ff(['-i', score, '-i', voice, '-filter_complex', '[1:a]volume=1.6,asplit=2[vk][vm];[0:a]volume=0.55[m];[m][vk]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[md][vm]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]', '-map', '[a]', '-ar', '48000', mix]);
else if (cues.length) ff(['-i', voice, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', mix]);
else if (hasScore) ff(['-i', score, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', mix]);
else { console.log('nothing to mix: no score and no voice cues'); process.exit(0); }
console.log(`mix: ${mix}  (${cues.length} voice cues, ${dur.toFixed(1)} s${hasScore ? ', with score' : ''})`);
