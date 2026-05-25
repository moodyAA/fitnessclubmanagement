import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../context/DataContext'
import { formatDate, formatMoney } from '../data/mockData'

export function DashboardPage() {
  const { clients, contracts, payments, schedule, visits } = useData()

  const stats = [
    { label: 'Клиентов', value: clients.length },
    { label: 'Договоров', value: contracts.length },
    { label: 'Выручка', value: formatMoney(payments.reduce((s, p) => s + p.amount, 0)) },
    { label: 'Посещений', value: visits.length },
  ]

  const navCards = [
    { to: '/clients', title: 'Клиенты', desc: 'Регистрация и карточки клиентов' },
    { to: '/contracts', title: 'Договоры', desc: 'Оформление абонентских договоров' },
    { to: '/memberships', title: 'Абонементы', desc: 'Виды клубных карт и тарифы' },
    { to: '/halls', title: 'Залы', desc: 'Помещения и вместимость' },
    { to: '/lesson-types', title: 'Типы занятий', desc: 'Направления тренировок' },
    { to: '/payments', title: 'Платежи', desc: 'Приём и учёт оплат' },
    { to: '/visits', title: 'Посещения', desc: 'Фиксация посещаемости' },
    { to: '/schedule', title: 'Расписание', desc: 'Занятия по дням и залам' },
    { to: '/bookings', title: 'Запись на занятие', desc: 'Предварительная запись клиентов' },
  ]

  return (
    <>
      <PageHeader
        title="Главная"
        description="Панель управления базой данных «Фитнес зал»"
      />

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card__label">{stat.label}</div>
            <div className="stat-card__value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card__header">Последние договоры</div>
          <div className="card__body">
            <table>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {contracts.slice(-5).reverse().map((c) => (
                  <tr key={c.id}>
                    <td>{c.number}</td>
                    <td>{formatDate(c.date)}</td>
                    <td>{formatMoney(c.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card__header">Ближайшие занятия</div>
          <div className="card__body">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Время</th>
                  <th>Зал</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((s) => (
                  <tr key={s.id}>
                    <td>{formatDate(s.date)}</td>
                    <td>
                      {s.start_time} – {s.end_time}
                    </td>
                    <td>Зал #{s.hall_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Разделы системы</h2>
        <div className="nav-cards">
          {navCards.map((card) => (
            <Link key={card.to} to={card.to} className="nav-card">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
