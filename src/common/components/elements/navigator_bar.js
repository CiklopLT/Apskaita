import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {BURGER, ARROW_BACK_W, HOME_W} from '../../../image';
import styles from '../styles/styles';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const custom_styles = {
  top_bar: {
    backgroundColor: '#194E8B',
    paddingTop: getStatusBarHeight(true) + 13,
    height: getStatusBarHeight(true) + 56,
  }
};

const NavigatorBar = ({ navigation, heading }) => {
  const nav_icon = heading === 'Pradžia' ? BURGER : ARROW_BACK_W;
  return (
    <View style={custom_styles.top_bar}>
      <Grid>
        <Row>
          <Col size={1}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={ nav_icon }
                style={{ ...styles.icon, marginLeft: 10 }}
              />
            </TouchableOpacity>
          </Col>
          <Col size={5}>
            <Text style={{ fontSize: 16, color: '#ffffff', fontFamily: 'OpenSans-Regular' }}>{heading}</Text>
          </Col>
          <Col size={1}>
            <TouchableOpacity onPress={() => navigation.navigate('UserMain')}>
              <Image
                source={ HOME_W }
                style={{ ...styles.icon, marginLeft: 10 }}
              />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    </View>
  );
};

export default NavigatorBar;
