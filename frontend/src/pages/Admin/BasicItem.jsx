import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import {
  getBasicItemsByType,
  createBasicItem,
  updateBasicItem,
  deleteBasicItem,
} from '../../services/AdminService'

// ── Helpers ───────────────────────────────────────────────────────────────────

// Maps URL param → display label
const LABEL_MAP = {
  category:       'Category',
  skills:         'Skill',
  classification: 'Classification',
  level:          'Level',
  avatar:         'Avatar',
}

// Maps URL param → backend 'type' field value
const API_TYPE_MAP = {
  category:       'category',
  skills:         'skill',
  classification: 'classification',
  level:          'level',
  avatar:         'avtar',
}

const toLabel   = (param) => LABEL_MAP[param]   ?? (param.charAt(0).toUpperCase() + param.slice(1))
const toApiType = (param) => API_TYPE_MAP[param] ?? param

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle = {
  border: '1.5px solid #e5e7eb',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#374151',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: '#374151',
  marginBottom: 5,
  display: 'block',
}

// ── Image upload / preview box ─────────────────────────────────────────────────

const ImageBox = ({ value, onChange }) => {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max file size is 5 MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: 145,
          height: 130,
          border: value ? '2px solid #e5e7eb' : '2px dashed #c4c4d0',
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          background: '#fafafa',
        }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* overlay upload icon */}
            <div style={{
              position: 'absolute', bottom: 4, right: 4,
              background: '#4338ca', borderRadius: '50%',
              width: 26, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
            </div>
          </>
        ) : (
          <>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="#9ca3af">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
            <span style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Upload File</span>
          </>
        )}
      </div>
      <span style={{ fontSize: 12, color: '#9ca3af' }}>Max Size : 5MB</span>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      {/* also allow pasting a URL */}
      <input
        type="text"
        placeholder="…or paste image URL"
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, fontSize: 12, padding: '6px 10px', marginTop: 4 }}
      />
    </div>
  )
}

// ── Edit modal ─────────────────────────────────────────────────────────────────

