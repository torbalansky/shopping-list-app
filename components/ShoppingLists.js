import { useEffect, useState } from "react";
import {
  StyleSheet, View, FlatList, Text,
  TextInput, KeyboardAvoidingView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ShoppingLists = ({ db, route, isConnected }) => {
  const { userID, userName } = route.params;
  const navigation = useNavigation();
  const auth = getAuth();

  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const [item3, setItem3] = useState("");

  let unsubShoppinglists;

  useEffect(() => {

    if (isConnected === true) {

      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubShoppinglists) unsubShoppinglists();
      unsubShoppinglists = null;

      const q = query(collection(db, "shoppinglists"), where("uid", "==", userID));
      unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
        let newLists = [];
        documentsSnapshot.forEach(doc => {
          newLists.push({ id: doc.id, ...doc.data() })
        });
        cacheShoppingLists(newLists);
        setLists(newLists);
      });
    } else loadCachedLists();

    // Clean up code
    return () => {
      if (unsubShoppinglists) unsubShoppinglists();
    }
  }, [isConnected]);

  const loadCachedLists = async () => {
    const cachedLists = await AsyncStorage.getItem("shopping_lists") || [];
    setLists(JSON.parse(cachedLists));
  }

  const cacheShoppingLists = async (listsToCache) => {
    try {
      await AsyncStorage.setItem('shopping_lists', JSON.stringify(listsToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const addShoppingList = async (newList) => {
    const newListRef = await addDoc(collection(db, "shoppinglists"), newList);
    if (newListRef.id) {
      setLists([newList, ...lists]);
      Alert.alert(`The list "${listName}" has been added.`);
    } else {
      Alert.alert("Unable to add. Please try later");
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Welcome");
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Shopping Planner",
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, []); 

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{userName}'s Shopping List</Text> 
      <FlatList
        style={styles.listsContainer}
        data={lists}
        renderItem={({ item }) =>
          <View style={styles.listItem}>
            <Text >{item.name}: {item.items.join(', ')}</Text>
          </View>
        }
      />
      {(isConnected === true) ?
        <View style={styles.listForm}>
          <TextInput
            style={styles.listName}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #1"
            value={item1}
            onChangeText={setItem1}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #2"
            value={item2}
            onChangeText={setItem2}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #3"
            value={item3}
            onChangeText={setItem3}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newList = {
                uid: userID,
                name: listName,
                items: [item1, item2, item3]
              }
              addShoppingList(newList);
            }}
          >
            <Text style={styles.addButtonText}>Add item</Text>
          </TouchableOpacity>
        </View> : null
      }

      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  listItem: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    flex: 1,
    flexGrow: 1
  },
  listForm: {
    flexBasis: 280,
    flex: 0,
    margin: 5,
    padding: 10,
    backgroundColor: "#FFF3CC",
    borderRadius: 4
  },
  listName: {
    width: 200,
    height: 40,
    padding: 10,
    fontWeight: "600",
    marginBottom: 10,
    borderColor: "#555",
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 4
  },
  item: {
    width: 280,
    height: 40,
    padding: 10,
    marginLeft: 30,
    marginBottom: 10,
    borderColor: "#555",
    borderWidth: 1,
    backgroundColor: "#FFF", 
    borderRadius: 4
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#3CB371",
    borderRadius: 4
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20
  },
  logoutButton: {
    backgroundColor: "#FF5733",
    padding: 5,
    borderRadius: 4,
    zIndex: 1
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 20
  },
  userName: {
    fontWeight: "600",
    fontSize: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    backgroundColor: "#ADD8E6",
  },
  headerTitle: {
    textAlign: "right"
  }
});

export default ShoppingLists;