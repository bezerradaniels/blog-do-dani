import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit3, Trash2, Loader2, X, Save } from 'lucide-react';
import type { Category } from '../../types';

const API = '/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#e11d48', '#d97706', '#0891b2', '#be185d', '#4f46e5', '#0d9488', '#dc2626'];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Category[]>('/categories.php');
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!editing?.name) return;
    setError('');
    try {
      if (isNew) {
        await apiFetch('/categories.php', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      } else {
        await apiFetch(`/categories.php?id=${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta categoria?')) return;
    try {
      await apiFetch(`/categories.php?id=${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Categorias</h1>
        <button
          onClick={() => { setEditing({ name: '', slug: '', color: '#2563eb' }); setIsNew(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {/* Modal de edição */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text mb-4">{isNew ? 'Nova Categoria' : 'Editar Categoria'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Nome</label>
                <input
                  type="text"
                  value={editing.name || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Slug</label>
                <input
                  type="text"
                  value={editing.slug || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, slug: e.target.value } : null)}
                  placeholder="Gerado automaticamente se vazio"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setEditing(prev => prev ? { ...prev, color: c } : null)}
                      className={`w-8 h-8 rounded-full border-2 transition ${editing.color === c ? 'border-text scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-muted hover:text-text transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Cor</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Nome</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Slug</th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-bg/50 transition">
                  <td className="px-5 py-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-bold uppercase px-2.5 py-1 rounded"
                      style={{ backgroundColor: cat.color + '20', color: cat.color }}
                    >
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-text-muted">{cat.slug}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing({ ...cat }); setIsNew(false); }}
                        className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-text-muted">Nenhuma categoria encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
