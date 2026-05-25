import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../context/DataContext'
import type { LessonType } from '../types'

const emptyLessonType: Omit<LessonType, 'id'> = {
  name: '',
  description: '',
  level: 'Любой',
  duration_min: 60,
}

export function LessonTypesPage() {
  const { lessonTypes, addLessonType, updateLessonType, deleteLessonType } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<LessonType | null>(null)
  const [form, setForm] = useState(emptyLessonType)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyLessonType)
    setModalOpen(true)
  }

  const openEdit = (item: LessonType) => {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description,
      level: item.level,
      duration_min: item.duration_min,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateLessonType(editing.id, form)
    else addLessonType(form)
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Типы занятий"
        description="Справочник направлений тренировок"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Добавить тип
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Уровень</th>
                <th>Длительность</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lessonTypes.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.level}</td>
                  <td>{item.duration_min} мин</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(item)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteLessonType(item.id)}
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
        title={editing ? 'Редактировать тип' : 'Новый тип занятия'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="lesson-type-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="lesson-type-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field form-field--full">
            <label>Название типа</label>
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
            <label>Уровень подготовки</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option>Любой</option>
              <option>Начальный</option>
              <option>Средний</option>
              <option>Продвинутый</option>
            </select>
          </div>
          <div className="form-field">
            <label>Длительность (мин)</label>
            <input
              type="number"
              min={15}
              required
              value={form.duration_min}
              onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
