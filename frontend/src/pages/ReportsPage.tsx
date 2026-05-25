import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../context/DataContext'
import { formatDate, formatMoney } from '../data/mockData'

type ReportTab = 'clients' | 'payments' | 'attendance' | 'sales'

const tabs: { id: ReportTab; label: string }[] = [
  { id: 'clients', label: 'По клиентам' },
  { id: 'payments', label: 'По оплате' },
  { id: 'attendance', label: 'По посещаемости' },
  { id: 'sales', label: 'По продажам абонементов' },
]

export function ReportsPage() {
  const { clients, payments, contracts, visits, schedule, memberships, halls, lessonTypes } =
    useData()
  const [tab, setTab] = useState<ReportTab>('clients')

  const clientReport = useMemo(
    () =>
      clients.map(({ full_name, phone, email, birth_date }) => ({
        full_name,
        phone,
        email,
        birth_date,
      })),
    [clients],
  )

  const paymentReport = useMemo(
    () =>
      payments.map((payment) => {
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
      }),
    [payments, contracts, clients],
  )

  const attendanceReport = useMemo(() => {
    const map = new Map<string, { lesson_type: string; visits_count: number; hall_name: string }>()
    for (const visit of visits) {
      const scheduleItem = schedule.find((s) => s.id === visit.schedule_id)!
      const lessonType = lessonTypes.find((lt) => lt.id === scheduleItem.lesson_type_id)!
      const hall = halls.find((h) => h.id === scheduleItem.hall_id)!
      const key = `${lessonType.name}-${hall.name}`
      const existing = map.get(key)
      if (existing) existing.visits_count += 1
      else map.set(key, { lesson_type: lessonType.name, visits_count: 1, hall_name: hall.name })
    }
    return Array.from(map.values())
  }, [visits, schedule, lessonTypes, halls])

  const salesReport = useMemo(
    () =>
      memberships.map((membership) => {
        const related = contracts.filter((c) => c.membership_id === membership.id)
        return {
          membership_name: membership.name,
          contracts_count: related.length,
          total_revenue: related.reduce((sum, c) => sum + c.total_price, 0),
        }
      }),
    [memberships, contracts],
  )

  return (
    <>
      <PageHeader
        title="Отчёты"
        description="Отчётная информация для руководителя"
      />

      <div className="btn-group" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`btn ${tab === item.id ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card__header">
          {tabs.find((t) => t.id === tab)?.label}
        </div>
        <div className="card__body">
          {tab === 'clients' && (
            <table>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Дата рождения</th>
                </tr>
              </thead>
              <tbody>
                {clientReport.map((row) => (
                  <tr key={row.full_name}>
                    <td>{row.full_name}</td>
                    <td>{row.phone}</td>
                    <td>{row.email}</td>
                    <td>{formatDate(row.birth_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'payments' && (
            <table>
              <thead>
                <tr>
                  <th>Договор</th>
                  <th>Клиент</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Способ</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {paymentReport.map((row, i) => (
                  <tr key={i}>
                    <td>{row.contract_number}</td>
                    <td>{row.client_name}</td>
                    <td>{formatDate(row.payment_date)}</td>
                    <td>{formatMoney(row.amount)}</td>
                    <td>{row.method}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'attendance' && (
            <table>
              <thead>
                <tr>
                  <th>Тип занятия</th>
                  <th>Зал</th>
                  <th>Посещений</th>
                </tr>
              </thead>
              <tbody>
                {attendanceReport.map((row, i) => (
                  <tr key={i}>
                    <td>{row.lesson_type}</td>
                    <td>{row.hall_name}</td>
                    <td>{row.visits_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'sales' && (
            <table>
              <thead>
                <tr>
                  <th>Абонемент</th>
                  <th>Договоров</th>
                  <th>Выручка</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.map((row) => (
                  <tr key={row.membership_name}>
                    <td>{row.membership_name}</td>
                    <td>{row.contracts_count}</td>
                    <td>{formatMoney(row.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
