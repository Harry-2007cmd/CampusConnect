import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { useAuth } from "../../hooks/useAuth";
import { colors, spacing, typography } from "../../theme/tokens";

// Hackathon scope (D-011): no resend cooldown or attempt lockout.
export default function OtpEntryScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { confirmOtp } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reached without an email in navigation state (e.g. refresh / deep link) — start over.
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  async function handleVerify() {
    setError(null);
    setIsSubmitting(true);
    try {
      await confirmOtp(email, code.trim());
      // App-level routing watches auth state and routes to ProfileSetup/Main automatically.
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Enter the code</h1>
        <p style={styles.subtitle}>We sent a 6-digit code to {email}.</p>

        <div style={styles.form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim().length === 6) handleVerify();
            }}
          >
            <TextField
              label="Verification code"
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              error={error}
            />
          </form>
        </div>
      </div>
      <div style={styles.footer}>
        <Button
          title="Verify"
          onPress={handleVerify}
          loading={isSubmitting}
          disabled={code.trim().length !== 6}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    margin: 0,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    margin: 0,
    marginBottom: spacing.lg,
  },
  form: {
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.xl,
    display: "flex",
    flexDirection: "column",
  },
};
