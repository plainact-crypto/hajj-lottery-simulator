import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ArticlesSourcesPage, HajjLevelsPage, HajjSystemsWorldPage, HowItWorksPage, NotFoundPage, RitualsPage } from './pages/ContentPages';
import { ArticlePage, GuidesPage } from './pages/Articles';
import { HomePage } from './pages/HomePage';
import TripsPage from './pages/TripsPage';
import UmrahProgramCheckerPage from './pages/UmrahProgramCheckerPage';
import {
  AuthorsPage,
  ContactPage,
  CorrectionsPolicyPage,
  EditorialPolicyPage,
  OfficialSourcesPage,
  SourcesPolicyPage,
  TrustAboutPage,
  TrustDisclaimerPage,
  TrustPrivacyPage,
} from './pages/TrustPages';

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<TrustAboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="editorial-policy" element={<EditorialPolicyPage />} />
      <Route path="sources-policy" element={<SourcesPolicyPage />} />
      <Route path="corrections-policy" element={<CorrectionsPolicyPage />} />
      <Route path="authors" element={<AuthorsPage />} />
      <Route path="official-sources" element={<OfficialSourcesPage />} />
      <Route path="how-it-works" element={<HowItWorksPage />} />
      <Route path="hajj-levels" element={<HajjLevelsPage />} />
      <Route path="rituals" element={<RitualsPage />} />
      <Route path="hajj-systems-world" element={<HajjSystemsWorldPage />} />
      <Route path="articles-sources" element={<ArticlesSourcesPage />} />
      <Route path="guides" element={<GuidesPage />} />
      <Route path="guides/:slug" element={<ArticlePage />} />
      <Route path="umrah-1448-checker" element={<UmrahProgramCheckerPage />} />
      <Route path="privacy" element={<TrustPrivacyPage />} />
      <Route path="disclaimer" element={<TrustDisclaimerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="/trips" element={<TripsPage />} />
  </Routes>;
}
