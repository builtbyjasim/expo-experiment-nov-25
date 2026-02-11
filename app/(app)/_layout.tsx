import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{ headerShown: true, title: "Home" }}
      />
      <Drawer.Screen name="settings" options={{ title: "Setting" }} />
    </Drawer>
  );
}
