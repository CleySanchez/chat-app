import {StyleSheet, LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
import Start from './components/Start';
import Chat from './components/Chat';
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {disableNetwork} from "firebase/firestore";
import {enableNetwork} from "firebase/firestore";
import {useEffect} from "react";
import {Alert} from "react-native";
import {useNetInfo} from "@react-native-community/netinfo";

const App = () => {
const firebaseConfig = {
  apiKey: "AIzaSyD7CqyMOEGU96r_grt4vFpRu--yuJ6ZtMg",
  authDomain: "chatapp-2e7ec.firebaseapp.com",
  projectId: "chatapp-2e7ec",
  storageBucket: "chatapp-2e7ec.appspot.com",
  messagingSenderId: "524837702452",
  appId: "1:524837702452:web:ff3aa44fd893875f08b361",
  measurementId: "G-ZHPHKP1TCM"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app);

const Stack = createNativeStackNavigator();

const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

return (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Start"
    >
      <Stack.Screen
        name="Start"
        component={Start}
      />
      <Stack.Screen
        name="Chat"
      >
          {(props) => ( 
          <Chat
           db={db}
           storage={storage}
           isConnected={connectionStatus.isConnected}
           {...props}
          />
          )}

      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);
}
const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
});
export default App;