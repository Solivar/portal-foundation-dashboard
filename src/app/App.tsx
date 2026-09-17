import { Header } from '../components/layout/Header';
import { Dashboard } from '../features/dashboard';
import { NotificationProvider } from '../features/notifications';

function App() {
  return (
    <NotificationProvider>
      <a className="skipLink" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <Dashboard />
    </NotificationProvider>
  );
}

export default App;
