import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "Home", drawerLabel: "Home" }}
      />

      <Drawer.Screen
        name="settings"
        options={{ title: "Settings", drawerLabel: "Settings" }}
      />
    </Drawer>
  );
}
