import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import sample from "lodash/sample";
import Markdown from "react-native-markdown-renderer";
import { AllHtmlEntities } from "html-entities";

const entities = new AllHtmlEntities();

export const Post = () => {
  const [post, setPost] = useState();

  useEffect(() => {
    async function getComments() {
      const res = await fetch(
        "https://www.reddit.com/user/SchnoodleDoodleDo/comments.json?count=100&sort=new&t=all"
      );
      const data = await res.json();

      setPost(sample(data.data.children));
    }

    getComments();
  }, []);

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 600,
        marginHorizontal: "auto",
        marginVertical: 32
      }}
    >
      {!!post && <Markdown>{entities.decode(post.data.body)}</Markdown>}
    </View>
  );
};
