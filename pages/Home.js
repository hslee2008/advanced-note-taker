import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { List, FAB, Menu } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const [lists, setLists] = useState([]);
  const [passwordList, setPasswordList] = useState([]);
  const [password, setPassword] = useState([]);
  const [date, setDate] = useState([]);

  const [showMenu, setShowMenu] = useState(false);
  const [itemLongPressed, setItemLongPressed] = useState({});
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@advancedNoteTakerLists");
      const json = JSON.parse(value ?? "[]");

      json.forEach((list) => {
        AsyncStorage.getItem(list).then((value) => {
          const json = JSON.parse(value);

          if (json.password !== "") {
            setPasswordList((passwordList) => [...passwordList, list]);
            setPassword((password) => [...password, json.password]);
          }

          setDate([...date, json.date]);
        });
      });

      if (value !== null) setLists(JSON.parse(value));
    } catch (e) {
      setError(e);
    }
  };

  const DeleteItem = async () => {
    try {
      const value = await AsyncStorage.getItem("@advancedNoteTakerLists");
      const lists = JSON.parse(value ?? "[]");

      const index = lists.indexOf(itemLongPressed);

      await AsyncStorage.removeItem(lists[index]);

      lists.splice(index, 1);

      await AsyncStorage.setItem(
        "@advancedNoteTakerLists",
        JSON.stringify([...lists])
      );

      getData();
    } catch (e) {
      setError(e);
    }
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {lists.length == 0 ? (
          <View>
            <Text>저장한 메모가 없습니다</Text>
          </View>
        ) : (
          <>
            {lists.map((listTitle, i) => (
              <Pressable
                key={i}
                android_ripple={{ color: "lightgray" }}
                onLongPress={(evt) => {
                  setShowMenu(true);
                  setItemLongPressed(listTitle);
                  setCoord({
                    x: evt.nativeEvent.locationX,
                    y: evt.nativeEvent.locationY,
                  });
                }}
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
                <List.Item
                  title={listTitle}
                  description={date[i]}
                  left={(props) => <List.Icon {...props} icon="file" />}
                />
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>

      {showMenu && (
        <View
          style={{
            ...styles.menu,
            top: coord.y,
            left: coord.x,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <Menu.Item
            leadingIcon="arrow-up-down"
            onPress={() => {}}
            title="움직이기"
          />
          <Menu.Item
            leadingIcon="pencil"
            onPress={() => {
              navigation.navigate({
                name: "메모",
                params: { title: itemLongPressed },
              });
              setShowMenu(false);
            }}
            title="편집"
          />
          <Menu.Item
            leadingIcon="delete"
            onPress={() => {
              DeleteItem();
              setShowMenu(false);
            }}
            title="석제"
          />
          <Menu.Item
            leadingIcon="close"
            onPress={() => {
              setShowMenu(false);
            }}
            title="닫기"
          />
        </View>
      )}

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
});
