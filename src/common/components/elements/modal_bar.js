import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {ARROW_BACK} from '../../../image';
import styles from '../styles/styles';

const custom_styles = {
  top_bar: {
    marginTop: 30,
  }
};

const ModalBar = ({ action, value }) => {
  return (
    <View style={custom_styles.top_bar}>
      <TouchableOpacity onPress={() => action(false, value)}>
        <Image
          source={ ARROW_BACK }
          style={{ ...styles.icon, marginLeft: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ModalBar;
