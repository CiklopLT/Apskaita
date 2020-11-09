import React, {useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {Button, CheckBox, Input} from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';

import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';
import {ARROW_DOWN, ARROW_UP, CIRCLE, CIRCLE_O} from "../../image";

const Sms = ({ user, navigation }) => {
  const sms = user.sms;
  let recipients_list = new Set();
  if (sms && sms.recipients) sms.recipients.forEach(rec => recipients_list.add(rec.id));

  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [newText, setNewText] = useState('');
  const [enableAll, setEnableAll] = useState(true);
  const [_enabledCount, setEnabledCount] = useState(recipients_list.size);
  const [recipientsList, setRecipientsList] = useState(recipients_list);

  const topUp = () => {
    setSpinnerVisible(true);
    const request_data = {
      amount: topUpAmount,
    };

    request.smsTopUp(request_data)
      .then((data) => {
        setShowTopUp(false);
        setSpinnerVisible(false);
        if (data.status) {
          alert_proceed('Sėkmė', 'Kreditas papildytas sėkmingai');
        } else {
          alert_proceed('Klaida', 'Kredito papildymas nepavyko');
        }
      });
  };

  const handleRecipientAllChange = () => {
    setRecipientsList(!enableAll ? recipients_list : new Set());
    setEnableAll(!enableAll);
    setEnabledCount(recipientsList.size);
  };

  const handleRecipientChange = (id, value) => {
    let new_recipients_list = recipientsList;
    value ? new_recipients_list.add(id) : new_recipients_list.delete(id);
    setRecipientsList(new_recipients_list);
    setEnabledCount(new_recipients_list.size);
    setEnableAll(recipientsList.size === recipients_list.size);
  };

  const sendSMS = () => {
    setSpinnerVisible(true);
    const request_data = {
      text: newText,
      receivers: [...recipientsList].join(',')
    };

    request.smsSend(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data.status) {
          alert_proceed('Sėkmė', 'SMS išsiųstas sėkmingai');
        } else {
          alert_proceed('Klaida', 'SMS išsiųsti nepavyko');
        }
      });
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <NavigatorBar navigation={navigation} heading="Siųsti SMS"/>
      <View style={styles.right_view}>
        <Text style={{ ...styles.table.regular_text, marginTop: 10, marginRight: 35 }}>{`Jūsų SMS kredito likutis: ${sms.credit} €`}</Text>
        <Button
          buttonStyle={{ ...styles.button.toggle, height: 20 }}
          titleStyle={styles.button.title_light}
          iconRight={true}
          icon={<Image source={ showTopUp ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
          onPress={() => setShowTopUp(!showTopUp)}
          title='Pasirinkti papildymo būdą'
        />
      </View>
      {
        !!showTopUp &&
        <View style={{ ...styles.center_view, marginTop: 0 }}>
          <Input
            name="top_up_amount"
            label="Papildymo suma"
            keyboardType='numeric'
            width={100}
            labelStyle={styles.input.label}
            containerStyle={{ width: 343 }}
            defaultValue={topUpAmount}
            onChangeText={text => setTopUpAmount(text)}
          />
          <Button
            buttonStyle={{ ...styles.button.big, marginTop: 20 }}
            titleStyle={styles.button.title}
            onPress={() => topUp()}
            title='Papildyti'
          />
        </View>
      }
      <View style={styles.right_view}>
        <Button
          buttonStyle={styles.button.toggle}
          titleStyle={styles.button.title_light}
          iconRight={true}
          icon={<Image source={ showContacts ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
          onPress={() => setShowContacts(!showContacts)}
          title='Pasirinkti gavėjus'
        />
      </View>
      {
        !!showContacts && !!sms.recipients &&
        <React.Fragment>
          <CheckBox
            title='jungti/Išjungti visus'
            checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
            uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
            uncheckedColor={styles.radio.circle_inactive_color}
            checkedColor={styles.radio.circle_active_color}
            checked={enableAll}
            onPress={() => handleRecipientAllChange()}
          />
          {
            sms.recipients.map((rec) => {
              const active = recipientsList.has(rec.id);
              return (
                <CheckBox
                  key={rec.id}
                  title={`${rec.name} ${rec.surname}`}
                  checkedIcon={<Image source={CIRCLE_O} style={styles.icon}/>}
                  uncheckedIcon={<Image source={CIRCLE} style={styles.icon}/>}
                  uncheckedColor={styles.radio.circle_inactive_color}
                  checkedColor={styles.radio.circle_active_color}
                  checked={active}
                  onPress={() => handleRecipientChange(rec.id, !active)}
                />
              )
            })
          }
        </React.Fragment>
      }
      <View style={styles.center_view}>
        <Input
          name="new_text"
          multiline={true}
          numberOfLines={3}
          label="Pranešimo tekstas"
          labelStyle={styles.input.label}
          containerStyle={{ width: 343 }}
          defaultValue={newText}
          onChangeText={text => setNewText(text)}
        />
        <Button
          buttonStyle={{ ...styles.button.big, marginTop: 20 }}
          titleStyle={styles.button.title}
          onPress={() => sendSMS()}
          title='Siųsti'
        />
      </View>
      {
        sms.all && !!sms.all.length
          ?
            <Grid style={styles.gridStyle}>
              <Row><Text>Išsiųsti</Text></Row>
              {sms.all.map(sms => <SentList key={sms.id} data={sms} />)}
            </Grid>
          :
            <View style={styles.center_view}>
              <Text style={styles.h1Text}>Nėra išsiųstų žinučių</Text>
            </View>
      }
    </ScrollView>
  );
};

const SentList = ({ data }) => {
  return (
    <Row style={styles.rowStyle}>
      <Col>
        <Text style={styles.table.regular_text}>{data.time}</Text>
      </Col>
      <Col>
        <Text style={styles.table.title_text}>{data.text}</Text>
      </Col>
    </Row>
  );
}

export default Sms;
