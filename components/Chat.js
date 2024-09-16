import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

// Chat component
const Chat = ({ route, navigation, db, isConnected, storage }) => {
    // Destructuring route.params
    const { name, background, id } = route.params;
    // State to manage messages
    const [messages, setMessages] = useState([]);

    // Function to handle sending messages
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0])
    }

    // Function to customize the appearance of chat bubbles
    const renderBubble = (props) => {
      return <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    }

    // Function to load cached messages from AsyncStorage
    const loadCachedMessages = async () => {
      const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
      setLists(JSON.parse(cachedMessages)); // setLists is undefined here, it should be setMessages
    };
  
    // Function to cache messages using AsyncStorage
    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    };

    // Variable to hold unsubscribe function
    let unsubMessages;

    // Effect hook to set navigation title
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // Effect hook to listen for changes in messages collection
    useEffect(() => {
      if (isConnected === true) {
        if (unsubMessages) unsubMessages();
        unsubMessages = null;
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          docs.forEach((doc) => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
            });
            })
            cacheMessages(newMessages);
            setMessages(newMessages);
          });

        } else {
          loadCachedMessages();

          return () => {
            if (unsubShoppinglists) unsubShoppinglists();
          };
        }

      return () => {
        if (unsubMessages) unsubMessages();
      }
    }, []);

    // Function to render input toolbar based on connectivity
    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      else return null;
    };

    // Function to render custom actions component
    const renderCustomActions = (props) => {
      return <CustomActions storage={storage} {...props} />;
    };
  
    // Function to render custom view for location messages
    const renderCustomView = (props) => {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
    };

    // JSX to render GiftedChat component
    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <GiftedChat
              messages={messages}
              renderBubble={renderBubble}
              renderInputToolbar={renderInputToolbar}
              onSend={messages => onSend(messages)}
              renderActions={renderCustomActions}
              renderCustomView={renderCustomView}
              user={{
                //_id: route.params.id,
                _id: id,
                name
              }}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
        )
}

// Styles for the Chat component
const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
});

// Exporting the Chat component as default
export default Chat;