import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { TextInput, FAB, Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation, route }) {
  const [memo, setMemo] = useState("");
  const [title, setTitle] = useState("");
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date());

  const save = async () => {
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
  };

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

      <FAB label="저장" style={styles.fab} onPress={save} />
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
