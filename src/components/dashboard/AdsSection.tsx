import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit3, Trash2, Loader2, X, Save, Upload, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';

const API = '/api';

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  link_text: string;
  active: boolean;
  position: string;
  created_at: string;
}

const EMPTY: Partial<Ad> = {
  title: '',
  description: '',
  image: '',
  link: '',
  link_text: 'Saiba mais',
  active: true,
  position: 'sidebar',
};

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

const POSITIONS: { value: string; label: string }[] = [
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'article_bottom', label: 'Fim do artigo' },
  { value: 'home_banner', label: 'Banner da home' },
];

export default function AdsSection() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Partial<Ad> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Ad[]>('/ads.php');
      setAds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API}/upload.php`, { method: 'POST', credentials: 'include', body: formData });
      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      setEditing(prev => prev ? { ...prev, image: data.url } : null);
    } catch {
      setModalError('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!editing?.title) { setModalError('Título é obrigatório'); return; }
    setModalError('');
    setSaving(true);
    try {
      if (isNew) {
        await apiFetch('/ads.php', { method: 'POST', body: JSON.stringify(editing) });
      } else {
        await apiFetch(`/ads.php?id=${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) });
      }
      setEditing(null);
      setIsNew(false);
      await load();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (ad: Ad) => {
    try {
      await apiFetch(`/ads.php?id=${ad.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !ad.active }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este anúncio?')) return;
    try {
      await apiFetch(`/ads.php?id=${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  };

  const positionLabel = (pos: string) => POSITIONS.find(p => p.value === pos)?.label ?? pos;

  return (
    <div>
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Anúncios</h1>
        <button
          onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); setModalError(''); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" />
          Novo Anúncio
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-text">{isNew ? 'Novo Anúncio' : 'Editar Anúncio'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{modalError}</div>
              )}

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Título *</label>
                <input type="text" value={editing.title || ''} autoFocus
                  onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Descrição</label>
                <textarea value={editing.description || ''} rows={3}
                  onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Texto exibido abaixo do título..."
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Imagem do anúncio</label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {editing.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={editing.image} alt="" className="w-full object-cover max-h-48" />
                    <button
                      onClick={() => setEditing(prev => prev ? { ...prev, image: '' } : null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed border-border rounded-xl text-text-muted hover:border-primary/40 hover:text-primary transition disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    <span className="text-sm">{uploading ? 'Enviando...' : 'Clique para fazer upload'}</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Link de destino</label>
                <input type="url" value={editing.link || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, link: e.target.value } : null)}
                  placeholder="https://..."
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Texto do botão</label>
                <input type="text" value={editing.link_text || ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, link_text: e.target.value } : null)}
                  placeholder="Saiba mais"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Posição</label>
                <select value={editing.position || 'sidebar'}
                  onChange={e => setEditing(prev => prev ? { ...prev, position: e.target.value } : null)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                  {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => setEditing(prev => prev ? { ...prev, active: !prev.active } : null)}
                  className={`transition ${editing.active ? 'text-primary' : 'text-text-muted'}`}>
                  {editing.active
                    ? <ToggleRight className="w-8 h-8" />
                    : <ToggleLeft className="w-8 h-8" />}
                </button>
                <span className="text-sm text-text">{editing.active ? 'Anúncio ativo' : 'Anúncio inativo'}</span>
              </div>

              {/* Preview */}
              {(editing.title || editing.image) && (
                <div>
                  <p className="text-xs font-medium text-text-muted mb-2">Prévia</p>
                  <div className="rounded-xl overflow-hidden bg-primary text-white">
                    {editing.image && (
                      <img src={editing.image} alt="" className="w-full object-cover max-h-36" />
                    )}
                    <div className="p-4">
                      <p className="font-bold text-sm">{editing.title}</p>
                      {editing.description && <p className="mt-1 text-xs text-white/80">{editing.description}</p>}
                      {editing.link_text && (
                        <div className="mt-3 text-center py-2 bg-white text-primary font-semibold text-xs rounded-lg">
                          {editing.link_text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => { setEditing(null); setIsNew(false); }}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-muted hover:text-text transition">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">
          <p className="text-sm">Nenhum anúncio cadastrado ainda.</p>
          <p className="text-xs mt-1">Clique em "Novo Anúncio" para começar.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map(ad => (
            <div key={ad.id} className={`bg-white rounded-xl border overflow-hidden flex flex-col transition ${ad.active ? 'border-border' : 'border-border opacity-60'}`}>
              {ad.image ? (
                <img src={ad.image} alt={ad.title} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary/40 font-medium">Sem imagem</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-text line-clamp-1">{ad.title}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${ad.active ? 'bg-green-50 text-green-700' : 'bg-bg text-text-muted'}`}>
                    {ad.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                {ad.description && <p className="text-xs text-text-muted line-clamp-2">{ad.description}</p>}
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="text-xs bg-bg text-text-muted px-2 py-0.5 rounded">{positionLabel(ad.position)}</span>
                  {ad.link && (
                    <a href={ad.link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-0.5">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <div className="px-4 pb-4 flex items-center justify-between border-t border-border pt-3">
                <button onClick={() => handleToggle(ad)}
                  className={`transition ${ad.active ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                  title={ad.active ? 'Desativar' : 'Ativar'}>
                  {ad.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing({ ...ad }); setIsNew(false); setModalError(''); }}
                    className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(ad.id)}
                    className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
