import { err, ok, type HexColor, type RGB, type Result } from '../types';

export const createRGB = (r: number, g: number, b: number): Result<RGB, string> => {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return err(`Invalid RGB values: R=${r}, G=${g}, B=${b}`);
  }
  return ok({ r, g, b } as RGB);
};

export const rgbToHex = (rgb: RGB): HexColor => {
  const toHex = (n: number): string => n.toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}` as HexColor;
};

export const hexToRgb = (hex: string): Result<RGB, string> => {
  const cleanHex = hex.replace('#', '');
  
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return err(`Invalid hex format: ${hex}`);
  }
  
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

export const generateSimilarColor = (baseColor: RGB, maxDistance: number): RGB => {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const variation = Math.floor(maxDistance / Math.sqrt(3));
    const dr = Math.floor((Math.random() - 0.5) * 2 * variation);
    const dg = Math.floor((Math.random() - 0.5) * 2 * variation);
    const db = Math.floor((Math.random() - 0.5) * 2 * variation);
    
    const r = Math.max(0, Math.min(255, baseColor.r + dr));
    const g = Math.max(0, Math.min(255, baseColor.g + dg));
    const b = Math.max(0, Math.min(255, baseColor.b + db));
    
    const newColor = { r, g, b } as RGB;
    const distance = calculateColorDistance(baseColor, newColor);
    
    if (distance <= maxDistance) {
      return newColor;
    }
    
    attempts++;
  }
  
  return generateRandomRGB();
};