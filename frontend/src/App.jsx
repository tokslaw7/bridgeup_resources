import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import RequireAuth from './auth/RequireAuth.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import ResourceDetailPage from './pages/ResourceDetailPage.jsx';
import NewResourcePage from './pages/NewResourcePage.jsx';
import EditResourcePage from './pages/EditResourcePage.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';

function AuthNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (user) {
    return (
      <>
        <NavLink to="/new" className="nav-link nav-link--cta">
          + Post a Resource
        </NavLink>
        <span className="nav-user" title={user.email}>
          {user.name}
        </span>
        <button type="button" className="nav-link nav-link--button" onClick={handleLogout}>
          Log out
        </button>
      </>
    );
  }

  return (
    <>
      <NavLink to="/login" className="nav-link">
        Log in
      </NavLink>
      <NavLink to="/signup" className="nav-link nav-link--cta">
        Sign up
      </NavLink>
    </>
  );
}

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">📖</span>
            <span className="brand-name">BridgeUp</span>
            <span className="brand-tag">Community Resource Board</span>
          </Link>
          <nav className="nav">
            <NavLink to="/" end className="nav-link">
              Browse
            </NavLink>
            <AuthNav />
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/new"
            element={
              <RequireAuth>
                <NewResourcePage />
              </RequireAuth>
            }
          />
          <Route
            path="/resources/:id/edit"
            element={
              <RequireAuth>
                <EditResourcePage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <p>BridgeUp · Curated educational materials and guides to support your journey.</p>
      </footer>
    </div>
  );
}
