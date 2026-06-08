import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ResourceCard({ resource }) {
  const { user } = useAuth();
  const { id, title, description, category, owner_id, owner_name } = resource;
  const isOwner = user && user.id === owner_id;
  const snippet =
    description.length > 160 ? `${description.slice(0, 160).trimEnd()}…` : description;

  return (
    <article className="card">
      <div className="card-head">
        <span className={`badge badge--${category.toLowerCase()}`}>{category}</span>
        {isOwner && <span className="badge badge--mine">Yours</span>}
      </div>
      <h3 className="card-title">
        <Link to={`/resources/${id}`}>{title}</Link>
      </h3>
      <p className="card-desc">{snippet}</p>
      <div className="card-foot">
        {owner_name && <span className="card-owner">Posted by {owner_name}</span>}
        <div className="card-actions">
          <Link to={`/resources/${id}`} className="btn btn--ghost">
            View
          </Link>
          {isOwner && (
            <Link to={`/resources/${id}/edit`} className="btn btn--ghost">
              Edit
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
