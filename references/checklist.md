# Delivery checklist

Before calling it done, run and report each of these:

1. `node render.mjs film.html --grid 36` — every scene present, no blank/black frames
   except the intended fades between scenes; in presenter mode, no narrator off its mark.
2. `--strip START,24` across one walk-on and one fast prop move — no popping, contacts
   planted (feet on the floor line, hands on props).
3. `--only N` full-size stills of two busy scenes — style gates in `style.md`.
4. `node mix.mjs film.html` then the full render; check:
   `ffprobe -show_entries format=duration:stream=nb_frames` (frames = dur × 24),
   `ffmpeg -i final.mp4 -f null -` decodes without error,
   `ffmpeg -i out/mix.wav -af ebur128 -f null -` ≈ −16 LUFS.
5. Line/duration sanity for the voice (see narration.md); subtitles match the audio order.
6. Report honestly: you did not hear the audio; name the proper nouns the user should
   listen for; note which scenes were checked only on the grid.
7. Deliver: `out/<film>-final.mp4`, `out/<film>-contact.jpg`, the source folder, and the
   rebuild commands (tts → mix → render).
