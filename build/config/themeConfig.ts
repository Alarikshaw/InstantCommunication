import { generate } from '@ant-design/colors';

export const primaryColor = '#0960bd';

export const themeMode = 'light';

export type ThemeMode = 'dark' | 'light';

type Fn = (...arg: any) => any;

export interface GenerateColorsParams {
  mixLighten: Fn;
  mixDarken: Fn;
  tinycolor: any;
  color?: string;
}

export function generateAntColors(color: string, mode: ThemeMode) {
  return generate(color, {
    theme: mode == 'dark' ? 'dark' : 'default',
  });
}

export function getThemeColors(color?: string, theme?: ThemeMode) {
  const tc = color || primaryColor;
  const tm = theme || themeMode;
  const colors = generateAntColors(tc, tm);
  const primary = colors[5];
  const modeColors = generateAntColors(primary, tm === 'dark' ? 'light' : 'dark');

  return [...colors, ...modeColors];
}

export function generateColors({
  color = primaryColor,
  mixLighten,
  mixDarken,
  tinycolor,
}: GenerateColorsParams) {
  const arr = new Array(19).fill(0);
  const lightens = arr.map((t, i) => {
    return mixLighten(color, i / 5);
  });

  const darkens = arr.map((t, i) => {
    return mixDarken(color, i / 5);
  });

  const alphaColors = arr.map((t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString();
  });

  const tinycolorLightens = arr
    .map((t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#ffffff');

  const tinycolorDarkens = arr
    .map((t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#000000');
  return [...lightens, ...darkens, ...alphaColors, ...tinycolorDarkens, ...tinycolorLightens];
}

/**
 * less global variable
 */
export function generateModifyVars() {
  const palettes = generateAntColors(primaryColor, themeMode);
  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  return {
    'primary-color': primaryColor, //  Global dominant color
    'info-color': '#87CEEB', //  Default color
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    'link-color': primaryColor, //   Link color
    'disabled-color': '#C2C2CC', //  Failure color
    'heading-color': 'rgba(0, 0, 0, 0.85)', //  Title color
    'text-color': 'rgba(0, 0, 0, 0.85)', //  Main text color
    // 'heading-color': '#2C3A61', //  Title color
    // 'text-color': '#2C3A61', //  Main text color
    'text-color-secondary ': '#606266', // Subtext color
    'background-color-base': '#F0F2F5', // background color
    'font-size-base': '14px', //  Main font size
    'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', //  Floating shadow
    'border-color-base': '#F0F0F0', //  Border color,
    'border-color-split': '#F0F0F0', //  Border color,
    'border-radius-base': '2px', //  Component/float fillet
  };
}
