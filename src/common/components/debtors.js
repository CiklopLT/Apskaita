import React, { useState } from 'react';
import {Text, ScrollView} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Slider } from "@miblanchard/react-native-slider";

import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';

const Debtors = ({ user, navigation }) => {
  const [deptRangeFrom, setDeptRangeFrom] = useState(0);
  const [deptRangeTo, setDeptRangeTo] = useState(1000);

  let debtors = user.debtors.all;
  const all_debts = debtors && debtors.map(deb => Number(deb.skola));
  const max_value = Math.max(...all_debts);
  if (deptRangeTo <= max_value) debtors = debtors.filter(deb => Number(deb.skola) < deptRangeTo);
  if (deptRangeFrom > 0) debtors = debtors.filter(deb => Number(deb.skola) > deptRangeFrom);
  const balance = ((all_debts && all_debts.reduce((deb, curr) => deb + curr, 0)) || 0).toFixed(2);

  return(
    <ScrollView style={{ backgroundColor: 'white' }}>
      <NavigatorBar navigation={navigation} heading="Skolininkai"/>
      <Grid style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
        <Row style={{ paddingLeft: 5 }}>
          <Text style={styles.table.title_text}>{`Skolos filtras: [${deptRangeFrom}, ${deptRangeTo}] €`}</Text>
        </Row>
        <Slider
          animateTransition
          maximumTrackTintColor="#989595"
          maximumValue={1000}
          minimumTrackTintColor="#FFC944"
          minimumValue={0}
          step={10}
          thumbTintColor="#F1F1F1"
          value={[deptRangeFrom, deptRangeTo]}
          onValueChange={val => {
            setDeptRangeFrom(val[0]);
            setDeptRangeTo(val[1]);
          }}
        />
      </Grid>

      <Grid style={{ ...styles.gridStyle, marginTop: 0 }}>
        <Row style={styles.rowStyle}>
          <Col size={4}>
            <Text style={styles.titleText}>Viso:</Text>
          </Col>
          <Col size={1}>
            <Text style={styles.titleText}>{`${balance} €`}</Text>
          </Col>
        </Row>
        { debtors && debtors.map((debtor, i) => <ListRows key={i} data={debtor} />) }
      </Grid>
    </ScrollView>
  );
};

const ListRows = ({ data }) => {
  return(
    <Row style={styles.rowStyle}>
      <Col size={4}>
        <Text style={styles.table.title_text}>{data.name} {data.surname}</Text>
      </Col>
      <Col size={1}>
        <Text style={styles.table.regular_text}>{`${data.skola} €`}</Text>
      </Col>
    </Row>
  );
};

export default Debtors;
