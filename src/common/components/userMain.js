import React, { useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import NavigatorBar from './elements/navigator_bar';
import {ARROW_BACK, ARROW_DOWN, ARROW_UP, USER} from "../../image";
import { Col, Row, Grid } from 'react-native-easy-grid';

import alert_proceed from './elements/alert_proceed';
import * as request from '../../server/api';
import * as actions from '../actions/actions';
import styles from "./styles/styles";

const handle_logout = (navigate) => {
  request.removeToken()
    .then(() => {
      navigate('Home');
    });
};

const UserMain = ({ user, dispatch, navigation }) => {
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const switchAccounts = (username) => {
    setSpinnerVisible(true);
    request.switchUser({ username })
      .then((data) => {
        dispatch(actions.set_token(data.jti));
        dispatch(actions.reset_user_data());
        dispatch(actions.set_user_main_data(data.data));
        return request.getAdditionalDataRequest();
      })
      .then(data => dispatch(actions.set_user_additional_data(data)))
      .then(() => {
        setSpinnerVisible(false);
        setShowAccountsModal(false);
        alert_proceed('Sėkmė', `Jūs sėkmingai prisijungėte su vartotoju: ${username}`);
      });
  };
  const masterAccounts = user.data.master_accounts;
  const rights = Number(user.data.rights);

  return (
    <View style={{ flex: 1 }} >
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Pradžia" />
      <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
        <View style={styles.right_view}>
          <Button
            iconRight={true}
            icon={<Image source={ showOptions ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
            buttonStyle={styles.button.toggle}
            titleStyle={styles.button.title_light}
            title='Nustatymai'
            onPress={() => setShowOptions(!showOptions)}
          />
        </View>
        {
          !!showOptions &&
          <Grid>
            <Row>
              <Col>
                <Button
                  title='Pagrindiniai nustatymai'
                  containerStyle={{ ...styles.button.rounded_blue_container, marginLeft: 10, marginRight: 10 }}
                  buttonStyle={styles.button.rounded_blue}
                  titleStyle={styles.button.rounded_title}
                  onPress={() => navigation.navigate('PersonalData')}
                />
              </Col>
              <Col>
                <Button
                  title='Pranešimai'
                  containerStyle={{ ...styles.button.rounded_blue_container, marginLeft: 10, marginRight: 10, height: 40, paddingTop: 5 }}
                  buttonStyle={styles.button.rounded_blue}
                  titleStyle={styles.button.rounded_title}
                  onPress={() => navigation.navigate('Notifications')}
                />
              </Col>
              <Col>
                <Button
                  title='Keisti slaptažodį'
                  containerStyle={{ ...styles.button.rounded_blue_container, marginLeft: 10, marginRight: 10, height: 40, paddingTop: 5 }}
                  buttonStyle={styles.button.rounded_blue}
                  titleStyle={styles.button.rounded_title}
                  onPress={() => navigation.navigate('ChangePassword') }
                />
              </Col>
            </Row>
          </Grid>
        }
        <View style={styles.center_view}>
          <Image source={ USER } style={styles.icon_big} />
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Text style={styles.table.title_text}>Vartotojas: </Text>
            <Text style={styles.table.regular_text}>{user.data.name} {user.data.surname}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.table.title_text}>ID: </Text>
            <Text style={styles.table.regular_text}>{user.data.payer_id}</Text>
          </View>
          <TouchableOpacity onPress={() => handle_logout(navigation.navigate)} >
            <Text style={{ marginTop: 10, textDecorationLine: 'underline' }}>Atsijungti</Text>
          </TouchableOpacity>
        </View>
        <Grid>
          <Row style={{ marginTop: 80 }}>
            {
              masterAccounts && !!masterAccounts.length &&
              <Col style={{ alignItems: 'center' }}>
                <Button
                  title='Perjungti paskyrą'
                  containerStyle={{ ...styles.button.rounded_yellow_container, width: 150 }}
                  buttonStyle={styles.button.rounded_yellow}
                  titleStyle={styles.button.rounded_yellow_title}
                  onPress={() => setShowAccountsModal(true) }
                />
              </Col>
            }
            {
              rights === 3 &&
              <Col style={{ alignItems: 'center' }}>
                <Button
                  title='Papildomi asmenys'
                  containerStyle={{ ...styles.button.rounded_yellow_container, width: 150 }}
                  buttonStyle={styles.button.rounded_yellow}
                  titleStyle={styles.button.rounded_yellow_title}
                  onPress={() => navigation.navigate('AdditionalPersons') }
                />
              </Col>
            }
          </Row>
        </Grid>
        <View style={styles.center_view}>

        </View>


        <Modal
          animationType="fade"
          transparent={false}
          visible={showAccountsModal}
        >
          <ScrollView>
            <View>
              <TouchableOpacity onPress={() => setShowAccountsModal(false)}>
                <Image
                  source={ ARROW_BACK }
                  style={{ ...styles.icon, marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
            { masterAccounts && masterAccounts.map(account => <MasterAccount key={account.username} account={account} action={switchAccounts} />) }
          </ScrollView>
        </Modal>
      </ScrollView>
    </View>
  )
};

const MasterAccount = ({ account, action }) => {
  return (
    <Button
      onPress={() => action(account.username) }
      title={account.account}
      buttonStyle={{ ...styles.button.big, marginTop: 20 }}
      titleStyle={styles.button.title}
    />
  );
};

export default UserMain;
