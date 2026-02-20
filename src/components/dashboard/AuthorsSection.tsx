import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit3, Trash2, Loader2, X, Save, Upload, UserCircle } from 'lucide-react';
import type { Author } from '../../types';

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

export default function AuthorsSection() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Partial<Author> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Author[]>('/authors.php');
      setAuthors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API}/upload.php`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      setEditing(prev => prev ? { ...prev, avatar: data.url } : null);
    } catch {
      setError('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!editing?.name) return;
    setError('');
    try {
      if (isNew) {
        await apiFetch('/authors.php', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      } else {
        await apiFetch(`/authors.php?id=${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      }
      setEditing(null);
      setIsNew(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este autor?')) return;
    try {
      await apiFetch(`/authors.php?id=${id}`, { method: 'DELETE' });
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
        <h1 className="text-2xl font-bold text-text">Autores</h1>
        <button
          onClick={() => { setEditing({ name: '', role: '', bio: '', avatar: '' }); setIsNew(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" />
          Novo Autor
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text mb-4">{isNew ? 'Novo Autor' : 'Editar Autor'}</h2>
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
                <label className="block text-xs font-medium text-text-muted mb-1">Cargo / Função</label>
                <input
                  type="text"
                  value={editing.role || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, role: e.target.value } : null)}
                  placeholder="Ex: Editora Chefe"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Bio</label>
                <textarea
                  value={editing.bio || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  rows={3}
                  placeholder="Breve descrição do autor..."
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Avatar</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {editing.avatar ? (
                      <div className="relative">
                        <img src={editing.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                        <button
                          type="button"
                          onClick={() => setEditing(prev => prev ? { ...prev, avatar: '' } : null)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-bg border-2 border-dashed border-border flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-text-muted/40" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg text-text-muted hover:text-text hover:border-primary transition disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Enviando...' : 'Escolher imagem'}
                  </button>
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
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Autor</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Cargo</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Bio</th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {authors.map(author => (
                <tr key={author.id} className="hover:bg-bg/50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={author.avatar || `https://i.pravatar.cc/150?u=${author.name}`}
                        alt={author.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <span className="text-sm font-medium text-text">{author.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-text-muted">{author.role}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-text-muted line-clamp-1 max-w-xs">{author.bio}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing({ ...author }); setIsNew(false); }}
                        className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-text-muted">Nenhum autor encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
