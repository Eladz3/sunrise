import { Routes, Route } from 'react-router-dom';
import { AuthGate } from '@/auth/AuthGate';
import { AppLayout } from '@/components/layout/AppLayout';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

function App() {
  return (
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route
        path="*"
        element={
          <AuthGate>
            <AppLayout />
          </AuthGate>
        }
      />
    </Routes>
  );
}

export default App;
