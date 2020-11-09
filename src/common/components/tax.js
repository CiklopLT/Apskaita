import React, { useState } from 'react';
import {View, Text, ScrollView, Linking, Image, TouchableOpacity} from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {LIST_ARROW} from '../../image';

import TaxesLineChart from './line_charts/taxes_line_chart';
import TaxesPieChart from './pie_charts/taxes_pie_chart';
import FiltersWrapper from './elements/filters_wrapper';
import ModalBar from './elements/modal_bar';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';

const Tax = ({ user, navigation }) => {
  const current_tax = user.taxes.current;
  const all_taxes = user.taxes.all;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openUrl = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URI: ${url}`);
      }
    });
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <NavigatorBar navigation={navigation} heading="Mokesčiai" />
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={[`Mokėtina ${(current_tax && current_tax.payment) || 0} €`, 'Mokesčių istorija']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      {
        selectedIndex === 0 && !!current_tax &&
        <View>
          <View style={styles.center_view}>
            <Text style={styles.title}>
              {current_tax.date}
            </Text>
          </View>
          <MainTable data={current_tax} />
          {
            current_tax.payLink &&
            <View style={styles.center_view}>
              <Button
                buttonStyle={styles.button.small}
                titleStyle={styles.button.title}
                title={`Mokėti ${current_tax.payment} €`}
                onPress={() => openUrl(current_tax.payLink)}
              />
            </View>
          }
          {
            current_tax.details &&
            <React.Fragment>
              <DetailsTable data={current_tax.details} />
              <View style={styles.center_view}>
                <Button
                  buttonStyle={styles.button.small}
                  titleStyle={styles.button.title}
                  onPress={() => navigation.navigate('PdfView', {uri: current_tax.pdf})}
                  title='Atsisiųsti mokėjimo lapelį'
                />
              </View>
            </React.Fragment>
          }
        </View>
      }
      {
        selectedIndex === 1 &&
        <ScrollView style={{ height: 800, marginTop: 30 }}>
          <FiltersWrapper
            months_buttons={[3, 6, 12]}
            chart_buttons={['table', 'line', 'pie']}
            sort_by="date"
            list_rows={ListRows}
            list_rows_header={ListRowsHeader}
            line_chart={LineChart}
            pie_chart={PieChart}
            modal={ModalView}
            navigate={navigation.navigate}
            all_data={all_taxes}
            single_parameter="date"
          />
        </ScrollView>
      }
    </ScrollView>
  );
};

const ListRows = ({ data, action, key }) => {
  return(
    <Row style={styles.rowStyle} key={key}>
      <Col size={2}><Text style={styles.table.regular_text}>{data.date}</Text></Col>
      <Col size={2}><Text style={styles.table.regular_text}>{data.due}</Text></Col>
      <Col size={2}><Text style={styles.table.regular_text}>{data.payment}</Text></Col>
      <Col size={1}>
        <TouchableOpacity onPress={() => action(true, data.date)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ListRowsHeader = () => {
  return (
    <Row style={{ height: 20 }}>
      <Col size={2}><Text style={styles.table.title_text}>Data</Text></Col>
      <Col size={2}><Text style={styles.table.title_text}>Mokėtina suma</Text></Col>
      <Col size={2}><Text style={styles.table.title_text}>Apmokėta</Text></Col>
      <Col size={1} />
    </Row>
  );
};

const ModalView = ({ data, action, navigate }) => {
  return (
    <ScrollView>
      <ModalBar action={action} value={0} />
      <View style={{ ...styles.center_view, marginTop: 0 }}>
        <Text style={styles.title}>
          {data.date}
        </Text>
      </View>
      <MainTable data={data}/>
      <View style={styles.center_view}>
        <Button
          buttonStyle={styles.button.small}
          titleStyle={styles.button.title}
          onPress={() => {
            action(false, 0);
            navigate('PdfView', { uri: data.pdf });
          }}
          title='Atsisiųsti mokėjimo lapelį'
        />
      </View>
      { data.details && <DetailsTable data={data.details} /> }
    </ScrollView>
  );
};

const MainTable = ({ data }) => {
  return (
    <Grid style={{ marginLeft: 40, marginRight: 40, marginTop: 10 }}>
      <Row style={{ height: 50 }}>
        <Col style={styles.table.head} size={4}>
          <Text style={styles.table.title_text}>MOKĖTINA SUMA:</Text>
        </Col>
        <Col style={styles.table.head} size={4}>
          <Text style={styles.table.title_text}>{`${data.payment} €`}</Text>
        </Col>
      </Row>
      <Row style={{ height: 50 }}>
        <Col style={styles.table.col} size={4}>
          <Text style={styles.table.regular_text}>Priskaičiuota:</Text>
        </Col>
        <Col style={styles.table.col} size={4}>
          <Text style={styles.table.title_text}>{`${data.counted} €`}</Text>
        </Col>
      </Row>
      <Row style={{ height: 50 }}>
        <Col style={styles.table.col} size={4}>
          <Text style={styles.table.regular_text}>Skola/Permoka:</Text>
        </Col>
        <Col style={styles.table.col} size={4}>
          <Text style={styles.table.title_text}>{`${data.dept} €`}</Text>
        </Col>
      </Row>
      <Row style={{ height: 50 }}>
        <Col style={styles.table.col} size={4}>
          <Text style={styles.table.regular_text}>Įmokos:</Text>
        </Col>
        <Col style={styles.table.col} size={4}>
          <Text style={styles.table.title_text}>{`${data.payment} €`}</Text>
        </Col>
      </Row>
    </Grid>
  );
};

const DetailsTable = ({ data }) => {
  return (
    <Grid style={{ marginLeft: 40, marginRight: 40, marginTop: 20 }}>
      <Row style={{ height: 50 }}>
        <Col style={styles.table.head} size={8}>
          <Text style={styles.table.title_text}>MOKĖJIMO LAPELIS</Text>
        </Col>
      </Row>
      { Object.values(data).map(row => <DetailsRow key={row.name} data={row} />) }
    </Grid>
  );
};

const DetailsRow = ({ data }) => {
  return (
    <Row style={{ height: 50 }} >
      <Col style={styles.table.col} size={4}>
        <Text style={styles.table.regular_text}>{data.name}</Text>
      </Col>
      <Col style={styles.table.col} size={4}>
        <Text style={styles.table.title_text}>{`${data.moketina} €`}</Text>
      </Col>
    </Row>
  );
};

const LineChart = ({ data }) => {
  return (
    <TaxesLineChart data={data} />
  );
};

const PieChart = ({ data }) => {
  return (
    <TaxesPieChart data={data} />
  );
};

export default Tax;
