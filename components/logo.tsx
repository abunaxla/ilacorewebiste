import Image from 'next/image';

// Measured from the cropped SVG viewBoxes (scripts/crop-logos.mjs): 538.74 / 187.34.
const LOGO_RATIO = 2.876;
const HEIGHT = 40;

export function Logo({ variant = 'color', className }: { variant?: 'color' | 'white'; className?: string }) {
  return (
    <Image
      src={variant === 'white' ? '/brand/logo-white.svg' : '/brand/logo-color.svg'}
      alt="ILACORE"
      width={Math.round(HEIGHT * LOGO_RATIO)}
      height={HEIGHT}
      priority
      unoptimized
      className={className}
    />
  );
}
