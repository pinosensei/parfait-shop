/* ==========================================================
   Parfait Shop – game.js   (Step 1: interface + free building)
   All pictures are original SVG drawings made in this file.
   Saved data uses ONLY these keys:
     pinoParfait_v1        (the parfait design)
     pinoParfait_prefs_v1  (switch settings)
   Nothing else in localStorage is ever read, changed or deleted.
   ========================================================== */
(() => {
'use strict';

const SAVE_KEY  = 'pinoParfait_v1';
const PREFS_KEY = 'pinoParfait_prefs_v1';
const TRAY_W = 680, TRAY_H = 548;
const GLASS_X = 340;           // centre of the glass (tray coords)

/* ---------------------------------------------------------
   1. ORIGINAL ILLUSTRATIONS (each drawn in a 100×100 box)
   --------------------------------------------------------- */
const O = '#5b3a29';
const st = (w = 3) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const f1 = n => n.toFixed(1);
const around = (n, fn) => { let s = ''; for (let i = 0; i < n; i++) s += fn(i, i / n * Math.PI * 2); return s; };
const pt = (r, a, c = 50) => [f1(c + Math.cos(a) * r), f1(c + Math.sin(a) * r)];
function seeded(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

const ART = {};

ART.strawberry =
  `<path d="M50 90C28 80 14 58 18 40C22 26 38 24 50 32C62 24 78 26 82 40C86 58 72 80 50 90Z" fill="#ff4f6e" ${st()}/>` +
  [[36,46],[50,44],[64,46],[42,58],[58,58],[50,70],[30,58],[70,58],[44,79],[56,79]]
    .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="2.7" fill="#ffe08a"/>`).join('') +
  `<ellipse cx="32" cy="42" rx="4.5" ry="8" fill="#fff" opacity=".45" transform="rotate(25 32 42)"/>` +
  `<path d="M50 35L37 24L46 27L43 13L50 23L57 13L54 27L63 24Z" fill="#5cc45a" ${st(2.5)}/>`;

ART.banana =
  `<g transform="rotate(-30 50 50)">` +
  `<ellipse cx="50" cy="50" rx="45" ry="19" fill="#f2d35f" ${st()}/>` +
  `<ellipse cx="50" cy="50" rx="39" ry="14" fill="#fdf1c0"/>` +
  `<path d="M50 50L44 46M50 50L56 46M50 50L50 57" stroke="#cdb46a" stroke-width="2.2" stroke-linecap="round"/>` +
  `<circle cx="34" cy="50" r="1.4" fill="#b99a55"/><circle cx="66" cy="50" r="1.4" fill="#b99a55"/>` +
  `<ellipse cx="34" cy="42" rx="11" ry="3" fill="#fff" opacity=".7"/></g>`;

ART.kiwi =
  `<circle cx="50" cy="50" r="40" fill="#9a7444" ${st()}/><circle cx="50" cy="50" r="34" fill="#8bd640"/>` +
  around(16, (i, a) => { const [x1, y1] = pt(14, a), [x2, y2] = pt(31, a);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b9ec7c" stroke-width="1.5"/>`; }) +
  `<ellipse cx="50" cy="50" rx="12" ry="10" fill="#f4f9d2"/>` +
  around(12, (i, a) => { const [x, y] = pt(19, a);
    return `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="3.3" fill="#2d2a26" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${x} ${y})"/>`; });

ART.orange =
  `<circle cx="50" cy="50" r="40" fill="#ff9f1c" ${st()}/><circle cx="50" cy="50" r="34" fill="#fff1cf"/>` +
  around(8, (i, a) => { const a1 = a + .07, a2 = a + Math.PI / 4 - .07;
    const [ax, ay] = pt(4, a1), [bx, by] = pt(30, a1), [cx, cy] = pt(30, a2), [dx, dy] = pt(4, a2);
    return `<path d="M${ax} ${ay}L${bx} ${by}A30 30 0 0 1 ${cx} ${cy}L${dx} ${dy}Z" fill="#ffb732" stroke="#ffb732" stroke-width="2" stroke-linejoin="round"/>`; }) +
  `<ellipse cx="36" cy="34" rx="6" ry="3.5" fill="#fff" opacity=".5" transform="rotate(-35 36 34)"/>`;

ART.blueberry =
  `<circle cx="50" cy="54" r="36" fill="#4f5fd6" ${st()}/>` +
  `<ellipse cx="38" cy="44" rx="9" ry="6" fill="#a9b6ff" opacity=".6" transform="rotate(-30 38 44)"/>` +
  `<path d="M42 24L46 30L50 22L54 30L58 24L57 33L43 33Z" fill="#2f3a8f" ${st(2)}/>`;

ART.grape =
  `<path d="M50 24L52 9" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M53 14C62 5 74 9 77 15C69 20 59 20 53 14Z" fill="#5cc45a" ${st(2)}/>` +
  `<circle cx="50" cy="56" r="33" fill="#9b4dca" ${st()}/>` +
  `<ellipse cx="38" cy="45" rx="7" ry="11" fill="#fff" opacity=".4" transform="rotate(25 38 45)"/>`;

ART.peach =
  `<path d="M50 88C24 88 12 66 16 48C20 30 36 24 50 34C64 24 80 30 84 48C88 66 76 88 50 88Z" fill="#ffb7a8" ${st()}/>` +
  `<ellipse cx="64" cy="62" rx="15" ry="13" fill="#ff8a8a" opacity=".45"/>` +
  `<path d="M50 37C44 52 46 70 50 85" stroke="#e8857a" stroke-width="3" fill="none" stroke-linecap="round"/>` +
  `<path d="M50 34C52 22 62 14 74 16C70 28 60 34 50 34Z" fill="#5cc45a" ${st(2.5)}/>`;

ART.cherry =
  `<path d="M44 58C44 38 54 22 70 11" fill="none" stroke="#4f8a2b" stroke-width="4" stroke-linecap="round"/>` +
  `<path d="M68 13C78 4 92 8 94 15C85 21 74 21 68 13Z" fill="#5cc45a" ${st(2)}/>` +
  `<circle cx="42" cy="66" r="24" fill="#e01e37" ${st()}/>` +
  `<ellipse cx="34" cy="58" rx="5" ry="7" fill="#fff" opacity=".6" transform="rotate(30 34 58)"/>`;

ART.melon =
  `<path d="M16 8C72 12 98 60 74 95C50 74 44 34 16 8Z" fill="#dcef80"/>` +
  `<path d="M19 9C72 14 96 60 74 92" fill="none" stroke="#67a83a" stroke-width="9" stroke-linecap="round"/>` +
  `<path d="M16 8C72 12 98 60 74 95C50 74 44 34 16 8Z" fill="none" ${st()}/>` +
  `<path d="M30 16C56 26 74 50 76 76" fill="none" stroke="#f3fbc2" stroke-width="4" stroke-linecap="round"/>` +
  `<ellipse cx="38" cy="26" rx="1.8" ry="3.2" fill="#f6f2c8" transform="rotate(-50 38 26)"/>` +
  `<ellipse cx="52" cy="42" rx="1.8" ry="3.2" fill="#f6f2c8" transform="rotate(-35 52 42)"/>` +
  `<ellipse cx="60" cy="60" rx="1.8" ry="3.2" fill="#f6f2c8" transform="rotate(-20 60 60)"/>`;

ART.pineapple =
  `<circle cx="50" cy="50" r="40" fill="#ffe14d"/>` +
  around(12, (i, a) => { const [x1, y1] = pt(16, a), [x2, y2] = pt(35, a);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f3c62f" stroke-width="2.5" stroke-linecap="round"/>`; }) +
  `<circle cx="50" cy="50" r="37" fill="none" stroke="#f5b82e" stroke-width="5"/>` +
  `<circle cx="50" cy="50" r="40" fill="none" ${st()}/>` +
  `<circle cx="50" cy="50" r="12" fill="#fffbe6" ${st(2.5)}/>`;

ART.apple =
  `<path d="M10 42L90 42Q86 86 50 90Q14 86 10 42Z" fill="#fff3c8"/>` +
  `<path d="M12 50Q18 84 50 88Q82 84 88 50" fill="none" stroke="#e63946" stroke-width="8" stroke-linecap="round"/>` +
  `<path d="M10 42L90 42Q86 86 50 90Q14 86 10 42Z" fill="none" ${st()}/>` +
  `<ellipse cx="45" cy="54" rx="2.6" ry="4.6" fill="#7a4a24" transform="rotate(-15 45 54)"/>` +
  `<ellipse cx="55" cy="54" rx="2.6" ry="4.6" fill="#7a4a24" transform="rotate(15 55 54)"/>`;

function scoop(c, shade, extra = '') {
  return `<path d="M14 62C10 34 30 16 50 16C70 16 90 34 86 62C82 66 78 60 74 66C70 72 64 64 58 70C52 76 46 66 40 72C34 76 30 64 24 68C18 70 16 64 14 62Z" fill="${c}" ${st()}/>` +
    `<path d="M20 58C34 64 66 64 80 58" stroke="${shade}" stroke-width="3" fill="none" stroke-linecap="round"/>` + extra +
    `<ellipse cx="34" cy="32" rx="8" ry="5" fill="#fff" opacity=".6" transform="rotate(-25 34 32)"/>`;
}
ART.vanilla  = scoop('#fff4d6', '#f0dca8', `<circle cx="58" cy="40" r="1.6" fill="#3b2a20"/><circle cx="44" cy="48" r="1.4" fill="#3b2a20"/><circle cx="66" cy="50" r="1.4" fill="#3b2a20"/>`);
ART.strawice = scoop('#ffb3c6', '#f48aa7', `<circle cx="58" cy="38" r="3" fill="#ff5c7c"/><circle cx="44" cy="50" r="2.6" fill="#ff5c7c"/><circle cx="68" cy="52" r="2.4" fill="#ff5c7c"/>`);
ART.chocoice = scoop('#9a6243', '#6e4128', `<rect x="56" y="36" width="5" height="4" rx="1" fill="#4a2a17"/><rect x="42" y="47" width="5" height="4" rx="1" fill="#4a2a17"/><rect x="66" y="50" width="5" height="4" rx="1" fill="#4a2a17"/>`);

ART.cream =
  `<path d="M16 80C8 80 8 66 18 64C10 58 16 46 28 48C24 38 34 30 44 34C44 24 54 14 60 8C60 20 70 26 66 36C78 34 86 44 78 52C90 54 92 66 84 68C92 72 90 82 82 80Z" fill="#fffdf6" ${st()}/>` +
  `<path d="M22 67C40 73 64 73 80 67M28 51C40 57 60 57 72 51M42 37C50 41 58 41 64 37" stroke="#e8dac2" stroke-width="3" fill="none" stroke-linecap="round"/>`;

function sauce(c) {
  return `<path d="M8 30C20 22 32 34 44 26C56 18 68 32 80 24C86 20 92 24 92 30L92 40C92 46 86 46 86 52C86 62 78 62 78 52C78 46 70 44 66 50L66 70C66 80 56 80 56 70L56 48C52 44 46 46 44 52C44 58 36 58 36 52C36 46 28 44 24 50L24 62C24 70 14 70 14 62L14 44C8 42 8 36 8 30Z" fill="${c}" ${st(2.5)}/>` +
    `<path d="M18 32C28 28 36 34 46 30" stroke="#fff" opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
ART.chocosauce = sauce('#6b3a1f');
ART.strawsauce = sauce('#e63950');

ART.ice = [[14,62,-8],[36,66,6],[58,64,-4],[76,60,10],[24,44,12],[46,46,-6],[66,42,8],[34,26,-10],[56,24,6]]
  .map(([x, y, r]) => `<g transform="rotate(${r} ${x + 11} ${y + 11})"><rect x="${x}" y="${y}" width="22" height="22" rx="5" fill="#e4f6ff" ${st(2.2)}/>` +
    `<path d="M${x + 22} ${y + 6}L${x + 22} ${y + 17}Q${x + 22} ${y + 22} ${x + 17} ${y + 22}L${x + 6} ${y + 22}" fill="none" stroke="#a9dcf5" stroke-width="3" stroke-linecap="round"/>` +
    `<rect x="${x + 4}" y="${y + 4}" width="7" height="4" rx="2" fill="#fff"/></g>`).join('');

ART.wafer =
  `<g transform="rotate(-18 50 50)"><rect x="39" y="5" width="22" height="90" rx="9" fill="#f2c27b" ${st()}/>` +
  `<path d="M40 20L60 30M40 36L60 46M40 52L60 62M40 68L60 78" stroke="#d79a4a" stroke-width="2.5" stroke-linecap="round"/></g>`;

ART.sprinkles = (() => {
  const r = seeded(7), cols = ['#ff5c8a', '#ffd23f', '#4fc3f7', '#7bd389', '#b388ff', '#ff9f40'];
  let s = '';
  for (let i = 0; i < 28; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 34;
    const x = 50 + Math.cos(a) * d, y = 52 + Math.sin(a) * d * .8;
    s += `<rect x="${f1(x - 1.8)}" y="${f1(y - 5.5)}" width="3.6" height="11" rx="1.8" fill="${cols[i % cols.length]}" transform="rotate(${Math.round(r() * 180)} ${f1(x)} ${f1(y)})"/>`;
  }
  return s;
})();

/* ---------------------------------------------------------
   2. INGREDIENT LIST
   kind: 'count'   → will use "How many?" (1–5) in Shop Talk
         'scoop'   → ice cream, counted in scoops
         'topping' → no "How many?" (cream, sauces, sprinkles)
   s = starting size, h = how much height it fills in the glass
   --------------------------------------------------------- */
const ING = [
  { id:'strawberry', label:'strawberry', one:'strawberry', many:'strawberries', ja:'いちご',        kind:'count',   s:0.88, h:.55 },
  { id:'banana',     label:'banana',     one:'banana',     many:'bananas',      ja:'バナナ',        kind:'count',   s:0.78, h:.45 },
  { id:'kiwi',       label:'kiwi',       one:'kiwi',       many:'kiwis',        ja:'キウイ',        kind:'count',   s:0.78, h:.50 },
  { id:'orange',     label:'orange',     one:'orange',     many:'oranges',      ja:'オレンジ',      kind:'count',   s:0.78, h:.50 },
  { id:'blueberry',  label:'blueberry',  one:'blueberry',  many:'blueberries',  ja:'ブルーベリー',  kind:'count',   s:0.43, h:.45 },
  { id:'grape',      label:'grape',      one:'grape',      many:'grapes',       ja:'ぶどう',        kind:'count',   s:0.53, h:.45 },
  { id:'peach',      label:'peach',      one:'peach',      many:'peaches',      ja:'もも',          kind:'count',   s:0.88, h:.50 },
  { id:'cherry',     label:'cherry',     one:'cherry',     many:'cherries',     ja:'さくらんぼ',    kind:'count',   s:0.75, h:.40 },
  { id:'melon',      label:'melon',      one:'melon',      many:'melons',       ja:'メロン',        kind:'count',   s:1.06, h:.45 },
  { id:'pineapple',  label:'pineapple',  one:'pineapple',  many:'pineapples',   ja:'パイナップル',  kind:'count',   s:0.81, h:.45 },
  { id:'apple',      label:'apple',      one:'apple',      many:'apples',       ja:'りんご',        kind:'count',   s:0.88, h:.40 },
  { id:'wafer',      label:'wafer',      one:'wafer',      many:'wafers',       ja:'ウエハース',    kind:'count',   s:1.38, h:.20 },
  { id:'vanilla',    label:'vanilla ice',    one:'vanilla ice cream',    many:'vanilla ice cream',    ja:'バニラアイス', kind:'scoop', s:1.56, h:.42, cat:'ice' },
  { id:'strawice',   label:'strawberry ice', one:'strawberry ice cream', many:'strawberry ice cream', ja:'いちごアイス', kind:'scoop', s:1.56, h:.42, cat:'ice' },
  { id:'chocoice',   label:'chocolate ice',  one:'chocolate ice cream',  many:'chocolate ice cream',  ja:'チョコアイス', kind:'scoop', s:1.56, h:.42, cat:'ice' },
  { id:'ice',        label:'crushed ice', one:'crushed ice', many:'crushed ice', ja:'こおり',  kind:'topping', s:1.1, h:.40, cat:'ice' },
  { id:'cream',      label:'whipped cream',    one:'whipped cream',    many:'whipped cream',    ja:'ホイップ', kind:'topping', s:1.69, h:.45, cat:'top' },
  { id:'chocosauce', label:'chocolate sauce',  one:'chocolate sauce',  many:'chocolate sauce',  ja:'チョコソース',     kind:'topping', s:2.12, h:.15, cat:'top' },
  { id:'strawsauce', label:'strawberry sauce', one:'strawberry sauce', many:'strawberry sauce', ja:'いちごソース',     kind:'topping', s:2.12, h:.15, cat:'top' },
  { id:'sprinkles',  label:'sprinkles',  one:'sprinkles',  many:'sprinkles',    ja:'スプレー', kind:'topping', s:1.25, h:.15, cat:'top' },
];
const ING_BY = Object.fromEntries(ING.map(i => [i.id, i]));

/* ---------------------------------------------------------
   3. THE GLASS (back layer sits behind the food, front layer on top)
   --------------------------------------------------------- */
const BOWL = 'M172 80C168 250 226 412 340 428C454 412 512 250 508 80';
const GLASS_LINE = 'rgba(96,142,186,.95)';
/* The glass is drawn at 82% size and moved down, leaving room above the rim
   for tall toppings. GK = size, GTY = how far it moves down.               */
const GK = .82, GTY = 113.4;
const G_OPEN = `<g transform="translate(${f1(340 * (1 - GK))},${GTY}) scale(${GK})">`;
const RIM_Y = GTY + GK * 80;        // ≈ 179 in tray coords
const CREAM_TOP = 366;              // cream base top (glass drawing coords)
/* permanent custard / vanilla cream base – part of the glass, not an item */
const CREAM_BASE =
  `<clipPath id="bowlClip"><path d="${BOWL}Z"/></clipPath>` +
  `<g clip-path="url(#bowlClip)">` +
  `<path d="M160 ${CREAM_TOP}Q200 ${CREAM_TOP - 9} 240 ${CREAM_TOP}T320 ${CREAM_TOP}T400 ${CREAM_TOP}T480 ${CREAM_TOP}T560 ${CREAM_TOP}L560 440L160 440Z" fill="#ffeab0"/>` +
  `<path d="M160 ${CREAM_TOP + 22}Q240 ${CREAM_TOP + 30} 340 ${CREAM_TOP + 28}T560 ${CREAM_TOP + 22}L560 440L160 440Z" fill="#f9d98c" opacity=".7"/>` +
  `<path d="M160 ${CREAM_TOP}Q200 ${CREAM_TOP - 9} 240 ${CREAM_TOP}T320 ${CREAM_TOP}T400 ${CREAM_TOP}T480 ${CREAM_TOP}T560 ${CREAM_TOP}" fill="none" stroke="#efc66e" stroke-width="4"/>` +
  `<ellipse cx="300" cy="${CREAM_TOP + 14}" rx="22" ry="4" fill="#fff" opacity=".75"/>` +
  `<ellipse cx="372" cy="${CREAM_TOP + 30}" rx="12" ry="3" fill="#fff" opacity=".6"/>` +
  `</g>`;
const GLASS_BACK = G_OPEN +
  `<ellipse cx="340" cy="500" rx="125" ry="15" fill="rgba(91,58,41,.10)"/>` +
  `<path d="${BOWL}Z" fill="rgba(225,242,255,.45)"/>` +
  `<ellipse cx="340" cy="80" rx="168" ry="22" fill="rgba(255,255,255,.55)" stroke="${GLASS_LINE}" stroke-width="4"/>` +
  CREAM_BASE + `</g>`;
const GLASS_FRONT = G_OPEN +
  `<path d="${BOWL}" fill="rgba(200,232,255,.14)" stroke="${GLASS_LINE}" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M172 80A168 22 0 0 0 508 80" fill="none" stroke="${GLASS_LINE}" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M202 112C202 212 226 312 262 372" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" opacity=".6"/>` +
  `<path d="M478 120C478 182 468 240 452 290" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".4"/>` +
  `<path d="M325 426L330 486L350 486L355 426" fill="rgba(225,242,255,.8)" stroke="${GLASS_LINE}" stroke-width="4" stroke-linejoin="round"/>` +
  `<ellipse cx="340" cy="492" rx="96" ry="16" fill="rgba(225,242,255,.85)" stroke="${GLASS_LINE}" stroke-width="4"/>` +
  `<ellipse cx="305" cy="488" rx="34" ry="4" fill="#fff" opacity=".7"/></g>`;

/* half-width of the bowl at height y (used to place food neatly) */
function bowlHalf(y) {               // y in tray coords
  const gy = (y - GTY) / GK;
  const t = Math.min(1, Math.max(0, (gy - 80) / 348));
  return GK * 168 * (1 - .72 * t * t);
}

/* ---------------------------------------------------------
   4. STATE, SAVE & LOAD
   --------------------------------------------------------- */
const state = { shop: '', items: [] };
const prefs = { talk: false, ja: false, sound: true };
let selId = null;
const undoStack = [];
let pending = null;

function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } }
function fetchKey(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
function cleanItems() { return state.items.map(({ w, h, ...rest }) => rest); }

function loadAll() {
  const p = fetchKey(PREFS_KEY);
  if (p) Object.assign(prefs, p);
  const d = fetchKey(SAVE_KEY);
  if (d && d.v === 1 && Array.isArray(d.items)) {
    state.shop = String(d.shop || '');
    state.items = d.items.filter(it => it && (it.t === 'card' || ART[it.t]));
  }
}
const savePrefs = () => store(PREFS_KEY, prefs);

/* undo history */
const snap = () => JSON.stringify(cleanItems());
function beginChange() { if (pending === null) pending = snap(); }
function endChange() {
  if (pending === null) return;
  const now = snap();
  if (now !== pending) { undoStack.push(pending); if (undoStack.length > 50) undoStack.shift(); }
  pending = null;
  $('#undoBtn').disabled = !undoStack.length;
}

/* ---------------------------------------------------------
   5. DOM HELPERS & SCALING
   --------------------------------------------------------- */
const $ = s => document.querySelector(s);
const stage = $('#stage'), tray = $('#tray'), panel = $('#panel');
const itemsLayer = $('#items'), cardsLayer = $('#cards'), fx = $('#fx');
const toolbar = $('#toolbar'), trash = $('#trash'), hint = $('#hint');
let SCALE = 1;

function fit() {
  const w = window.innerWidth, h = window.innerHeight;
  SCALE = Math.min(w / 980, h / 640);
  stage.style.transform = `translate(${(w - 980 * SCALE) / 2}px,${(h - 640 * SCALE) / 2}px) scale(${SCALE})`;
  updateToolbar();
}
function toTray(e) {
  const r = tray.getBoundingClientRect();
  return { x: (e.clientX - r.left) / SCALE, y: (e.clientY - r.top) / SCALE };
}
const inRect = (e, el) => { const r = el.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
const uid = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const findItem = id => state.items.find(i => i.id === id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------------------------------------------------------
   6. SOUND EFFECTS (made with Web Audio – no files needed)
   --------------------------------------------------------- */
let actx = null;
function audio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(f0, f1, dur, type = 'sine', vol = .18, delay = 0) {
  const c = audio(); if (!c || !prefs.sound) return;
  const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .02);
}
const sfx = {
  pop:   () => tone(520, 980, .12),
  drop:  () => tone(300, 200, .09, 'triangle', .14),
  trash: () => tone(500, 120, .22, 'triangle', .15),
  click: () => tone(700, 700, .05, 'square', .05),
  save:  () => { tone(660, 660, .12, 'sine', .15); tone(990, 990, .2, 'sine', .15, .12); },
};

/* ---------------------------------------------------------
   7. DRAWING ITEMS
   --------------------------------------------------------- */
const els = new Map();

function elFor(it) {
  let el = els.get(it.id);
  if (!el) {
    el = document.createElement('div');
    el.dataset.id = it.id;
    if (it.t === 'card') { el.className = 'card'; el.textContent = it.text; cardsLayer.appendChild(el); }
    else { el.className = 'item'; el.innerHTML = `<svg viewBox="0 0 100 100">${ART[it.t]}</svg>`; itemsLayer.appendChild(el); }
    els.set(it.id, el);
  }
  return el;
}
function place(it) {
  const el = elFor(it);
  const w = it.t === 'card' ? el.offsetWidth : 100, h = it.t === 'card' ? el.offsetHeight : 100;
  it.w = w; it.h = h;
  el.style.transform = `translate(${f1(it.x - w / 2)}px,${f1(it.y - h / 2)}px) rotate(${f1(it.r)}deg) scale(${f1(it.s * it.f * 100) / 100},${f1(it.s * 100) / 100})`;
  el.classList.toggle('sel', it.id === selId);
}
function renderAll() {
  itemsLayer.innerHTML = ''; cardsLayer.innerHTML = ''; els.clear();
  state.items.forEach(place);
  updateToolbar(); updateHint();
}
function reorderDom() { state.items.forEach(it => { const el = els.get(it.id); if (el) el.parentNode.appendChild(el); }); }
function animate(it, cls, ms = 450) {
  const el = els.get(it.id); if (!el) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}
function sparkle(x, y, n = 7) {
  const marks = ['✦', '★', '✧', '♥'], cols = ['#ff7aa2', '#ffd23f', '#7cc8f2', '#b388ff'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'), a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 40;
    s.className = 'spark'; s.textContent = marks[i % 4];
    s.style.cssText = `left:${x}px;top:${y}px;color:${cols[i % 4]};--dx:${f1(Math.cos(a) * d)}px;--dy:${f1(Math.sin(a) * d)}px`;
    fx.appendChild(s); setTimeout(() => s.remove(), 800);
  }
}

function select(id) {
  selId = id;
  els.forEach((el, k) => el.classList.toggle('sel', k === id));
  updateToolbar(); updateHint();
}
function newItem(type, x, y, extra = {}) {
  const ing = ING_BY[type];
  const it = { id: uid(), t: type, x, y, s: ing ? ing.s : 1, r: 0, f: 1, ...extra };
  state.items.push(it); place(it);
  return it;
}
function removeItem(it) {
  const el = els.get(it.id);
  state.items = state.items.filter(i => i !== it);
  els.delete(it.id);
  if (el) { el.classList.add('poof'); setTimeout(() => el.remove(), 270); }
  if (selId === it.id) select(null);
  sfx.trash();
}
function clampIn(it) { it.x = clamp(it.x, 10, TRAY_W - 10); it.y = clamp(it.y, 10, TRAY_H - 10); }

/* tap on an ingredient → it flies neatly into the glass */
function inGlass(it) { return it.t !== 'card' && it.y > RIM_Y - 150 && it.y < GTY + GK * 428 && Math.abs(it.x - GLASS_X) < bowlHalf(it.y) + 12; }
function fillLevel(except) {
  let lvl = GTY + GK * CREAM_TOP - 4;   // food starts on top of the cream base
  state.items.forEach(it => { if (it !== except && inGlass(it)) lvl -= 100 * it.s * (ING_BY[it.t].h) * .45; });
  return Math.max(RIM_Y - 105, lvl);
}
function autoPlace(it) {
  const ing = ING_BY[it.t], lvl = fillLevel(it);
  const half = 100 * it.s * ing.h * .5;
  const y = Math.max(RIM_Y - 115, lvl - half + (Math.random() * 10 - 5));
  const room = Math.max(0, bowlHalf(y) - 100 * it.s * .36);
  const centred = ing.kind === 'topping';
  it.x = GLASS_X + (Math.random() * 2 - 1) * (centred ? Math.min(room, 18) : room);
  it.y = y;
  it.r = centred ? 0 : Math.round(Math.random() * 30 - 15);
  const el = els.get(it.id);
  el.style.transition = 'transform .5s cubic-bezier(.34,1.45,.5,1)';
  place(it);
  setTimeout(() => { el.style.transition = ''; sparkle(it.x, it.y); updateToolbar(); }, 500);
  sfx.pop();
}

/* ---------------------------------------------------------
   8. FLOATING TOOLBAR & HINT
   --------------------------------------------------------- */
function updateToolbar() {
  const it = selId && findItem(selId);
  if (!it || gesture) { toolbar.hidden = true; return; }
  toolbar.hidden = false;
  toolbar.classList.toggle('card-mode', it.t === 'card');
  const el = els.get(it.id), r = el.getBoundingClientRect(), tr = tray.getBoundingClientRect();
  const tw = toolbar.offsetWidth, th = toolbar.offsetHeight;
  const cx = ((r.left + r.right) / 2 - tr.left) / SCALE;
  let top = (r.top - tr.top) / SCALE - th - 10;
  if (top < 4) top = (r.bottom - tr.top) / SCALE + 10;
  toolbar.style.left = clamp(cx - tw / 2, 4, TRAY_W - tw - 4) + 'px';
  toolbar.style.top = clamp(top, 4, TRAY_H - th - 4) + 'px';
}
function updateHint() {
  if (selId) hint.innerHTML = 'Drag to move · Pinch with 2 fingers to resize &amp; turn<small>ドラッグでうごかす・2本ゆびで大きさと向きをかえる</small>';
  else if (!state.items.length) hint.innerHTML = 'Tap or drag an ingredient into the glass!<small>ざいりょうを タップ か ドラッグしてね！</small>';
  else hint.innerHTML = 'Tap a piece to change it<small>ざいりょうをタップすると へんしゅうできるよ</small>';
}

const ACTIONS = {
  flip:    it => { it.f *= -1; },
  bigger:  it => { it.s = clamp(it.s * 1.15, .2, 3.5); },
  smaller: it => { it.s = clamp(it.s / 1.15, .2, 3.5); },
  rotL:    it => { it.r -= 15; },
  rotR:    it => { it.r += 15; },
  front:   it => { state.items = state.items.filter(i => i !== it).concat(it); reorderDom(); },
  back:    it => { state.items = [it].concat(state.items.filter(i => i !== it)); reorderDom(); },
};
toolbar.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const it = selId && findItem(selId); if (!it) return;
  beginChange();
  if (b.dataset.act === 'delete') removeItem(it);
  else { ACTIONS[b.dataset.act](it); place(it); animate(it, 'land', 360); sfx.click(); }
  endChange(); updateToolbar(); updateHint();
});

/* ---------------------------------------------------------
   9. TOUCH & MOUSE: drag, pinch, wheel
   --------------------------------------------------------- */
const pointers = new Map();
let gesture = null;

function overDelete(e) { return inRect(e, trash) || (!document.body.classList.contains('show') && inRect(e, panel)); }
function setHot(e) {
  const t = inRect(e, trash), p = !t && !document.body.classList.contains('show') && inRect(e, panel);
  trash.classList.toggle('hot', t);
  panel.classList.toggle('drop-del', p && !(gesture && gesture.fromBtn && !gesture.left));
}
function clearHot() { trash.classList.remove('hot'); panel.classList.remove('drop-del'); tray.classList.remove('dragging-item'); }

function startPinch() {
  const ids = [...pointers.keys()].slice(0, 2), [a, b] = ids.map(i => pointers.get(i));
  const it = gesture.item;
  gesture = { type: 'pinch', item: it, ids, d0: Math.hypot(b.x - a.x, b.y - a.y) || 1,
              a0: Math.atan2(b.y - a.y, b.x - a.x), s0: it.s, r0: it.r };
  const el = els.get(it.id); if (el) el.classList.remove('dragging');
  toolbar.hidden = true;
}

stage.addEventListener('pointerdown', e => {
  audio();
  const btn = e.target.closest('.ing-btn');
  if (!btn && e.target.closest('button, input, a, .modal')) return;   // normal buttons work as usual
  const p = toTray(e);
  pointers.set(e.pointerId, p);

  if (gesture && gesture.item && pointers.size === 2) { e.preventDefault(); startPinch(); return; }
  if (pointers.size > 2 || gesture) return;

  const pieceEl = e.target.closest('.item, .card');
  if (btn) {
    e.preventDefault();
    beginChange();
    const it = newItem(btn.dataset.id, p.x, p.y);
    animate(it, 'pop');
    select(it.id); sfx.pop();
    gesture = { type: 'drag', item: it, pid: e.pointerId, ox: 0, oy: 0, sx: e.clientX, sy: e.clientY,
                moved: false, fromBtn: true, t0: performance.now() };
    toolbar.hidden = true;
  } else if (pieceEl) {
    e.preventDefault();
    const it = findItem(pieceEl.dataset.id); if (!it) return;
    beginChange();
    select(it.id);
    gesture = { type: 'drag', item: it, pid: e.pointerId, ox: p.x - it.x, oy: p.y - it.y,
                sx: e.clientX, sy: e.clientY, moved: false };
  } else if (e.target.closest('#tray')) {
    select(null);
  }
});

window.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId)) return;
  const p = toTray(e); pointers.set(e.pointerId, p);
  if (!gesture) return;
  e.preventDefault();
  if (gesture.type === 'drag' && e.pointerId === gesture.pid) {
    const it = gesture.item, el = els.get(it.id);
    if (!gesture.moved && Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy) > 8) {
      gesture.moved = true; toolbar.hidden = true;
      tray.classList.add('dragging-item');
      if (el) el.classList.add('dragging');
      if (!gesture.fromBtn) { state.items = state.items.filter(i => i !== it).concat(it); reorderDom(); }
    }
    if (gesture.moved) {
      if (gesture.fromBtn && !inRect(e, panel)) gesture.left = true;
      it.x = p.x - gesture.ox; it.y = p.y - gesture.oy; place(it); setHot(e);
    }
  } else if (gesture.type === 'pinch') {
    const [a, b] = gesture.ids.map(i => pointers.get(i)); if (!a || !b) return;
    const it = gesture.item;
    it.s = clamp(gesture.s0 * Math.hypot(b.x - a.x, b.y - a.y) / gesture.d0, .2, 3.5);
    it.r = gesture.r0 + (Math.atan2(b.y - a.y, b.x - a.x) - gesture.a0) * 180 / Math.PI;
    place(it);
  }
}, { passive: false });

