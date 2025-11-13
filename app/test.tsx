import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Test = () => {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View>
        <Text>Test Screen</Text>
        <Button onPress={() => router.back()} title="Go back" />
      </View>
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({});
