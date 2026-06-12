// app/systems/socials/socialConfig.ts

export const socials = [
  { name: "X", url: "https://x.com/JeepMeta" },
  { name: "Github", url: "https://github.com/jeepmeta" },
  { name: "Linkedin", url: "https://www.linkedin.com/in/jeepmeta" },
  { name: "Medium", url: "https://medium.com/@jeepmeta" },
  { name: "Reddit", url: "https://www.reddit.com/user/jeepmeta" },
  { name: "Discord", url: "https://discord.com/users/1109274133902143498" },
] as const;

export type SocialName = (typeof socials)[number]["name"];

// Icon sizes for different devices
export const ICON_SIZE = {
  desktop: 0.9,
  mobile: 0.9,
} as const;

// Generate social positions with responsive radius
export function getSocialPositions(isMobile: boolean) {
  const radius = isMobile ? 2.8 : 3.8;
  const height = 0.01;

  return socials.map((_, i) => {
    const angle = (i / socials.length) * Math.PI * 2;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.9;
    const rotationY = -angle + Math.PI / 2;

    return { x, y: height, z, rotationY };
  });
}

// Default positions for initial render (desktop)
export const socialPositions = getSocialPositions(false);
