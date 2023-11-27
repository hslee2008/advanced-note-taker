import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { FAB, Searchbar } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import SavedItem from "../components/SavedItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const [lists, setLists] = useState([]);
  const [passwordList, setPasswordList] = useState([]);
  const [password, setPassword] = useState([]);
  const [date, setDate] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, []);

  const getData = async () => {
    const value = await AsyncStorage.getItem("@advancedNoteTakerLists");
    const json = JSON.parse(value ?? "[]");

    json.forEach((list) => {
      AsyncStorage.getItem(list).then((value) => {
        const json = JSON.parse(value);

        if (json === null) {
          AsyncStorage.removeItem(list);
          return;
        }

        if (json.password !== "") {
          setPasswordList((passwordList) => [...passwordList, list]);
          setPassword((password) => [...password, json.password]);
        }

        setDate((date) => [...date, json.date]);
      });
    });

    if (value !== null) setLists(JSON.parse(value));
  };

  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <>
      <View style={{ margin: 15 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Searchbar
            placeholder="Search"
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
          />

          {lists.length == 0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.headerMessage}>저장한 메모가 없습니다</Text>
            </View>
          ) : lists.filter((title) => title.includes(searchQuery)).length ===
            0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.headerMessage}>메모를 찾을 수 없습니다</Text>
            </View>
          ) : (
            <>
              {lists
                .filter((title) => title.includes(searchQuery))
                .map((listTitle, i) => (
                  <Pressable
                    key={i}
                    android_ripple={{ color: "lightgray" }}
                    onPress={() => {
                      if (passwordList.includes(listTitle)) {
                        navigation.navigate({
                          name: "암호 메모",
                          params: {
                            title: listTitle,
                            password: password[passwordList.indexOf(listTitle)],
                          },
                        });
                      } else {
                        navigation.navigate({
                          name: "메모",
                          params: { title: listTitle },
                        });
                      }
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <SavedItem
                        listTitle={listTitle}
                        date={date[i]}
                        passwordList={passwordList}
                        navigation={navigation}
                        getData={getData}
                      />
                    </View>
                  </Pressable>
                ))}
            </>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("새로운 메모")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    margin: 16,
  },
  headerMessage: {
    fontSize: 20,
  },
  messageContainer: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
