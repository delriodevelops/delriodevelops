import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Christian Del Río | Engineer & Builder'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    // Attempt to load font, fallback if fails
    let interData = null;
    try {
        // Using a stable jsdelivr link for Inter 900 (Black)
        const res = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-900-normal.woff');
        if (res.ok) {
            interData = await res.arrayBuffer();
        }
    } catch (e) {
        console.error('Failed to load font:', e);
    }

    const accentColor = '#ccff00'; // Acid Lime
    const accentGlow = 'rgba(204, 255, 0, 0.15)';

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0a0a',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Fallback font stack
                    fontFamily: interData ? 'Inter' : 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background - Minimalist Dark */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom right, #1a1a1a, #050505)',
                        zIndex: -2,
                    }}
                />

                {/* Accent Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '600px',
                        background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
                        zIndex: -1,
                        opacity: 0.6,
                    }}
                />

                {/* Decorative Grid Lines (Monumental Style + Accent) */}
                <div style={{ position: 'absolute', top: 50, left: 50, width: 30, height: 2, background: accentColor }} />
                <div style={{ position: 'absolute', top: 50, left: 50, width: 2, height: 30, background: accentColor }} />
                <div style={{ position: 'absolute', bottom: 50, right: 50, width: 30, height: 2, background: accentColor }} />
                <div style={{ position: 'absolute', bottom: 50, right: 50, width: 2, height: 30, background: accentColor }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0,
                    transform: 'translateY(-15px)',
                }}>
                    <div style={{
                        fontSize: 140,
                        fontWeight: 900,
                        color: '#ededed',
                        textTransform: 'uppercase',
                        lineHeight: 0.85,
                        letterSpacing: '-0.06em',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                    }}>
                        CHRISTIAN
                    </div>
                    <div style={{
                        fontSize: 140,
                        fontWeight: 900,
                        color: '#ededed',
                        textTransform: 'uppercase',
                        lineHeight: 0.85,
                        letterSpacing: '-0.06em',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                    }}>
                        DEL RÍO
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        fontSize: 26,
                        marginTop: 40,
                        color: '#888',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        alignItems: 'center',
                        gap: 20,
                    }}
                >
                    <span>Engineer</span>
                    <div style={{ width: 6, height: 6, background: accentColor, borderRadius: '50%', boxShadow: `0 0 10px ${accentColor}` }} />
                    <span>Builder</span>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: interData ? [
                {
                    name: 'Inter',
                    data: interData,
                    style: 'normal',
                    weight: 900,
                },
            ] : undefined,
        }
    )
}
