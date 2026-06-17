import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AppLayout } from "./layouts/AppLayout";
import { MagusMeHomePage } from "./pages/MagusMeHomePage";
import { ConsultPage } from "./pages/ConsultPage";
import { LearnPage } from "./pages/LearnPage";
import { CreatePage } from "./pages/CreatePage";
import { DailyToolsPage } from "./pages/DailyToolsPage";
import { SpellDetailPage } from "./pages/SpellDetailPage";
import { SituationAnalysisPage } from "./pages/SituationAnalysisPage";
import { HumanMapPage } from "./pages/HumanMapPage";
import { ArcanaPage } from "./pages/ArcanaPage";
import RuneConsultPage from "./pages/RuneConsultPage";
import AstrologyConsultPage from "./pages/AstrologyConsultPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ReferencesPage } from "./pages/ReferencesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MarketplaceHome } from "./pages/MarketplaceHome";
import { MarketplaceSearch } from "./pages/MarketplaceSearch";
import { MarketplaceListingDetail } from "./pages/MarketplaceListingDetail";
import { MarketplaceCreateListing } from "./pages/MarketplaceCreateListing";
import { MarketplaceOrders } from "./pages/MarketplaceOrders";
import { MarketplaceOrderDetail } from "./pages/MarketplaceOrderDetail";
import { MarketplacePayoutSetup } from "./pages/MarketplacePayoutSetup";
import { MarketplaceAnalytics } from "./pages/MarketplaceAnalytics";
import { AdminMarketplace } from "./pages/AdminMarketplace";

// Generic divination system pages. one component handles all generic_llm systems
import { GENERIC_SYSTEMS, SPECIALIZED_SYSTEMS } from "../shared/divinationSystems";
import { GenericDivinationPage } from "./pages/GenericDivinationPage";
import { IChingPage } from "./pages/IChingPage";
import { LenormandPage } from "./pages/LenormandPage";
import { PlayingCardsPage } from "./pages/PlayingCardsPage";
import AstroWatchPage from "./pages/AstroWatchPage";
import { TarotPage } from "./pages/TarotPage";
import { OracleCardsPage } from "./pages/OracleCardsPage";
import { KipperPage } from "./pages/KipperPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <AppLayout>
          <Routes>
            {/* Core routes */}
            <Route path="/" element={<MagusMeHomePage />} />
            <Route path="/consult" element={<ConsultPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:spellId" element={<SpellDetailPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/reading" element={<SituationAnalysisPage />} />
            <Route path="/human-map" element={<HumanMapPage />} />
            <Route path="/tools" element={<DailyToolsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/references" element={<ReferencesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Marketplace routes */}
            <Route path="/marketplace" element={<MarketplaceHome />} />
            <Route path="/marketplace/create" element={<MarketplaceCreateListing />} />
            <Route path="/marketplace/orders" element={<MarketplaceOrders />} />
            <Route path="/marketplace/orders/:id" element={<MarketplaceOrderDetail />} />
            <Route path="/marketplace/c/:slug" element={<MarketplaceSearch />} />
            <Route path="/marketplace/s/:handle" element={<MarketplaceSearch />} />
            <Route path="/marketplace/l/:slug" element={<MarketplaceListingDetail />} />
            <Route path="/marketplace/payments/payout" element={<MarketplacePayoutSetup />} />
            <Route path="/marketplace/analytics" element={<MarketplaceAnalytics />} />
            <Route path="/marketplace/admin" element={<AdminMarketplace />} />

            {/* Specialized divination routes. custom pages */}
            <Route path="/consult/tarot" element={<TarotPage />} />
            <Route path="/consult/runes" element={<RuneConsultPage />} />
            <Route path="/consult/lenormand" element={<LenormandPage />} />
            <Route path="/consult/astrology" element={<AstrologyConsultPage />} />
            <Route path="/consult/iching" element={<IChingPage />} />
            <Route path="/consult/playing-cards" element={<PlayingCardsPage />} />
            <Route path="/consult/oracle-cards" element={<OracleCardsPage />} />
            <Route path="/consult/kipper" element={<KipperPage />} />
            <Route path="/consult/astro-watch" element={<AstroWatchPage />} />

            {/* Generic divination routes. auto-generated from registry */}
            {GENERIC_SYSTEMS.map((sys) => (
              <Route
                key={sys.id}
                path={sys.route}
                element={<GenericDivinationPage systemId={sys.id} />}
              />
            ))}

            {/* Fallback */}
            <Route path="*" element={<MagusMeHomePage />} />
          </Routes>
        </AppLayout>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
