import { apiFetch } from './client'
import type {
  Booking,
  Client,
  Contract,
  Hall,
  LessonType,
  Membership,
  Payment,
  ScheduleItem,
  Trainer,
  Visit,
} from '../types'

interface Paginated<T> {
  count: number
  results: T[]
}

async function fetchList<T>(path: string): Promise<T[]> {
  const data = await apiFetch<Paginated<T> | T[]>(path)
  return Array.isArray(data) ? data : data.results
}

function normalizeMembership(m: Membership): Membership {
  return { ...m, base_price: Number(m.base_price) }
}

function normalizeContract(c: Contract): Contract {
  return { ...c, total_price: Number(c.total_price), discount: Number(c.discount) }
}

function normalizePayment(p: Payment): Payment {
  return { ...p, amount: Number(p.amount) }
}

function normalizeSchedule(s: ScheduleItem): ScheduleItem {
  return {
    ...s,
    start_time: s.start_time.slice(0, 5),
    end_time: s.end_time.slice(0, 5),
  }
}

export async function loadAllData() {
  const [clients, memberships, contracts, trainers, halls, lessonTypes, schedule, bookings, visits, payments] =
    await Promise.all([
      fetchList<Client>('/clients/'),
      fetchList<Membership>('/memberships/').then((items) => items.map(normalizeMembership)),
      fetchList<Contract>('/contracts/').then((items) => items.map(normalizeContract)),
      fetchList<Trainer>('/trainers/'),
      fetchList<Hall>('/halls/'),
      fetchList<LessonType>('/lesson-types/'),
      fetchList<ScheduleItem>('/schedule/').then((items) => items.map(normalizeSchedule)),
      fetchList<Booking>('/bookings/'),
      fetchList<Visit>('/visits/'),
      fetchList<Payment>('/payments/').then((items) => items.map(normalizePayment)),
    ])

  return { clients, memberships, contracts, trainers, halls, lessonTypes, schedule, bookings, visits, payments }
}

export const api = {
  createClient: (data: Omit<Client, 'id'>) =>
    apiFetch<Client>('/clients/', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: number, data: Omit<Client, 'id'>) =>
    apiFetch<Client>(`/clients/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteClient: (id: number) =>
    apiFetch<void>(`/clients/${id}/`, { method: 'DELETE' }),

  createMembership: (data: Omit<Membership, 'id'>) =>
    apiFetch<Membership>('/memberships/', { method: 'POST', body: JSON.stringify(data) }).then(normalizeMembership),
  updateMembership: (id: number, data: Omit<Membership, 'id'>) =>
    apiFetch<Membership>(`/memberships/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }).then(normalizeMembership),
  deleteMembership: (id: number) =>
    apiFetch<void>(`/memberships/${id}/`, { method: 'DELETE' }),

  createContract: (data: Omit<Contract, 'id' | 'total_price' | 'expiry_date'>) =>
    apiFetch<Contract>('/contracts/', { method: 'POST', body: JSON.stringify(data) }).then(normalizeContract),
  updateContract: (id: number, data: Omit<Contract, 'id' | 'total_price' | 'expiry_date'>) =>
    apiFetch<Contract>(`/contracts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }).then(normalizeContract),
  deleteContract: (id: number) =>
    apiFetch<void>(`/contracts/${id}/`, { method: 'DELETE' }),

  createTrainer: (data: Omit<Trainer, 'id'>) =>
    apiFetch<Trainer>('/trainers/', { method: 'POST', body: JSON.stringify(data) }),
  updateTrainer: (id: number, data: Omit<Trainer, 'id'>) =>
    apiFetch<Trainer>(`/trainers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTrainer: (id: number) =>
    apiFetch<void>(`/trainers/${id}/`, { method: 'DELETE' }),

  createHall: (data: Omit<Hall, 'id'>) =>
    apiFetch<Hall>('/halls/', { method: 'POST', body: JSON.stringify(data) }),
  updateHall: (id: number, data: Omit<Hall, 'id'>) =>
    apiFetch<Hall>(`/halls/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteHall: (id: number) =>
    apiFetch<void>(`/halls/${id}/`, { method: 'DELETE' }),

  createLessonType: (data: Omit<LessonType, 'id'>) =>
    apiFetch<LessonType>('/lesson-types/', { method: 'POST', body: JSON.stringify(data) }),
  updateLessonType: (id: number, data: Omit<LessonType, 'id'>) =>
    apiFetch<LessonType>(`/lesson-types/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteLessonType: (id: number) =>
    apiFetch<void>(`/lesson-types/${id}/`, { method: 'DELETE' }),

  createScheduleItem: (data: Omit<ScheduleItem, 'id'>) =>
    apiFetch<ScheduleItem>('/schedule/', { method: 'POST', body: JSON.stringify(data) }).then(normalizeSchedule),
  updateScheduleItem: (id: number, data: Omit<ScheduleItem, 'id'>) =>
    apiFetch<ScheduleItem>(`/schedule/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }).then(normalizeSchedule),
  deleteScheduleItem: (id: number) =>
    apiFetch<void>(`/schedule/${id}/`, { method: 'DELETE' }),

  createBooking: (data: Omit<Booking, 'id'>) =>
    apiFetch<Booking>('/bookings/', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id: number, data: Omit<Booking, 'id'>) =>
    apiFetch<Booking>(`/bookings/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBooking: (id: number) =>
    apiFetch<void>(`/bookings/${id}/`, { method: 'DELETE' }),

  createVisit: (data: Omit<Visit, 'id'>) =>
    apiFetch<Visit>('/visits/', { method: 'POST', body: JSON.stringify(data) }),
  deleteVisit: (id: number) =>
    apiFetch<void>(`/visits/${id}/`, { method: 'DELETE' }),

  createPayment: (data: Omit<Payment, 'id'>) =>
    apiFetch<Payment>('/payments/', { method: 'POST', body: JSON.stringify(data) }).then(normalizePayment),
  deletePayment: (id: number) =>
    apiFetch<void>(`/payments/${id}/`, { method: 'DELETE' }),
}
