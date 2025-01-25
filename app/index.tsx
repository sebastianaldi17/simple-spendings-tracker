import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { View, Text, Button, StyleSheet } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.replace("/(tabs)/get-spendings");
    }
  });

  const handleLogin = async () => {
    await signInAnonymously(auth);
    router.replace("/(tabs)/get-spendings");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat datang!</Text>
      <Button
        title="Log In"
        onPress={async () => {
          await handleLogin();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
