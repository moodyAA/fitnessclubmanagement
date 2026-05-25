import { useMemo, useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../context/DataContext'
import type { Client } from '../types'
import { formatDate } from '../data/mockData'

const emptyClient: Omit<Client, 'id'> = {
  full_name: '',
  passport_data: '',
  phone: '',
  email: '',
  birth_date: '',
  address: '',
}

export function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useData()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState(emptyClient)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return clients.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q),
    )
  }, [clients, search])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyClient)
    setModalOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditing(client)
    setForm({
      full_name: client.full_name,
      passport_data: client.passport_data,
      phone: client.phone,
      email: client.email,
      birth_date: client.birth_date,
      address: client.address,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateClient(editing.id, form)
    } else {
      addClient(form)
    }
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Форма «Клиент» — регистрация и редактирование данных"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Добавить клиента
          </button>
        }
      />

      <div className="card">
        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Поиск по ФИО, телефону, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {filtered.length} из {clients.length}
          </span>
        </div>
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата рождения</th>
                <th>Адрес</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td>{client.full_name}</td>
                  <td>{client.phone}</td>
                  <td>{client.email}</td>
                  <td>{formatDate(client.birth_date)}</td>
                  <td>{client.address}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(client)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteClient(client.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={editing ? 'Редактировать клиента' : 'Новый клиент'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="client-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="client-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field form-field--full">
            <label>ФИО</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Паспортные данные</label>
            <input
              required
              value={form.passport_data}
              onChange={(e) => setForm({ ...form, passport_data: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Телефон</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Дата рождения</label>
            <input
              type="date"
              required
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
          </div>
          <div className="form-field form-field--full">
            <label>Адрес</label>
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
