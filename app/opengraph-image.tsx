import { ImageResponse } from 'next/og';

export const alt = 'ILACORE: bring visibility to your key operations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#05061a', color: 'white', padding: 72 }}>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>ILACORE</div>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 900 }}>Bring visibility to your key operations.</div>
        <div style={{ fontSize: 28, color: '#dca238' }}>ilacore.com</div>
      </div>
    ),
    size,
  );
}
