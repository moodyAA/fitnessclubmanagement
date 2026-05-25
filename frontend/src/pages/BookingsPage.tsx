import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData, useLookups } from '../context/DataContext'
import type { Booking, BookingStatus } from '../types'
import { formatDate } from '../data/mockData'

const statuses: BookingStatus[] = ['Запланировано', 'Посещено', 'Отменено']

const emptyBooking: Omit<Booking, 'id'> = {
  client_id: 0,
  schedule_id: 0,
  booking_date: new Date().toISOString().slice(0, 10),
  status: 'Запланировано',
}

function statusBadge(status: BookingStatus) {
  if (status === 'Посещено') return 'badge badge--success'
  if (status === 'Отменено') return 'badge badge--muted'
  return 'badge badge--warning'
}

export function BookingsPage() {
  const { bookings, clients, schedule, addBooking, updateBooking, deleteBooking } = useData()
  const { getClientName, getLessonTypeName } = useLookups()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Booking | null>(null)
  const [form, setForm] = useState(emptyBooking)

  const openCreate = () => {
    setEditing(null)
    setForm({
      ...emptyBooking,
      client_id: clients[0]?.id ?? 0,
      schedule_id: schedule[0]?.id ?? 0,
    })
    setModalOpen(true)
  }

  const openEdit = (booking: Booking) => {
    setEditing(booking)
    setForm({
      client_id: booking.client_id,
      schedule_id: booking.schedule_id,
      booking_date: booking.booking_date,
      status: booking.status,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateBooking(editing.id, form)
    else addBooking(form)
    setModalOpen(false)
  }

  const scheduleLabel = (scheduleId: number) => {
    const item = schedule.find((s) => s.id === scheduleId)
    if (!item) return '—'
    return `${formatDate(item.date)} ${item.start_time} — ${getLessonTypeName(item.lesson_type_id)}`
  }

  return (
    <>
      <PageHeader
        title="Запись на занятие"
        description="Форма «Запись_на_занятие» — предварительная запись клиентов"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Новая запись
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
                <th>Дата записи</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{getClientName(booking.client_id)}</td>
                  <td>{scheduleLabel(booking.schedule_id)}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>
                    <span className={statusBadge(booking.status)}>{booking.status}</span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(booking)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteBooking(booking.id)}
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
        title={editing ? 'Редактировать запись' : 'Новая запись'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="booking-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="booking-form" className="form-grid form-grid--single" onSubmit={handleSubmit}>
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
            <label>Дата записи</label>
            <input
              type="date"
              required
              value={form.booking_date}
              onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Статус записи</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </>
  )
}
