import React, { useState } from 'react';
import { ScrollView, View, Image, Modal } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import LogInForm from './forms/logInForm';
import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import { LOGO } from '../../image';
import ModalBar from "./elements/modal_bar";
import styles from './styles/styles';
import Spinner from 'react-native-loading-spinner-overlay';

const Login = (props) => {
  const [forgotModalShow, setForgotModalShow] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const closeModal = (value) => {
    setForgotModalShow(value);
  };

  const handleForgotEmail = () => {
    if (newEmail === '') {
      alert_proceed('Klaida', 'El. paštas nepateiktas!');
      return false;
    }
    setSpinnerVisible(true);
    request.forgotPasswordRequest({ email: newEmail })
     .then((data) => {
       if (data.status) {
         alert_proceed('Sėkmė', 'Užklausa sėkmingai išsiųsta');
       } else {
         alert_proceed('Klaida', 'Užklausa nesėkiminga');
       }
       setSpinnerVisible(false);
     });
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <View style={{ backgroundColor: '#fff', alignItems: 'center', marginTop: 80 }}>
        <Image
          style={styles.imageStyle}
          source={ LOGO }
        />
      </View>
      <LogInForm navigation={props.navigation} dispatch={props.dispatch} />
      <Button
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitleStyle}
        title='JUNGIUOSI PIRMĄ KARTĄ'
        onPress={() => alert_proceed('Informacija', 'Susisiekite su mumis https://www.dnsb.eu/kontaktai/')}
      />
      <Button
        buttonStyle={styles.buttonLinkStyle}
        titleStyle={styles.buttonLinkTitleStyle}
        title='Pamiršau slaptažodį'
        onPress={() => setForgotModalShow(true)}
      />

      <Modal
        animationType="fade"
        transparent={false}
        visible={forgotModalShow}
      >
        <ScrollView style={{ backgroundColor: 'white' }}>
          <ModalBar action={closeModal} value={0} />
          <View style={styles.center_view}>
            <Text style={{ ...styles.h1Text, paddingLeft: 20, paddingRight: 20, marginBottom: 20, textAlign:'justify' }}>
              Įveskite savo el. pašto adresą ir į jį jums bus atsiųsta nuoroda, kurią paspaudus galėsite pakeisti savo slaptažodį
            </Text>
            <Input
              name="forgot_email"
              label="El. pašto adresas"
              labelStyle={styles.input.label}
              containerStyle={{ width: 343 }}
              onChangeText={text => setNewEmail(text)}
            />
            <Button
              title='Siųsti'
              buttonStyle={{ ...styles.button.big, marginTop: 20 }}
              titleStyle={styles.button.title}
              onPress={() => handleForgotEmail()}
            />
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default Login;
