import styles from "../styles/styles";
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {Camera} from "expo-camera";
import React from "react";

const CameraWrapper = ({ setCamera, hasCameraPermission, takePicture, setCameraMode }) => {
  return (
    <View style={{ ...styles.cameraContainer, height: (Dimensions.get('window').height - 90) }}>
      {
        hasCameraPermission
          ?
          <Camera
            ref={cam => setCamera(cam)}
            style={styles.preview}
            type={Camera.Constants.Type.back}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'center',
                alignItems: 'center',
              }}
              onPress={() => takePicture()}
            >
              <Text style={{ ...styles.title, opacity: 1, color: 'white', backgroundColor: '#172B4C', padding: 5 }}>
                Fotografuoti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'center',
                alignItems: 'center',
              }}
              onPress={() => setCameraMode(false)}>
              <Text style={{ ...styles.title, color: 'white', textDecorationLine: 'underline' }}>
                Grįžti
              </Text>
            </TouchableOpacity>
          </Camera>
          :
          <View style={{ ...styles.center_view, marginLeft: 30 }}>
            <Text style={{ ...styles.title, opacity: 1 }}>Sutikimas naudotis kamera nebuvo gautas.</Text>
            <Text style={{ ...styles.title, fontSize: 11 }}>Norint jį suteikti, tai galima padaryti per įrenginio nustatymus</Text>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'center',
                alignItems: 'center',
              }}
              onPress={() => setCameraMode(false)}>
              <Text style={{ ...styles.title, textDecorationLine: 'underline', marginTop: 10 }}>
                Grįžti
              </Text>
            </TouchableOpacity>
          </View>
      }
    </View>
  )
};

export default CameraWrapper;