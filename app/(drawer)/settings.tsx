import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function SettingScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home inside Drawer</Text>
      {/* <Button title="Go to Settings" onPress={() => router.push("/(drawer)/settings")} /> */}
    </View>
  );
}
