import axios from 'axios';
import styles from './styles';
import CustomButton from './components/CustomButton';
import React, { useState } from 'react';
import {
    View,
    Text,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
const ExampleComponent: React.FC = (): JSX.Element => {
    // State to store the list of cars and the modal visibility flag
    const [cars, setCars] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const handleNewConversationClick = async () => {
        try {
            // Call your API endpoint with a GET request:
            const response = await axios.get(
                'https://gba15q4lh7.execute-api.eu-central-1.amazonaws.com/prod/cars'
            );
            const allCars = response.data;

            // Check if any data was returned
            if (Array.isArray(allCars) && allCars.length > 0) {
                setCars(allCars);
                setModalVisible(true);
            } else {
                Alert.alert('Cars', 'No data returned or error', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            Alert.alert('Cars', 'An error occurred while fetching data', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };

    // Render a single car item. The API returns each field as an object with an "S" property.
    const renderCarItem = (car: any, index: number) => {
        const carId = car['car-id']?.S;
        const brand = car.brand?.S;
        const model = car.model?.S;

        return (
            <View key={carId || index} style={styles.carItem}>
                <Text style={styles.carText}>ID: {carId}</Text>
                <Text style={styles.carText}>Brand: {brand}</Text>
                <Text style={styles.carText}>Model: {model}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>GutToWork</Text>
            <Text style={styles.description}>
                GutToWork is a project designed to revolutionize workplace well-being through
                technology and research.
            </Text>
            {/* When the button is pressed, the API is called and the modal is opened if data is returned */}
            <CustomButton title="Show Cars" onPress={handleNewConversationClick} />

            {/* Modal to display the list of cars */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Cars</Text>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {cars.map((car, index) => renderCarItem(car, index))}
                    </ScrollView>
                    {/* Close button for the modal */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    {/* Alternatively, you could reuse your CustomButton:
              <CustomButton title="Close" onPress={() => setModalVisible(false)} />
          */}
                </View>
            </Modal>
        </View>
    );
};

export default ExampleComponent;
