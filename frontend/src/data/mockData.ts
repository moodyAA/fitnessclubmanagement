import type {
  AttendanceReport,
  Booking,
  Client,
  ClientReport,
  Contract,
  DashboardStats,
  Hall,
  LessonType,
  Membership,
  MembershipSalesReport,
  Payment,
  PaymentReport,
  ScheduleItem,
  Trainer,
  Visit,
} from '../types'

export const clients: Client[] = [
  {
    id: 1,
    full_name: 'Василий Васильев Васильевич',
    passport_data: '4510 123456',
    phone: '+7 (918) 123-45-67',
    email: 'vasily@mail.ru',
    birth_date: '2000-12-12',
    address: 'г. Краснодар, ул. Красная, 1',
  },
  {
    id: 2,
    full_name: 'Анна Петрова Сергеевна',
    passport_data: '4511 654321',
    phone: '+7 (918) 234-56-78',
    email: 'anna.petrov@mail.ru',
    birth_date: '1995-03-20',
    address: 'г. Краснодар, ул. Северная, 15',
  },
  {
    id: 3,
    full_name: 'Игорь Смирнов Алексеевич',
    passport_data: '4512 789012',
    phone: '+7 (918) 345-67-89',
    email: 'igor.sm@mail.ru',
    birth_date: '1988-07-05',
    address: 'г. Краснодар, ул. Ставропольская, 42',
  },
]

export const memberships: Membership[] = [
  {
    id: 1,
    name: 'Месячный безлимит',
    description: 'Посещение зала без ограничений в течение месяца',
    duration_days: 30,
    base_price: 3500,
    sessions_count: 30,
    status: 'Активен',
  },
  {
    id: 2,
    name: '12 занятий',
    description: 'Абонемент на 12 групповых занятий',
    duration_days: 60,
    base_price: 4800,
    sessions_count: 12,
    status: 'Активен',
  },
  {
    id: 3,
    name: 'Персональные тренировки (8)',
    description: '8 индивидуальных занятий с тренером',
    duration_days: 45,
    base_price: 12000,
    sessions_count: 8,
    status: 'Активен',
  },
]

export const contracts: Contract[] = [
  {
    id: 1,
    number: 'ДГ-001',
    date: '2026-05-17',
    client_id: 1,
    membership_id: 1,
    discount: 10,
    total_price: 3150,
    club_name: 'FitClub Краснодар',
    expiry_date: '2026-06-17',
  },
  {
    id: 2,
    number: 'ДГ-002',
    date: '2026-05-20',
    client_id: 2,
    membership_id: 2,
    discount: 0,
    total_price: 4800,
    club_name: 'FitClub Краснодар',
    expiry_date: '2026-07-19',
  },
  {
    id: 3,
    number: 'ДГ-003',
    date: '2026-05-22',
    client_id: 3,
    membership_id: 3,
    discount: 5,
    total_price: 11400,
    club_name: 'FitClub Краснодар',
    expiry_date: '2026-07-06',
  },
]

export const trainers: Trainer[] = [
  {
    id: 1,
    full_name: 'Олег Николаев',
    specialization: 'Силовые тренировки',
    phone: '+7 (918) 111-22-33',
    email: 'o.nikolaev@fitclub.ru',
    experience_years: 8,
    category: 'Высшая',
  },
  {
    id: 2,
    full_name: 'Мария Козлова',
    specialization: 'Йога, пилатес',
    phone: '+7 (918) 222-33-44',
    email: 'm.kozlova@fitclub.ru',
    experience_years: 5,
    category: 'Первая',
  },
]

export const halls: Hall[] = [
  {
    id: 1,
    name: 'Тренажерный зал 1',
    purpose: 'Силовые тренировки',
    capacity: 25,
  },
  {
    id: 2,
    name: 'Зал групповых занятий',
    purpose: 'Йога, пилатес, кардио',
    capacity: 20,
  },
]

export const lessonTypes: LessonType[] = [
  {
    id: 1,
    name: 'Персональная тренировка',
    description: 'Индивидуальное занятие с тренером',
    level: 'Любой',
    duration_min: 60,
  },
  {
    id: 2,
    name: 'Йога',
    description: 'Групповое занятие по йоге',
    level: 'Начальный',
    duration_min: 90,
  },
  {
    id: 3,
    name: 'Кроссфит',
    description: 'Высокоинтенсивная групповая тренировка',
    level: 'Средний',
    duration_min: 60,
  },
]

