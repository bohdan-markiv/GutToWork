import React from 'react';
import axios from 'axios';
import { View, Text, Alert } from 'react-native';
import styles from './styles';
import CustomButton from './components/CustomButton';

const ExampleComponent: React.FC = (): JSX.Element => {
    const handleNewConversationClick = async () => {
        try {
            // Call your API endpoint with a GET request:
            const response = await axios.get<string>('https://gba15q4lh7.execute-api.eu-central-1.amazonaws.com/dev/cars');
            const allCars = response.data;

            // Check if any data was returned
            if (allCars) {
                Alert.alert(
                    "Cars",
                    allCars,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            } else {
                Alert.alert(
                    "Cars",
                    "nothing got or error",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
            Alert.alert(
                "Cars",
                "nothing got or error",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>GutToWork</Text>
            <Text style={styles.description}>
                GutToWork is a project designed to revolutionize workplace well-being through technology and research.
            </Text>
            {/* When the button is pressed, it will call the API and show the result in a popup */}
            <CustomButton title="Show Cars" onPress={handleNewConversationClick} />
        </View>
    );
};

export default ExampleComponent;
