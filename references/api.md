# API

## kuanimation.js (runtime)
`W H S TAU` · `lerp clamp lerp2` · `parseColor mix tint shade alpha` · `rng(seed)() hash(k,seed) wobble(x,seed)` ·
`linear easeIO easeIn easeOut easeInOutSine easeOutExpo easeOutBack` · `span(a,b,t,ease)` 0..1 between times ·
`keys(t, [[time, value | [values], ease?],…])` · `onTwos(t)` · `smoothLine(pts,step,close)` · `polyPath(pts,close)` · `twoBone(root,target,a,b,bend)` ·
`resetT(c) cam(c,x,y,zoom,rot) layer() blit(c,L)` · `sprite(id,[x,y,w,h],draw,res) blitS(c,sp,al)` cached drawings ·
`txt(c,s,x,y,{size,font,color,align,weight,italic,al,reveal,shadow})` · `tone hiss` for scores ·
`defineFilm({timeline:[{name,dur,fn(c,tau)}], score, fps, width})`. Page hooks: `DT.frame(i) DT.grid(n) DT.strip(a,n) DT.wav() DT.cues DT.dur`.

## brush.js
`FONT.serif/khmer/hand/ui` · vectors `add sub mul len norm rot xf(pts,x,y,s,a,flipX)` · shapes `rectP ell circ rr(x,y,w,h,r)` ·
`curve(pts,close)` (third value 1 = corner) · `cutAt(q,u)` · `profile(keys)` · `strip(pts,widthFn)` ·
`sh(c,pts,fill,{w,tex,line,al,color})` filled cut-out with outline · `mk(c,pts,{w,color,al,close})` open stroke ·
`inkLine` low level · `vgrad(top,bottom) hgrad(a,b)` fill functions · `texture(c,path,k)` · `INK LINE` defaults ·
`useStyle('wash'|'haze'|'paper'|'marker')` · `celShade(c,path,q,k)` haze shading · `mottle(c,path,k)` watercolour grain · `STYLE` · `deckle(q,amp)` torn edge · `pin(c,[x,y],r)` brass split-pin (paper only) · `sh(...,{lift})` shadow depth.

## stage.js
`T` palette (set from `PALETTES.wash|haze|paper|marker` by `useStyle`) · `WASH_MOODS` · `HAZE_MOODS` · `MOODS` (paper, marker) · `STG {floorY:760}` ·
`stageBack(c,mood)` · `stageFloor(c,mood)` · `stageFront(c,open)` frame + scene transition · `subtitle(c,l1,l2,u,al,{font1,font2})` (line 1 in any language: the style's lettering with script-font fallback) ·
wash: `washLandscape(mood,seed)` `washGround` `softFade` `washSubtitle` `pool(g,pts,col)` · haze: `hazeLandscape(mood,seed)` `hazeGround` `hazeFront(c,open)` `clump(g,x,y,r,{base,lit,dk,inkAl,lw,seed})` `canopyBand(g,{y0,y1,r0,r1,base,haze,glow,k,seed,roll})` · paper: `paperLandscape(mood,seed)` `paperGround` `shadowBox` `tearShutter(c,open)` · marker: `washLayer` `sideCurtains` `valance` `mainCurtain`.
Characters stand on y ≈ 760..1060 (front of stage ≈ 900–1030).

## cast.js
`face(c,r,{mood,mouth,blink,look,cheeks})` · `grandpa(c,x,y,s,{mouth,blink,look,gesture,gp,walk,t,dir})` the built-in narrator ·
`pp(c,x,y,s,{body,skin,hat,mood,arms,walk,t,dir,mouth,robe,skirt,prop:{draw(c,handR,handL),behind}})` player ·
`HATS` · `PROPS.spear/parasol/bowl/oar/scroll/shield` · `elephantT(c,x,y,s,phase,{cloth,rider,walk,gold})` · `apsaraT(c,x,y,s,t,{body})` (Khmer dancer).
A new narrator is a function with `grandpa`'s signature; pass it as `buildPlay(SCENES,{narrator})`.

## props.js
`waveRoller(c,y,t,{col,dk,amp,ph,h})` · `signBoard(c,x,y,w,h,text,{font,size,fill,col,drop})` · `onStick(c,x,y,draw,p)` ·
general: `sunBurst cloudT palmT treeT stiltHouse mountainT boatT shipT fireT crocT confetti throneT blockT hangingMap(c,x,y,w,h,drop,draw(g,w,h))` ·
from the Angkor example: `budTower angkorFlat bayonT brickTowerT buddhaT gateT flagT` (Cambodia's flag).

## action.js
`travel(tau,t0,t1,a,b,ease)` → [x,y] · `hop(tau,t0,t1,a,b,h)` arc jump · `stepPhase(x,stride)` walk phase from distance ·
`shake(tau,t0,amp,d)` → {dx,dy} camera offset · `bubble(c,tau,t0,t1,x,y,content,{w,h,tail,think,size})` speech/thought (text or draw fn) ·
`emote(c,tau,t0,x,y,kind,{s,t1})` kinds `! ? heart sweat anger zzz idea` · `impact(c,tau,t0,x,y,{r,col,d})` ·
`speedLines(c,x,y,dir,{n,len,spread})` · `dust(c,tau,t0,x,y,{n,s,d})` ·
`rain(c,tau,{n,al,slant,speed,len,col})` screen-space rain · `glowLight(c,x,y,r,col,k)` lamp/sun bloom.

## director.js
`timing(V,{pre,post,holds})` · `speaking(S,tau)` → `{i,l,u,amp}` · `L_(S)(i)` line start · `pop(tau,t0,d)` · `rise(c,p,draw)` ·
`buildPlay(SCENES,{narrator=null,style='wash'|'haze'|'paper'|'marker',frame='stage'|'full',subtitles,end})` → timeline (+ `window.DT.cues`) · `endCard(lines,{dur})` ·
`DEFAULT_CAMERA` slow push-in · `applyCamera(c,{x,y,zoom,dx,dy})` · `dipCut` · `performNarrator` (presenter mode).
Scene fields: `name mood set(c,tau,S) holds pre post dur beats camera captions curtainOpen`; presenter-only: `gx gy gs dir gestures special`.
`S.beats(i)` = start of voice line i (or `beats[i]` for a voiceless scene).

## Tools
`node render.mjs film.html [--grid N | --strip A,N | --only a,b] [--width px] [--out dir]` ·
`node mix.mjs film.html` → `out/mix.wav` (score ducked under voice, −16 LUFS) ·
`tts_gemini.py --voice --style --per` · `tts_edge.py --voice --rate --pitch`.
