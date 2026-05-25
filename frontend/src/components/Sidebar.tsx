import { NavLink } from 'react-router-dom'

const mainNav = [
  { to: '/', label: 'Главная', end: true },
  { to: '/clients', label: 'Клиенты' },
  { to: '/contracts', label: 'Договоры' },
  { to: '/memberships', label: 'Абонементы' },
  { to: '/payments', label: 'Платежи' },
  { to: '/schedule', label: 'Расписание' },
  { to: '/bookings', label: 'Запись на занятие' },
  { to: '/visits', label: 'Посещения' },
  { to: '/reports', label: 'Отчёты' },
]

const refNav = [
  { to: '/halls', label: 'Залы' },
  { to: '/lesson-types', label: 'Типы занятий' },
  { to: '/trainers', label: 'Тренеры' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">FC</div>
        <div>
          <div className="sidebar__title">FitClub Admin</div>
          <div className="sidebar__subtitle">Фитнес зал</div>
        </div>
      </div>

      <div className="sidebar__section">Основное</div>
      {mainNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
          }
        >
          {item.label}
        </NavLink>
      ))}

      <div className="sidebar__section">Справочники</div>
      {refNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}
