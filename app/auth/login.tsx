import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Login = () => {
  const router = useRouter();
  console.log("login-->", router.canGoBack());
  return (
    <View>
      <Button
        onPress={() => router.navigate("/auth/signup")}
        title="go to signup"
      />
      <Text>login</Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
