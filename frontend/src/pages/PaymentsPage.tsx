import { useMemo } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useData, useLookups } from '../context/DataContext'
import { formatDate, formatMoney } from '../data/mockData'

export function PaymentsPage() {
  const { payments } = useData()
  const { getClientName, getContractNumber } = useLookups()
  const { contracts } = useData()

  const rows = useMemo(
    () =>
      payments.map((payment) => {
        const contract = contracts.find((c) => c.id === payment.contract_id)
        return {
          ...payment,
          contract_number: getContractNumber(payment.contract_id),
          client_name: contract ? getClientName(contract.client_id) : '—',
        }
      }),
    [payments, contracts, getClientName, getContractNumber],
  )

  const total = rows.reduce((sum, row) => sum + row.amount, 0)

  return (
    <>
      <PageHeader
        title="Платежи"
        description="Все оплаты по абонентским договорам"
      />

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card__label">Всего платежей</div>
          <div className="stat-card__value">{rows.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Общая сумма</div>
          <div className="stat-card__value">{formatMoney(total)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Договор</th>
                <th>Клиент</th>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Способ</th>
                <th>Статус</th>
                <th>Чек</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.contract_number}</td>
                  <td>{row.client_name}</td>
                  <td>{formatDate(row.payment_date)}</td>
                  <td>{formatMoney(row.amount)}</td>
                  <td>{row.method}</td>
                  <td>
                    <span className="badge badge--success">{row.status}</span>
                  </td>
                  <td>{row.receipt_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
