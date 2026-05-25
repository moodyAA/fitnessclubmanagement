import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../context/DataContext'
import type { Trainer } from '../types'

const emptyTrainer: Omit<Trainer, 'id'> = {
  full_name: '',
  specialization: '',
  phone: '',
  email: '',
  experience_years: 0,
  category: 'Первая',
}

export function TrainersPage() {
  const { trainers, addTrainer, updateTrainer, deleteTrainer } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Trainer | null>(null)
  const [form, setForm] = useState(emptyTrainer)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyTrainer)
    setModalOpen(true)
  }

  const openEdit = (trainer: Trainer) => {
    setEditing(trainer)
    setForm({
      full_name: trainer.full_name,
      specialization: trainer.specialization,
      phone: trainer.phone,
      email: trainer.email,
      experience_years: trainer.experience_years,
      category: trainer.category,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateTrainer(editing.id, form)
    else addTrainer(form)
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Тренеры"
        description="Справочник сотрудников фитнес-клуба"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Добавить тренера
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Специализация</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Стаж</th>
                <th>Категория</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr key={trainer.id}>
                  <td>{trainer.full_name}</td>
                  <td>{trainer.specialization}</td>
                  <td>{trainer.phone}</td>
                  <td>{trainer.email}</td>
                  <td>{trainer.experience_years} лет</td>
                  <td>{trainer.category}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(trainer)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteTrainer(trainer.id)}
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
        title={editing ? 'Редактировать тренера' : 'Новый тренер'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="trainer-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="trainer-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field form-field--full">
            <label>ФИО</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Специализация</label>
            <input
              required
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Категория</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Высшая</option>
              <option>Первая</option>
              <option>Вторая</option>
            </select>
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
            <label>Стаж (лет)</label>
            <input
              type="number"
              min={0}
              required
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