function pointerEnd(e) {
  if (!pointers.has(e.pointerId)) return;
  pointers.delete(e.pointerId);
  if (!gesture) return;

  if (gesture.type === 'pinch') {
    if (pointers.size >= 2) return;
    const it = gesture.item, rest = [...pointers.entries()][0];
    if (rest) { const [pid, p] = rest; gesture = { type: 'drag', item: it, pid, ox: p.x - it.x, oy: p.y - it.y, sx: 0, sy: 0, moved: true }; }
    else finishGesture();
    return;
  }
  if (e.pointerId !== gesture.pid) return;

  const g = gesture, it = g.item, el = els.get(it.id);
  if (el) el.classList.remove('dragging');
  if (g.fromBtn && !g.moved && performance.now() - g.t0 < 700) {
    autoPlace(it);
  } else if (g.moved) {
    if (e.type === 'pointerup' && overDelete(e)) removeItem(it);
    else { clampIn(it); place(it); animate(it, 'land', 360); sfx.drop(); }
  } else if (g.fromBtn) {
    removeItem(it);           // long-press on a button without moving = cancel
  }
  finishGesture();
}
function finishGesture() { gesture = null; clearHot(); endChange(); updateToolbar(); updateHint(); }
window.addEventListener('pointerup', pointerEnd);
window.addEventListener('pointercancel', pointerEnd);

