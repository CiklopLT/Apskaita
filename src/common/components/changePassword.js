import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';

import * as request from '../../server/api';
import styles from './styles/styles';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';

const ChangePassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const handleFormSubmit = () => {
    if (newPassword === newPassword2 && newPassword.length > 5) {
      request.changePassword({ password: newPassword })
        .then(() => alert_proceed('Sėkmė', 'Slaptažodis pakeistas sėkmingai'));
    } else {
      alert_proceed('Klaida', 'Slaptažodis netinkamas, arba per trumpas (min 5 simboliai)');
    }
  };

  return (
    <ScrollView  style={{backgroundColor: '#fff'}}>
      <NavigatorBar navigation={navigation} heading="Slaptažodžio keitimas" />
      <View style={styles.center_view}>
        <Input
          name="new_password"
          label="Naujas slaptažodis"
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
          onChangeText={text => setNewPassword(text)}
        />
        <Input
          name="new_password_2"
          label="Pakartoti naują slaptažodį"
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20, marginBottom: 20 }}
          onChangeText={text => setNewPassword2(text)}
        />
        <Button
          title='Išsaugoti'
          buttonStyle={{ ...styles.button.big, marginBottom: 20 }}
          titleStyle={styles.button.title}
          onPress={() => handleFormSubmit()}
        />
      </View>
    </ScrollView>
  );
};

export default ChangePassword;
