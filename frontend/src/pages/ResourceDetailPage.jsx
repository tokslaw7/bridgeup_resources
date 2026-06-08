import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResource, deleteResource } from '../api/api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getResource(id)
      .then(setResource)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this resource? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteResource(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <div className="alert alert--error">{error}</div>;
  if (!resource) return null;

  const {
    title,
    description,
    category,
    owner_id,
    owner_name,
    created_at,
    updated_at,
  } = resource;
  const isOwner = user && user.id === owner_id;

  return (
    <article className="detail">
      <Link to="/" className="back-link">
        ← Back to all resources
      </Link>

      <div className="detail-head">
        <span className={`badge badge--${category.toLowerCase()}`}>{category}</span>
        <h1>{title}</h1>
      </div>

      <p className="detail-desc">{description}</p>

      <p className="detail-timestamps muted">
        {owner_name && `Posted by ${owner_name} · `}
        {new Date(created_at).toLocaleDateString()}
        {updated_at !== created_at && ` · Updated ${new Date(updated_at).toLocaleDateString()}`}
      </p>

      {isOwner && (
        <div className="detail-actions">
          <Link to={`/resources/${id}/edit`} className="btn btn--primary">
            Edit
          </Link>
          <button className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </article>
  );
}
