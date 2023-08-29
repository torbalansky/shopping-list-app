import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Alert, TextInput } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
  const auth = getAuth();
  const [userName, setUserName] = useState("");

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("ShoppingLists", { userID: result.user.uid, userName: userName });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <View style={styles.container}>
        <ImageBackground source={require('../background.jpg')} style={styles.image}>
          <Text style={styles.appTitle}>Shopping Planner</Text>
          <View style={styles.innerContainer}>
          <TextInput
          style={styles.input}
          placeholder="Enter you name"
          value={userName}
          onChangeText={setUserName}
          />
          <TouchableOpacity style={styles.startButton} onPress={signInUser}>
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  innerContainer: {
    width: '88%',
    height: '40%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .1)',
    borderRadius: 5
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 50,
    marginTop: 100
  },
  startButton: {
    backgroundColor: "#3498db",
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center", 
    borderRadius: 4
  },
  startButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20
  },
  input:{
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: "#000",
    width: "80%",
    marginTop: 30,
    marginBottom: 40,
    padding: 10
  },
  image: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
});

export default Welcome;