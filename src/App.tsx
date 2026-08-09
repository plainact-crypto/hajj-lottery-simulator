import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AboutPage, DisclaimerPage, HajjLevelsPage, HajjSystemsWorldPage, HowItWorksPage, NotFoundPage, PrivacyPage, RitualsPage } from './pages/ContentPages';
import { HomePage } from './pages/HomePage';

export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="about" element={<AboutPage />} /><Route path="how-it-works" element={<HowItWorksPage />} /><Route path="hajj-levels" element={<HajjLevelsPage />} /><Route path="rituals" element={<RitualsPage />} /><Route path="duas" element={<RitualsPage />} /><Route path="hajj-systems-world" element={<HajjSystemsWorldPage />} /><Route path="privacy" element={<PrivacyPage />} /><Route path="disclaimer" element={<DisclaimerPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes>;
}
