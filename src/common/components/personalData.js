import React, { useState } from 'react';
import {View, ScrollView, Image} from 'react-native';
import { Input, Button, CheckBox, Text } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import styles from "./styles/styles";
import {CIRCLE, CIRCLE_O} from "../../image";

const PersonalData = ({ user, navigation }) => {
  const user_data = user.data;
  const fullName = `${user_data.name} ${user_data.surname}`;
  const [address, setAddress] = useState(user_data.corres_address);
  const [email, setEmail] = useState(user_data.email);
  const [phone, setPhone] = useState(user_data.phone);
  const [invoiceByEmail, setInvoiceByEmail] = useState(Number(user_data.invoice_by_email));
  const [invoiceByPost, setInvoiceByPost] = useState(Number(user_data.invoice_by_post));
  const [sms, setSms] = useState(!!Number(user_data.sms));
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const handleFormSubmit = () => {
    setSpinnerVisible(true);
    const request_data = {
      email,
      address_koresp: address,
      phone,
      lapeliai_mail: invoiceByEmail,
      lapeliai_fiz: invoiceByPost,
      sms,
    };

    request.setPersonalDataRequest(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data.status) {
          alert_proceed('Sėkmė', 'Asmeniniai duomenys išsaugoti sėkmingai');
        } else {
          alert_proceed('Klaida', 'Duomenų išsaugoti nepavyko');
        }
      });
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Asmeniniai duomenys" />
      <View style={{ ...styles.center_view, marginTop: 0}} >
        <Input
          name="fullname"
          label="Vardas Pavardė"
          disabled={true}
          defaultValue={fullName}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
        />
        <Input
          name="login"
          label="Slapyvardis"
          disabled={true}
          defaultValue={user_data.login}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
        />
        <Input
          name="code"
          label="Kodas"
          disabled={true}
          defaultValue={user_data.payer_id}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
        />
        <Input
          name="address"
          label="Adresas"
          disabled={true}
          defaultValue={address}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
          onChangeText={text => setAddress(text)}
        />
        <Input
          name="email"
          label="El. paštas"
          defaultValue={email}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
          onChangeText={text => setEmail(text)}
        />
        <Input
          name="phone"
          label="Telefonas"
          defaultValue={phone}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343, marginTop: 20 }}
          onChangeText={text => setPhone(text)}
        />
        <Text style={{ marginTop: 20 }}>Mokėjimo lapelius noriu gauti</Text>
      </View>
      <CheckBox
        title='El. paštu'
        checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
        uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
        uncheckedColor={styles.radio.circle_inactive_color}
        checkedColor={styles.radio.circle_active_color}
        checked={!!invoiceByEmail}
        onPress={() => setInvoiceByEmail(invoiceByEmail ? 0 : 1)}
      />
      <CheckBox
        title='Į pašto dėžutę'
        checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
        uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
        uncheckedColor={styles.radio.circle_inactive_color}
        checkedColor={styles.radio.circle_active_color}
        checked={!!invoiceByPost}
        onPress={() => setInvoiceByPost(invoiceByPost ? 0 : 1)}
      />
      <View style={{ ...styles.center_view, marginTop: 20}} >
        <Text>Su DNSB.eu susijusią informaciją noriu gauti</Text>
      </View>
      <CheckBox
        title='SMS'
        checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
        uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
        uncheckedColor={styles.radio.circle_inactive_color}
        checkedColor={styles.radio.circle_active_color}
        checked={!!sms}
        onPress={() => setSms(sms ? 0 : 1)}
      />
      <View style={{ ...styles.center_view, marginTop: 10 }} >
        <Button
          buttonStyle={{ ...styles.button.big, marginBottom: 20 }}
          titleStyle={styles.button.title}
          title='Išsaugoti'
          onPress={() => handleFormSubmit()}
        />
      </View>
    </ScrollView>
  );
};

export default PersonalData;
