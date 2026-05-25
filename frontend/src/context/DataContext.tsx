import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { USE_MOCK } from '../api/client'
import { api, loadAllData } from '../api/endpoints'
import * as seed from '../data/mockData'
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
import { calcExpiryDate, calcTotalPrice } from '../data/mockData'

interface DataStore {
  loading: boolean
  error: string | null
  clients: Client[]
  memberships: Membership[]
  contracts: Contract[]
  trainers: Trainer[]
  halls: Hall[]
  lessonTypes: LessonType[]
  schedule: ScheduleItem[]
  bookings: Booking[]
  visits: Visit[]
  payments: Payment[]
  refresh: () => Promise<void>
  addClient: (data: Omit<Client, 'id'>) => Promise<void>
  updateClient: (id: number, data: Omit<Client, 'id'>) => Promise<void>
  deleteClient: (id: number) => Promise<void>
  addMembership: (data: Omit<Membership, 'id'>) => Promise<void>
  updateMembership: (id: number, data: Omit<Membership, 'id'>) => Promise<void>
  deleteMembership: (id: number) => Promise<void>
  addContract: (data: Omit<Contract, 'id' | 'total_price' | 'expiry_date'>) => Promise<void>
  updateContract: (id: number, data: Omit<Contract, 'id' | 'total_price' | 'expiry_date'>) => Promise<void>
  deleteContract: (id: number) => Promise<void>
  addTrainer: (data: Omit<Trainer, 'id'>) => Promise<void>
  updateTrainer: (id: number, data: Omit<Trainer, 'id'>) => Promise<void>
  deleteTrainer: (id: number) => Promise<void>
  addHall: (data: Omit<Hall, 'id'>) => Promise<void>
  updateHall: (id: number, data: Omit<Hall, 'id'>) => Promise<void>
  deleteHall: (id: number) => Promise<void>
  addLessonType: (data: Omit<LessonType, 'id'>) => Promise<void>
  updateLessonType: (id: number, data: Omit<LessonType, 'id'>) => Promise<void>
  deleteLessonType: (id: number) => Promise<void>
  addScheduleItem: (data: Omit<ScheduleItem, 'id'>) => Promise<void>
  updateScheduleItem: (id: number, data: Omit<ScheduleItem, 'id'>) => Promise<void>
  deleteScheduleItem: (id: number) => Promise<void>
  addBooking: (data: Omit<Booking, 'id'>) => Promise<void>
  updateBooking: (id: number, data: Omit<Booking, 'id'>) => Promise<void>
  deleteBooking: (id: number) => Promise<void>
  addVisit: (data: Omit<Visit, 'id'>) => Promise<void>
  deleteVisit: (id: number) => Promise<void>
  addPayment: (data: Omit<Payment, 'id'>) => Promise<void>
  deletePayment: (id: number) => Promise<void>
}

const DataContext = createContext<DataStore | null>(null)

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
}

