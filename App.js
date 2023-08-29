// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

// import the screens
import ShoppingLists from './components/ShoppingLists';
import Welcome from './components/Welcome';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

import { Alert, LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();
  const firebaseConfig = {
    apiKey: "AIzaSyBiF-YxO3QfDty-2-wz3AjHePxWYZkoMl8",
    authDomain: "shoppinglist-32177.firebaseapp.com",
    projectId: "shoppinglist-32177",
    storageBucket: "shoppinglist-32177.appspot.com",
    messagingSenderId: "922811494277",
    appId: "1:922811494277:web:a5f8ba21a58617b52b5eec"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen
          name="ShoppingLists"
        >
          {props => <ShoppingLists isConnected={connectionStatus.isConnected} db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;