import Link from "next/link";

export default function TermsPage() {
    return (
    <section>
      <div className='legal-page'>
        <h1>Terms of Service</h1>
        <p>Last updated: April 1, 2025</p>

        <p>
          By using Expenny, you agree not to use the app for any illegal activity or to abuse the service.
          Your data is stored securely in Firebase and is only accessible to you.
        </p>

        <p>
          We may update these terms occasionally, and continued use of the app indicates your acceptance of those updates.
        </p>

        <p>
          We are not liable for data loss, misuse, or unintended consequences of using the app.
          This is a personal finance tool intended for informational purposes.
        </p>
        <Link href={'/'}>
                <button>Home</button>
        </Link>
      </div>
    </section>
    )
  }
