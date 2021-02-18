import theme from "../constants/themes/theme";
import {ActivityIndicator, StyleSheet} from "react-native";
import React from "react";

const LoadingBar = ({ style, ...rest }) => (
    <ActivityIndicator
        style={[styles.spinnerStyle, style]}
        // size="large"
        color={theme.primary}
        {...rest}
    />
);

const styles = StyleSheet.create({
    spinnerStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 100,
        justifyContent: "center",
    },
});

export default LoadingBar
