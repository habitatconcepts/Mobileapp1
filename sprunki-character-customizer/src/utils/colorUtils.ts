export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

export const lightenColor = (hex: string, percent: number): string => {
    const { r, g, b } = hexToRgb(hex);
    const newR = Math.min(255, Math.floor(r + (r * percent)));
    const newG = Math.min(255, Math.floor(g + (g * percent)));
    const newB = Math.min(255, Math.floor(b + (b * percent)));

    return rgbToHex(newR, newG, newB);
};

export const darkenColor = (hex: string, percent: number): string => {
    const { r, g, b } = hexToRgb(hex);
    const newR = Math.max(0, Math.floor(r - (r * percent)));
    const newG = Math.max(0, Math.floor(g - (g * percent)));
    const newB = Math.max(0, Math.floor(b - (b * percent)));

    return rgbToHex(newR, newG, newB);
};