import { StyleSheet, View, Dimensions } from 'react-native';

const { height } = Dimensions.get('window'); // Get screen height

const styles = StyleSheet.create({

    container: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        marginTop: height * 0.3,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default styles;
