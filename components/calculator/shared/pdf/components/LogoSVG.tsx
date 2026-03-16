import { Svg, Circle, Path } from '@react-pdf/renderer'

export function LogoSVG({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      {/* Background circle */}
      <Circle cx="30" cy="30" r="28" fill="#E6F9FF" />
      {/* P letter */}
      <Path
        d="M18 15V45H24V35H32C38.627 35 44 29.627 44 23C44 16.373 38.627 11 32 11H24C20.686 11 18 13.686 18 17V15Z"
        fill="#0D2137"
      />
      <Path
        d="M24 17H32C35.314 17 38 19.686 38 23C38 26.314 35.314 29 32 29H24V17Z"
        fill="#E6F9FF"
      />
      {/* ECG Line */}
      <Path
        d="M8 38 L16 38 L20 32 L24 44 L28 28 L32 40 L36 38 L52 38"
        stroke="#00B4E6"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
