'use client'

import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function SubscriptionForm(props) {
    const { onSubmit, closeInput, formData, handleChangeInput, handleResetForm } = props
    const { handleAddSubscription } = useAuth()



    async function handleFormSubmit(e) {
        e.preventDefault();
        console.log("📤 Submitting subscription:", formData)

        try {
            await handleAddSubscription(formData)
            console.log("✅ Subscription saved")
            handleResetForm()
            closeInput()
        } catch (err) {
            console.error("❌ Error saving subscription:", err.message)
        }
    }


    return (
        <section>
            <h2>Add a new subscription</h2>

            <form onSubmit={handleFormSubmit}>
                <label>
                    <span>Subscription Name</span>
                    <input value={formData.name} onChange={handleChangeInput} type='text' name='name' placeholder='e.g. Netflix, Spotify' required />
                </label>

                <label>
                    <span>Category </span>
                    <select value={formData.category} onChange={handleChangeInput} name='category'>
                        {['Entertainment', 'Music', 'Software', 'Web Services', 'Health & Fitness', 'Other'].map((cat, catIndex) => {
                            return (
                                <option key={catIndex}>
                                    {cat}
                                </option>
                            )
                        })}
                    </select>
                </label>

                <label>
                    <span>Cost</span>
                    <input value={formData.cost} onChange={handleChangeInput} type='number' name='cost' step='0.01' placeholder='e.g. 12.00' required />
                </label>

                <label>
                    <span>Currency</span>
                    <select value={formData.currency} onChange={handleChangeInput} name='currency'>
                        {['USD', 'EUR', 'GBP', 'NZD', 'AUD', 'Other'].map((curr, currIndex) => {
                            return (
                                <option key={currIndex}>{curr}</option>
                            )
                        })}
                    </select>
                </label>

                <label>
                    <span>Billing Frequency</span>
                    <select value={formData.billingFrequency} onChange={handleChangeInput} name='billingFrequency'>
                        {['Monthly', 'Yearly', 'Quarterly', 'One-time'].map((bill, billIndex) => {
                            return (
                                <option key={billIndex}>{bill}</option>
                            )
                        })}
                    </select>
                </label>

                <label>
                    <span>Payment Method</span>
                    <select value={formData.paymentMethod} onChange={handleChangeInput} name='paymentMethod'>
                        {['Credit Card', 'Debit Card', 'Paypal', 'Bank Transfer', 'Other'].map((pay, payIndex) => {
                            return (
                                <option key={payIndex}>{pay}</option>
                            )
                        })}
                    </select>
                </label>

                <label>
                    <span>Subscription Start Date</span>
                    <input value={formData.startDate} onChange={handleChangeInput} type='date' name='startDate' required />
                </label>

                <label>
                    <span>Status</span>
                    <select value={formData.status} onChange={handleChangeInput} name='status'>
                        {['Active', 'Paused', 'Cancelled'].map((status, statusIndex) => {
                            return (
                                <option key={statusIndex}>{status}</option>
                            )
                        })}
                    </select>
                </label>

                <label className='fat-column'>
                    <span>Notes</span>
                    <textarea value={formData.notes} onChange={handleChangeInput} name='notes' placeholder='e.g. shared with family, includes cloud storage' />
                </label>

                <div className='fat-column form-submit-btns'>
                    <button onClick={closeInput}>Cancel</button>
                    <button type='submit'>
                        Add Subscription
                        </button>
                </div>

            </form>
        </section>
    )
}
