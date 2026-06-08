import { useState } from 'react';

const EMPTY = {
  title: '',
  description: '',
  category: '',
};

export default function ResourceForm({ initial, categories, onSubmit, submit, submitLabel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="alert alert--error">{error}</div>}

      <label className="field">
        <span className="field-label">Title *</span>
        <input
          type="text"
          value={values.title}
          onChange={update('title')}
          maxLength={200}
          required
          placeholder="e.g. Understanding Autism Spectrum Disorder: A Parent Guide"
        />
      </label>

      <label className="field">
        <span className="field-label">Category *</span>
        <select value={values.category} onChange={update('category')} required>
          <option value="" disabled>
            Select a category…
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">Description *</span>
        <textarea
          value={values.description}
          onChange={update('description')}
          rows={5}
          maxLength={5000}
          required
          placeholder="A comprehensive guide covering the spectrum, early signs, diagnosis process…"
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={submit}>
          {submit ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
