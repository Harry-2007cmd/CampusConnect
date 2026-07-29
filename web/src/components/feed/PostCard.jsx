import { colors, spacing, radius, typography } from "../../theme/tokens";
import UpvoteButton from "./UpvoteButton";

function formatPostedAt(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PostCard({ post, onUpvote, isUpvoting }) {
  return (
    <div style={styles.card}>
      <div style={styles.content}>{post.content}</div>
      <div style={styles.footerRow}>
        <span style={styles.meta}>
          {post.author_name ?? "A student"} · {formatPostedAt(post.created_at)}
        </span>
        <UpvoteButton count={post.upvote_count} onPress={onUpvote} disabled={isUpvoting} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  content: {
    fontSize: typography.size.body,
    color: colors.textPrimary,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
  },
};
