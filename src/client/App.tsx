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
import { ArcanaPage } from "./pages/ArcanaPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <AppLayout>
          <Routes>
            <Route path="/" element={<MagusMeHomePage />} />
            <Route path="/consult" element={<ConsultPage />} />
            <Route path="/consult/tarot" element={<ArcanaPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:spellId" element={<SpellDetailPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/reading" element={<SituationAnalysisPage />} />
            <Route path="/tools" element={<DailyToolsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<MagusMeHomePage />} />
          </Routes>
        </AppLayout>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