/* mouse wheel = resize the selected piece (Chromebook / PC) */
let wheelTimer = null;
stage.addEventListener('wheel', e => {
  const it = selId && findItem(selId); if (!it) return;
  e.preventDefault();
  beginChange();
  it.s = clamp(it.s * (e.deltaY < 0 ? 1.07 : 1 / 1.07), .2, 3.5);
  place(it); updateToolbar();
  clearTimeout(wheelTimer); wheelTimer = setTimeout(endChange, 400);
}, { passive: false });

/* stop iPad page zoom / long-press menus */
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('contextmenu', e => { if (!e.target.closest('#photoImg')) e.preventDefault(); });
document.addEventListener('touchmove', e => { if (!e.target.closest('input')) e.preventDefault(); }, { passive: false });

/* keyboard shortcuts for Chromebooks */
document.addEventListener('keydown', e => {
  if (e.target.closest('input')) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
  const it = selId && findItem(selId); if (!it) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { beginChange(); removeItem(it); endChange(); updateHint(); }
});

/* ---------------------------------------------------------
   10. PANEL BUTTONS
   --------------------------------------------------------- */
function undo() {
  if (!undoStack.length) return;
  state.items = JSON.parse(undoStack.pop());
  selId = null; renderAll(); sfx.click();
  $('#undoBtn').disabled = !undoStack.length;
}
$('#undoBtn').addEventListener('click', undo);

