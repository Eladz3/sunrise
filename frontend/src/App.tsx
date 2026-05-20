import { Routes, Route } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { AuthGate } from '@/auth/AuthGate'
import { AppLayout } from '@/components/layout/AppLayout'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsOfService from '@/pages/TermsOfService'
import { DevApiToggle } from '@/components/dev/DevApiToggle'

function App() {
  return (
    <>
      {import.meta.env.DEV && <DevApiToggle />}
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
    </>
  )
}

export default App
