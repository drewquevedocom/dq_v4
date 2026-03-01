type JesperLeadMagnetEmailProps = {
  downloadUrl: string;
  recipientEmail: string;
};

const styles = {
  body: {
    margin: 0,
    padding: "24px",
    backgroundColor: "#0b0b0f",
    color: "#f8f8f8",
    fontFamily: "Outfit, Inter, Arial, sans-serif",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    border: "1px solid #26272f",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "#12131a",
  },
  header: {
    padding: "24px",
    background: "linear-gradient(135deg, #101117 0%, #1c1d28 100%)",
    borderBottom: "1px solid #26272f",
  },
  brand: {
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#8b92a8",
  },
  title: {
    margin: "8px 0 0",
    fontSize: "28px",
    lineHeight: "1.2",
    color: "#ffffff",
  },
  content: {
    padding: "24px",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#d7daea",
  },
  buttonWrap: {
    margin: "24px 0",
  },
  button: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "10px",
    backgroundColor: "#18e0a1",
    color: "#04110d",
    fontWeight: 700,
    textDecoration: "none",
  },
  footer: {
    marginTop: "16px",
    color: "#8b92a8",
    fontSize: "13px",
  },
};

export default function JesperLeadMagnetEmail({
  downloadUrl,
  recipientEmail,
}: JesperLeadMagnetEmailProps) {
  return (
    <html>
      <body style={styles.body}>
        <div style={styles.container}>
          <div style={styles.header}>
            <p style={styles.brand}>Jesper Growth Engine</p>
            <h1 style={styles.title}>Your 7-Agent Framework PDF</h1>
          </div>
          <div style={styles.content}>
            <p>Thanks for connecting with Jarvis.</p>
            <p>
              Here is your copy of the <strong>7-Agent Framework PDF</strong>.
              It breaks down the exact operating model behind AgentIQAgents.
            </p>
            <div style={styles.buttonWrap}>
              <a href={downloadUrl} style={styles.button}>
                Download the PDF
              </a>
            </div>
            <p>
              Sent to: <strong>{recipientEmail}</strong>
            </p>
            <p style={styles.footer}>
              - Jesper Team
              <br />
              Drew Quevedo | AgentIQAgents
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
