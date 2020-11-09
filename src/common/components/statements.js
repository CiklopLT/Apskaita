import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';

import * as request from '../../server/api';
import * as actions from '../actions/actions';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';

const Statements = ({ user, navigation, dispatch }) => {
  const accounts = user.statements && user.statements.accounts;
  if (!accounts) return false;

  const [statements, setStatements] = useState(user.statements && user.statements.all);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadOnce, setLoadOnce] = useState(false);

  const selected_account = accounts[selectedIndex];
  let st_grouped = {};
  if (statements) {
    st_grouped = statements.reduce((groups, item) => {
      const val = item['date'];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }

  const updateIndex = (index) => {
    setSpinnerVisible(true);
    const request_data = { acc_id: accounts[selectedIndex].accId };
    request.statementsRequest(request_data)
      .then((data) => {
        dispatch(actions.set_statements_data(data.data));
        setStatements(data.data.rows);
        setSelectedIndex(index);
        setSpinnerVisible(false);
      });
  };

  useEffect(() => {
    if (!loadOnce) {
      const request_data = { acc_id: accounts[0].accId };
      request.statementsRequest(request_data)
        .then(data => {
          dispatch(actions.set_statements_data(data.data));
          setStatements(data.data.rows);
          setLoadOnce(true);
        });
    }
  });

  return(
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <NavigatorBar navigation={navigation} heading="Bankų išrašai"/>
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={accounts.map(acc => acc.name)}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      <View style={styles.center_view}>
        <Text style={styles.h1Text}>Likutis {selected_account.amount} €</Text>
      </View>
      <View style={styles.center_view}>
        <Text style={styles.titleText}>Paskutinį kartą naujinta {selected_account.updated}</Text>
      </View>
      {
        Object.entries(st_grouped).map(([key, value]) => <StatementDay key={key} data={value} date={key} />)
      }
    </ScrollView>
  );
};

const StatementDay = ({ date, data }) => {
  return (
    <Grid style={styles.gridStyle}>
      <Row><Text style={styles.h1TextColor}>{date}</Text></Row>
      { data.map((st, i) => <DetailsRow key={`${st.date}_${i}`} data={st} />) }
    </Grid>
  );
};

const DetailsRow = ({ data }) => {
  return (
    <Row style={styles.rowStyleMedium}>
      <Col size={2}><Text style={styles.h1Text}>{data.amount} €</Text></Col>
      <Col size={6}>
        <Text style={styles.table.title_text}>{data.payer || '-'}</Text>
        <Text style={styles.table.regular_text}>{data.date}</Text>
      </Col>
    </Row>
  );
};

export default Statements;
