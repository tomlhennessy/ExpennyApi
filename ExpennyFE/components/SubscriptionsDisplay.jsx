'use client'

import { useAuth } from "@/context/AuthContext"
import { formatDateReadable, getDaysUntilNextCharge } from "@/utils"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function SubscriptionsDisplay({ handleShowInput, handleEditSubscription }) {
  const { userData, handleDeleteSubscription, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!userData?.subscriptions?.length) {
    return (
      <section>
        <h2>Your Subscriptions</h2>
        <div className="card-container">
          <div className='card subscription-card'>
            <h5>You haven&apos;t added any subscriptions yet.</h5>
          </div>
          <button onClick={handleShowInput} className='button-card add-subscriptions'>
            <i className='fa-solid fa-plus'></i>
            <h5>Add your first subscription</h5>
          </button>
        </div>
      </section>
    )
  }


  return (
    <section>
      <h2>Your Subscriptions</h2>
      <div className='card-container'>
        {userData.subscriptions.map((sub) => {
          const { name, category, cost, currency, billingFrequency, startDate, notes, status } = sub

          return (
            <div key={sub.id} className='card subscription-card'>
              <div>
                <h3>{name}</h3>
                <div className={'status ' + (status === 'Active' ? 'card-button-primary' : 'card-button-secondary')}>
                  <small>{status}</small>
                </div>
              </div>

              <p><i>{category}</i></p>

              <div className='sub-cost'>
                <h2>${cost}</h2>
                <p>{currency}</p>
              </div>

              <small>per {billingFrequency}</small>

              <div className="sub-renewal">
                <div>
                  <p>Started</p>
                  <h4>{formatDateReadable(startDate)}</h4>
                </div>
                <div>
                  <p>Due</p>
                  <h4>{getDaysUntilNextCharge(startDate, billingFrequency)} days</h4>
                </div>
              </div>

              <div className="white-line" />
              <p>{notes}</p>

              <div className="subscription-actions">
                <button onClick={() => handleEditSubscription(sub)} className="button-card">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button onClick={() => handleDeleteSubscription(sub.id)} className="button-card">
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          )
        })}
        <button onClick={handleShowInput} className='button-card add-subscriptions'>
          <i className='fa-solid fa-plus'></i>
          <h5>Add new subscription</h5>
        </button>
      </div>
    </section>
  )
}
