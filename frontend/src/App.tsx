import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DataProvider } from './context/DataContext'
import { BookingsPage } from './pages/BookingsPage'
import { ClientsPage } from './pages/ClientsPage'
import { ContractsPage } from './pages/ContractsPage'
import { DashboardPage } from './pages/DashboardPage'
import { HallsPage } from './pages/HallsPage'
import { LessonTypesPage } from './pages/LessonTypesPage'
import { MembershipsPage } from './pages/MembershipsPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SchedulePage } from './pages/SchedulePage'
import { TrainersPage } from './pages/TrainersPage'
import { VisitsPage } from './pages/VisitsPage'

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="memberships" element={<MembershipsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="visits" element={<VisitsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="halls" element={<HallsPage />} />
            <Route path="lesson-types" element={<LessonTypesPage />} />
            <Route path="trainers" element={<TrainersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
