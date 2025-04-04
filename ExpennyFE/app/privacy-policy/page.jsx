import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
    <section>

      <div className="legal-page">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 1, 2025</p>

        <p>
          Expenny respects your privacy. We do not share or sell your personal information.
          This app stores subscription data using Firebase, which adheres to industry-standard security practices.
        </p>

        <p>We collect your email and subscription entries for your personal use only.</p>
        <p>
          You may delete your account and all associated data at any time by contacting us via the help form.
        </p>

        <p>For any concerns, please reach out via the <a href="https://docs.google.com/forms/d/e/1FAIpQLScdnBBf51r8BrK3Y7wPnietEzYxcyHZQn315iMf9LI44Fjnsg/viewform?usp=header">Get Help</a> form.</p>

        <Link href={'/'}>
        <button>Home</button>
        </Link>

        </div>
    </section>

    )
  }
