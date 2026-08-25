import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ArticlesSourcesPage, HajjSystemsWorldPage } from './pages/ContentPages';
import { ArticlePage, GuidesPage } from './pages/Articles';
import { HomePage } from './pages/HomePage';
import { HajjDataPage } from './pages/HajjDataPage';
import TripsPage from './pages/TripsPage';
import UmrahProgramCheckerPage from './pages/UmrahProgramCheckerPage';
import { BudgetCalculatorPage, EligibilityCheckerPage, PackingChecklistPage, ProgramComparisonPage, ToolsHubPage } from './pages/InteractiveToolsPages';
import {
  FirstHajjPage,
  HajjPackingGuidePage,
  HajjPreparationHubPage,
  HajjRitualsHubPage,
  HajjStepByStepPage,
  HajjTypesPage,
  UmrahEgyptPage,
  UmrahHubPage,
  UmrahVisaPage,
} from './pages/EvergreenContentPages';
import { ScaleContentPage } from './pages/ScaleContentPage';
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
import {
  AssociationsHajj2027Page,
  CompareHajjPaths2027Page,
  EgyptHajj2027Page,
  HajjLottery2027Page,
  HajjLotteryApply2027Page,
  HajjLotteryRequirements2027Page,
  TouristHajj2027Page,
  UnifiedHajjPortalPage,
} from './pages/Seasonal2027Pages';

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="tools" element={<ToolsHubPage />} />
      <Route path="tools/hajj-packing-checklist" element={<PackingChecklistPage />} />
      <Route path="tools/hajj-budget-calculator" element={<BudgetCalculatorPage />} />
      <Route path="tools/egypt-hajj-eligibility-checker" element={<EligibilityCheckerPage />} />
      <Route path="tools/hajj-program-comparison" element={<ProgramComparisonPage />} />
      <Route path="data/hajj-tourism-history" element={<HajjDataPage />} />
      <Route path="egypt-hajj/2027" element={<EgyptHajj2027Page />} />
      <Route path="hajj-lottery/2027" element={<HajjLottery2027Page />} />
      <Route path="hajj-lottery/2027/requirements" element={<HajjLotteryRequirements2027Page />} />
      <Route path="hajj-lottery/2027/apply" element={<HajjLotteryApply2027Page />} />
      <Route path="egypt-hajj/2027/associations" element={<AssociationsHajj2027Page />} />
      <Route path="egypt-hajj/2027/compare-paths" element={<CompareHajjPaths2027Page />} />
      <Route path="tourist-hajj/2027" element={<TouristHajj2027Page />} />
      <Route path="egypt-hajj/unified-hajj-portal" element={<UnifiedHajjPortalPage />} />
      <Route path="hajj-rituals" element={<HajjRitualsHubPage />} />
      <Route path="hajj-rituals/step-by-step" element={<HajjStepByStepPage />} />
      <Route path="hajj-rituals/types" element={<HajjTypesPage />} />
      <Route path="hajj-preparation" element={<HajjPreparationHubPage />} />
      <Route path="hajj-preparation/first-time" element={<FirstHajjPage />} />
      <Route path="hajj-preparation/packing-list" element={<HajjPackingGuidePage />} />
      <Route path="umrah" element={<UmrahHubPage />} />
      <Route path="umrah/egypt" element={<UmrahEgyptPage />} />
      <Route path="umrah/visa" element={<UmrahVisaPage />} />
      <Route path="about" element={<TrustAboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="editorial-policy" element={<EditorialPolicyPage />} />
      <Route path="sources-policy" element={<SourcesPolicyPage />} />
      <Route path="corrections-policy" element={<CorrectionsPolicyPage />} />
      <Route path="authors" element={<AuthorsPage />} />
      <Route path="official-sources" element={<OfficialSourcesPage />} />
      <Route path="how-it-works" element={<ScaleContentPage overridePath="/hajj-lottery/how-it-works" />} />
      <Route path="hajj-levels" element={<ScaleContentPage overridePath="/tourist-hajj/levels" />} />
      <Route path="rituals" element={<HajjRitualsHubPage />} />
      <Route path="hajj-systems-world" element={<HajjSystemsWorldPage />} />
      <Route path="articles-sources" element={<ArticlesSourcesPage />} />
      <Route path="guides" element={<GuidesPage />} />
      <Route path="guides/:slug" element={<ArticlePage />} />
      <Route path="umrah-1448-checker" element={<UmrahProgramCheckerPage />} />
      <Route path="trips" element={<TripsPage />} />
      <Route path="privacy" element={<TrustPrivacyPage />} />
      <Route path="disclaimer" element={<TrustDisclaimerPage />} />
      <Route path="*" element={<ScaleContentPage />} />
    </Route>
  </Routes>;
}
