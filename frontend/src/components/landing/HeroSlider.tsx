import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SLIDE_IMAGES } from '../../data/content'

export function HeroSlider() {
  const [i, setI] = useState(0)
  const len = SLIDE_IMAGES.length

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % len), 6000)
    return () => clearInterval(t)
  }, [len])

  const prev = () => setI((v) => (v - 1 + len) % len)
  const next = () => setI((v) => (v + 1) % len)

  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="relative aspect-21/9 min-h-[220px] w-full max-md:aspect-video">
        {SLIDE_IMAGES.map((slide, idx) => (
          <div
            key={`slide-${idx}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="size-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-lg font-medium text-white drop-shadow md:text-2xl">
              {slide.caption}
            </p>
          </div>
        ))}
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30"
          aria-label="Anterior"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30"
          aria-label="Siguiente"
        >
          <ChevronRight className="size-6" />
        </button>
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {SLIDE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className={`size-2 rounded-full transition ${
                idx === i ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
