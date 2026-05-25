import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData, useLookups } from '../context/DataContext'
import type { Visit } from '../types'
import { formatDate } from '../data/mockData'

const emptyVisit: Omit<Visit, 'id'> = {
  client_id: 0,
  schedule_id: 0,
  visit_date: new Date().toISOString().slice(0, 10),
}

export function VisitsPage() {
  const { visits, clients, schedule, addVisit, deleteVisit } = useData()
  const { getClientName, getLessonTypeName } = useLookups()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyVisit)

  const scheduleLabel = (scheduleId: number) => {
    const item = schedule.find((s) => s.id === scheduleId)
    if (!item) return '—'
    return `${formatDate(item.date)} ${item.start_time} — ${getLessonTypeName(item.lesson_type_id)}`
  }

  const openCreate = () => {
    setForm({
      ...emptyVisit,
      client_id: clients[0]?.id ?? 0,
      schedule_id: schedule[0]?.id ?? 0,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addVisit(form)
    setModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Посещения"
        description="Учёт фактической посещаемости клиентов"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Отметить посещение
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Занятие</th>
                <th>Дата посещения</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>{getClientName(visit.client_id)}</td>
                  <td>{scheduleLabel(visit.schedule_id)}</td>
                  <td>{formatDate(visit.visit_date)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--danger btn--sm"
                      onClick={() => deleteVisit(visit.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Отметить посещение"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="visit-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="visit-form" className="form-grid form-grid--single" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Клиент</label>
            <select
              required
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: Number(e.target.value) })}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Занятие</label>
            <select
              required
              value={form.schedule_id}
              onChange={(e) => setForm({ ...form, schedule_id: Number(e.target.value) })}
            >
              {schedule.map((s) => (
                <option key={s.id} value={s.id}>
                  {scheduleLabel(s.id)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Дата посещения</label>
            <input
              type="date"
              required
              value={form.visit_date}
              onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
