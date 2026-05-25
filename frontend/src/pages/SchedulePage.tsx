import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData, useLookups } from '../context/DataContext'
import type { ScheduleItem } from '../types'
import { formatDate } from '../data/mockData'

const emptySchedule: Omit<ScheduleItem, 'id'> = {
  trainer_id: 0,
  hall_id: 0,
  lesson_type_id: 0,
  date: new Date().toISOString().slice(0, 10),
  start_time: '10:00',
  end_time: '11:00',
}

export function SchedulePage() {
  const {
    schedule,
    trainers,
    halls,
    lessonTypes,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
  } = useData()
  const { getTrainerName, getHallName, getLessonTypeName } = useLookups()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [form, setForm] = useState(emptySchedule)

  const openCreate = () => {
    setEditing(null)
    setForm({
      ...emptySchedule,
      trainer_id: trainers[0]?.id ?? 0,
      hall_id: halls[0]?.id ?? 0,
      lesson_type_id: lessonTypes[0]?.id ?? 0,
    })
    setModalOpen(true)
  }

  const openEdit = (item: ScheduleItem) => {
    setEditing(item)
    setForm({
      trainer_id: item.trainer_id,
      hall_id: item.hall_id,
      lesson_type_id: item.lesson_type_id,
      date: item.date,
      start_time: item.start_time,
      end_time: item.end_time,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateScheduleItem(editing.id, form)
    else addScheduleItem(form)
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Расписание занятий"
        description="Планирование тренировок по залам и тренерам"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Добавить занятие
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Тип занятия</th>
                <th>Тренер</th>
                <th>Зал</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td>
                  <td>
                    {item.start_time} – {item.end_time}
                  </td>
                  <td>{getLessonTypeName(item.lesson_type_id)}</td>
                  <td>{getTrainerName(item.trainer_id)}</td>
                  <td>{getHallName(item.hall_id)}</td>
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
                        onClick={() => deleteScheduleItem(item.id)}
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
        title={editing ? 'Редактировать занятие' : 'Новое занятие'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="schedule-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="schedule-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Дата</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Тип занятия</label>
            <select
              required
              value={form.lesson_type_id}
              onChange={(e) => setForm({ ...form, lesson_type_id: Number(e.target.value) })}
            >
              {lessonTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Тренер</label>
            <select
              required
              value={form.trainer_id}
              onChange={(e) => setForm({ ...form, trainer_id: Number(e.target.value) })}
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Зал</label>
            <select
              required
              value={form.hall_id}
              onChange={(e) => setForm({ ...form, hall_id: Number(e.target.value) })}
            >
              {halls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Начало</label>
            <input
              type="time"
              required
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Окончание</label>
            <input
              type="time"
              required
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
