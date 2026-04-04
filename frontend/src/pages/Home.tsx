import { HeroSlider } from '../components/landing/HeroSlider'
import { CategoryCards } from '../components/landing/CategoryCards'
import { SedesNosotros } from '../components/landing/SedesNosotros'
import { FlipSpecialties } from '../components/landing/FlipSpecialties'
import { AdvisorForm } from '../components/landing/AdvisorForm'
import { NewsSection } from '../components/landing/NewsSection'
import { EventsSection } from '../components/landing/EventsSection'
import { PricingSection } from '../components/landing/PricingSection'
export function Home() {
  return (
    <div className="text-left text-slate-800 dark:text-slate-200 min-h-screen relative"
      style={{
        backgroundColor: '#1e3a8a',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e1b4b 100%)
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dot pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(147, 197, 253, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(147, 197, 253, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10">
        <HeroSlider />
        <CategoryCards />
        <SedesNosotros />
        <FlipSpecialties />
        <AdvisorForm />
        <NewsSection />
        <EventsSection />
        <PricingSection />
      </div>
    </div>
  )
}
