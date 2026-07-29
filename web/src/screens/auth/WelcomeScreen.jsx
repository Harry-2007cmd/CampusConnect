import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { colors, spacing, typography } from "../../theme/tokens";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to CampusConnect</h1>
        <p style={styles.subtitle}>
          Find rides, share updates, and connect with students at your university.
        </p>
      </div>
      <div style={styles.footer}>
        <Button title="Get Started" onPress={() => navigate("/login")} />
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
    justifyContent: "center",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    margin: 0,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    margin: 0,
  },
  footer: {
    padding: spacing.xl,
    display: "flex",
    flexDirection: "column",
  },
};