export const schedule: ScheduleItem[] = [
  {
    id: 1,
    trainer_id: 1,
    hall_id: 1,
    lesson_type_id: 1,
    date: '2026-05-25',
    start_time: '10:00',
    end_time: '11:00',
  },
  {
    id: 2,
    trainer_id: 2,
    hall_id: 2,
    lesson_type_id: 2,
    date: '2026-05-25',
    start_time: '18:00',
    end_time: '19:30',
  },
  {
    id: 3,
    trainer_id: 1,
    hall_id: 1,
    lesson_type_id: 3,
    date: '2026-05-26',
    start_time: '19:00',
    end_time: '20:00',
  },
]

export const bookings: Booking[] = [
  {
    id: 1,
    client_id: 1,
    schedule_id: 1,
    booking_date: '2026-05-21',
    status: 'Запланировано',
  },
  {
    id: 2,
    client_id: 2,
    schedule_id: 2,
    booking_date: '2026-05-22',
    status: 'Запланировано',
  },
  {
    id: 3,
    client_id: 3,
    schedule_id: 3,
    booking_date: '2026-05-23',
    status: 'Отменено',
  },
]

export const visits: Visit[] = [
  {
    id: 1,
    client_id: 1,
    schedule_id: 1,
    visit_date: '2026-05-17',
  },
  {
    id: 2,
    client_id: 2,
    schedule_id: 2,
    visit_date: '2026-05-20',
  },
]

export const payments: Payment[] = [
  {
    id: 1,
    contract_id: 1,
    payment_date: '2026-05-17',
    amount: 3150,
    method: 'Банковская карта',
    status: 'Успешно',
    receipt_number: 'СНК-1001',
  },
  {
    id: 2,
    contract_id: 2,
    payment_date: '2026-05-20',
    amount: 4800,
    method: 'Наличные',
    status: 'Успешно',
    receipt_number: 'СНК-1002',
  },
  {
    id: 3,
    contract_id: 3,
    payment_date: '2026-05-22',
    amount: 11400,
    method: 'Банковская карта',
    status: 'Успешно',
    receipt_number: 'СНК-1003',
  },
]

export function getDashboardStats(): DashboardStats {
  return {
    clients_count: clients.length,
    active_contracts: contracts.length,
    total_revenue: payments.reduce((sum, p) => sum + p.amount, 0),
    today_visits: visits.filter((v) => v.visit_date === '2026-05-24').length,
  }
}

export function getClientReport(): ClientReport[] {
  return clients.map(({ full_name, phone, email, birth_date }) => ({
    full_name,
    phone,
    email,
    birth_date,
  }))
}

export function getPaymentReport(): PaymentReport[] {
  return payments.map((payment) => {
    const contract = contracts.find((c) => c.id === payment.contract_id)!
    const client = clients.find((c) => c.id === contract.client_id)!
    return {
      contract_number: contract.number,
      client_name: client.full_name,
      payment_date: payment.payment_date,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
    }
  })
}

export function getAttendanceReport(): AttendanceReport[] {
  const map = new Map<string, AttendanceReport>()

  for (const visit of visits) {
    const scheduleItem = schedule.find((s) => s.id === visit.schedule_id)!
    const lessonType = lessonTypes.find((lt) => lt.id === scheduleItem.lesson_type_id)!
    const hall = halls.find((h) => h.id === scheduleItem.hall_id)!
    const key = `${lessonType.name}-${hall.name}`

    const existing = map.get(key)
    if (existing) {
      existing.visits_count += 1
    } else {
      map.set(key, {
        lesson_type: lessonType.name,
        visits_count: 1,
        hall_name: hall.name,
      })
    }
  }

  return Array.from(map.values())
}

export function getMembershipSalesReport(): MembershipSalesReport[] {
  return memberships.map((membership) => {
    const related = contracts.filter((c) => c.membership_id === membership.id)
    return {
      membership_name: membership.name,
      contracts_count: related.length,
      total_revenue: related.reduce((sum, c) => sum + c.total_price, 0),
    }
  })
}

export function calcTotalPrice(basePrice: number, discount: number): number {
  return Math.round(basePrice - (basePrice * discount) / 100)
}

export function calcExpiryDate(contractDate: string, durationDays: number): string {
  const date = new Date(contractDate)
  date.setDate(date.getDate() + durationDays)
  return date.toISOString().slice(0, 10)
}

export function getClientName(id: number): string {
  return clients.find((c) => c.id === id)?.full_name ?? '—'
}

export function getMembershipName(id: number): string {
  return memberships.find((m) => m.id === id)?.name ?? '—'
}

export function getTrainerName(id: number): string {
  return trainers.find((t) => t.id === id)?.full_name ?? '—'
}

export function getHallName(id: number): string {
  return halls.find((h) => h.id === id)?.name ?? '—'
}

export function getLessonTypeName(id: number): string {
  return lessonTypes.find((lt) => lt.id === id)?.name ?? '—'
}

export function getContractNumber(id: number): string {
  return contracts.find((c) => c.id === id)?.number ?? '—'
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU')
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}
