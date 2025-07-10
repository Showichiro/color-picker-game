import { err, type HexColor, ok, type Result, type RGB } from '../types';

export const createRGB = (r: number, g: number, b: number): Result<RGB, string> => {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return err(`Invalid RGB values: R=${r}, G=${g}, B=${b}`);
  }
  return ok({ r, g, b } as RGB);
};

const toHex = (n: number): string => n.toString(16).padStart(2, '0');

export const rgbToHex = ({ r, g, b }: RGB): HexColor => 
  `#${toHex(r)}${toHex(g)}${toHex(b)}` as HexColor;

const HEX_PATTERN = /^#?([0-9A-Fa-f]{6})$/;

export const hexToRgb = (hex: string): Result<RGB, string> => {
  const match = hex.match(HEX_PATTERN);
  
  if (!match) {
    return err(`Invalid hex format: ${hex}`);
  }
  
  const cleanHex = match[1];
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return createRGB(r, g, b);
};

export const calculateColorDistance = (color1: RGB, color2: RGB): number => {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

export const generateRandomRGB = (): RGB => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b } as RGB;
};

const clamp = (value: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, value));

const generateColorVariation = (base: number, variation: number): number => {
  const delta = Math.floor((Math.random() - 0.5) * 2 * variation);
  return clamp(base + delta, 0, 255);
};

export const generateSimilarColor = (baseColor: RGB, maxDistance: number): RGB => {
  const maxAttempts = 100;
  const variation = Math.floor(maxDistance / Math.sqrt(3));
  
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const newColor: RGB = {
      r: generateColorVariation(baseColor.r, variation),
      g: generateColorVariation(baseColor.g, variation),
      b: generateColorVariation(baseColor.b, variation),
    } as RGB;
    
    if (calculateColorDistance(baseColor, newColor) <= maxDistance) {
      return newColor;
    }
  }
  
  return generateRandomRGB();
};