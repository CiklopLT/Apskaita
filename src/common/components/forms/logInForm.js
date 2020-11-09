import React, { Component } from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';

import alert_proceed from '../elements/alert_proceed';
import * as actions from '../../actions/actions';
import * as request from '../../../server/api';

const styles = {
  labelStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
    opacity: 0.5,
  },
  submitButtonStyle: {
    backgroundColor: "#172B4C",
    height: 48,
    width: '95%',
    marginLeft: 10,
  },
  buttonTitleStyle: {
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  }
};

class LogInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      spinner_visible: false
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync('credentials')
      .then((data) => {
        if (data) {
          const credentials = JSON.parse(data);
          this.setState({ username: credentials.usr, password: credentials.psw });
        }
      });
  }

  handleFormSubmit(state) {
    this.setState({ spinner_visible: true });
    request.loginRequest(state.username, state.password)
      .then(data => {
        if (data) {
          this.props.dispatch(actions.set_user_main_data(data));
          return request.getAdditionalDataRequest();
        } else {
          this.setState({ spinner_visible: false });
          alert_proceed('Klaida', 'Blogi prisijungimo duomenys');
          return false;
        }
      })
      .then((data) => {
        if (data) this.props.dispatch(actions.set_user_additional_data(data))
        return request.getPersonalDataRequest();
      })
      .then((data)  => {
        if (data) this.props.dispatch(actions.set_user_settings_data(data))
      })
      .then(() => {
        this.setState({ spinner_visible: false });
        this.props.navigation.navigate('UserMain');
      });
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', marginTop: 20 }}>
        <Spinner visible={this.state.spinner_visible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
        <Input
          name="username"
          defaultValue={this.state.username}
          label="Vartotojo vardas"
          labelStyle={styles.labelStyle}
          selectionColor={'#172B4C'}
          onChangeText={(text) => this.setState({ username: text })}
        />
        <Input
          name="password"
          defaultValue={this.state.password}
          label="Slaptažodis"
          labelStyle={{...styles.labelStyle, marginTop: 20 }}
          secureTextEntry={true}
          selectionColor={'#172B4C'}
          onChangeText={(text) => this.setState({ password: text })}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            buttonStyle={styles.submitButtonStyle}
            titleStyle={styles.buttonTitleStyle}
            title='PRISIJUNGTI'
            onPress={() => this.handleFormSubmit(this.state)}
          />
        </View>
      </View>
    );
  }
}

export default LogInForm;
