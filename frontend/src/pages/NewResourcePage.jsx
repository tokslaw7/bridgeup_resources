import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createResource, listCategories } from '../api/api.js';
import ResourceForm from '../components/ResourceForm.jsx';

export default function NewResourcePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
  }, []);

  async function handleSubmit(values) {
    setSubmit(true);
    try {
      const created = await createResource(values);
      navigate(`/resources/${created.id}`);
    } finally {
      setSubmit(false);
    }
  }

  return (
    <section className="form-page">
      <Link to="/" className="back-link">
        ← Back to all resources
      </Link>
      <h1>Post a Resource</h1>
      <p className="muted">Curated educational materials and guides to support your journey.</p>
      <ResourceForm
        categories={categories}
        onSubmit={handleSubmit}
        submit={submit}
        submitLabel="Publish Resource"
      />
    </section>
  );
}
