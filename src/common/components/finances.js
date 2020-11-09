import React, { useState } from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {Button, Icon, ButtonGroup, Input} from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';

import FiltersWrapper from './elements/filters_wrapper';
import FinancePieChart from './pie_charts/finances_pie_chart';
import FinanceLineChart from './line_charts/finances_line_chart';
import NavigatorBar from './elements/navigator_bar';
import ModalBar from './elements/modal_bar';
import styles from './styles/styles';
import {LIST_ARROW, SEARCH} from "../../image";

const Finances = ({ user, navigation }) => {
  const finances = user.finances.all;
  const [selectedNavIndex, setSelectedNavIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [allData, setAllData] = useState(finances.income);
  const [allDataCount, setAllDataCount] = useState(finances.income.length);

  const updateTypeIndex = (index) => {
    let current_data = index === 0 ? finances.income : finances.expense;
    if (searchText !== '') {
      current_data = current_data.filter(doc => doc.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    setSelectedTypeIndex(index);
    setAllData(current_data);
    setAllDataCount(current_data.length);
  };

  const updateSearchText = (text) => {
    let filtered_data;
    if (text !== '') {
      filtered_data = allData.filter(doc => doc.name.toLowerCase().includes(text.toLowerCase()));
    } else {
      filtered_data = selectedTypeIndex === 0 ? finances.income : finances.expense;
    }
    setAllData(filtered_data);
    setAllDataCount(filtered_data.length);
    setSearchText(text);
  };

  return(
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Bendrijos finansai"/>
      <Input
        name="search"
        leftIcon={
          <Image source={ SEARCH } style={styles.icon} />
        }
        containerStyle={{ marginLeft: 10, width: 390 }}
        onChangeText={text => updateSearchText(text)}
      />
      <ButtonGroup
        onPress={updateTypeIndex}
        selectedIndex={selectedTypeIndex}
        buttons={['Pajamos', 'Sąnaudos']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      <FiltersWrapper
        months_buttons={[3, 6, 12]}
        chart_buttons={['table', 'pie']}
        sort_by="date"
        list_rows={ListRows}
        modal={ModalView}
        group={true}
        line_chart={PieChart}
        all_data={allData}
        data_length={allDataCount}
      />
    </ScrollView>
  );
};

const ListRows = ({ key, data, action }) => {
  return(
    <Row style={styles.rowStyle} key={key}>
      <Col size={5}>
        <Text style={styles.table.title_text}>{data.name}</Text>
      </Col>
      <Col size={2}>
        <Text style={styles.table.regular_text}>{data.value} €</Text>
      </Col>
      <Col size={1}>
        <TouchableOpacity onPress={() => action(true, data.id)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ModalView = ({ data, action }) => {
  return (
    <ScrollView>
      <ModalBar action={action} value={0} />
      <Grid style={styles.gridStyle}>
        <Row>
          <Col>
            <Text style={{ ...styles.headerTitleText, marginLeft: 0 }}>{data.name}</Text>
          </Col>
        </Row>
        { data.all_data && Object.values(data.all_data).map(row => <ModalRow key={row.date} data={row} />) }
        <Row style={styles.rowStyle}>
          <Col size={3}>
            <Text style={styles.table.title_text}>Viso:</Text>
          </Col>
          <Col size={1}>
            <Text style={styles.table.title_text}>{data.value}</Text>
          </Col>
        </Row>
      </Grid>
    </ScrollView>
  );
};

const ModalRow = ({ data }) => {
  return (
    <Row style={styles.rowStyle}>
      <Col size={3}>
        <Text style={styles.table.regular_text}>{data.date}</Text>
      </Col>
      <Col size={1}>
        <Text style={styles.table.regular_text}>{data.value}</Text>
      </Col>
    </Row>
  );
};

const PieChart = ({ data }) => {
  return (
    <FinancePieChart data={data} />
  );
};

export default Finances;