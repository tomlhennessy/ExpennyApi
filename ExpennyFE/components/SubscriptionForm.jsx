'use client'

import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function SubscriptionForm({ closeInput, formData, handleChangeInput, handleResetForm, editId }) {
  const { handleAddSubscription, handleUpdateSubscription, loading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  if (loading) return <LoadingSpinner />

  async function handleFormSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.name || !formData.cost || !formData.startDate) {
      setError("Please fill out all required fields.")
      return
    }

    setSubmitting(true)

    try {
      if (editId) {
        await handleUpdateSubscription(editId, formData)
        setSuccess("✅ Subscription updated successfully!")
      } else {
        await handleAddSubscription(formData)
        setSuccess("✅ Subscription added successfully!")
      }

      handleResetForm()
      closeInput()
    } catch (err) {
      console.error("❌ Error submitting:", err.message)
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2>{editId ? "Edit Subscription" : "Add a New Subscription"}</h2>

      {error && <p className="alert-error">{error}</p>}
      {success && <p className="alert-success">{success}</p>}

      <form onSubmit={handleFormSubmit}>
        <label>
          <span>Subscription Name</span>
          <input value={formData.name} onChange={handleChangeInput} type='text' name='name' placeholder='e.g. Netflix, Spotify' required />
        </label>

        <label>
          <span>Category</span>
          <select value={formData.category} onChange={handleChangeInput} name='category'>
            {['Entertainment', 'Music', 'Software', 'Web Services', 'Health & Fitness', 'Other'].map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Cost</span>
          <input value={formData.cost} onChange={handleChangeInput} type='number' name='cost' step='0.01' placeholder='e.g. 12.00' required />
        </label>

        <label>
          <span>Currency</span>
          <select value={formData.currency} onChange={handleChangeInput} name='currency'>
            {['USD', 'EUR', 'GBP', 'NZD', 'AUD', 'Other'].map((curr, i) => (
              <option key={i}>{curr}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Billing Frequency</span>
          <select value={formData.billingFrequency} onChange={handleChangeInput} name='billingFrequency'>
            {['Monthly', 'Yearly', 'Quarterly'].map((freq, i) => (
              <option key={i}>{freq}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Payment Method</span>
          <select value={formData.paymentMethod} onChange={handleChangeInput} name='paymentMethod'>
            {['Credit Card', 'Debit Card', 'Paypal', 'Bank Transfer', 'Other'].map((method, i) => (
              <option key={i}>{method}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Renewal Type</span>
          <select value={formData.renewalType} onChange={handleChangeInput} name='renewalType'>
            {['Automatic', 'Manual'].map((type, i) => (
              <option key={i}>{type}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Subscription Start Date</span>
          <input value={formData.startDate} onChange={handleChangeInput} type='date' name='startDate' required />
        </label>

        <label>
          <span>Status</span>
          <select value={formData.status} onChange={handleChangeInput} name='status'>
            {['Active', 'Paused', 'Cancelled'].map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>
        </label>

        <label className='fat-column'>
          <span>Notes</span>
          <textarea value={formData.notes} onChange={handleChangeInput} name='notes' placeholder='e.g. shared with family, includes cloud storage' />
        </label>

        <div className='fat-column form-submit-btns'>
          <button type='button' onClick={closeInput}>Cancel</button>
          <button type='submit' disabled={submitting}>
            {submitting ? "Submitting..." : editId ? "Update Subscription" : "Add Subscription"}
          </button>
        </div>
      </form>
    </section>
  )
}
