import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Menu, IconButton } from "react-native-paper";

export default function SavedItem({
  listTitle,
  date,
  passwordList,
  navigation,
  getData,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const DeleteItem = async () => {
    const value = await AsyncStorage.getItem("@advancedNoteTakerLists");
    const lists = JSON.parse(value ?? "[]");

    const index = lists.indexOf(listTitle);

    await AsyncStorage.removeItem(lists[index]);

    lists.splice(index, 1);

    await AsyncStorage.setItem(
      "@advancedNoteTakerLists",
      JSON.stringify([...lists])
    );

    getData();

    setShowMenu(false);
  };

  const Edit = () => {
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

    setShowMenu(false);
  };

  return (
    <>
      <List.Item
        title={listTitle}
        description={date}
        left={(inner_props) => <List.Icon {...inner_props} icon="file" />}
      />

      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={
          <IconButton onPress={() => setShowMenu(true)} icon="dots-vertical" />
        }
      >
        <Menu.Item leadingIcon="pencil" onPress={Edit} title="편집" />
        <Menu.Item leadingIcon="delete" onPress={DeleteItem} title="삭제" />
      </Menu>
    </>
  );
}