/* word cards */
const cardModal = $('#cardModal'), cardInput = $('#cardInput');
$('#cardBtn').addEventListener('click', () => { cardInput.value = ''; cardModal.hidden = false; setTimeout(() => cardInput.focus(), 50); });
function closeCard() { cardModal.hidden = true; cardInput.blur(); }
$('#cardCancel').addEventListener('click', closeCard);
$('#cardOk').addEventListener('click', () => {
  const text = cardInput.value.trim(); closeCard();
  if (!text) return;
  beginChange();
  const it = newItem('card', 560, 500, { text, s: 1 });
  clampIn(it); place(it); animate(it, 'pop'); select(it.id); sfx.pop();
  endChange();
});
cardInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) $('#cardOk').click(); });

/* save */
$('#saveBtn').addEventListener('click', () => {
  const ok = store(SAVE_KEY, { v: 1, shop: state.shop, items: cleanItems() });
  if (ok) { sfx.save(); toast('Saved! 💾', 'ほぞんしました！'); }
  else toast('Sorry, could not save.', 'ほぞんできませんでした。');
});

/* reset */
const resetModal = $('#resetModal');
$('#resetBtn').addEventListener('click', () => { resetModal.hidden = false; });
$('#resetNo').addEventListener('click', () => { resetModal.hidden = true; });
$('#resetYes').addEventListener('click', () => {
  resetModal.hidden = true;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}     // removes ONLY this game's design
  state.items = []; state.shop = ''; $('#shopName').value = '';
  undoStack.length = 0; $('#undoBtn').disabled = true;
  selId = null; renderAll(); sfx.trash();
});

