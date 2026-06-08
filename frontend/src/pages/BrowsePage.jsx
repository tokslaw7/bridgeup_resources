import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listResources, listCategories } from '../api/api.js';
import ResourceCard from '../components/ResourceCard.jsx';

export default function BrowsePage() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      setError('');
      listResources({ search, category })
        .then(setResources)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Community Resources</h1>
          <p className="muted"> Curated educational materials and guides to support your journey.</p>
        </div>
        <Link to="/new" className="btn btn--primary">
          + Post a Resource
        </Link>
      </div>

      <div className="filters">
        <input
          className="filters__search"
          type="search"
          placeholder="Search by title, description, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filters__category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <p className="muted">Loading resources…</p>
      ) : resources.length === 0 ? (
        <div className="empty">
          <p>No resources found.</p>
          <Link to="/new" className="btn btn--primary">
            Be the first to post one
          </Link>
        </div>
      ) : (
        <div className="grid">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </section>
  );
}
