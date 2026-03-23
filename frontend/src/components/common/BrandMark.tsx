import { type HTMLAttributes } from 'react'

const sizeMap = {
  sm: { box: 'size-11', svg: 28 },
  md: { box: 'size-14', svg: 34 },
  lg: { box: 'size-16', svg: 44 },
} as const

type Size = keyof typeof sizeMap

type Props = HTMLAttributes<HTMLDivElement> & {
  size?: Size
}

/**
 * Marca visual: globo terráqueo (SVG vectorial, sin fondo blanco — solo el icono).
 */
export function BrandMark({ size = 'lg', className = '', ...rest }: Props) {
  const { box, svg } = sizeMap[size]

  return (
    <div
      role="img"
      aria-label="Sistema Gestión Universitaria"
      className={`flex shrink-0 items-center justify-center bg-transparent ${box} ${className}`}
      {...rest}
    >
      <GlobeIcon width={svg} height={svg} />
    </div>
  )
}

function GlobeIcon({ width, height }: { width: number; height: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Anillo exterior */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="currentColor"
        strokeWidth="4"
        className="text-slate-300"
      />
      {/* Marcas en 12, 3, 6 y 9 h */}
      <line
        x1="50"
        y1="1"
        x2="50"
        y2="9"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-slate-300"
      />
      <line
        x1="99"
        y1="50"
        x2="91"
        y2="50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-slate-300"
      />
      <line
        x1="50"
        y1="99"
        x2="50"
        y2="91"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-slate-300"
      />
      <line
        x1="1"
        y1="50"
        x2="9"
        y2="50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-slate-300"
      />
      {/* Globo (relleno azul claro) */}
      <circle cx="50" cy="50" r="30" fill="#7dd3fc" />
      {/* Meridiano central */}
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="80"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Ecuador */}
      <line
        x1="20"
        y1="50"
        x2="80"
        y2="50"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Curvas laterales (efecto esfera) */}
      <ellipse
        cx="50"
        cy="50"
        rx="14"
        ry="30"
        stroke="#0f172a"
        strokeWidth="1.8"
        fill="none"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="30"
        ry="11"
        stroke="#0f172a"
        strokeWidth="1.8"
        fill="none"
      />
    </svg>
  )
}
