import { Video } from "expo-av";
import { AllHtmlEntities } from "html-entities";
import sample from "lodash/sample";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Markdown from "react-native-markdown-renderer";
import React from "react";

const entities = new AllHtmlEntities();

const Styles = StyleSheet.create({
  embed: {
    width: 400,
    height: 400
  }
});

interface Props {
  id?: string;
}

export const Post: FunctionComponent<Props> = React.memo(({ id }) => {
  const [post, setPost] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    async function getComments() {
      const res = await fetch(
        "https://www.reddit.com/user/SchnoodleDoodleDo/comments.json?count=100&sort=new&t=all"
      );
      const data = await res.json();

      const post = !!id
        ? data.data.children.find(post => post.data.id === id)
        : sample(data.data.children);

      router.replace("/[id]", `/${post.data.id}`);

      setPost(post);
    }

    getComments();
  }, [id]);

  const isVideo = post?.data?.link_url?.startsWith("https://v.redd.it");
  const isGfycat = post?.data?.link_url?.startsWith("https://gfycat.com");
  const isImgur = post?.data?.link_url?.startsWith("https://imgur.com");
  const isImgurVideo =
    post?.data?.link_url?.startsWith("https://i.imgur.com") &&
    post?.data?.link_url?.endsWith(".gifv");

  if (!post) return null;

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: 32
      }}
    >
      <View
        style={{
          flex: 1,
          marginRight: 64,
          display: "flex",
          alignItems: "flex-end"
        }}
      >
        {isVideo ? (
          <Video
            source={{ uri: `${post.data.link_url}/DASH_360?source=fallback` }}
            style={Styles.embed}
            useNativeControls
            shouldPlay
            isMuted
            isLooping
          />
        ) : isImgur ? (
          <Image
            source={{ uri: `${post.data.link_url}.jpg` }}
            style={Styles.embed}
            resizeMode="contain"
          />
        ) : isImgurVideo ? (
          <Video
            source={{ uri: post.data.link_url.replace(".gifv", ".mp4") }}
            style={Styles.embed}
            useNativeControls
            shouldPlay
            isMuted
            isLooping
          />
        ) : isGfycat ? (
          <iframe
            src={post.data.link_url.replace(
              "https://gfycat.com/",
              "https://gfycat.com/ifr/"
            )}
            frameBorder="0"
            width="300"
            height="300"
          />
        ) : (
          <Image
            source={{ uri: post.data.link_url }}
            style={Styles.embed}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 32, marginBottom: 32 }}>
          {post.data.link_title}
        </Text>

        <Markdown
          style={{
            blockquote: {
              borderRadius: 16,
              margin: 0,
              padding: 16,
              borderWidth: 1,
              borderColor: "grey",
              backgroundColor: "transparent"
            },
            paragraph: {
              margin: 0,
              marginVertical: 8
            },
            hr: {
              backgroundColor: "#000000",
              height: 1,
              marginVertical: 16
            },
            text: {
              fontSize: 24
            }
          }}
        >
          {entities.decode(post.data.body)}
        </Markdown>
      </View>
    </View>
  );
});
