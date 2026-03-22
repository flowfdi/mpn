#!/usr/bin/env node
/**
 * PatientNotes favicon generator — zero external dependencies.
 * Produces: favicon.ico (16+32), favicon-32.png, icon-192.png, apple-touch-icon.png
 *
 * Implements:
 *  - Pixel-level RGBA rasteriser (rounded rects)
 *  - CRC32 for PNG chunks
 *  - PNG encoder (IHDR + IDAT + IEND, 8-bit RGBA)
 *  - ICO encoder (multi-size, PNG-embedded format)
 *
 * Run: node scripts/generate-favicons.mjs
 */

import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true })

// ── CRC32 ─────────────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return ((crc ^ 0xffffffff) >>> 0)
}

// ── PNG encoder ───────────────────────────────────────────────────────────────
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const l = Buffer.allocUnsafe(4); l.writeUInt32BE(data.length)
  const c = Buffer.allocUnsafe(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([l, t, data, c])
}

function encodePNG(w, h, rgba) {
  // Each scanline: 1 filter byte (0 = None) + w*4 RGBA bytes
  const raw = Buffer.allocUnsafe(h * (1 + w * 4))
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0
    rgba.copy(raw, y * (1 + w * 4) + 1, y * w * 4, (y + 1) * w * 4)
  }
  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr.writeUInt8(8, 8)   // bit depth
  ihdr.writeUInt8(6, 9)   // colour type: RGBA
  ihdr.writeUInt8(0, 10); ihdr.writeUInt8(0, 11); ihdr.writeUInt8(0, 12)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),             // zlib-wrapped deflate
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ── ICO encoder ───────────────────────────────────────────────────────────────
function encodeICO(images) {
  // images: [{ w, h, png }]
  let offset = 6 + images.length * 16
  const header = Buffer.allocUnsafe(6)
  header.writeUInt16LE(0, 0)             // reserved
  header.writeUInt16LE(1, 2)             // type: ICO
  header.writeUInt16LE(images.length, 4)
  const entries = images.map(({ w, h, png }) => {
    const e = Buffer.allocUnsafe(16)
    e.writeUInt8(w >= 256 ? 0 : w, 0)   // width  (0 means 256)
    e.writeUInt8(h >= 256 ? 0 : h, 1)   // height
    e.writeUInt8(0, 2); e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)                // colour planes
    e.writeUInt16LE(32, 6)               // bits per pixel
    e.writeUInt32LE(png.length, 8)       // size of PNG blob
    e.writeUInt32LE(offset, 12)          // offset from start of file
    offset += png.length
    return e
  })
  return Buffer.concat([header, ...entries, ...images.map(i => i.png)])
}

// ── Rasteriser ────────────────────────────────────────────────────────────────
function createCanvas(w, h) {
  const data = Buffer.alloc(w * h * 4)  // fully transparent

  function setPixel(x, y, r, g, b, a) {
    x = Math.round(x); y = Math.round(y)
    if (x < 0 || x >= w || y < 0 || y >= h) return
    const i = (y * w + x) * 4
    // Alpha composite over existing pixel
    const sa = a / 255, da = data[i + 3] / 255
    const oa = sa + da * (1 - sa)
    if (oa < 1e-6) return
    data[i]     = Math.round((r * sa + data[i]     * da * (1 - sa)) / oa)
    data[i + 1] = Math.round((g * sa + data[i + 1] * da * (1 - sa)) / oa)
    data[i + 2] = Math.round((b * sa + data[i + 2] * da * (1 - sa)) / oa)
    data[i + 3] = Math.round(oa * 255)
  }

  function fillRoundedRect(x0, y0, rw, rh, radius, r, g, b, a = 255) {
    const x1 = x0 + rw, y1 = y0 + rh
    for (let py = Math.floor(y0); py < Math.ceil(y1); py++) {
      for (let px = Math.floor(x0); px < Math.ceil(x1); px++) {
        // Only check corners
        const inCX = px < x0 + radius || px >= x1 - radius
        const inCY = py < y0 + radius || py >= y1 - radius
        if (inCX && inCY) {
          const nearX = px < x0 + radius ? x0 + radius : x1 - radius
          const nearY = py < y0 + radius ? y0 + radius : y1 - radius
          if (Math.hypot(px + 0.5 - nearX, py + 0.5 - nearY) > radius) continue
        }
        setPixel(px, py, r, g, b, a)
      }
    }
  }

  return { data, fillRoundedRect }
}

// ── Icon design (fully parameterised by size) ─────────────────────────────────
//
// Design: forest green rounded square background (#228B22)
// with 5 stacked white vertebral bodies (cervical → coccyx),
// each slightly wider than the previous then tapering.
//
function drawIcon(size) {
  const s = size / 32          // scale factor relative to 32-px master
  const { data, fillRoundedRect } = createCanvas(size, size)

  // Background
  fillRoundedRect(0, 0, size, size, Math.round(7 * s), 0x22, 0x8b, 0x22, 255)

  // ── Vertebrae (white) ─────────────────────────────────────────────────────
  // Layout (at 32px): x=cx-w/2, widths 8→10→12→9→5, heights 4→4.5→5→4→2.5
  // Positions chosen so the stack fills ~90% of height with natural taper.

  const vertebrae = [
    // [cx_frac, y, width, height, radius, alpha]
    [0.5,  3.5,  8,   4.0, 2.0, 255],   // cervical    (top, narrow)
    [0.5,  9.5, 10,   4.5, 2.3, 255],   // thoracic
    [0.5, 16.0, 12,   5.0, 2.5, 255],   // lumbar      (widest)
    [0.5, 22.5,  9,   4.0, 2.0, 220],   // sacrum      (slight fade)
    [0.5, 27.5,  5,   2.5, 1.5, 160],   // coccyx      (most faded)
  ]

  for (const [cxF, y, w, h, r, a] of vertebrae) {
    const px = Math.round(size * cxF - w * s / 2)
    fillRoundedRect(px, y * s, w * s, h * s, r * s, 255, 255, 255, a)
  }

  return data
}

// ── Generate ──────────────────────────────────────────────────────────────────
const SIZES = [
  { size: 16,  file: null,                  label: 'ico-16'    },
  { size: 32,  file: 'favicon-32.png',      label: '32×32'     },
  { size: 64,  file: 'favicon-64.png',      label: '64×64'     },
  { size: 180, file: 'apple-touch-icon.png',label: '180×180'   },
  { size: 192, file: 'icon-192.png',        label: '192×192'   },
]

console.log('\n🎨  Generating PatientNotes favicons…\n')

const pngs = {}
for (const { size, file, label } of SIZES) {
  const rgba = drawIcon(size)
  const png  = encodePNG(size, size, rgba)
  pngs[size] = png
  if (file) {
    writeFileSync(join(publicDir, file), png)
    console.log(`  ✓  public/${file}  (${label})`)
  }
}

// favicon.ico — 16 + 32
const ico = encodeICO([
  { w: 16, h: 16, png: pngs[16] },
  { w: 32, h: 32, png: pngs[32] },
])
writeFileSync(join(publicDir, 'favicon.ico'), ico)
console.log(`  ✓  public/favicon.ico  (16×16 + 32×32)`)

console.log('\n✅  Done — all favicon files written to public/\n')
