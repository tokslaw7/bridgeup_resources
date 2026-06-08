import { Routes, Route, Link, NavLink} from 'react-router-dom';
import SignUp from './pages/SignUp.jsx';


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
            <NavLink to="/signup" className="nav-link">
              Sign up
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<div className="home">
            <h1>Welcome to BridgeUp</h1>
            <p>Find community resources.</p>
          </div>} 
          />
        </Routes>
      </main>

      <footer className="footer">
        <p>BridgeUp · Curated educational materials and guides to support your journey.</p>
      </footer>
    </div>
  );
}
