import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingLayout } from './components/landing/LandingLayout'
import { HomePage } from './pages/landing/HomePage'
import { FeaturesPage } from './pages/landing/FeaturesPage'
import { HowItWorksPage } from './pages/landing/HowItWorksPage'
import { TemplatesPage } from './pages/landing/TemplatesPage'
import { AboutPage } from './pages/landing/AboutPage'
import { BuilderPage } from './pages/BuilderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="builder" element={<BuilderPage />} />
      </Routes>
    </BrowserRouter>
  )
}
