import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles.ts';

const ExampleComponent: React.FC = (): JSX.Element => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>GutToWork</Text>
            <Text style={styles.description}>
                Gut2Work is a project designed to revolutionize workplace well-being through technology and research.
            </Text>
        </View>
    );
};

export default ExampleComponent;
