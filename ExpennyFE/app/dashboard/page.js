'use client'

import LoadingSpinner from "@/components/LoadingSpinner"
import SubscriptionForm from "@/components/SubscriptionForm"
import SubscriptionsDisplay from "@/components/SubscriptionsDisplay"
import SubscriptionSummary from "@/components/SubscriptionSummary"
import { useAuth } from "@/context/AuthContext"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useState } from "react"

const blankSubscription = {
  name: '',
  category: 'Web Services',
  cost: '',
  currency: 'USD',
  billingFrequency: 'Monthly',
  nextBillingDate: '',
  paymentMethod: 'Credit Card',
  startDate: '',
  renewalType: '',
  notes: '',
  status: 'Active'
}

export default function DashboardPage() {
  useRequireAuth()

  const [isAddEntry, setIsAddEntry] = useState(false)
  const [formData, setFormData] = useState(blankSubscription)
  const { handleDeleteSubscription, userData, currentUser, loading } = useAuth()
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

  if (loading) return <LoadingSpinner />

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
