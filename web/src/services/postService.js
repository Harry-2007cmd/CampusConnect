import { api } from "./api";

// Mirrors backend/app/routers/posts.py 1:1. Basic Feed only — no comments, no moderation (D-011).
export async function getPosts() {
  const { data } = await api.get("/posts");
  return data;
}

export async function createPost(content) {
  const { data } = await api.post("/posts", { content });
  return data;
}

export async function upvotePost(id) {
  const { data } = await api.post(`/posts/${id}/upvote`);
  return data;
}
