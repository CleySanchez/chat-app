import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
    const { name, background } = route.params;

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Set the title of the screen to the user's name
        navigation.setOptions({ title: name });

        // Load initial messages
        setMessages([
            {
                _id: 1,
                text: "Hello Developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: "This is a system message",
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    // Function to handle sending new messages
    const onSend = (newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    };

    // Function to customize the message bubbles
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#000",
                    },
                    left: {
                        backgroundColor: "#FFF",
                    },
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
                renderBubble={renderBubble}
            />
            {/* KeyboardAvoidingView to ensure input is visible when keyboard is open */}
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
            {Platform.OS === 'ios' && <KeyboardAvoidingView behavior="padding" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
