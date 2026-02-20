import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Lock, Plus, Edit3, Trash2, X, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API = '/api';

interface AdminUser {
  id: number;
  username: string;
  name: string;
  avatar: string;
  role: 'admin' | 'collaborator';
  created_at: string;
}

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

const EMPTY_FORM = { username: '', name: '', password: '', role: 'collaborator' as 'admin' | 'collaborator' };

export default function SettingsSection() {
  const { user } = useAuth();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Users management state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data: Partial<AdminUser> & { password?: string } } | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const data = await apiFetch<AdminUser[]>('/users.php');
      setUsers(data);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    if (!currentPassword || !newPassword) { setPwMessage({ type: 'error', text: 'Preencha todos os campos' }); return; }
    if (newPassword !== confirmPassword) { setPwMessage({ type: 'error', text: 'As senhas não coincidem' }); return; }
    if (newPassword.length < 6) { setPwMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' }); return; }

    setSaving(true);
    try {
      const res = await fetch(`${API}/auth.php?action=change_password`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha');
      setPwMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPwMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao alterar senha' });
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setModal({ mode: 'create', data: { ...EMPTY_FORM } });
    setModalError('');
  };

  const openEdit = (u: AdminUser) => {
    setModal({ mode: 'edit', data: { ...u, password: '' } });
    setModalError('');
  };

  const handleModalSave = async () => {
    if (!modal) return;
    const { mode, data } = modal;
    setModalError('');

    if (!data.name || !data.username) { setModalError('Nome e usuário são obrigatórios'); return; }
    if (mode === 'create' && (!data.password || data.password.length < 6)) {
      setModalError('A senha deve ter pelo menos 6 caracteres'); return;
    }

    setModalSaving(true);
    try {
      if (mode === 'create') {
        await apiFetch('/users.php', { method: 'POST', body: JSON.stringify(data) });
      } else {
        const payload: Record<string, string> = { name: data.name!, username: data.username!, role: data.role! };
        if (data.password) payload.password = data.password;
        await apiFetch(`/users.php?id=${data.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      setModal(null);
      await loadUsers();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Excluir o usuário "${u.name}"?`)) return;
    try {
      await apiFetch(`/users.php?id=${u.id}`, { method: 'DELETE' });
      await loadUsers();
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  };

  const RoleBadge = ({ role }: { role: 'admin' | 'collaborator' }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
      role === 'admin'
        ? 'bg-primary/10 text-primary'
        : 'bg-bg text-text-muted border border-border'
    }`}>
      {role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
      {role === 'admin' ? 'Administrador' : 'Colaborador'}
    </span>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Configurações</h1>

      <div className="grid gap-6 max-w-2xl">
        {/* Informações da conta */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-bold text-text mb-4">Minha Conta</h2>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <img src={user.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-text">{user.name}</p>
                  <p className="text-sm text-text-muted">@{user.username}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Alterar senha */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-text-muted" />
            Alterar Senha
          </h2>
          {pwMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              pwMessage.type === 'success'
                ? 'bg-green-50 border border-green-100 text-green-700'
                : 'bg-red-50 border border-red-100 text-red-600'
            }`}>{pwMessage.text}</div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Senha atual</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Nova senha</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Confirmar nova senha</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving}
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Senha
              </button>
            </div>
          </form>
        </div>

        {/* Gerenciar Usuários */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text">Usuários do Sistema</h2>
            <button onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition">
              <Plus className="w-3.5 h-3.5" />
              Novo Usuário
            </button>
          </div>

          {usersError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center justify-between">
              {usersError}
              <button onClick={() => setUsersError('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          {usersLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
          ) : (
            <div className="divide-y divide-border">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://i.pravatar.cc/150?u=${u.username}`}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-text">{u.name}</p>
                      <p className="text-xs text-text-muted">@{u.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleBadge role={u.role} />
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)}
                        className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-primary/5 transition">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {u.id !== user?.id && (
                        <button onClick={() => handleDelete(u)}
                          className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info do sistema */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-bold text-text mb-4">Sobre o Sistema</h2>
          <div className="space-y-2 text-sm text-text-muted">
            <div className="flex justify-between"><span>Frontend</span><span className="text-text">React + TypeScript + Tailwind</span></div>
            <div className="flex justify-between"><span>Backend</span><span className="text-text">PHP + SQLite</span></div>
            <div className="flex justify-between"><span>Versão</span><span className="text-text">1.0.0</span></div>
          </div>
        </div>
      </div>

      {/* Modal criar/editar usuário */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text mb-4">
              {modal.mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
            </h2>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{modalError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Nome completo</label>
                <input type="text" value={modal.data.name || ''} autoFocus
                  onChange={e => setModal(m => m ? { ...m, data: { ...m.data, name: e.target.value } } : null)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Nome de usuário</label>
                <input type="text" value={modal.data.username || ''}
                  onChange={e => setModal(m => m ? { ...m, data: { ...m.data, username: e.target.value } } : null)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  {modal.mode === 'create' ? 'Senha' : 'Nova senha (deixe em branco para não alterar)'}
                </label>
                <input type="password" value={modal.data.password || ''}
                  onChange={e => setModal(m => m ? { ...m, data: { ...m.data, password: e.target.value } } : null)}
                  placeholder={modal.mode === 'edit' ? '••••••' : ''}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Função</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button"
                    onClick={() => setModal(m => m ? { ...m, data: { ...m.data, role: 'admin' } } : null)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                      modal.data.role === 'admin'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-text-muted hover:border-primary/40'
                    }`}>
                    <Shield className="w-5 h-5" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Administrador</p>
                      <p className="text-xs opacity-70 mt-0.5">Acesso total</p>
                    </div>
                  </button>
                  <button type="button"
                    onClick={() => setModal(m => m ? { ...m, data: { ...m.data, role: 'collaborator' } } : null)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                      modal.data.role === 'collaborator'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-text-muted hover:border-primary/40'
                    }`}>
                    <UserCheck className="w-5 h-5" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Colaborador</p>
                      <p className="text-xs opacity-70 mt-0.5">Cria e edita posts</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-muted hover:text-text transition">
                Cancelar
              </button>
              <button onClick={handleModalSave} disabled={modalSaving}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50">
                {modalSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
