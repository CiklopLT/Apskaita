import React from 'react';
import { View, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import * as actions from '../actions/actions';
import * as request from '../../server/api';

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { spinner_visible: true };
  }

  componentDidMount() {
    request.getAdditionalDataRequest()
      .then((data) => {
        this.setState({ spinner_visible: false });
        if (data){
          this.props.dispatch(actions.set_user_additional_data(data));
          this.props.navigation.navigate('UserMain');
          //this.props.navigation.navigate('PersonalData');
        } else {
          this.props.navigation.navigate('Home');
        }
      });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff' }}>
        <Spinner visible={this.state.spinner_visible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
        <Grid>
          <Row size={1}></Row>
          <Row size={1}>
            <Col size={1}></Col>
            <Col size={1}><Text>Jungiamasi...</Text></Col>
            <Col size={1}></Col>
          </Row>
          <Row size={1}></Row>
        </Grid>
      </View>
    );
  }
}

export default Start;
