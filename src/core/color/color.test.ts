import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../types';
import {
  calculateColorDistance,
  createRGB,
  generateRandomRGB,
  generateSimilarColor,
  hexToRgb,
  rgbToHex,
} from './color';

describe('Color Domain', () => {
  describe('createRGB', () => {
    it('should create valid RGB color', () => {
      const result = createRGB(128, 200, 50);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.r).toBe(128);
        expect(result.value.g).toBe(200);
        expect(result.value.b).toBe(50);
      }
    });

    it('should fail with invalid R value', () => {
      const result = createRGB(256, 200, 50);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Invalid RGB values: R=256, G=200, B=50');
      }
    });

    it('should fail with negative value', () => {
      const result = createRGB(128, -1, 50);
      expect(isErr(result)).toBe(true);
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to HEX correctly', () => {
      const rgb = createRGB(255, 0, 0);
      if (isOk(rgb)) {
        const hex = rgbToHex(rgb.value);
        expect(hex).toBe('#ff0000');
      }
    });

    it('should handle two-digit hex values', () => {
      const rgb = createRGB(128, 200, 50);
      if (isOk(rgb)) {
        const hex = rgbToHex(rgb.value);
        expect(hex).toBe('#80c832');
      }
    });
  });

  describe('hexToRgb', () => {
    it('should convert valid HEX to RGB', () => {
      const result = hexToRgb('#ff0000');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.r).toBe(255);
        expect(result.value.g).toBe(0);
        expect(result.value.b).toBe(0);
      }
    });

    it('should handle hex without #', () => {
      const result = hexToRgb('ff0000');
      expect(isOk(result)).toBe(true);
    });

    it('should fail with invalid hex format', () => {
      const result = hexToRgb('#gg0000');
      expect(isErr(result)).toBe(true);
    });

    it('should fail with wrong length', () => {
      const result = hexToRgb('#ff00');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('calculateColorDistance', () => {
    it('should calculate distance between same colors as 0', () => {
      const color1 = createRGB(100, 100, 100);
      const color2 = createRGB(100, 100, 100);
      if (isOk(color1) && isOk(color2)) {
        const distance = calculateColorDistance(color1.value, color2.value);
        expect(distance).toBe(0);
      }
    });

    it('should calculate distance between black and white', () => {
      const black = createRGB(0, 0, 0);
      const white = createRGB(255, 255, 255);
      if (isOk(black) && isOk(white)) {
        const distance = calculateColorDistance(black.value, white.value);
        expect(distance).toBeCloseTo(441.67, 2);
      }
    });
  });

  describe('generateRandomRGB', () => {
    it('should generate valid RGB color', () => {
      const rgb = generateRandomRGB();
      expect(rgb.r).toBeGreaterThanOrEqual(0);
      expect(rgb.r).toBeLessThanOrEqual(255);
      expect(rgb.g).toBeGreaterThanOrEqual(0);
      expect(rgb.g).toBeLessThanOrEqual(255);
      expect(rgb.b).toBeGreaterThanOrEqual(0);
      expect(rgb.b).toBeLessThanOrEqual(255);
    });
  });

  describe('generateSimilarColor', () => {
    it('should generate color within max distance', () => {
      const baseColor = createRGB(128, 128, 128);
      if (isOk(baseColor)) {
        const maxDistance = 50;
        const similarColor = generateSimilarColor(baseColor.value, maxDistance);
        const distance = calculateColorDistance(baseColor.value, similarColor);
        expect(distance).toBeLessThanOrEqual(maxDistance);
      }
    });
  });
});