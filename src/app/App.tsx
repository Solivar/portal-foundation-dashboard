import { Header } from '../components/layout/Header';
import { Dashboard } from '../features/dashboard';

function App() {
  return (
    <>
      <a className="skipLink" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <Dashboard />
    </>
  );
}

export default App;
