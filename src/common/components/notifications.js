import React from 'react';
import {Alert, Text, ScrollView, Image} from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';

import * as request from '../../server/api';
import * as actions from '../actions/actions';
import styles from './styles/styles';
import NavigatorBar from './elements/navigator_bar';
import {CIRCLE, CIRCLE_O} from "../../image";

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    const user_data = props.user.data;
    this.dispatch = props.dispatch;
    this.navigation = props.navigation;
    this.state = {
      notif_lapeliai: !!user_data.notif_lapeliai,
      notif_declar: !!user_data.notif_declar,
      notif_gyventojams: !!user_data.notif_gyventojams,
      notif_darbai: !!user_data.notif_darbai,
      notif_votings: !!user_data.notif_votings,
      notif_votingExp: !!user_data.notif_votingExp,
      notif_pirm_darbNur: !!user_data.notif_pirm_darbNur,
      notif_pirm_darbComm: !!user_data.notif_pirm_darbComm,
      notif_pirm_darbDone: !!user_data.notif_pirm_darbDone,
      notif_pirm_inv: !!user_data.notif_pirm_inv,
      notif_pirm_darbCreated: !!user_data.notif_pirm_darbCreated,
      notif_pirm_newsComm: !!user_data.notif_pirm_newsComm,
      spinner_visible: false
    };
  }

  handleFormSubmit() {
    this.setState({ spinner_visible: true });
    let request_data = {};
    request_data.notif_lapeliai = this.state.notif_lapeliai ? 1 : 0;
    request_data.notif_declar = this.state.notif_declar ? 1 : 0;
    request_data.notif_gyventojams = this.state.notif_gyventojams ? 1 : 0;
    request_data.notif_darbai = this.state.notif_darbai ? 1 : 0;
    request_data.notif_votings = this.state.notif_votings ? 1 : 0;
    request_data.notif_votingExp = this.state.notif_votingExp ? 1 : 0;
    request_data.notif_pirm_darbNur = this.state.notif_pirm_darbNur ? 1 : 0;
    request_data.notif_pirm_darbComm = this.state.notif_pirm_darbComm ? 1 : 0;
    request_data.notif_pirm_darbDone = this.state.notif_pirm_darbDone ? 1 : 0;
    request_data.notif_pirm_inv = this.state.notif_pirm_inv ? 1 : 0;
    request_data.notif_pirm_darbCreated = this.state.notif_pirm_darbCreated ? 1 : 0;
    request_data.notif_pirm_newsComm = this.state.notif_pirm_newsComm ? 1 : 0;

    request.setPersonalDataRequest(request_data)
      .then((data) => {
        this.setState({ spinner_visible: false });
        if (data) {
          this.dispatch(actions.update_user_settings_data(request_data));
          Alert.alert(
            'Sėkmė',
            'Asmeniniai duomenys išsaugoti sėkmingai',
            [
              {text: 'Supratau'}
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Klaida',
            'Duomenų išsaugoti nepavyko',
            [
              {text: 'Supratau'}
            ],
            { cancelable: false }
          );
        }
        this.navigate('UserMain');
      });
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <Spinner visible={this.state.spinner_visible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
        <NavigatorBar navigation={this.props.navigation} returnPage="Options" heading="Pranešimai" />
        <Text style={{ ...styles.h1TextMargin, marginTop: 10, marginLeft: 10 }}>
          Noriu gauti pranešimus
        </Text>
        <CheckBox
          title='Apie priskaičiuotus mokesčius'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_lapeliai}
          onPress={() => this.setState({ notif_lapeliai: !this.state.notif_lapeliai })}
        />
        <CheckBox
          title='Jei nedeklaravau duomenų likus 1 dienai iki mėnesio galo'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_declar}
          onPress={() => this.setState({ notif_declar: !this.state.notif_declar })}
        />
        <CheckBox
          title='Apie informaciją gyventojams'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state. notif_gyventojams}
          onPress={() => this.setState({ notif_gyventojams: !this.state.notif_gyventojams })}
        />
        <CheckBox
          title='Apie mano siūlomą darbą'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_darbai}
          onPress={() => this.setState({ notif_darbai: !this.state.notif_darbai })}
        />
        <CheckBox
          title='Apie naujus/prasidedančius balsavimus'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_votings}
          onPress={() => this.setState({ notif_votings: !this.state.notif_votings })}
        />
        <CheckBox
          title='Iki balsavimo pabaigos likus 1 valandai, jei dar nebalsavau'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_votingExp}
          onPress={() => this.setState({ notif_votingExp: !this.state.notif_votingExp })}
        />
        <CheckBox
          title='Gavus darbų nurodymą'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_pirm_darbNur}
          onPress={() => this.setState({ notif_pirm_darbNur: !this.state.notif_pirm_darbNur })}
        />
        <CheckBox
          title='Kažkam pakomentavus darbų nurodymą'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_pirm_darbComm}
          onPress={() => this.setState({ notif_pirm_darbComm: !this.state.notif_pirm_darbComm })}
        />
        <CheckBox
          title='Kai atliekamas mano pateiktas darbas'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_pirm_darbDone}
          onPress={() => this.setState({ notif_pirm_darbDone: !this.state.notif_pirm_darbDone })}
        />
        <CheckBox
          title='Kai reikia patvirtinti sąskaitą'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_pirm_inv}
          onPress={() => this.setState({ notif_pirm_inv: !this.state.notif_pirm_inv })}
        />
        <CheckBox
          title='Kai gyventojai pasiūlo darbą'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_pirm_darbCreated}
          onPress={() => this.setState({ notif_pirm_darbCreated: !this.state.notif_pirm_darbCreated })}
        />
        <CheckBox
          title='Kai pakomentuojama naujiena'
          checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
          uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
          uncheckedColor={styles.radio.circle_inactive_color}
          checkedColor={styles.radio.circle_active_color}
          checked={this.state.notif_pirm_newsComm}
          onPress={() => this.setState({ notif_pirm_newsComm: !this.state.notif_pirm_newsComm })}
        />
        <Grid style={{ marginTop: 10 }}>
          <Row>
            <Col size={2} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button
                buttonStyle={{ ...styles.button.small, width: 150 }}
                titleStyle={styles.button.title}
                title='Išsaugoti'
                onPress={() => this.handleFormSubmit()}
              />
            </Col>
            <Col size={2} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button
                buttonStyle={{ ...styles.button.small_light, width: 150 }}
                titleStyle={styles.button.title_light}
                title='Grįžti'
                onPress={() => this.navigation.navigate('UserMain')}
              />
            </Col>
          </Row>
        </Grid>
      </ScrollView>
    );
  }
}

export default Notifications;
