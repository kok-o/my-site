import { PROFILE_HEIGHT, RIDGE_PROFILES } from './footer-ridge-profiles'

const RIDGE_COUNT = RIDGE_PROFILES.length
const LEVELS = 6
const SEED = 7
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map(value => (value + 0.5) / 64)

function hash(x: number, y: number, seed: number) {
  let value = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}

function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const dx = x - ix
  const dy = y - iy
  const u = dx * dx * (3 - 2 * dx)
  const v = dy * dy * (3 - 2 * dy)
  const a = hash(ix, iy, seed)
  const b = hash(ix + 1, iy, seed)
  const c = hash(ix, iy + 1, seed)
  const d = hash(ix + 1, iy + 1, seed)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fractal(x: number, y: number, seed: number, octaves: number) {
  let result = 0
  let weight = 1
  let total = 0
  for (let octave = 0; octave < octaves; octave++) {
    result += noise(x, y, seed + octave * 31) * weight
    total += weight
    weight *= 0.5
    x *= 2.03
    y *= 2.03
  }
  return result / total
}

function smoothStep(value: number) {
  const t = Math.min(1, Math.max(0, value))
  return t * t * (3 - 2 * t)
}

function createRidge(width: number, height: number, margin: number, layer: number) {
  const depth = layer / (RIDGE_COUNT - 1)
  const crest = new Float32Array(width + 2 * margin)
  const mistDepth = new Float32Array(crest.length)
  const profile = RIDGE_PROFILES[layer]
  const last = profile.length - 1

  for (let x = 0; x < crest.length; x++) {
    const u = (x - margin + 0.5) / width
    // Reflect the illustration at either edge for the extra columns revealed by parallax.
    const position = (u > 1 ? 2 - u : Math.abs(u)) * last
    const left = Math.floor(position)
    const rise = profile[Math.min(left + 1, last)] - profile[left]
    crest[x] = (profile[left] + rise * (position - left)) * height / PROFILE_HEIGHT
    mistDepth[x] = height * (0.09 + 0.4 * depth) * (0.45 + 1.1 * fractal(u * 4, layer * 5.3, SEED + 9, 2))
  }
  return { crest, mistDepth, depth, tone: 0.52 + 0.44 * depth }
}

export type RidgePalette = {
  farInk: readonly [number, number, number]
  nearInk: readonly [number, number, number]
  crestBoost: number
}

type RidgeFrame = {
  progress: number
  fogTime: number
  pointerX: number
  pointerY: number
  clearing: number
  parallax: number
  palette: RidgePalette
}

