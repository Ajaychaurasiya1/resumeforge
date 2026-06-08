import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { LandingLayout } from './components/landing/LandingLayout'
import { HomePage } from './pages/landing/HomePage'
import { FeaturesPage } from './pages/landing/FeaturesPage'
import { HowItWorksPage } from './pages/landing/HowItWorksPage'
import { TemplatesPage } from './pages/landing/TemplatesPage'
import { AboutPage } from './pages/landing/AboutPage'
import { MissionPage } from './pages/landing/MissionPage'
import { PrivacyPage } from './pages/landing/PrivacyPage'
import { BuilderPage } from './pages/BuilderPage'
import { ScorePage } from './pages/ScorePage'
import { ViewPage } from './pages/ViewPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="mission" element={<MissionPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
        <Route path="builder" element={<BuilderPage />} />
        <Route path="score" element={<ScorePage />} />
        <Route path="view/:id" element={<ViewPage />} />
      </Routes>
    </BrowserRouter>
  )
}
