import { ImageResponse } from 'next/og'

export const alt = 'Nurkhan Esenbek | Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#000000', color: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '70px 80px' }}>
      <div style={{ display: 'flex', color: '#a3a3a3', fontSize: 22, letterSpacing: 5 }}>PYTHON · AI · OPEN SOURCE</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 84, letterSpacing: -4 }}>Nurkhan Esenbek.</div>
        <div style={{ fontSize: 32, color: '#a3a3a3', marginTop: 20 }}>Software Engineer</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, color: '#a3a3a3' }}><span>Python / AI developer tools / React</span><span>nurkhan.space</span></div>
    </div>, size,
  )
}
