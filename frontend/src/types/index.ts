export interface Client {
  id: number
  full_name: string
  passport_data: string
  phone: string
  email: string
  birth_date: string
  address: string
}

export interface Membership {
  id: number
  name: string
  description: string
  duration_days: number
  base_price: number
  sessions_count: number
  status: string
}

export interface Contract {
  id: number
  number: string
  date: string
  client_id: number
  membership_id: number
  discount: number
  total_price: number
  club_name: string
  expiry_date: string
}

export interface Trainer {
  id: number
  full_name: string
  specialization: string
  phone: string
  email: string
  experience_years: number
  category: string
}

export interface Hall {
  id: number
  name: string
  purpose: string
  capacity: number
}

export interface LessonType {
  id: number
  name: string
  description: string
  level: string
  duration_min: number
}

export interface ScheduleItem {
  id: number
  trainer_id: number
  hall_id: number
  lesson_type_id: number
  date: string
  start_time: string
  end_time: string
}

export interface Booking {
  id: number
  client_id: number
  schedule_id: number
  booking_date: string
  status: 'Запланировано' | 'Посещено' | 'Отменено'
}

export interface Visit {
  id: number
  client_id: number
  schedule_id: number
  visit_date: string
}

export interface Payment {
  id: number
  contract_id: number
  payment_date: string
  amount: number
  method: string
  status: string
  receipt_number: string
}

export type BookingStatus = Booking['status']

export interface DashboardStats {
  clients_count: number
  active_contracts: number
  total_revenue: number
  today_visits: number
}

export interface MembershipSalesReport {
  membership_name: string
  contracts_count: number
  total_revenue: number
}

export interface AttendanceReport {
  lesson_type: string
  visits_count: number
  hall_name: string
}

export interface PaymentReport {
  contract_number: string
  client_name: string
  payment_date: string
  amount: number
  method: string
  status: string
}

export interface ClientReport {
  full_name: string
  phone: string
  email: string
  birth_date: string
}
