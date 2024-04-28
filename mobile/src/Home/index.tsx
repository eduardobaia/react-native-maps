import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { categories } from "./categories";
import { useNavigation } from "@react-navigation/native";

export interface IMarker {
  category: string;
  contact: string;
  description: string;
  latitude: number;
  longitude: number;
  name: string;
}

export default function Home() {
  const [markers, setMarkers] = useState<IMarker>([]);
  const [filter, setFilter] = useState("");
  const navigation = useNavigation();

  const mapRef = React.useRef(null);


  const filteredData = markers.filter(m => m.category === filter);

  React.useEffect(() => {
  
    const userRegion = {
      latitude: markers.length > 0 ? markers[0] : 52.62869394486038,
      longitude: markers.length > 0 ? markers[0] : -1.9794797216434805,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    mapRef.current?.animateToRegion(userRegion);
  }, []);


  function nativagteToRegion(latitude, longitude){

    const userRegion = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      console.log("navegando to ")
      mapRef.current?.animateToRegion(userRegion);
  }

  //console.log(markers);
  // useEffect(() => {
  //     fetch("http://192.168.1.70:3000/store").then(async(request) =>{
  //         const data = await request.json();

  //         setMarkers(data);
  //         console.log(markers[0].latitude)
  //     })

  // }, [])
  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch("http://192.168.1.70:3000/store");
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error("Failed to fetch markers:", error);
      }
    }

    fetchMarkers();
  }, []);

  console.log(filter);

  if (!markers || markers.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator while data is being fetched
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome </Text>
        <Text style={styles.subtitle}> Find in the map a Local commerce </Text>
      </View>

      <MapView
        ref={mapRef === null ? null : mapRef}
        initialRegion={{
          latitude: markers[0].latitude,
          longitude: markers[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.042,
        }}
        style={styles.container}
      >
        {( filter ? filteredData : markers).map((item) => {
          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPress={() => {
                navigation.navigate("Detail", item);
              }}
            />
          );
        })}
      </MapView>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          contentContainerStyle={{
            alignItems: "center",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryItem, filter === item.key ? styles.selectedCategory : null]}
              onPress={() => {
                
                setFilter(filter=== item.key ? "" : item.key)

               filteredData.length > 0 ?  nativagteToRegion(filteredData[0].latitude, filteredData[0].longitude): "";
}}
              key={item.key}
            >
              <Image style={styles.categoryImage} source={item.image} />
              <Text style={styles.categoryText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: "#322156",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#322156",
  },
  map: {
    flex: 1,
  },
  categoryContainer: {
    padding: 10,
  },
  categoryItem: {
    height: 110,
    backgroundColor: "#f0f0f5",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  categoryImage: {
    height: 50,
    width: 50,
  },
  categoryText: {
    textAlign: "center",
    color: "#322156",
  },
  selectedCategory:{
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4242443"
  }
});
