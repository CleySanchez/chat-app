// CustomActions.js

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useActionSheet } from "@expo/react-native-action-sheet";

const CustomActions = ({ wrapperStyle, onSend, storage, userID, name }) => {

  // Function to generate a unique reference for the uploaded image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Function to upload image and send its URL
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    try {
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded, URL:", imageURL);
      onSend([{
        _id: Math.random().toString(36).substring(7), // Simple unique ID
        createdAt: new Date(),
        user: {
          _id: userID,
          name: name,
        },
        image: imageURL,
      }]);
      console.log("onSend called with image message");
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Upload Error", "Failed to upload image. Please try again.");
    }
  };

  // Function to pick an image from the device's library
  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions Required", "Please grant photo library permissions to use this feature.");
    }
  };

  // Function to take a photo using the device's camera
  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions Required", "Please grant camera permissions to use this feature.");
    }
  };

  // Function to get the current device location
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend([{
          _id: Math.random().toString(36).substring(7), // Simple unique ID
          createdAt: new Date(),
          user: {
            _id: userID,
            name: name,
          },
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        }]);
        console.log("onSend called with location message");
      } else {
        Alert.alert("Location Error", "Unable to fetch location. Please try again.");
      }
    } else {
      Alert.alert("Permissions Required", "Please grant location permissions to use this feature.");
    }
  };

  // Hook to use the action sheet for presenting options
  const actionSheet = useActionSheet();

  // Function to handle action press from the action sheet
  const onActionPress = () => {
    const options = ["Choose From Library", "Take Picture", "Send Location", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            break;
          case 1:
            takePhoto();
            break;
          case 2:
            getLocation();
            break;
          default:
            break;
        }
      }
    );
  };

  // Render component
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="Media options"
      accessibilityHint="Opens options to send media or location"
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={styles.iconText}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

// Styles for the CustomActions component
const styles = StyleSheet.create({
  container: {
    width: 34,               // Adjusted size
    height: 34,
    marginLeft: 50,
    marginBottom: 5,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
  },
  wrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,         // Half of width/height to make it circular
    borderColor: "#757083",   // Match chat theme
    borderWidth: 1.5,         // Slightly thinner border
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
    backgroundColor: "#FFF",  // White background for contrast
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,             // Subtle shadow for Android
  },
  iconText: {
    color: "#757083",         // Match border color
    fontWeight: "bold",
    fontSize: 18,             // Adjusted font size for smaller button
    backgroundColor: "transparent",
    textAlign: "center",
    lineHeight: 18,           // Center vertically within Text
  },
});

export default CustomActions;