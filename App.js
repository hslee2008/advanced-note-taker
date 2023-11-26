import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./pages/Home";
import NewMemo from "./pages/NewMemo";
import Memo from "./pages/Memo";
import PasswordProtectedMemo from "./pages/PasswordProtectedMemo";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="홈" component={Home} />
        <Stack.Screen name="새로운 메모" component={NewMemo} />
        <Stack.Screen name="메모" component={Memo} />
        <Stack.Screen name="암호 메모" component={PasswordProtectedMemo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
