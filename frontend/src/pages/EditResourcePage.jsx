import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResource, updateResource, listCategories } from '../api/api.js';
import ResourceForm from '../components/ResourceForm.jsx';

export default function EditResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    Promise.all([getResource(id), listCategories()])
      .then(([resource, cats]) => {
        setInitial({
          title: resource.title ?? '',
          description: resource.description ?? '',
          category: resource.category ?? '',
        });
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values) {
    setSubmit(true);
    try {
      await updateResource(id, values);
      navigate(`/resources/${id}`);
    } finally {
      setSubmit(false);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <div className="alert alert--error">{error}</div>;

  return (
    <section className="form-page">
      <Link to={`/resources/${id}`} className="back-link">
        ← Back to resource
      </Link>
      <h1>Edit Resource</h1>
      <ResourceForm
        initial={initial}
        categories={categories}
        onSubmit={handleSubmit}
        submit={submit}
        submitLabel="Save Changes"
      />
    </section>
  );
}
