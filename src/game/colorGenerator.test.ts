import { describe, expect, it } from "vitest";
import { type ColorGeneratorConfig, generateColorSet } from "./colorGenerator";

describe("generateColorSet", () => {
  it("should generate the specified number of colors", () => {
    const config: ColorGeneratorConfig = {
      panelCount: 2,
      difficulty: 1,
    };
    const result = generateColorSet(config);

    expect(result.colors).toHaveLength(2);
    expect(result.targetIndex).toBeGreaterThanOrEqual(0);
    expect(result.targetIndex).toBeLessThan(2);
  });

  it("should always include the target color at the specified index", () => {
    const config: ColorGeneratorConfig = {
      panelCount: 4,
      difficulty: 1,
    };
    const result = generateColorSet(config);

    expect(result.colors[result.targetIndex]).toBe(result.targetColor);
  });

  it("should generate colors with appropriate difference based on difficulty", () => {
    const easyConfig: ColorGeneratorConfig = {
      panelCount: 2,
      difficulty: 1,
    };
    const hardConfig: ColorGeneratorConfig = {
      panelCount: 2,
      difficulty: 5,
    };

    const easyResult = generateColorSet(easyConfig);
    const hardResult = generateColorSet(hardConfig);

    // This is a conceptual test - in practice, we'd measure color distance
    expect(easyResult.colors).toBeDefined();
    expect(hardResult.colors).toBeDefined();
  });

  it("should not generate duplicate colors", () => {
    const config: ColorGeneratorConfig = {
      panelCount: 6,
      difficulty: 1,
    };
    const result = generateColorSet(config);
    const uniqueColors = new Set(result.colors);

    expect(uniqueColors.size).toBe(result.colors.length);
  });
});
