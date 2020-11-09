import React, { Component } from 'react';
import { Alert } from 'react-native';

const alert_proceed = (type, message) => {
  setTimeout(() => {
    Alert.alert(
      type,
      message,
      [
        {text: 'Supratau'}
      ],
      { cancelable: false }
    )},
    100)
};

export default alert_proceed;