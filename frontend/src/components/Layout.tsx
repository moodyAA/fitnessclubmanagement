import { Outlet } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { Sidebar } from './Sidebar'

export function Layout() {
  const { loading, error } = useData()

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {loading && <div className="badge badge--muted" style={{ marginBottom: 16 }}>Загрузка...</div>}
        {error && <div className="badge badge--warning" style={{ marginBottom: 16 }}>Ошибка: {error}</div>}
        <Outlet />
      </main>
    </div>
  )
}
