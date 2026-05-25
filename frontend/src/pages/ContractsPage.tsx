import { useMemo, useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData, useLookups } from '../context/DataContext'
import type { Contract } from '../types'
import { calcExpiryDate, calcTotalPrice, formatDate, formatMoney } from '../data/mockData'

type ContractForm = Omit<Contract, 'id' | 'total_price' | 'expiry_date'>

const emptyContract: ContractForm = {
  number: '',
  date: new Date().toISOString().slice(0, 10),
  client_id: 0,
  membership_id: 0,
  discount: 0,
  club_name: 'FitClub Краснодар',
}

export function ContractsPage() {
  const {
    contracts,
    clients,
    memberships,
    payments,
    addContract,
    updateContract,
    deleteContract,
    addPayment,
  } = useData()
  const { getClientName, getMembershipName } = useLookups()

  const [selectedId, setSelectedId] = useState<number | null>(contracts[0]?.id ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [editing, setEditing] = useState<Contract | null>(null)
  const [form, setForm] = useState(emptyContract)
  const [paymentForm, setPaymentForm] = useState({
    payment_date: new Date().toISOString().slice(0, 10),
    amount: 0,
    method: 'Банковская карта',
    status: 'Успешно',
    receipt_number: '',
  })

  const selected = contracts.find((c) => c.id === selectedId) ?? null
  const selectedPayments = useMemo(
    () => payments.filter((p) => p.contract_id === selectedId),
    [payments, selectedId],
  )

  const membership = selected
    ? memberships.find((m) => m.id === selected.membership_id)
    : null

  const previewTotal = useMemo(() => {
    const m = memberships.find((item) => item.id === form.membership_id)
    return calcTotalPrice(m?.base_price ?? 0, form.discount)
  }, [form.membership_id, form.discount, memberships])

  const previewExpiry = useMemo(() => {
    const m = memberships.find((item) => item.id === form.membership_id)
    if (!form.date || !m) return '—'
    return formatDate(calcExpiryDate(form.date, m.duration_days))
  }, [form.date, form.membership_id, memberships])

  const openCreate = () => {
    setEditing(null)
    setForm({
      ...emptyContract,
      client_id: clients[0]?.id ?? 0,
      membership_id: memberships[0]?.id ?? 0,
    })
    setModalOpen(true)
  }

  const openEdit = (contract: Contract) => {
    setEditing(contract)
    setForm({
      number: contract.number,
      date: contract.date,
      client_id: contract.client_id,
      membership_id: contract.membership_id,
      discount: contract.discount,
      club_name: contract.club_name,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateContract(editing.id, form)
    } else {
      addContract(form)
    }
    setModalOpen(false)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) return
    addPayment({ ...paymentForm, contract_id: selectedId })
    setPaymentModalOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Договоры"
        description="Форма «Договор» с подтаблицей платежей"
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Оформить договор
          </button>
        }
      />

      <div className="card">
        <div className="card__body">
          <table>
            <thead>
              <tr>
                <th>Номер</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Абонемент</th>
                <th>Скидка</th>
                <th>Итого</th>
                <th>Срок действия</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  style={{
                    background: contract.id === selectedId ? '#eff6ff' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedId(contract.id)}
                >
                  <td>{contract.number}</td>
                  <td>{formatDate(contract.date)}</td>
                  <td>{getClientName(contract.client_id)}</td>
                  <td>{getMembershipName(contract.membership_id)}</td>
                  <td>{contract.discount}%</td>
                  <td>{formatMoney(contract.total_price)}</td>
                  <td>{formatDate(contract.expiry_date)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(contract)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => deleteContract(contract.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card__header">
            Договор {selected.number} — детали и платежи
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Клиент</label>
              <span>{getClientName(selected.client_id)}</span>
            </div>
            <div className="detail-item">
              <label>Абонемент</label>
              <span>{getMembershipName(selected.membership_id)}</span>
            </div>
            <div className="detail-item">
              <label>Базовая стоимость</label>
              <span>{formatMoney(membership?.base_price ?? 0)}</span>
            </div>
            <div className="detail-item">
              <label>Итоговая стоимость</label>
              <span>{formatMoney(selected.total_price)}</span>
            </div>
            <div className="detail-item">
              <label>Клуб</label>
              <span>{selected.club_name}</span>
            </div>
            <div className="detail-item">
              <label>Срок действия</label>
              <span>{formatDate(selected.expiry_date)}</span>
            </div>
          </div>
          <div className="toolbar">
            <strong>Платежи по договору</strong>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => {
                setPaymentForm({
                  payment_date: new Date().toISOString().slice(0, 10),
                  amount: selected.total_price,
                  method: 'Банковская карта',
                  status: 'Успешно',
                  receipt_number: `СНК-${1000 + payments.length + 1}`,
                })
                setPaymentModalOpen(true)
              }}
            >
              + Добавить платёж
            </button>
          </div>
          <div className="card__body">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Способ</th>
                  <th>Статус</th>
                  <th>Чек</th>
                </tr>
              </thead>
              <tbody>
                {selectedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      Платежей пока нет
                    </td>
                  </tr>
                ) : (
                  selectedPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{formatDate(payment.payment_date)}</td>
                      <td>{formatMoney(payment.amount)}</td>
                      <td>{payment.method}</td>
                      <td>
                        <span className="badge badge--success">{payment.status}</span>
                      </td>
                      <td>{payment.receipt_number}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        title={editing ? 'Редактировать договор' : 'Новый договор'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" form="contract-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="contract-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Номер договора</label>
            <input
              required
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="ДГ-004"
            />
          </div>
          <div className="form-field">
            <label>Дата договора</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Клиент</label>
            <select
              required
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: Number(e.target.value) })}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Абонемент</label>
            <select
              required
              value={form.membership_id}
              onChange={(e) => setForm({ ...form, membership_id: Number(e.target.value) })}
            >
              {memberships.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {formatMoney(m.base_price)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Скидка, %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Итоговая стоимость (расчёт)</label>
            <input readOnly value={formatMoney(previewTotal)} />
          </div>
          <div className="form-field">
            <label>Срок действия (расчёт)</label>
            <input readOnly value={previewExpiry} />
          </div>
          <div className="form-field">
            <label>Название клуба</label>
            <input
              required
              value={form.club_name}
              onChange={(e) => setForm({ ...form, club_name: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      <Modal
        title="Добавить платёж"
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setPaymentModalOpen(false)}
            >
              Отмена
            </button>
            <button type="submit" form="payment-form" className="btn btn--primary">
              Сохранить
            </button>
          </>
        }
      >
        <form id="payment-form" className="form-grid" onSubmit={handlePaymentSubmit}>
          <div className="form-field">
            <label>Дата оплаты</label>
            <input
              type="date"
              required
              value={paymentForm.payment_date}
              onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Сумма</label>
            <input
              type="number"
              required
              min={0}
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
            />
          </div>
          <div className="form-field">
            <label>Способ оплаты</label>
            <select
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
            >
              <option>Банковская карта</option>
              <option>Наличные</option>
              <option>Перевод</option>
            </select>
          </div>
          <div className="form-field">
            <label>Статус</label>
            <select
              value={paymentForm.status}
              onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
            >
              <option>Успешно</option>
              <option>Ожидание</option>
              <option>Отменён</option>
            </select>
          </div>
          <div className="form-field form-field--full">
            <label>Номер чека</label>
            <input
              required
              value={paymentForm.receipt_number}
              onChange={(e) => setPaymentForm({ ...paymentForm, receipt_number: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
