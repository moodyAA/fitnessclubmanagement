import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../context/DataContext'
import type { Hall } from '../types'

const emptyHall: Omit<Hall, 'id'> = {
  name: '',
  purpose: '',
  capacity: 0,
}

export function HallsPage() {
  const { halls, addHall, updateHall, deleteHall } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Hall | null>(null)
  const [form, setForm] = useState(emptyHall)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyHall)
    setModalOpen(true)
  }

  const openEdit = (hall: Hall) => {
    setEditing(hall)
    setForm({ name: hall.name, purpose: hall.purpose, capacity: hall.capacity })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateHall(editing.id, form)
    else addHall(form)
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Залы"
        description="Справочник помещений фитнес-клуба"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Добавить зал
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Назначение</th>
                <th>Вместимость</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {halls.map((hall) => (
                <tr key={hall.id}>
                  <td>{hall.name}</td>
                  <td>{hall.purpose}</td>
                  <td>{hall.capacity}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(hall)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteHall(hall.id)}
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
        title={editing ? 'Редактировать зал' : 'Новый зал'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="hall-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="hall-form" className="form-grid form-grid--single" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Название зала</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Назначение</label>
            <input
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Вместимость</label>
            <input
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
