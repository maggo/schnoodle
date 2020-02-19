import { useRouter } from "next/router";
import React from "react";
import { Post } from "../components/Post";

export default function PostPage() {
  const router = useRouter();

  return router.query.id ? <Post id={router.query.id?.toString()} /> : null;
}
