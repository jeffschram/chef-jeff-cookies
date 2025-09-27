// Simple cookie image generator using Canvas API
export interface CookieImageOptions {
  size: number;
  baseColor: string;
  chipColor: string;
  chipCount: number;
  crackPattern: boolean;
}

export function generateCookieImage(options: CookieImageOptions): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = options.size;
  canvas.height = options.size;
  
  const centerX = options.size / 2;
  const centerY = options.size / 2;
  const radius = options.size * 0.4;
  
  // Create gradient for cookie base
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, options.baseColor);
  gradient.addColorStop(1, darkenColor(options.baseColor, 20));
  
  // Draw cookie base
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Add texture/roughness to edges
  ctx.strokeStyle = darkenColor(options.baseColor, 30);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 360; i += 10) {
    const angle = (i * Math.PI) / 180;
    const variation = Math.random() * 4 - 2;
    const x = centerX + Math.cos(angle) * (radius + variation);
    const y = centerY + Math.sin(angle) * (radius + variation);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  
  // Add chocolate chips
  ctx.fillStyle = options.chipColor;
  for (let i = 0; i < options.chipCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (radius * 0.7);
    const chipX = centerX + Math.cos(angle) * distance;
    const chipY = centerY + Math.sin(angle) * distance;
    const chipSize = 3 + Math.random() * 4;
    
    ctx.beginPath();
    ctx.arc(chipX, chipY, chipSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Add highlight to chips
    ctx.fillStyle = lightenColor(options.chipColor, 30);
    ctx.beginPath();
    ctx.arc(chipX - 1, chipY - 1, chipSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = options.chipColor;
  }
  
  // Add crack pattern if requested
  if (options.crackPattern) {
    ctx.strokeStyle = darkenColor(options.baseColor, 40);
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const startAngle = Math.random() * Math.PI * 2;
      const startX = centerX + Math.cos(startAngle) * (radius * 0.3);
      const startY = centerY + Math.sin(startAngle) * (radius * 0.3);
      ctx.moveTo(startX, startY);
      
      const endAngle = startAngle + (Math.random() - 0.5) * Math.PI;
      const endX = centerX + Math.cos(endAngle) * (radius * 0.6);
      const endY = centerY + Math.sin(endAngle) * (radius * 0.6);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
  
  return canvas.toDataURL();
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

export const cookieVariations = {
  nibbler: [
    { baseColor: '#D2691E', chipColor: '#8B4513', chipCount: 8, crackPattern: false },
    { baseColor: '#CD853F', chipColor: '#654321', chipCount: 6, crackPattern: true },
    { baseColor: '#DEB887', chipColor: '#8B4513', chipCount: 10, crackPattern: false },
    { baseColor: '#F4A460', chipColor: '#654321', chipCount: 7, crackPattern: true },
    { baseColor: '#D2691E', chipColor: '#2F1B14', chipCount: 9, crackPattern: false },
  ],
  family: [
    { baseColor: '#CD853F', chipColor: '#8B4513', chipCount: 12, crackPattern: false },
    { baseColor: '#D2691E', chipColor: '#654321', chipCount: 10, crackPattern: true },
    { baseColor: '#DEB887', chipColor: '#8B4513', chipCount: 14, crackPattern: false },
    { baseColor: '#F4A460', chipColor: '#2F1B14', chipCount: 11, crackPattern: true },
    { baseColor: '#BC8F8F', chipColor: '#654321', chipCount: 13, crackPattern: false },
  ],
  pro: [
    { baseColor: '#8B4513', chipColor: '#654321', chipCount: 15, crackPattern: true },
    { baseColor: '#A0522D', chipColor: '#2F1B14', chipCount: 18, crackPattern: false },
    { baseColor: '#CD853F', chipColor: '#8B4513', chipCount: 16, crackPattern: true },
    { baseColor: '#D2691E', chipColor: '#654321', chipCount: 20, crackPattern: false },
    { baseColor: '#8B4513', chipColor: '#2F1B14', chipCount: 17, crackPattern: true },
  ]
};
