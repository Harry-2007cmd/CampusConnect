import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { useAuth } from "../../hooks/useAuth";
import { colors, spacing, typography } from "../../theme/tokens";

export default function EmailEntryScreen() {
  const navigate = useNavigate();
  const { sendOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleContinue() {
    setError(null);
    if (!email.trim().endsWith(".edu")) {
      setError("Please enter your university (.edu) email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(email.trim());
      navigate("/verify", { state: { email: email.trim() } });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>What's your university email?</h1>
        <p style={styles.subtitle}>We'll send you a one-time code to verify it's you.</p>

        <div style={styles.form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) handleContinue();
            }}
          >
            <TextField
              label="Email"
              placeholder="you@university.edu"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              error={error}
            />
          </form>
        </div>
      </div>
      <div style={styles.footer}>
        <Button
          title="Send Code"
          onPress={handleContinue}
          loading={isSubmitting}
          disabled={!email.trim()}
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
