import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AboutPage, ArticlesSourcesPage, DisclaimerPage, HajjLevelsPage, HajjSystemsWorldPage, HowItWorksPage, NotFoundPage, PrivacyPage, RitualsPage } from './pages/ContentPages';
import { HomePage } from './pages/HomePage';
import TripsPage from './pages/TripsPage';
import UmrahProgramCheckerPage from './pages/UmrahProgramCheckerPage';

export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="about" element={<AboutPage />} /><Route path="how-it-works" element={<HowItWorksPage />} /><Route path="hajj-levels" element={<HajjLevelsPage />} /><Route path="rituals" element={<RitualsPage />} /><Route path="duas" element={<RitualsPage />} /><Route path="hajj-systems-world" element={<HajjSystemsWorldPage />} /><Route path="articles-sources" element={<ArticlesSourcesPage />} /><Route path="umrah-1448-checker" element={<UmrahProgramCheckerPage />} /><Route path="privacy" element={<PrivacyPage />} /><Route path="disclaimer" element={<DisclaimerPage />} /><Route path="*" element={<NotFoundPage />} /></Route><Route path="/trips" element={<TripsPage />} /></Routes>;
}
