import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import LayoutWithControlBar from "../../components/LayoutWithControlBar";
import WantedElement from "../../components/WantedElement";
import {
  doc,
  setDoc,
  getFirestore,
  Timestamp,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { database } from "../../../firebase";
import getBooksFromApi from "../../utils/getBooksFromApi";
import { auth } from "../../../firebase";
import uuid from "react-native-uuid";

const WantedScreen = () => {
  const db = getFirestore();
  const [wanted, setWanted] = useState([]);
  const [barcode, setBarcode] = useState("BRAK");
  const navigation = useNavigation();
  const [wantedTitle, setWantedTitle] = useState("");
  const [wantedAuthors, setWantedAuthors] = useState("");
  const [id] = useState(uuid.v1());

  useEffect(() => {
    const collectionRef = collection(database, "wanted");
    const q = query(
      collectionRef,
      orderBy("timestamp", "desc"),
      where("user", "==", auth.currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setWanted(
        querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          id: doc.id,
          user: doc.data().user,
          author: doc.data().authors,
          timestamp: doc.data().timestamp.toDate(),
        }))
      );
      console.log("Updated");
    });

    return unsubscribe;
  }, []);

  const handleScanner = () => {
    setBarcode("");
    navigation.navigate("ScannerScreen", { setBarcode: setBarcode });
  };

  const handleAddWanted = () => {
    if (!wantedTitle) {
      return;
    }
    console.log("Uploading");
    const wantedData = {
      title: wantedTitle,
      authors: wantedAuthors,
      isbn: barcode,
      user: auth.currentUser?.email,
      timestamp: Timestamp.now().toDate(),
    };
    console.log("Wanted data: " + JSON.stringify(wantedData));
    setDoc(doc(db, "wanted", id), wantedData);
    navigation.navigate("OffersScreen");
  };
  useEffect(() => {
    if (!!barcode) {
      console.log(barcode);
      getBooksFromApi(barcode).then((d) => {
        try {
          setWantedTitle(d["volumeInfo"]["title"]);
        } catch (e) {
          console.log(e);
        }
        try {
          setWantedAuthors(
            d["volumeInfo"]["authors"].map((item) => item).join(", ")
          );
        } catch (e) {
          console.log(e);
        }
      });
    }
  }, [barcode]);

  return (
    <LayoutWithControlBar>
      <>
        <Text style={style.textdetail}>Dodawaj poszukiwaną pozycję</Text>
        <TouchableOpacity style={style.scannerButton} onPress={handleScanner}>
          <Icon name="barcode" color="white" style={style.icon} />
          <Text style={[{ fontSize: 15 }]}>Zeskanuj kod</Text>
        </TouchableOpacity>
        <Text style={style.textdetail}>{"ISBN: " + barcode}</Text>
        <Text style={style.textdetail}>{"Tytuł: " + wantedTitle}</Text>
        <Text style={style.textdetail}>{"Autorzy: " + wantedAuthors}</Text>
        <TouchableOpacity style={style.button} onPress={handleAddWanted}>
          <Text>DODAJ</Text>
        </TouchableOpacity>
      </>
      <View style={style.scrollViewContainter}>
        <FlatList
          data={wanted}
          renderItem={(props) => {
            return <WantedElement {...props} />;
          }}
          keyExtractor={(item) => item.timestamp}
        />
      </View>
    </LayoutWithControlBar>
  );
};

const style = StyleSheet.create({
  searchBar: {
    width: "100%",
    height: "10%",
  },
  scrollableContent: {
    width: "100%",
    height: "100%",
    flexShrink: 1,
  },
  scrollViewContainter: {
    flexDirection: "column",
    height: "60%",
    width: "100%",
  },
  icon: {
    fontSize: 40,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "60%",
    flexDirection: "row",
    backgroundColor: "lightgrey",
  },
  textdetail: {
    fontSize: 20,
    alignSelf: "stretch",
    backgroundColor: "gray",
    borderRadius: 8,
    marginTop: 3,
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
  button: {
    backgroundColor: "green",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  scannerButton: {
    backgroundColor: "green",
    width: "50%",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
});

export default WantedScreen;
