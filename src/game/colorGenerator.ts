export interface ColorGeneratorConfig {
  panelCount: number;
  difficulty: number;
}

export interface ColorSet {
  colors: string[];
  targetColor: string;
  targetIndex: number;
}

const hue2rgb = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

const toHex = (x: number): string => {
  const hex = Math.round(x * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateColorSet(config: ColorGeneratorConfig): ColorSet {
  const { panelCount, difficulty } = config;
  const colors: string[] = [];

  // Generate target color
  const targetHue = Math.random() * 360;
  const targetSaturation = 50 + Math.random() * 50; // 50-100%
  const targetLightness = 30 + Math.random() * 40; // 30-70%
  const targetColor = hslToHex(targetHue, targetSaturation, targetLightness);

  // Determine target position
  const targetIndex = Math.floor(Math.random() * panelCount);

  // Calculate color difference based on difficulty
  const maxDifference = Math.max(30, 100 - difficulty * 15);

  // Use a Set for efficient duplicate checking
  const colorSet = new Set<string>();
  colorSet.add(targetColor);

  // Generate other colors
  for (let i = 0; i < panelCount; i++) {
    if (i === targetIndex) {
      colors.push(targetColor);
    } else {
      let newColor: string;
      let attempts = 0;

      do {
        // Generate a color that's different from the target
        const hueDiff = (Math.random() - 0.5) * maxDifference;
        const satDiff = (Math.random() - 0.5) * maxDifference * 0.5;
        const lightDiff = (Math.random() - 0.5) * maxDifference * 0.3;

        const newHue = (targetHue + hueDiff + 360) % 360;

        const newSat = Math.max(0, Math.min(100, targetSaturation + satDiff));
        const newLight = Math.max(
          20,
          Math.min(80, targetLightness + lightDiff),
        );

        newColor = hslToHex(newHue, newSat, newLight);
        attempts++;
      } while (colorSet.has(newColor) && attempts < 100);

      colorSet.add(newColor);
      colors.push(newColor);
    }
  }

  return {
    colors,
    targetColor,
    targetIndex,
  };
}
