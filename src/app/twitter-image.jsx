import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Christian del Río - Software Engineer & Indie Hacker';
export const size = {
    width: 1200,
    height: 600,
};
export const contentType = 'image/png';

export default async function Image() {
    const accentColor = '#ccff00';
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
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom right, #1a1a1a, #050505)',
                    }}
                />

                {/* Accent Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        height: '500px',
                        background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
                        opacity: 0.6,
                    }}
                />

                {/* Corner decorations */}
                <div style={{ position: 'absolute', top: 40, left: 40, width: 25, height: 2, background: accentColor }} />
                <div style={{ position: 'absolute', top: 40, left: 40, width: 2, height: 25, background: accentColor }} />
                <div style={{ position: 'absolute', bottom: 40, right: 40, width: 25, height: 2, background: accentColor }} />
                <div style={{ position: 'absolute', bottom: 40, right: 40, width: 2, height: 25, background: accentColor }} />

                {/* Name */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0,
                    transform: 'translateY(-10px)',
                }}>
                    <div style={{
                        fontSize: 110,
                        fontWeight: 900,
                        color: '#ededed',
                        textTransform: 'uppercase',
                        lineHeight: 0.85,
                        letterSpacing: '-0.06em',
                    }}>
                        CHRISTIAN
                    </div>
                    <div style={{
                        fontSize: 110,
                        fontWeight: 900,
                        color: '#ededed',
                        textTransform: 'uppercase',
                        lineHeight: 0.85,
                        letterSpacing: '-0.06em',
                    }}>
                        DEL RÍO
                    </div>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 22,
                        marginTop: 35,
                        color: '#888',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        alignItems: 'center',
                        gap: 16,
                    }}
                >
                    <span>Engineer</span>
                    <div style={{ width: 5, height: 5, background: accentColor, borderRadius: '50%' }} />
                    <span>Builder</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
