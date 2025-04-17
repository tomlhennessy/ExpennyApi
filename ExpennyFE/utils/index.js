
// Helper function to format object keys into readable labels
export const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .replace("Upcoming Billing Dates", "Upcoming Bills (Next 7 Days)")
        .replace("Trial Ending Soon", "Trials Ending Soon")
}

export function getDaysUntilNextCharge(startDate, billingFrequency) {
    const start = new Date(startDate)
    const today = new Date()

    let nextBillingDate = new Date(start)

    if (billingFrequency === "Monthly") {
        // Add months until next charge is in the future
        while (nextBillingDate <= today) {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
        }
    } else if (billingFrequency === "Yearly") {
        // Add years until next charge is in the future
        while (nextBillingDate <= today) {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
        }
    } else if (billingFrequency === "Quarterly") {
        // Add quarters (3 months)
        while (nextBillingDate <= today) {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 3)
        }
    } else if (billingFrequency === "One-time") {
        // No recurring charges
        return "No upcoming charges"
    }

    // Calculate the number of days until next charge
    const diffTime = nextBillingDate - today
    const daysUntilNextCharge = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return daysUntilNextCharge
}

// Example Usage
// console.log(getDaysUntilNextCharge("2024-02-01", "Monthly"))  // Example output: 30

// Nicely format subscription start dates
export function formatDateReadable(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }


  export function formatCurrency(value) {
    return `$${Number(value).toFixed(2)}`
  }


