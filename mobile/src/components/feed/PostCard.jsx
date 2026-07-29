import { View, Text, StyleSheet } from "react-native";
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
    <View style={styles.card}>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.footerRow}>
        <Text style={styles.meta}>
          {post.author_name ?? "A student"} · {formatPostedAt(post.created_at)}
        </Text>
        <UpvoteButton count={post.upvote_count} onPress={onUpvote} disabled={isUpvoting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  content: {
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
  },
});