const EditModal = ({ label, item, onClose, onSaved, basicItem }) => {
  const [name, setName] = useState(item.name ?? '')
  const [img, setImg]   = useState(item.img ?? '')
  const [saving, setSaving] = useState(false)
  const [err, setErr]   = useState(null)

  const handleUpdate = async () => {
    if (!name.trim()) { setErr('Name is required'); return }
    setSaving(true); setErr(null)
    try {
      const updated = await updateBasicItem(basicItem, item._id, { name: name.trim(), img })
      onSaved(updated.item ?? updated)
    } catch (e) {
      setErr(e?.response?.data?.message ?? 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '32px 36px',
        width: 600, maxWidth: '95vw', position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Edit {label}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', fontSize: 22,
              cursor: 'pointer', color: '#374151', lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Name<span style={{ color: 'red' }}>*</span></label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name Here..."
            />
          </div>

          {/* Image */}
          <div>
            <label style={labelStyle}>Image<span style={{ color: 'red' }}>*</span></label>
            <ImageBox value={img} onChange={setImg} />
          </div>
        </div>

        {err && <div style={{ color: 'red', fontSize: 13, marginTop: 12 }}>{err}</div>}

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
          <button
            onClick={handleUpdate}
            disabled={saving}
            style={{
              background: '#4338ca', color: '#fff', border: 'none',
              borderRadius: 24, padding: '10px 28px', fontSize: 15,
              fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >{saving ? 'Updating…' : 'Update'}</button>
          <button
            onClick={onClose}
            style={{
              background: '#111', color: '#fff', border: 'none',
              borderRadius: 24, padding: '10px 28px', fontSize: 15,
              fontWeight: 600, cursor: 'pointer',
            }}
          >Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const BasicItem = () => {
  const { basicItem }    = useParams()
  const apiType          = toApiType(basicItem)
  const label            = toLabel(basicItem)

  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [fetchErr, setFetchErr] = useState(null)

  // Add form
  const [addName, setAddName]   = useState('')
  const [addImg, setAddImg]     = useState('')
  const [addErr, setAddErr]     = useState(null)
  const [saving, setSaving]     = useState(false)

  // Edit modal
  const [editItem, setEditItem] = useState(null)

  // Search & pagination
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [perPage, setPerPage]   = useState(10)

  // ── Fetch items ────────────────────────────────────────────────────────────
  const fetchItems = () => {
    setLoading(true); setFetchErr(null)
    getBasicItemsByType(apiType)
      .then(data => setItems(Array.isArray(data) ? data : data.items ?? []))
      .catch(() => setFetchErr('Failed to load items.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItems()
    setPage(1)
    setSearch('')
    setAddName(''); setAddImg(''); setAddErr(null)
  }, [basicItem])

  // ── Add ────────────────────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!addName.trim()) { setAddErr('Name is required.'); return }
    setSaving(true); setAddErr(null)
    try {
      await createBasicItem(apiType, { name: addName.trim(), img: addImg })
      setAddName(''); setAddImg('')
      await fetchItems()   // re-fetch from backend so the list is always in sync
    } catch (err) {
      setAddErr(err?.response?.data?.message ?? 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await deleteBasicItem(apiType, id)
      setItems(prev => prev.filter(i => i._id !== id))
    } catch {
      alert('Failed to delete item.')
    }
  }

  // ── Edit saved ─────────────────────────────────────────────────────────────
  const handleEditSaved = async (updated) => {
    setItems(prev => prev.map(i => (i._id === updated._id ? updated : i)))
    await fetchItems()   // re-fetch from backend so the list is always in sync
    setEditItem(null)
  }

  // ── Filter + paginate ──────────────────────────────────────────────────────
  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title={label}>
      {/* Breadcrumb */}
      <div style={{
        background: '#f3f4f6', borderRadius: 8, padding: '10px 18px',
        marginBottom: 24, fontSize: 14, color: '#6b7280',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>
          <Link to="/admin/dashboard" style={{ color: '#4338ca', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
          {' / '}{label}
        </span>
        {/* Sort icon placeholder */}
        <button style={{
          background: '#4338ca', border: 'none', borderRadius: 8,
          width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
          </svg>
        </button>
      </div>

      {/* ── Add form ──────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '28px 28px 22px', marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>Add {label}</h3>

        <form onSubmit={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Name<span style={{ color: 'red' }}>*</span></label>
              <input
                style={inputStyle}
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Name Here..."
              />
            </div>

            {/* Image */}
            <div>
              <label style={labelStyle}>Image<span style={{ color: 'red' }}>*</span></label>
              <ImageBox value={addImg} onChange={setAddImg} />
            </div>
          </div>

          {addErr && <div style={{ color: 'red', fontSize: 13, marginTop: 10 }}>{addErr}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#4338ca', color: '#fff', border: 'none',
                borderRadius: 24, padding: '10px 32px',
                fontSize: 15, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '22px 22px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#f3f4f6', borderRadius: 8,
          padding: '10px 16px', marginBottom: 18,
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="#9ca3af">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 15, flex: 1, color: '#374151' }}
            placeholder="Search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading…</div>
        ) : fetchErr ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'red' }}>{fetchErr}</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  {['#', 'Image', 'Name', 'Status', 'Action'].map((col, i) => (
                    <th key={col} style={{
                      padding: '12px 14px', fontSize: 13, fontWeight: 700,
                      color: '#374151', textAlign: i === 0 ? 'center' : i >= 3 ? 'center' : 'left',
                    }}>
                      {col}
                      {col === 'Name' && (
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="#9ca3af" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                          <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
                        </svg>
                      )}
                      {col === '#' && (
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="#9ca3af" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                          <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
                        </svg>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>No items found.</td>
                  </tr>
                ) : paginated.map((item, idx) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 1 ? '#f9fafb' : '#fff' }}>
                    {/* # */}
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: 14, color: '#374151', width: 60 }}>
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    {/* Image */}
                    <td style={{ padding: '12px 14px', width: 80 }}>
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      ) : (
                        <div style={{
                          width: 48, height: 48, borderRadius: 8,
                          background: '#e5e7eb', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width={22} height={22} viewBox="0 0 24 24" fill="#9ca3af">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    {/* Name */}
                    <td style={{ padding: '12px 14px', fontSize: 14, color: '#374151' }}>{item.name}</td>
                    {/* Status */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        background: '#16a34a', color: '#fff', borderRadius: 6,
                        padding: '4px 16px', fontSize: 13, fontWeight: 600,
                      }}>Show</span>
                    </td>
                    {/* Action */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        {/* Edit */}
                        <button
                          onClick={() => setEditItem(item)}
                          style={{
                            background: '#4338ca', border: 'none', borderRadius: 6,
                            width: 36, height: 36, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer',
                          }}
                        >
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            background: '#4338ca', border: 'none', borderRadius: 6,
                            width: 36, height: 36, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer',
                          }}
                        >
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer — entries info + pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                &nbsp;
                <button
                  style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 10px', fontWeight: 700, fontSize: 13, cursor: 'default', color: '#374151' }}
                >Show</button>
                &nbsp;
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
                  style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 8px', fontSize: 13, color: '#374151', background: '#fff' }}
                >
                  {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                &nbsp;<span style={{ fontWeight: 700 }}>entries</span>
              </div>

              {/* Page buttons */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 32, height: 32, border: '1px solid #e5e7eb',
                    borderRadius: 6, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: page === 1 ? 0.4 : 1,
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="#374151"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 32, height: 32, border: 'none',
                      borderRadius: 6,
                      background: n === page ? '#4338ca' : '#f3f4f6',
                      color: n === page ? '#fff' : '#374151',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    }}
                  >{n}</button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    width: 32, height: 32, border: '1px solid #e5e7eb',
                    borderRadius: 6, background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: page === totalPages ? 0.4 : 1,
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="#374151"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Edit modal ────────────────────────────────────────────────────── */}
      {editItem && (
        <EditModal
          label={label}
          item={editItem}
          basicItem={apiType}
          onClose={() => setEditItem(null)}
          onSaved={handleEditSaved}
        />
      )}
    </AdminLayout>
  )
}

export default BasicItem