const initialMock = {
  clients: seed.clients,
  memberships: seed.memberships,
  contracts: seed.contracts,
  trainers: seed.trainers,
  halls: seed.halls,
  lessonTypes: seed.lessonTypes,
  schedule: seed.schedule,
  bookings: seed.bookings,
  visits: seed.visits,
  payments: seed.payments,
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(!USE_MOCK)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState(initialMock.clients)
  const [memberships, setMemberships] = useState(initialMock.memberships)
  const [contracts, setContracts] = useState(initialMock.contracts)
  const [trainers, setTrainers] = useState(initialMock.trainers)
  const [halls, setHalls] = useState(initialMock.halls)
  const [lessonTypes, setLessonTypes] = useState(initialMock.lessonTypes)
  const [schedule, setSchedule] = useState(initialMock.schedule)
  const [bookings, setBookings] = useState(initialMock.bookings)
  const [visits, setVisits] = useState(initialMock.visits)
  const [payments, setPayments] = useState(initialMock.payments)

  const applyData = useCallback((data: typeof initialMock) => {
    setClients(data.clients)
    setMemberships(data.memberships)
    setContracts(data.contracts)
    setTrainers(data.trainers)
    setHalls(data.halls)
    setLessonTypes(data.lessonTypes)
    setSchedule(data.schedule)
    setBookings(data.bookings)
    setVisits(data.visits)
    setPayments(data.payments)
  }, [])

  const refresh = useCallback(async () => {
    if (USE_MOCK) return
    setLoading(true)
    setError(null)
    try {
      const data = await loadAllData()
      applyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [applyData])

  useEffect(() => {
    if (!USE_MOCK) refresh()
  }, [refresh])

  const mutate = useCallback(
    async <T,>(action: () => Promise<T>, fallback: () => void) => {
      if (USE_MOCK) {
        fallback()
        return
      }
      await action()
      await refresh()
    },
    [refresh],
  )

  const value = useMemo<DataStore>(
    () => ({
      loading,
      error,
      clients,
      memberships,
      contracts,
      trainers,
      halls,
      lessonTypes,
      schedule,
      bookings,
      visits,
      payments,
      refresh,

      addClient: (data) =>
        mutate(() => api.createClient(data), () => setClients((prev) => [...prev, { ...data, id: nextId(prev) }])),
      updateClient: (id, data) =>
        mutate(
          () => api.updateClient(id, data),
          () => setClients((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteClient: (id) =>
        mutate(() => api.deleteClient(id), () => setClients((prev) => prev.filter((item) => item.id !== id))),

      addMembership: (data) =>
        mutate(
          () => api.createMembership(data),
          () => setMemberships((prev) => [...prev, { ...data, id: nextId(prev) }]),
        ),
      updateMembership: (id, data) =>
        mutate(
          () => api.updateMembership(id, data),
          () => setMemberships((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteMembership: (id) =>
        mutate(() => api.deleteMembership(id), () => setMemberships((prev) => prev.filter((item) => item.id !== id))),

      addContract: (data) =>
        mutate(
          () => api.createContract(data),
          () => {
            const membership = memberships.find((m) => m.id === data.membership_id)
            const total_price = calcTotalPrice(membership?.base_price ?? 0, data.discount)
            const expiry_date = calcExpiryDate(data.date, membership?.duration_days ?? 0)
            setContracts((prev) => [...prev, { ...data, id: nextId(prev), total_price, expiry_date }])
          },
        ),
      updateContract: (id, data) =>
        mutate(
          () => api.updateContract(id, data),
          () => {
            const membership = memberships.find((m) => m.id === data.membership_id)
            const total_price = calcTotalPrice(membership?.base_price ?? 0, data.discount)
            const expiry_date = calcExpiryDate(data.date, membership?.duration_days ?? 0)
            setContracts((prev) =>
              prev.map((item) => (item.id === id ? { ...data, id, total_price, expiry_date } : item)),
            )
          },
        ),
      deleteContract: (id) =>
        mutate(() => api.deleteContract(id), () => setContracts((prev) => prev.filter((item) => item.id !== id))),

      addTrainer: (data) =>
        mutate(() => api.createTrainer(data), () => setTrainers((prev) => [...prev, { ...data, id: nextId(prev) }])),
      updateTrainer: (id, data) =>
        mutate(
          () => api.updateTrainer(id, data),
          () => setTrainers((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteTrainer: (id) =>
        mutate(() => api.deleteTrainer(id), () => setTrainers((prev) => prev.filter((item) => item.id !== id))),

      addHall: (data) =>
        mutate(() => api.createHall(data), () => setHalls((prev) => [...prev, { ...data, id: nextId(prev) }])),
      updateHall: (id, data) =>
        mutate(
          () => api.updateHall(id, data),
          () => setHalls((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteHall: (id) =>
        mutate(() => api.deleteHall(id), () => setHalls((prev) => prev.filter((item) => item.id !== id))),

      addLessonType: (data) =>
        mutate(
          () => api.createLessonType(data),
          () => setLessonTypes((prev) => [...prev, { ...data, id: nextId(prev) }]),
        ),
      updateLessonType: (id, data) =>
        mutate(
          () => api.updateLessonType(id, data),
          () => setLessonTypes((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteLessonType: (id) =>
        mutate(() => api.deleteLessonType(id), () => setLessonTypes((prev) => prev.filter((item) => item.id !== id))),

      addScheduleItem: (data) =>
        mutate(
          () => api.createScheduleItem(data),
          () => setSchedule((prev) => [...prev, { ...data, id: nextId(prev) }]),
        ),
      updateScheduleItem: (id, data) =>
        mutate(
          () => api.updateScheduleItem(id, data),
          () => setSchedule((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteScheduleItem: (id) =>
        mutate(() => api.deleteScheduleItem(id), () => setSchedule((prev) => prev.filter((item) => item.id !== id))),

      addBooking: (data) =>
        mutate(() => api.createBooking(data), () => setBookings((prev) => [...prev, { ...data, id: nextId(prev) }])),
      updateBooking: (id, data) =>
        mutate(
          () => api.updateBooking(id, data),
          () => setBookings((prev) => prev.map((item) => (item.id === id ? { ...data, id } : item))),
        ),
      deleteBooking: (id) =>
        mutate(() => api.deleteBooking(id), () => setBookings((prev) => prev.filter((item) => item.id !== id))),

      addVisit: (data) =>
        mutate(() => api.createVisit(data), () => setVisits((prev) => [...prev, { ...data, id: nextId(prev) }])),
      deleteVisit: (id) =>
        mutate(() => api.deleteVisit(id), () => setVisits((prev) => prev.filter((item) => item.id !== id))),

      addPayment: (data) =>
        mutate(() => api.createPayment(data), () => setPayments((prev) => [...prev, { ...data, id: nextId(prev) }])),
      deletePayment: (id) =>
        mutate(() => api.deletePayment(id), () => setPayments((prev) => prev.filter((item) => item.id !== id))),
    }),
    [
      loading,
      error,
      clients,
      memberships,
      contracts,
      trainers,
      halls,
      lessonTypes,
      schedule,
      bookings,
      visits,
      payments,
      refresh,
      mutate,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export function useLookups() {
  const data = useData()

  return useMemo(
    () => ({
      getClientName: (id: number) => data.clients.find((c) => c.id === id)?.full_name ?? '—',
      getMembershipName: (id: number) => data.memberships.find((m) => m.id === id)?.name ?? '—',
      getTrainerName: (id: number) => data.trainers.find((t) => t.id === id)?.full_name ?? '—',
      getHallName: (id: number) => data.halls.find((h) => h.id === id)?.name ?? '—',
      getLessonTypeName: (id: number) => data.lessonTypes.find((lt) => lt.id === id)?.name ?? '—',
      getContractNumber: (id: number) => data.contracts.find((c) => c.id === id)?.number ?? '—',
    }),
    [data],
  )
}
