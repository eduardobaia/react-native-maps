import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { View,Text, StyleSheet } from "react-native";
import { IMarker } from "../Home";
import { useEffect, useState } from "react";

type DetailRoute = RouteProp<{detail: IMarker}, "detail">;


export default function Detail(){

    const params = useRoute<DetailRoute>();
    const [address, setAddres] = useState<any>();

    const navigation = useNavigation();
    
    useEffect(() => {
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${params.params.latitude}&lon=${params.params.longitude}&format=json`
        ).then(async (request) => {
          const data = await request.json();
    
          setAddres(data);
          console.log("O DATA ")
          console.log(data)
          navigation.setOptions({
            title: params.params.name,
          });
        });
      }, []);


    console.log(params.params)
    return(
        <View style={styles.container}>
            <Text  style={styles.title}>{params.params.name}</Text>
            <Text  style={styles.subtitle}>{params.params.description}</Text>
            <Text  style={styles.section}>Address</Text>
            <Text  style={styles.text}>Street: {address?.address.road}</Text>
            <Text  style={styles.text}>City: {address?.address.city}</Text>
            <Text  style={styles.text}>Postal Code: {address?.address.postcode}</Text>
            <Text  style={styles.text}>Neighbor: {address?.address.suburb}</Text>
            <Text  style={styles.text}>Country: {address?.address.country} </Text>
            <Text  style={styles.text}>State:{address?.address.county} </Text>

            <Text  style={styles.section}>Contact</Text>
            <Text  style={styles.subtitle}>{params.params.contact}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F0F0F5",
        padding: 20
    },
    title:{
        color: "#322253",
        fontSize: 28,
        fontWeight: 'bold'
    },
    subtitle:{
        color: "#6C6C6C80",
        fontSize: 18,
        fontWeight: '400'
    },
    section:{
        color: "#6C6C6C80",
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 20
    },
    text:{
        color: "#6C6C80",
        fontSize: 16,
    }
})