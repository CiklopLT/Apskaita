import React, { useState } from 'react';
import {Text, Alert, ScrollView, View, Image} from 'react-native';
import Modal from 'react-native-modal';
import { ListItem, Button, Input, CheckBox } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import ModalBar from './elements/modal_bar';
import styles from './styles/styles';
import {ADD_CIRCLE, CIRCLE, CIRCLE_O} from "../../image";

const AdditionalPersons = ({ user, navigation }) => {
  const [personModal, setPersonModal] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(0);
  const selected_person = user.extra_persons && Object.values(user.extra_persons).find(person => person.id === selectedPersonId);

  const show_modal = (value, id) => {
    setPersonModal(value);
    setSelectedPersonId(id);
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <NavigatorBar navigation={navigation} heading="Papildomo asmens pridėjimas"/>
      {
        user.extra_persons
        ?
          Object.values(user.extra_persons).map((item) => (
            <ListItem
              key={item.id}
              title={`${item.name} ${item.surname}`}
              chevronColor='#0d2c64'
              onPress={() => setPersonModal(true, item.id)}
            />
          ))
        :
          <View style={styles.center_view}>
            <Text style={styles.h1Text}>Nėra papildomų asmenų</Text>
          </View>
      }
      <View style={styles.center_view}>
        <Button
          iconRight={true}
          icon={<Image source={ ADD_CIRCLE } style={{ ...styles.icon, marginLeft: 10 }} />}
          buttonStyle={styles.button.small_light}
          titleStyle={styles.button.title_light}
          title='Pridėti papildomą asmenį'
          onPress={() => setPersonModal(true)}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={false}
        visible={personModal}
      >
        <ModalView action={show_modal} data={selected_person} />
      </Modal>
    </ScrollView>
  );
};

const ModalView = ({ data, action }) => {
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [name, setName] = useState((data && data.name) || '');
  const [surname, setSurname] = useState((data && data.surname) || '');
  const [address, setAddress] = useState((data && data.corres_address) || '');
  const [email, setEmail] = useState((data && data.email) || '');
  const [phone, setPhone] = useState((data && data.phone) || '');
  const [invoiceByEmail, setInvoiceByEmail] = useState((data && Number(data.invoice_by_email)) || 0);

  const addPerson = () => {
    setSpinnerVisible(true);
    const request_data = {
      name,
      surname,
      address,
      email,
      phone,
      lapeliai_mail: invoiceByEmail
    };
    if (data && data.id) request_data.id = data.id;

    request.saveExtraPersonRequest(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data.status) {
          const msg = data.id ? 'Papildomo asmens informacija pakeista' : 'Papildomas asmuo išsaugotas sėkmingai';
          alert_proceed('Sėkmė', msg);
        } else {
          alert_proceed('Klaida', 'Klaida redaguojant papildomo asmens duomenis');
        }
      });
  };

  const personDelete = (id) => {
    Alert.alert(
      'Patvirtinti',
      'Ar tikrai norite ištrinti šį asmenį?',
      [
        {text: 'Ne', onPress: () => {}, style: 'cancel'},
        {text: 'Taip', onPress: () => {
          setSpinnerVisible(true);
          request.deleteExtraPersonRequest({ id })
            .then((data) => {
              setSpinnerVisible(false);
              if (data.status) {
                alert_proceed('Sėkmė', 'Papildomas asmuo ištrintas sėkmingai');
              } else {
                alert_proceed('Klaida', 'Papildomo asmens ištrinti nepavyko');
              }
            });
        }},
      ],
      { cancelable: false }
    );
  }

  return (
    <ScrollView>
      <ModalBar action={action} value={0} />
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      {
        data && !!data.id &&
        <Button
          buttonStyle={{ width: 160 }}
          iconRight={{color: 'white'}}
          icon={{name: 'delete'}}
          onPress={() => personDelete(data.id)}
          backgroundColor="#0D2C64"
          title='Ištrinti asmenį'
        />
      }
      <Input
        name="name"
        label="Vardas"
        defaultValue={name}
        labelStyle={styles.input.label}
        containerStyle={{ width: 343, marginTop: 20 }}
        onChangeText={text => setName(text)}
      />
      <Input
        name="surname"
        label="Pavardė"
        defaultValue={surname}
        labelStyle={styles.input.label}
        containerStyle={{ width: 343, marginTop: 20 }}
        onChangeText={text => setSurname(text)}
      />
      <Input
        name="address"
        label="Adresas korespondencijai"
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
      <CheckBox
        title='Noriu gauti mokėjimo lapelius el. paštu'
        checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
        uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
        uncheckedColor={styles.radio.circle_inactive_color}
        checkedColor={styles.radio.circle_active_color}
        containerStyle={{ marginRight: 35, marginTop: 20, marginBottom: 20 }}
        checked={!!invoiceByEmail}
        onPress={() => setInvoiceByEmail(invoiceByEmail ? 0 : 1)}
      />
      <Button
        buttonStyle={{ ...styles.button.big, marginBottom: 20 }}
        titleStyle={styles.button.title}
        title='Išsaugoti'
        onPress={() => addPerson()}
      />
    </ScrollView>
  );
};

export default AdditionalPersons;
