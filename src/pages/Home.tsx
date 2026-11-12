import { Coaches } from '../components/sections/Coaches'
import { Faq } from '../components/sections/Faq'
import { FirstClass } from '../components/sections/FirstClass'
import { Frames } from '../components/sections/Frames'
import { Hero } from '../components/sections/Hero'
import { Parents } from '../components/sections/Parents'
import { Programs } from '../components/sections/Programs'
import { Schedule } from '../components/sections/Schedule'
import { Start } from '../components/sections/Start'

export function Home() {
  return (
    <>
      <Hero />
      <Programs />
      <Start />
      <Frames />
      <Parents />
      <Coaches />
      <Schedule />
      <FirstClass />
      <Faq />
    </>
  )
}
