import React from 'react';

const DeleteAccountPolicy = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Delete Account Policy</h1>

      <section style={styles.section}>
        <h2>1. Introduction</h2>
        <p>
          At <strong>Syopi</strong>, we are committed to protecting your privacy and giving you control over your personal information.
          This Delete Account Policy outlines the process, consequences, and your rights when you choose to delete your account from our platform.
        </p>
      </section>

      <section style={styles.section}>
        <h2>2. Information We Collect</h2>
        <p>When you register or use Syopi, we may collect and store the following information:</p>
        <ul>
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>Encrypted Password</li>
          <li>Google Authentication Key (for secure login)</li>
          <li>Order History</li>
          <li>Vendor-related details (if applicable)</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2>3. How to Delete Your Account</h2>
        <p>
          You can request to delete your account by navigating to:
          <strong> Account &gt; More &gt; Delete Account</strong>
        </p>
        <p>After confirming the deletion, your account and associated data will be permanently removed.</p>
      </section>

      <section style={styles.section}>
        <h2>4. What Happens After Deletion</h2>
        <p>Once your account is deleted:</p>
        <ul>
          <li>Your personal data (name, email, phone, etc.) will be permanently erased from our active systems.</li>
          <li>Your login credentials and Google authentication key will be revoked.</li>
          <li>Your order and vendor history may be anonymized or retained for legal compliance.</li>
          <li>Any retained data will be securely stored and minimized.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2>5. Data Retention Exceptions</h2>
        <p>Some information may be retained even after account deletion:</p>
        <ul>
          <li>To comply with legal, tax, or regulatory requirements</li>
          <li>For fraud prevention and dispute resolution</li>
          <li>As required by our internal auditing policies</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2>6. Irreversibility</h2>
        <p>
          Please note: <strong>Account deletion is irreversible.</strong> If you wish to use Syopi again, you will need to register a new account.
        </p>
      </section>

      <section style={styles.section}>
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding account deletion, please contact our support team:
        </p>
        <p>
          📧 <a href="mailto:syopi5051@gmail.com" style={styles.link}>syopi5051@gmail.com</a>
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    lineHeight: '1.6',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  heading: {
    color: '#222',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  section: {
    marginBottom: '30px',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default DeleteAccountPolicy;
