import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 20,
                    background: '#14120f',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#efece5',
                    fontWeight: 900,
                    borderRadius: '4px',
                    fontFamily: 'sans-serif',
                    lineHeight: 1,
                }}
            >
                C
            </div>
        ),
        {
            ...size,
        }
    )
}
