import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert, // Added Alert import for error handling
} from 'react-native';
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
  const onSend = async (newMessages = []) => {
    console.log("onSend called with messages:", newMessages);
    if (newMessages.length > 0) {
      try {
        await addDoc(collection(db, "messages"), newMessages[0]);
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message: ", error);
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    }
  };

  // Function to customize the appearance of chat bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Function to load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
      setMessages(JSON.parse(cachedMessages));
    } catch (error) {
      console.log("Error loading cached messages: ", error.message);
    }
  };

  // Function to cache messages using AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log("Error caching messages: ", error.message);
    }
  };

  // Variable to hold unsubscribe function
  let unsubMessages = null;

  // Effect hook to set navigation title
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name, navigation]);

  // Effect hook to listen for changes in messages collection
  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      const qMessages = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );
      unsubMessages = onSnapshot(qMessages, (snapshot) => {
        let fetchedMessages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            user: data.user,
            location: data.location || null,
            image: data.image || null, // Include image if present
          });
        });
        cacheMessages(fetchedMessages);
        setMessages(fetchedMessages);
      });
    } else {
      loadCachedMessages();
    }

    // Cleanup function
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [db, isConnected]);

  // Function to render input toolbar based on connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    }
    return null;
  };

  // Function to render custom actions component
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} onSend={onSend} userID={id} name={name} {...props} />;
  };

  // Function to render custom view for location messages
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={styles.map}
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90} // Adjust based on your header height
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: id,     // Ensure 'id' is correctly defined
              name: name,  // Ensure 'name' is correctly defined
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            placeholder="Type your message..."
            alwaysShowSend
            scrollToBottom
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  map: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

export default Chat;