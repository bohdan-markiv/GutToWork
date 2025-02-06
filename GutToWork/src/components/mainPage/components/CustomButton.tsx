import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
};

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    containerStyle,
    textStyle,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, containerStyle]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CustomButton;
