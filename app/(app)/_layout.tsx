import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{ headerShown: true, title: "home" }}
      />
      <Drawer.Screen name="settings" options={{ title: "setting" }} />
    </Drawer>
  );
}
