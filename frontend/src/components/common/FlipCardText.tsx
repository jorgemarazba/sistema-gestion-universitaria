type Props = {
  frontTitle: string
  backText: string
  /** Si true, el reverso repite el mismo título (p. ej. reglamento pregrado) */
  backSameAsFront?: boolean
}

export function FlipCardText({
  frontTitle,
  backText,
  backSameAsFront = false,
}: Props) {
  const back = backSameAsFront ? frontTitle : backText
  return (
    <div className="group min-h-44 perspective-[1000px] sm:min-h-48">
      <div className="relative h-full min-h-44 w-full transition-transform duration-500 transform-3d group-hover:rotate-y-180 sm:min-h-48">
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-600 bg-linear-to-br from-violet-900/40 to-slate-900 p-5 text-center backface-hidden shadow-lg">
          <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
            {frontTitle}
          </h3>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-violet-500/40 bg-slate-900 p-5 text-center backface-hidden rotate-y-180 shadow-lg">
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            {back}
          </p>
        </div>
      </div>
    </div>
  )
}
