import React from "react";

import { StyleSheet, View, Text, Image } from "react-native";

const OfferElement = (props) => {
  return (
    <View style={style.container}>
      <Image
        style={style.image}
        source={{
          uri: props.imageUrl,
          width: 200,
          height: 300,
        }}
      ></Image>
      <View style={style.textContainer}>
        <Text style={style.title}>{props.title}</Text>
        <Text style={style.wanted}>{`For: ${props.wanted}`}</Text>
        <View style={style.timestampView}>
          <Text style={style.timestamp}>{props.timestamp}</Text>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "20%",
    flexDirection: "row",
    backgroundColor: "lightgrey",
  },
  image: {
    flex: 1,
    width: "10%",
    height: "100%",
  },
  title: {
    fontSize: 20,
  },
  wanted: {
    fontSize: 15,
    alignItems: "flex-start",
  },
  timestampView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  timestamp: {
    fontSize: 10,
    fontStyle: "italic",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    width: "80%",
  },
});

export default OfferElement;
