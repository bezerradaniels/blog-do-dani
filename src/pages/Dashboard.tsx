import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Edit3, Trash2, Eye, Search, FileText,
  LayoutDashboard, FolderOpen, Users, Settings, Megaphone,
  ChevronDown, Save, X,
  LogOut, Loader2, Upload,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import CategoriesSection from '../components/dashboard/CategoriesSection';
import AuthorsSection from '../components/dashboard/AuthorsSection';
import SettingsSection from '../components/dashboard/SettingsSection';
import AdsSection from '../components/dashboard/AdsSection';
import type { Post, Category } from '../types';

type View = 'list' | 'create' | 'edit';
type Section = 'posts' | 'categories' | 'authors' | 'ads' | 'settings';

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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [section, setSection] = useState<Section>('posts');
  const [view, setView] = useState<View>('list');
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<{ data: Post[] }>('/posts.php?all=1&page=1');
      setPosts(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await apiFetch<Category[]>('/categories.php');
      setCategories(data);
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, [loadPosts, loadCategories]);

  const filteredPosts = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleNewPost = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: categories[0] || { id: 1, name: 'SEO', slug: 'seo', color: '#2563eb' },
      tags: [],
      read_time: 5,
      status: 'draft',
      featured: false,
    });
    setView('create');
    setError('');
  };

  const handleEdit = (post: Post) => {
    setEditingPost({ ...post });
    setView('edit');
    setError('');
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editingPost?.title) return;

    setSaving(true);
    setError('');

    const payload = {
      title: editingPost.title,
      excerpt: editingPost.excerpt || '',
      content: editingPost.content || '',
      featured_image: editingPost.featured_image || '',
      category_id: editingPost.category?.id || 1,
      tags: editingPost.tags || [],
      read_time: editingPost.read_time || 5,
      status,
      featured: editingPost.featured || false,
    };

    try {
      if (view === 'create') {
        await apiFetch<Post>('/posts.php', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<Post>(`/posts.php?id=${editingPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      setEditingPost(null);
      setView('list');
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      await apiFetch<void>(`/posts.php?id=${id}`, { method: 'DELETE' });
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  };

  const togglePublish = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await apiFetch<Post>(`/posts.php?id=${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API}/upload.php`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      setEditingPost(prev => prev ? { ...prev, featured_image: data.url } : null);
    } catch {
      setError('Erro ao fazer upload da imagem');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    views: posts.reduce((sum, p) => sum + p.views, 0),
  };

  // Editor view
  if (view === 'create' || view === 'edit') {
    return (
      <div className="min-h-screen bg-bg">
        <div className="bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => { setView('list'); setEditingPost(null); }} className="text-text-muted hover:text-text transition">
                <X className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-text">
                {view === 'create' ? 'Novo Artigo' : 'Editar Artigo'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-muted hover:text-text transition disabled:opacity-50"
              >
                Salvar Rascunho
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Publicar
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-5xl mx-auto px-4 mt-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* Main Editor */}
            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  value={editingPost?.title || ''}
                  onChange={e => setEditingPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Título do artigo"
                  className="w-full text-3xl font-bold text-text placeholder-gray-300 focus:outline-none bg-transparent"
                />
              </div>

              <div>
                <textarea
                  value={editingPost?.excerpt || ''}
                  onChange={e => setEditingPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                  placeholder="Resumo do artigo (será exibido nos cards)..."
                  rows={2}
                  className="w-full text-text-muted text-sm border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              {/* Image Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition cursor-pointer"
                onClick={() => !editingPost?.featured_image && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {editingPost?.featured_image ? (
                  <div className="relative">
                    <img src={editingPost.featured_image} alt="" className="w-full aspect-video object-cover rounded-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingPost(prev => prev ? { ...prev, featured_image: '' } : null); }}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-text-muted hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-text-muted/30 mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Clique para fazer upload ou arraste uma imagem</p>
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem..."
                      onClick={e => e.stopPropagation()}
                      onBlur={e => {
                        if (e.target.value) {
                          setEditingPost(prev => prev ? { ...prev, featured_image: e.target.value } : null);
                          e.target.value = '';
                        }
                      }}
                      className="mt-3 w-64 mx-auto text-center text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Conteúdo</label>
                <RichTextEditor
                  value={editingPost?.content || ''}
                  onChange={content => setEditingPost(prev => prev ? { ...prev, content } : null)}
                />
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-text text-sm">Configurações</h3>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Categoria</label>
                  <select
                    value={editingPost?.category?.id || ''}
                    onChange={e => {
                      const cat = categories.find(c => c.id === Number(e.target.value));
                      if (cat) setEditingPost(prev => prev ? { ...prev, category: cat } : null);
                    }}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={editingPost?.tags?.join(', ') || ''}
                    onChange={e => setEditingPost(prev => prev ? { ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : null)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Tempo de leitura (min)</label>
                  <input
                    type="number"
                    value={editingPost?.read_time || 5}
                    onChange={e => setEditingPost(prev => prev ? { ...prev, read_time: Number(e.target.value) } : null)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingPost?.featured || false}
                    onChange={e => setEditingPost(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm text-text">Destaque na home</label>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-text text-sm mb-3">Pré-visualização</h3>
                {editingPost?.title ? (
                  <div className="border border-border rounded-lg p-3">
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: (editingPost.category?.color || '#2563eb') + '20',
                        color: editingPost.category?.color || '#2563eb',
                      }}
                    >
                      {editingPost.category?.name || 'Categoria'}
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-text line-clamp-2">{editingPost.title}</h4>
                    <p className="mt-1 text-xs text-text-muted line-clamp-2">{editingPost.excerpt}</p>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">Preencha o título para ver a prévia.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-bg">
      <div className="flex">
        {/* Sidebar Nav */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-border min-h-screen p-4">
          <div className="flex items-center gap-2 text-primary font-bold text-lg mb-8 px-2">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <nav className="space-y-1">
            <button onClick={() => { setSection('posts'); setView('list'); }} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg w-full transition ${section === 'posts' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text hover:bg-bg'}`}>
              <FileText className="w-4 h-4" />
              Artigos
            </button>
            <button onClick={() => setSection('categories')} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg w-full transition ${section === 'categories' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text hover:bg-bg'}`}>
              <FolderOpen className="w-4 h-4" />
              Categorias
            </button>
            <button onClick={() => setSection('authors')} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg w-full transition ${section === 'authors' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text hover:bg-bg'}`}>
              <Users className="w-4 h-4" />
              Autores
            </button>
            <button onClick={() => setSection('ads')} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg w-full transition ${section === 'ads' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text hover:bg-bg'}`}>
              <Megaphone className="w-4 h-4" />
              Anúncios
            </button>
            <button onClick={() => setSection('settings')} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg w-full transition ${section === 'settings' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text hover:bg-bg'}`}>
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </nav>
          <div className="mt-auto space-y-2 pt-4 border-t border-border">
            {user && (
              <div className="flex items-center gap-2 px-3 py-2">
                <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <span className="text-sm text-text truncate">{user.name}</span>
              </div>
            )}
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-primary transition">
              <Eye className="w-4 h-4" />
              Ver Blog
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-red-500 transition w-full">
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {section === 'categories' && <CategoriesSection />}
          {section === 'authors' && <AuthorsSection />}
          {section === 'ads' && <AdsSection />}
          {section === 'settings' && <SettingsSection />}
          {section === 'posts' && (<>
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center justify-between">
              {error}
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Total de Artigos</p>
              <p className="mt-1 text-2xl font-bold text-text">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Publicados</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Rascunhos</p>
              <p className="mt-1 text-2xl font-bold text-amber-500">{stats.drafts}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Visualizações</p>
              <p className="mt-1 text-2xl font-bold text-primary">{(stats.views / 1000).toFixed(1)}k</p>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-text">Artigos</h1>
            <button
              onClick={handleNewPost}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
            >
              <Plus className="w-4 h-4" />
              Novo Artigo
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar artigos..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="appearance-none pl-3 pr-9 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Rascunhos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Posts Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Artigo</th>
                      <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Categoria</th>
                      <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Status</th>
                      <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Data</th>
                      <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPosts.map(post => (
                      <tr key={post.id} className="hover:bg-bg/50 transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.featured_image || `https://picsum.photos/seed/${post.id}/80/60`}
                              alt=""
                              className="w-14 h-10 rounded-lg object-cover shrink-0 hidden sm:block"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-text truncate max-w-xs">{post.title}</p>
                              <p className="text-xs text-text-muted truncate max-w-xs">{post.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span
                            className="text-xs font-bold uppercase px-2.5 py-1 rounded"
                            style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                          >
                            {post.category.name}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <button
                            onClick={() => togglePublish(post)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              post.status === 'published'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </button>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <span className="text-sm text-text-muted">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/artigo/${post.slug}`}
                              className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition"
                              title="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPosts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-text-muted">
                          Nenhum artigo encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </>)}
        </main>
      </div>
    </div>
  );
}
