type Props = {
  title: string
  backText: string
  imageUrl: string
  imageAlt?: string
}

/** Tarjeta con imagen al frente; al hover se voltea y muestra texto */
export function FlipCardImage({ title, backText, imageUrl, imageAlt = '' }: Props) {
  return (
    <div className="group h-64 perspective-[1000px] sm:h-72">
      <div className="relative h-full w-full transition-transform duration-500 transform-3d group-hover:rotate-y-180">
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-700 backface-hidden shadow-lg">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white drop-shadow">
            {title}
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-violet-500/30 bg-slate-900 p-5 backface-hidden rotate-y-180 shadow-lg">
          <h3 className="text-base font-semibold text-violet-300">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{backText}</p>
        </div>
      </div>
    </div>
  )
}
