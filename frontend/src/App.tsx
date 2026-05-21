import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGate } from '@/auth/AuthGate'
import { AppLayout } from '@/components/layout/AppLayout'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsOfService from '@/pages/TermsOfService'
import Home from '@/pages/Home'
import { DevApiToggle } from '@/components/dev/DevApiToggle'

function App() {
  return (
    <>
      {import.meta.env.DEV && <DevApiToggle />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route
          path="/dashboard"
          element={
            <AuthGate>
              <AppLayout />
            </AuthGate>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
