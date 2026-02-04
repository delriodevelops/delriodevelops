import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog Post';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }) {
    const { slug } = params;

    // Convert slug to title (edge runtime can't use Firebase)
    const title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const accentColor = '#ccff00';

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0a0a',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '60px',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background Gradient */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                    }}
                />

                {/* Accent Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-200px',
                        right: '-200px',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(204, 255, 0, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />

                {/* Corner Decorations */}
                <div style={{ position: 'absolute', top: 40, left: 40, width: 30, height: 2, background: accentColor }} />
                <div style={{ position: 'absolute', top: 40, left: 40, width: 2, height: 30, background: accentColor }} />
                <div style={{ position: 'absolute', bottom: 40, right: 40, width: 30, height: 2, background: accentColor }} />
                <div style={{ position: 'absolute', bottom: 40, right: 40, width: 2, height: 30, background: accentColor }} />

                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {/* Tag */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 24px',
                            background: 'rgba(204, 255, 0, 0.1)',
                            border: `1px solid ${accentColor}`,
                            color: accentColor,
                            fontSize: '16px',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Blog
                    </div>

                    {/* Logo */}
                    <div
                        style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            display: 'flex',
                        }}
                    >
                        <span style={{ color: accentColor }}>del</span>
                        <span style={{ color: '#fff' }}>río</span>
                    </div>
                </div>

                {/* Main Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flex: 1,
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {/* Title */}
                    <h1
                        style={{
                            fontSize: title.length > 40 ? '64px' : '80px',
                            fontWeight: 900,
                            color: '#fff',
                            lineHeight: 1,
                            letterSpacing: '-0.03em',
                            margin: 0,
                            textTransform: 'uppercase',
                            maxWidth: '900px',
                        }}
                    >
                        {title}
                    </h1>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: '18px',
                            color: '#666',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Blog • delrío.dev
                    </div>
                    <div
                        style={{
                            fontSize: '18px',
                            color: '#666',
                        }}
                    >
                        Read Article →
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
