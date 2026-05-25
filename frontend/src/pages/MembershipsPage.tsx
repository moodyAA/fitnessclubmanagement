import { useMemo, useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData, useLookups } from '../context/DataContext'
import type { Membership } from '../types'
import { formatDate, formatMoney } from '../data/mockData'

const emptyMembership: Omit<Membership, 'id'> = {
  name: '',
  description: '',
  duration_days: 30,
  base_price: 0,
  sessions_count: 0,
  status: 'Активен',
}

export function MembershipsPage() {
  const { memberships, contracts, addMembership, updateMembership, deleteMembership } = useData()
  const { getClientName } = useLookups()

  const [selectedId, setSelectedId] = useState<number | null>(memberships[0]?.id ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Membership | null>(null)
  const [form, setForm] = useState(emptyMembership)

  const selected = memberships.find((m) => m.id === selectedId) ?? null
  const relatedContracts = useMemo(
    () => contracts.filter((c) => c.membership_id === selectedId),
    [contracts, selectedId],
  )

  const openCreate = () => {
    setEditing(null)
    setForm(emptyMembership)
    setModalOpen(true)
  }

  const openEdit = (membership: Membership) => {
    setEditing(membership)
    setForm({
      name: membership.name,
      description: membership.description,
      duration_days: membership.duration_days,
      base_price: membership.base_price,
      sessions_count: membership.sessions_count,
      status: membership.status,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateMembership(editing.id, form)
    } else {
      addMembership(form)
    }
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Абонементы"
        description="Форма «Абонемент» с договорами по выбранному тарифу"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Добавить абонемент
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Вид</th>
                <th>Срок (дней)</th>
                <th>Занятий</th>
                <th>Базовая стоимость</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr
                  key={membership.id}
                  style={{
                    background: membership.id === selectedId ? '#eff6ff' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedId(membership.id)}
                >
                  <td>{membership.name}</td>
                  <td>{membership.duration_days}</td>
                  <td>{membership.sessions_count}</td>
                  <td>{formatMoney(membership.base_price)}</td>
                  <td>
                    <span className="badge badge--success">{membership.status}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(membership)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteMembership(membership.id)}
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

      {selected && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card__header">{selected.name} — договоры</div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Описание</label>
              <span>{selected.description}</span>
            </div>
            <div className="detail-item">
              <label>Базовая стоимость</label>
              <span>{formatMoney(selected.base_price)}</span>
            </div>
          </div>
          <div className="card__body">
            <table>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Скидка</th>
                  <th>Итого</th>
                  <th>Срок действия</th>
                </tr>
              </thead>
              <tbody>
                {relatedContracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      Договоров по этому абонементу нет
                    </td>
                  </tr>
                ) : (
                  relatedContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.number}</td>
                      <td>{formatDate(contract.date)}</td>
                      <td>{getClientName(contract.client_id)}</td>
                      <td>{contract.discount}%</td>
                      <td>{formatMoney(contract.total_price)}</td>
                      <td>{formatDate(contract.expiry_date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        title={editing ? 'Редактировать абонемент' : 'Новый абонемент'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="membership-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="membership-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field form-field--full">
            <label>Вид абонемента</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-field form-field--full">
            <label>Описание</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Срок (дней)</label>
            <input
              type="number"
              min={1}
              required
              value={form.duration_days}
              onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Количество занятий</label>
            <input
              type="number"
              min={1}
              required
              value={form.sessions_count}
              onChange={(e) => setForm({ ...form, sessions_count: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Базовая стоимость</label>
            <input
              type="number"
              min={0}
              required
              value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Статус</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Активен</option>
              <option>Архив</option>
            </select>
          </div>
        </form>
      </Modal>
    </>
  )
}
