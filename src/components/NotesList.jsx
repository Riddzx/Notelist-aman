import React, { useState, useEffect } from 'react'
import { supabase } from '../SupaBaseClient'
import CryptoJS from 'crypto-js'
import './NotesList.css'

export default function NotesList({ user, onLogout }) {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Personal')
  const [useEncryption, setUseEncryption] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showDecryptModal, setShowDecryptModal] = useState(false)
  const [decryptKey, setDecryptKey] = useState('')
  const [pendingNote, setPendingNote] = useState(null)
  const [decryptError, setDecryptError] = useState('')

  // Load notes saat component mount
  useEffect(() => {
    fetchNotes()
  }, [user])

  // Fetch semua catatan user
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
      showMessage('❌ Gagal memuat catatan', 'error')
    }
  }

  // Enkripsi teks
  const encryptText = (text, key) => {
    if (!key) {
      showMessage('⚠️ Kunci enkripsi tidak boleh kosong', 'error')
      return null
    }
    return CryptoJS.AES.encrypt(text, key).toString()
  }

  // Dekripsi teks
  const decryptText = (encryptedText, key) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, key)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      
      // Validasi apakah dekripsi berhasil dengan memeriksa hasil
      if (!decrypted || decrypted.trim() === '') {
        return null
      }
      return decrypted
    } catch (error) {
      return null
    }
  }

  // Tampilkan pesan
  const showMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  // Simpan catatan baru atau update
  const handleSaveNote = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validasi input
      if (!title.trim()) {
        showMessage('⚠️ Judul tidak boleh kosong', 'error')
        setLoading(false)
        return
      }

      if (!content.trim()) {
        showMessage('⚠️ Isi catatan tidak boleh kosong', 'error')
        setLoading(false)
        return
      }

      const noteData = {
        title: title.trim(),
        content: useEncryption ? encryptText(content, encryptionKey) : content.trim(),
        category,
        is_encrypted: useEncryption,
      }

      if (!useEncryption || noteData.content) {
        if (editingId) {
          // Update catatan
          const { error } = await supabase
            .from('notes')
            .update(noteData)
            .eq('id', editingId)
            .eq('user_id', user.id)

          if (error) throw error

          // Log activity
          await supabase.from('audit_logs').insert([
            {
              user_id: user.id,
              action: 'UPDATE_NOTE',
              details: `Update catatan: "${title}"`,
            },
          ])

          showMessage('✅ Catatan berhasil diperbarui', 'success')
          setEditingId(null)
        } else {
          // Insert catatan baru
          const { error } = await supabase
            .from('notes')
            .insert([
              {
                ...noteData,
                user_id: user.id,
              },
            ])

          if (error) throw error

          // Log activity
          await supabase.from('audit_logs').insert([
            {
              user_id: user.id,
              action: 'CREATE_NOTE',
              details: `Buat catatan baru: "${title}"`,
            },
          ])

          showMessage('✅ Catatan berhasil disimpan', 'success')
        }

        // Reset form
        setTitle('')
        setContent('')
        setCategory('Personal')
        setUseEncryption(false)
        setEncryptionKey('')

        // Refresh notes
        fetchNotes()
      }
    } catch (error) {
      console.error('Error saving note:', error)
      showMessage(`❌ Gagal menyimpan: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Hapus catatan
  const handleDeleteNote = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus catatan "${title}"?`)) return

    try {
      setLoading(true)
      
      // Hapus dari database
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Log activity
      await supabase.from('audit_logs').insert([
        {
          user_id: user.id,
          action: 'DELETE_NOTE',
          details: `Hapus catatan: "${title}"`,
        },
      ])

      showMessage('✅ Catatan berhasil dihapus', 'success')
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
      showMessage(`❌ Gagal menghapus: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Buka modal dekripsi untuk catatan terenkripsi
  const handleEditEncryptedNote = (note) => {
    setPendingNote(note)
    setShowDecryptModal(true)
    setDecryptKey('')
    setDecryptError('')
  }

  // Submit dekripsi dari modal
  const handleDecryptSubmit = (e) => {
    e.preventDefault()
    setDecryptError('')
    
    if (!decryptKey.trim()) {
      setDecryptError('⚠️ Kunci dekripsi tidak boleh kosong')
      return
    }

    const decryptedContent = decryptText(pendingNote.content, decryptKey)
    
    if (decryptedContent === null) {
      setDecryptError('❌ Kunci dekripsi salah. Silakan coba lagi.')
      setDecryptKey('')
      return
    }

    // Edit note dengan content yang sudah di-decrypt
    setEditingId(pendingNote.id)
    setTitle(pendingNote.title)
    setContent(decryptedContent)
    setCategory(pendingNote.category)
    setUseEncryption(pendingNote.is_encrypted)
    setEncryptionKey(decryptKey)
    setShowDecryptModal(false)
    setPendingNote(null)
    setDecryptKey('')
    setDecryptError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Tutup modal dekripsi
  const handleCloseDecryptModal = () => {
    setShowDecryptModal(false)
    setPendingNote(null)
    setDecryptKey('')
    setDecryptError('')
  }

  // Edit catatan biasa (tidak terenkripsi)
  const handleEditNote = (note) => {
    if (note.is_encrypted) {
      handleEditEncryptedNote(note)
      return
    }

    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setCategory(note.category)
    setUseEncryption(note.is_encrypted)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setCategory('Personal')
    setUseEncryption(false)
    setEncryptionKey('')
  }

  // Filter notes berdasarkan search
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.is_encrypted ? 'terenkripsi' : note.content).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="notes-container">
      {/* Header */}
      <div className="notes-header">
        <div className="header-content">
          <h1>📝 Catatan Aman Cloud</h1>
          <p>Kelola catatan pribadi Anda dengan aman</p>
        </div>
        <div className="header-user">
          <span className="user-email">👤 {user.email}</span>
          <button onClick={onLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Form Input Catatan */}
      <div className="form-section">
        <h2>{editingId ? '✏️ Edit Catatan' : '📝 Buat Catatan Baru'}</h2>
        <form onSubmit={handleSaveNote} className="notes-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Judul catatan..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="form-input"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="form-select"
            >
              <option value="Personal">Personal</option>
              <option value="Pekerjaan">Pekerjaan</option>
              <option value="Ide">Ide</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <textarea
            placeholder="Tulis isi catatan di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className="form-textarea"
            rows="5"
          />

          <div className="encryption-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useEncryption}
                onChange={(e) => setUseEncryption(e.target.checked)}
                disabled={loading}
              />
              🔒 <strong>Enkripsi catatan ini</strong>
            </label>

            {useEncryption && (
              <div className="encryption-key-section">
                <input
                  type="password"
                  placeholder="Masukkan kunci enkripsi (minimal 6 karakter)"
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  disabled={loading}
                  className="form-input encryption-key"
                  minLength="6"
                  autoComplete="off"
                />
                <small className="encryption-hint">💡 Simpan kunci ini dengan aman. Tanpa kunci, Anda tidak bisa membaca catatan ini lagi.</small>
              </div>
            )}
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="form-buttons">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '⏳ Menyimpan...' : editingId ? '💾 Update' : '✅ Simpan'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="btn btn-secondary"
              >
                ❌ Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Filter */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Cari catatan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="notes-count">Total: <strong>{filteredNotes.length}</strong> catatan</p>
      </div>

      {/* Daftar Catatan */}
      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <div className="no-notes">
            <p>📭 Belum ada catatan. Buat catatan baru untuk memulai!</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`note-card ${note.is_encrypted ? 'encrypted' : ''}`}
            >
              <div className="note-header">
                <div className="note-title-section">
                  <h3>{note.title}</h3>
                  <span className="note-category">{note.category}</span>
                  {note.is_encrypted && <span className="note-locked">🔒 Terenkripsi</span>}
                </div>
              </div>

              <div className="note-content">
                {note.is_encrypted ? (
                  <p className="encrypted-text">
                    🔐 [Catatan terenkripsi - buka untuk melihat]
                  </p>
                ) : (
                  <p>{note.content}</p>
                )}
              </div>

              <div className="note-footer">
                <small>
                  📅 {new Date(note.created_at).toLocaleString('id-ID')}
                </small>
                <div className="note-actions">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="btn-action btn-edit"
                    disabled={loading}
                    title="Edit catatan"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id, note.title)}
                    className="btn-action btn-delete"
                    disabled={loading}
                    title="Hapus catatan"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dekripsi */}
      {showDecryptModal && (
        <div className="modal-overlay" onClick={handleCloseDecryptModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔓 Buka Catatan Terenkripsi</h2>
              <button 
                className="modal-close" 
                onClick={handleCloseDecryptModal}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-info">
                Catatan ini terenkripsi. Masukkan kunci enkripsi untuk membukanya.
              </p>
              
              <form onSubmit={handleDecryptSubmit} className="decrypt-form">
                <input
                  type="password"
                  placeholder="Masukkan kunci enkripsi..."
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  className="modal-input"
                  autoFocus
                />
                
                {decryptError && (
                  <div className="decrypt-error">
                    {decryptError}
                  </div>
                )}
                
                <div className="modal-buttons">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    🔓 Buka
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseDecryptModal}
                    className="btn btn-secondary"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}