/* show mode (hide / show the ingredient panel) */
$('#panelTab').addEventListener('click', () => {
  document.body.classList.toggle('show');
  select(null);
  sfx.click();
});

/* ---------------------------------------------------------
   11. PICTURE (PNG) OF THE PARFAIT
   --------------------------------------------------------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SVG_FONT = `'Hiragino Maru Gothic ProN','Arial Rounded MT Bold','BIZ UDPGothic','Noto Sans JP',sans-serif`;

function buildSVG() {
  const W = TRAY_W, TOP = 78, H = TRAY_H + TOP;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<defs><pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="4" fill="#fff"/></pattern></defs>`;
  s += `<rect width="${W}" height="${H}" fill="#fff7e6"/>`;
  for (let i = 0; i < W / 40; i++) {
    const c = i % 2 ? '#fff' : '#ff8fb1';
    s += `<rect x="${i * 40}" width="40" height="16" fill="${c}"/><path d="M${i * 40} 16A20 12 0 0 0 ${i * 40 + 40} 16Z" fill="${c}"/>`;
  }
  const name = state.shop.trim() || 'My Parfait Shop';
  s += `<g transform="translate(0,${TOP})"><rect width="${W}" height="${TRAY_H}" rx="26" fill="#e3f6ee"/><rect width="${W}" height="${TRAY_H}" rx="26" fill="url(#dots)"/>`;
  s += GLASS_BACK;
  const tf = it => `translate(${f1(it.x)},${f1(it.y)}) rotate(${f1(it.r)}) scale(${f1(it.s * it.f * 100) / 100},${f1(it.s * 100) / 100})`;
  state.items.filter(i => i.t !== 'card').forEach(it => { s += `<g transform="${tf(it)} translate(-50,-50)">${ART[it.t]}</g>`; });
  s += GLASS_FRONT;
  state.items.filter(i => i.t === 'card').forEach(it => {
    const w = it.w || 160, h = it.h || 46;
    s += `<g transform="${tf(it)}"><rect x="${-w / 2 + 1.5}" y="${-h / 2 + 1.5}" width="${w - 3}" height="${h - 3}" rx="13" fill="#fff" stroke="#ff7aa2" stroke-width="3"/>` +
         `<text y="1" text-anchor="middle" dominant-baseline="central" font-family="${SVG_FONT}" font-size="24" font-weight="bold" fill="${O}">${esc(it.text)}</text></g>`;
  });
  s += `</g>`;
  s += `<text x="20" y="62" text-anchor="start" font-family="${SVG_FONT}" font-size="28" font-weight="bold" fill="${O}" stroke="#fff7e6" stroke-width="8" stroke-linejoin="round" paint-order="stroke">🍓 ${esc(name)}</text>`;
  s += `</svg>`;
  return { svg: s, W, H };
}

let photoURL = null, photoBlob = null;
$('#photoBtn').addEventListener('click', async () => {
  select(null);
  const { svg, W, H } = buildSVG();
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  try {
    await img.decode();
    const c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2;
    const ctx = c.getContext('2d'); ctx.scale(2, 2); ctx.drawImage(img, 0, 0, W, H);
    photoBlob = await new Promise(res => c.toBlob(res, 'image/png'));
    if (!photoBlob) throw new Error('no blob');
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = URL.createObjectURL(photoBlob);
  } catch (err) {               // fallback: show the drawing without converting
    photoBlob = null; photoURL = img.src;
  }
  const fname = (state.shop.trim() || 'my-parfait').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '-') + '.png';
  $('#photoImg').src = photoURL;
  const dl = $('#photoDownload'); dl.href = photoURL; dl.download = fname;
  const share = $('#photoShare'); share.hidden = true;
  if (photoBlob && navigator.canShare) {
    const file = new File([photoBlob], fname, { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      share.hidden = false;
      share.onclick = () => navigator.share({ files: [file], title: 'My parfait' }).catch(() => {});
    }
  }
  $('#photoModal').hidden = false; sfx.save();
});
$('#photoClose').addEventListener('click', () => { $('#photoModal').hidden = true; });

/* ---------------------------------------------------------
   12. TOP BAR SWITCHES
   --------------------------------------------------------- */