export function createRidgeRenderer(ctx: CanvasRenderingContext2D, width: number, height: number, pixelSize: number) {
  const image = ctx.createImageData(width, height)
  const pixels = new Uint32Array(image.data.buffer)
  const margin = Math.ceil(width * 0.045) + 3
  const ridges = Array.from({ length: RIDGE_COUNT }, (_, layer) => createRidge(width, height, margin, layer))
  const fogWidth = Math.ceil(width / 2)
  const fogHeight = Math.ceil(height / 2)
  const mist = new Float32Array(fogWidth * fogHeight)
  const fade = Float32Array.from({ length: height }, (_, y) => smoothStep(y / (height * 0.14)))
  const clearingX = new Float32Array(width)
  const clearingY = new Float32Array(height)
  const radius = Math.max(1, 130 / pixelSize)
  const layerPalettes = new Uint32Array(RIDGE_COUNT * LEVELS)
  const rgba = new Uint8ClampedArray(layerPalettes.buffer)
  const lowerEdge = new Int32Array(width)
  let cachedPaletteKey = ''

  return function draw({ progress, fogTime, pointerX, pointerY, clearing, parallax, palette }: RidgeFrame) {
    const paletteKey = `${palette.farInk.join(',')}|${palette.nearInk.join(',')}|${palette.crestBoost}`
    if (paletteKey !== cachedPaletteKey) {
      cachedPaletteKey = paletteKey
      const { farInk, nearInk, crestBoost } = palette
      for (let layer = 0; layer < RIDGE_COUNT; layer++) {
        const depth = layer / (RIDGE_COUNT - 1)
        const mix = depth ** 0.85
        const baseR = farInk[0] + (nearInk[0] - farInk[0]) * mix
        const baseG = farInk[1] + (nearInk[1] - farInk[1]) * mix
        const baseB = farInk[2] + (nearInk[2] - farInk[2]) * mix
        const baseOffset = layer * LEVELS
        layerPalettes[baseOffset] = 0
        for (let level = 1; level < LEVELS; level++) {
          // Highest dither steps catch a subtle rim tint along the ridge crest.
          const rim = level === LEVELS - 1 ? crestBoost * (0.4 + 0.6 * depth) : level === LEVELS - 2 ? crestBoost * 0.25 * depth : 0
          const channel = (baseOffset + level) * 4
          rgba[channel] = Math.round(baseR + (farInk[0] - baseR) * rim)
          rgba[channel + 1] = Math.round(baseG + (farInk[1] - baseG) * rim)
          rgba[channel + 2] = Math.round(baseB + (farInk[2] - baseB) * rim)
          rgba[channel + 3] = Math.round(255 * level / (LEVELS - 1))
        }
      }
    }

    pixels.fill(0)
    if (progress <= 0.005) {
      ctx.putImageData(image, 0, 0)
      return
    }

    lowerEdge.fill(height)
    for (let y = 0; y < fogHeight; y++) {
      const ny = y * 4.4 / height
      for (let x = 0; x < fogWidth; x++) {
        const nx = x * 9 / width + fogTime
        const warp = noise(nx * 0.45 - fogTime * 0.6, ny * 0.8, 77) * 0.6
        const density = fractal(nx + warp, ny + warp * 0.4, 31, 3)
        mist[y * fogWidth + x] = smoothStep((density - 0.32) / 0.44)
      }
    }
    if (clearing > 0.001) {
      for (let x = 0; x < width; x++) {
        const dx = (x - pointerX * width) / radius
        clearingX[x] = clearing * Math.exp(-dx * dx)
      }
      for (let y = 0; y < height; y++) {
        const dy = (y - pointerY * height) * 1.5 / radius
        clearingY[y] = Math.exp(-dy * dy)
      }
    }

    const mistLift = 1 - smoothStep((progress - 0.15) / 0.85)
    // A foreground ridge clips those behind it. Visit each visible pixel once
    // and keep the sky transparent for the signature underneath the canvas.
    for (let layer = RIDGE_COUNT - 1; layer >= 0; layer--) {
      const ridge = ridges[layer]
      const layerStart = 0.03 + ridge.depth * 0.17
      const reveal = smoothStep((progress - layerStart) / (1 - layerStart))
      if (reveal <= 0.002) continue
      const rise = (1 - reveal) * height * (0.48 + 0.4 * ridge.depth)
      const shift = Math.round(parallax * (0.25 + ridge.depth) * 0.75 * (margin - 3))
      const paletteBase = layer * LEVELS

      for (let x = 0; x < width; x++) {
        const at = x + margin + shift
        const top = ridge.crest[at] + rise
        const start = Math.max(0, Math.ceil(top))
        const end = lowerEdge[x]
        if (start >= end) continue
        lowerEdge[x] = start
        const slope = Math.min(0.18, Math.max(-0.18, (ridge.crest[at + 2] - ridge.crest[at - 2]) * 0.06))
        const inverseDepth = 1 / ridge.mistDepth[at]
        const grainX = x + Math.round(top * 7)
        for (let y = start; y < end; y++) {
          const distance = y - top
          const valley = distance * inverseDepth
          const crestRim = distance < 3.5 ? (1 - distance / 3.5) * palette.crestBoost * 0.55 : 0
          const crest = 1 - smoothStep(valley) * (0.28 - 0.1 * ridge.depth)
          const grain = (hash(grainX, Math.floor(distance), layer) - 0.5) * 0.08
          const localClear = clearing > 0.001 ? clearingX[x] * clearingY[y] : 0
          const tone = Math.min(0.98, (ridge.tone * crest + crestRim + slope * (1 - smoothStep(2 * valley)) + grain + localClear * 0.16) * reveal)
          const density = mist[(y >> 1) * fogWidth + (x >> 1)] * 0.65 * (0.92 - 0.45 * ridge.depth)
          const haze = Math.min(0.88, density * (1 - localClear * 0.92) + mistLift * 0.35)
          const alpha = (tone * (1 - haze) + 0.08 * haze * (1 - mistLift)) * fade[y]
          const threshold = BAYER[(y & 7) * 8 + (x & 7)]
          const level = Math.min(LEVELS - 1, Math.floor(Math.max(0, alpha) * (LEVELS - 1) + threshold))
          pixels[y * width + x] = layerPalettes[paletteBase + level]
        }
      }
    }
    ctx.putImageData(image, 0, 0)
  }
}
