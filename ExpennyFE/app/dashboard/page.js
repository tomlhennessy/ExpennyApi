'use client'

import LoadingSpinner from "@/components/LoadingSpinner"
import SubscriptionForm from "@/components/SubscriptionForm"
import SubscriptionsDisplay from "@/components/SubscriptionsDisplay"
import SubscriptionSummary from "@/components/SubscriptionSummary"
import { useAuth } from "@/context/AuthContext"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useEffect, useState } from "react"

const todayStr = new Date().toISOString().split("T")[0]

const blankSubscription = {
  name: '',
  category: 'Web Services',
  cost: '',
  currency: 'AUD',
  billingFrequency: 'Monthly',
  nextBillingDate: '',
  paymentMethod: 'Credit Card',
  startDate: todayStr,
  renewalType: 'Automatic',
  notes: '',
  status: 'Active'
}

export default function DashboardPage() {
  useRequireAuth()

  const [isAddEntry, setIsAddEntry] = useState(false)
  const [formData, setFormData] = useState(blankSubscription)
  const { userData, loading, token } = useAuth()
  const [editId, setEditId] = useState(null)

  function handleChangeInput(e) {
    const newData = { ...formData, [e.target.name]: e.target.value }
    setFormData(newData)
  }

  function handleEditSubscription(sub) {
    setFormData(sub)
    setEditId(sub.id)
    setIsAddEntry(true)
  }

  function handleResetForm() {
    setFormData(blankSubscription)
    setEditId(null)
  }

  function handleToggleInput() {
    setIsAddEntry(!isAddEntry)
  }

  useEffect(() => {
    if (!loading && userData?.subscriptions?.length === 0) {
      setIsAddEntry(true)
    }
  }, [loading, userData])

  if (loading && !token) return <LoadingSpinner />

  return (
    <div className='section-container'>
      <SubscriptionSummary />
      <SubscriptionsDisplay
        handleEditSubscription={handleEditSubscription}
        handleShowInput={isAddEntry ? () => {} : handleToggleInput}
      />
      {isAddEntry && (
        <SubscriptionForm
          handleResetForm={handleResetForm}
          closeInput={handleToggleInput}
          formData={formData}
          handleChangeInput={handleChangeInput}
          editId={editId}
        />
      )}
    </div>
  )
}
