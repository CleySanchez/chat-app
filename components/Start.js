import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const image = require('../img/BackgroundImage.png');

  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate('Chat', { name, background: selectedColor, id: result.user.uid });
        Alert.alert('Signed in successfully');
      })
      .catch(error => {
        Alert.alert('Unable to sign in, try later');
      });
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>Chat App</Text>
        <View style={styles.containerWhite}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#757083"
            />
          </View>
          <Text style={styles.text1}>Choose Background Color:</Text>
          <View style={styles.colorButtonsContainer}>
            {['#090C08', '#474056', '#8A95A5', '#B9C6AE'].map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 2 : 0,
                    borderColor: selectedColor === color ? 'black' : 'transparent',
                  },
                ]}
                onPress={() => handleColorSelection(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.buttonStartChatting, { backgroundColor: selectedColor || '#757083' }]}
            onPress={signInUser}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    padding: '25%',
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
  },
  containerWhite: {
    width: '88%',
    height: '44%',
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  text1: {
    fontSize: 16,
    color: '#757083',
    fontWeight: '300',
    marginBottom: 20,
  },
  colorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonStartChatting: {
    backgroundColor: '#757083',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default Start;
