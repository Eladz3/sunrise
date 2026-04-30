import { AuthGate } from '@/auth/AuthGate';
import { AppLayout } from '@/components/layout/AppLayout';

function App() {
  return (
    <AuthGate>
      <AppLayout />
    </AuthGate>
  );
}

export default App;
