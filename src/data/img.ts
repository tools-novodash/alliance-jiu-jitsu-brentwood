import { IMG } from './images.gen'

export type Img = { src: string; w: number; h: number; sm?: number; alt: string }
type Name = keyof typeof IMG

/** A photo from public/images with its real pixel size (scripts/images.mjs). */
export const img = (name: Name, alt: string): Img => {
  const s = IMG[name] as { w: number; h: number; sm?: number; ext?: string }
  return { src: `/images/${name}.${s.ext ?? 'webp'}`, w: s.w, h: s.h, sm: s.sm, alt }
}
