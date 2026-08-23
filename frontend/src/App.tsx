import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import AuthScreen from './components/auth/AuthScreen';
import HouseholdSetup from './components/household/HouseholdSetup';
import { GroceryDashboard } from './components/grocery/GroceryDashboard';
import { authService } from './services/authService';

type AppState = 'loading' | 'auth' | 'household-setup' | 'dashboard';

interface User {
  id: number;
  name: string;
  email: string;
  household?: Household;
}

interface Household {
  id: number;
  name: string;
  inviteCode: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    const storedUser = authService.getUser();

    if (token && storedUser) {
      setUser(storedUser);
      setAppState(storedUser.household ? 'dashboard' : 'household-setup');
    } else {
      setAppState('auth');
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAppState(userData.household ? 'dashboard' : 'household-setup');
  };

  const handleHouseholdSetup = (household: Household) => {
    setUser({ ...user!, household });
    setAppState('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAppState('auth');
  };

  if (appState === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      {appState === 'auth' && <AuthScreen onLogin={handleLogin} />}
      {appState === 'household-setup' && user && (
        <HouseholdSetup user={user} onComplete={handleHouseholdSetup} />
      )}
      {appState === 'dashboard' && user && user.household && (
        <GroceryDashboard
          user={user}
          household={user.household}
          onLogout={handleLogout}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default App;
