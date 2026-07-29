import { useCallback, useEffect, useState } from "react";
import { colors, spacing, typography } from "../../theme/tokens";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import PostCard from "../../components/feed/PostCard";
import { getPosts, createPost, upvotePost } from "../../services/postService";

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [draft, setDraft] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [upvotingId, setUpvotingId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getPosts();
      setPosts(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePost() {
    const content = draft.trim();
    if (!content) return;

    setIsPosting(true);
    try {
      await createPost(content);
      setDraft("");
      await load();
    } catch (err) {
      window.alert("Couldn't post. Please try again in a moment.");
    } finally {
      setIsPosting(false);
    }
  }

  async function handleUpvote(id) {
    setUpvotingId(id);
    try {
      const updated = await upvotePost(id);
      setPosts((current) => current.map((post) => (post.id === id ? updated : post)));
    } catch (err) {
      window.alert("Couldn't upvote. Please try again in a moment.");
    } finally {
      setUpvotingId(null);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Campus Feed</h1>

      <div style={styles.composer}>
        <TextField
          placeholder="Share something with your campus..."
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <Button title="Post" onPress={handlePost} loading={isPosting} disabled={!draft.trim()} />
      </div>

      {status === "loading" ? (
        <Loader label="Loading feed..." />
      ) : status === "error" ? (
        <EmptyState
          tone="error"
          title="Couldn't load the feed"
          message="Something went wrong on our end. Please try again."
          actionLabel="Retry"
          onAction={load}
        />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          message="Be the first to share something with your campus."
        />
      ) : (
        <div style={styles.list}>
          {posts.map((item) => (
            <PostCard
              key={item.id}
              post={item}
              onUpvote={() => handleUpvote(item.id)}
              isUpvoting={upvotingId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    overflowY: "auto",
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    margin: 0,
    marginBottom: spacing.md,
  },
  composer: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
};
