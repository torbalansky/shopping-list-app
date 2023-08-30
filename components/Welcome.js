import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Alert, TextInput, KeyboardAvoidingView } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
  const auth = getAuth();
  const [userName, setUserName] = useState("");
  const [color, setColor] = useState("#FFF");
  const [selected, setSelected] = useState(null);
  
  const getColorStyle = (color) => {
    return {
      width: 40,
      height: 40,
      borderRadius: 30,
      borderColor: color === selected ? 'blue' : 'transparent',
      borderWidth: color === selected ? 3 : 0
    }
  }
  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("ShoppingLists", { userID: result.user.uid, userName: userName, color });
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
          <Text style={styles.colorText}>Choose Background Color</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity 
              style={[getColorStyle('#C7EFCF'), { backgroundColor: '#C7EFCF' }]}
              onPress={() => {
                setColor('#C7EFCF')
                setSelected('#C7EFCF')
              }}
            />
            <TouchableOpacity 
              style={[getColorStyle('#FFDBE6'), { backgroundColor: '#FFDBE6' }]}
              onPress={() => {
                setColor('#FFDBE6')
                setSelected('#FFDBE6')
              }}
            />
            <TouchableOpacity 
              style={[getColorStyle('#E4EBF1'), { backgroundColor: '#E4EBF1' }]}
              onPress={() => {
                setColor('#E4EBF1')
                setSelected('#E4EBF1')
              }}
            />
          </View>
          <TouchableOpacity style={styles.startButton} onPress={signInUser}>
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
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
    height: '38%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderRadius: 4
  },
  colorContainer: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20
  },
  colorText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold"
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 30,
    marginTop: 40
  },
  startButton: {
    backgroundColor: "#3498db",
    height: 50,
    width: "60%",
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
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 4
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