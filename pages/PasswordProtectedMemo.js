import { useState, useCallback } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { TextInput, FAB, Checkbox } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation, route }) {
  const [gotThrough, setGotThrough] = useState(false);
  const [beforeGotThroughPassword, setBeforeGotThroughPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);

  const [memo, setMemo] = useState("");
  const [title, setTitle] = useState("");
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date());

  const update = () => {
    if (title !== route.params.title) {
      updateWithChangedTitle();
    } else {
      updateWithSameTitle();
    }
  };

  const updateWithChangedTitle = async () => {
    try {
      await AsyncStorage.removeItem(route.params.title);

      await AsyncStorage.setItem(
        title,
        JSON.stringify({
          title,
          memo,
          checked,
          password,
          date: date.toLocaleDateString(),
        })
      );

      const value = await AsyncStorage.getItem("@advancedNoteTakerLists");
      const lists = JSON.parse(value ?? "[]");

      const index = lists.indexOf(route.params.title);

      lists.splice(index, 1, title);

      await AsyncStorage.setItem(
        "@advancedNoteTakerLists",
        JSON.stringify([...lists])
      );

      navigation.navigate("홈");
    } catch (e) {
      console.log(e);
    }
  };

  const updateWithSameTitle = async () => {
    try {
      await AsyncStorage.setItem(
        title,
        JSON.stringify({
          title,
          memo,
          checked,
          password,
          date: date.toLocaleDateString(),
        })
      );

      const value = await AsyncStorage.getItem("@advancedNoteTakerLists");
      const lists = JSON.parse(value ?? "[]");

      await AsyncStorage.setItem(
        "@advancedNoteTakerLists",
        JSON.stringify([...lists, title])
      );

      navigation.navigate("홈");
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        const titleKey = route.params.title;
        const memoContent = await AsyncStorage.getItem(titleKey);

        const { memo, checked, password, title, date } =
          JSON.parse(memoContent);

        setMemo(memo);
        setTitle(title);
        setChecked(checked);
        setPassword(password);
        setDate(new Date(date));
      }

      getData();
    }, [])
  );

  if (!gotThrough) {
    return (
      <View style={styles.container}>
        <TextInput
          label="암호"
          placeholder="암호를 입력하세요"
          activeUnderlineColor="white"
          mode="outlined"
          secureTextEntry
          value={beforeGotThroughPassword}
          onChangeText={setBeforeGotThroughPassword}
          style={{ marginBottom: 20 }}
        />

        <Button
          title="암호 확인하기"
          onPress={() => {
            if (beforeGotThroughPassword === route.params.password) {;
              setGotThrough(true);
            } else {
              setWrongPassword(true);
            }
          }}
        />

        {wrongPassword && <Text>암호가 틀렸습니다</Text>}
      </View>
    )
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="제목"
            placeholder="제목을 입력하세요"
            mode="flat"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={{ marginBottom: 20 }}
            numberOfLines={20}
            placeholder="메모를 입력하세요"
            activeUnderlineColor="white"
            multiline
            mode="flat"
            theme={{ roundness: 0 }}
            value={memo}
            onChangeText={setMemo}
          />

          <View style={styles.checkbox}>
            <Text>암호 사용하기</Text>
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(!checked)}
            />
          </View>

          {checked && (
            <TextInput
              label="암호"
              placeholder="암호를 입력하세요"
              activeUnderlineColor="white"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          )}
        </View>
      </ScrollView>

      <FAB label="업데이트" style={styles.fab} onPress={update} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
});