let toastTimer = null;
function toast(en, ja) {
  const t = $('#toast');
  t.innerHTML = en + (ja ? `<small class="ja">${ja}</small>` : '');
  t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}
function applyPrefs() {
  document.body.classList.toggle('ja-on', prefs.ja);
  $('#jaBtn').setAttribute('aria-pressed', prefs.ja);
  $('#talkBtn').setAttribute('aria-pressed', prefs.talk);
  $('#talkBtn .sw-state').textContent = prefs.talk ? 'ON' : 'OFF';
  $('#soundBtn').classList.toggle('off', !prefs.sound);
  $('#soundBtn').textContent = prefs.sound ? '🔊' : '🔇';
  updateToolbar();
}
$('#jaBtn').addEventListener('click', () => { prefs.ja = !prefs.ja; applyPrefs(); savePrefs(); sfx.click(); });
$('#soundBtn').addEventListener('click', () => { prefs.sound = !prefs.sound; applyPrefs(); savePrefs(); sfx.click(); });
$('#talkBtn').addEventListener('click', () => {
  prefs.talk = !prefs.talk; applyPrefs(); savePrefs(); sfx.click();
  if (prefs.talk) toast('Shop Talk will be added in Step 2 🗣️', 'おみせの会話は つぎのステップで ついかします');
});
$('#shopName').addEventListener('input', e => { state.shop = e.target.value; });
$('#shopName').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });

/* ---------------------------------------------------------
   13. START
   --------------------------------------------------------- */
function buildGrid() {
  $('#grid').innerHTML = ING.map(i =>
    `<button type="button" class="ing-btn${i.cat ? ' cat-' + i.cat : ''}" data-id="${i.id}" aria-label="${i.label}">` +
    `<svg viewBox="0 0 100 100">${ART[i.id]}</svg><span class="en">${i.label}</span><span class="ja">${i.ja}</span></button>`
  ).join('');
}
$('#glassBack').innerHTML = GLASS_BACK;
$('#glassFront').innerHTML = GLASS_FRONT;
buildGrid();
loadAll();
$('#shopName').value = state.shop;
applyPrefs();
renderAll();
$('#undoBtn').disabled = true;
window.addEventListener('resize', fit);
fit();
// cards need fonts to measure correctly
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => state.items.forEach(place));

})();
