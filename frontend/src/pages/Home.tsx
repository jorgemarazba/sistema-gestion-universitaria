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
    <div className="text-left text-slate-800 dark:text-slate-200">
      <HeroSlider />
      <CategoryCards />
      <SedesNosotros />
      <FlipSpecialties />
      <AdvisorForm />
      <NewsSection />
      <EventsSection />
      <PricingSection />
    </div>
  )
}
