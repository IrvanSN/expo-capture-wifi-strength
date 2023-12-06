import WifiManager from "react-native-wifi-reborn";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [label, setLabel] = useState("");
  const [captureNetwork, setCaptureNetwork] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        const netInfo = {
          label: "location permission info",
          data: {
            message: "Permission to access location was denied",
          },
        };

        setCaptureNetwork([...captureNetwork, netInfo]);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const netInfo = {
        label: "location permission info",
        data: {
          message: "Location permission granted",
          location,
        },
      };

      setCaptureNetwork([...captureNetwork, netInfo]);
    })();
  }, []);

  const onPress = async () => {
    const netInfo = {
      label,
      data: {
        bssid: await WifiManager.getBSSID(),
        signalStrength: await WifiManager.getCurrentSignalStrength(),
        frequency: await WifiManager.getFrequency(),
        ip: await WifiManager.getIP(),
      },
    };
    setCaptureNetwork([...captureNetwork, netInfo]);
    setLabel("");
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={{
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderWidth: 1,
            width: 300,
            marginBottom: 15,
          }}
          value={label}
          onChangeText={(val) => setLabel(val)}
        ></TextInput>
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 50,
            paddingVertical: 5,
            backgroundColor: "lightgray",
          }}
        >
          <Text>Capture</Text>
        </TouchableOpacity>
        <View style={{ marginVertical: 30 }}>
          <Text style={{ fontWeight: 500 }}>Message Log:</Text>
          {captureNetwork.map((item, index) => (
            <Text style={{ marginVertical: 5 }} key={index}>
              {`${index + 1}. ${item.label}: ${JSON.stringify(item.data)}`}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setCaptureNetwork([])}
          style={{
            paddingHorizontal: 50,
            paddingVertical: 5,
            backgroundColor: "lightgray",
            marginBottom: 30,
          }}
        >
          <Text>Clear Log</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 15,
  },
});
