import React, { useState } from 'react';
import {Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Col, Row, Grid } from 'react-native-easy-grid';

import ModalBar from './elements/modal_bar';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';
import {LIST_ARROW} from "../../image";

const Invoices = ({ user, navigation }) => {
  const invoices_issued = user.invoices.issued;
  const invoices_received = user.invoices.received;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(0);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  let invoices = selectedIndex === 0 ? invoices_received : invoices_issued;
  const selected_invoice = selectedInvoiceId && invoices.find(invoice => invoice.id === selectedInvoiceId);
  if (selectedTypeIndex === 1) {
    invoices = invoices.filter(invoice => Number(invoice.paidAmount) === Number(invoice.total));
  } else if (selectedTypeIndex === 2) {
    invoices = invoices.filter(invoice => Number(invoice.paidAmount) !== Number(invoice.total));
  }

  const showModal = (value, id) => {
    setShowInvoiceModal(value);
    setSelectedInvoiceId(id);
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <NavigatorBar navigation={navigation} heading="Sąskaitos"/>
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={['Gautos', 'Išrašytos']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      <ButtonGroup
        onPress={setSelectedTypeIndex}
        selectedIndex={selectedTypeIndex}
        buttons={['Visos', 'Apmokėtos', 'Laukiančios apmokėjimo']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      <Grid style={styles.gridStyle}>
        <Row></Row>
        {
          invoices.map(invoice => <ListRows key={invoice.id} data={invoice} action={showModal} />)
        }
      </Grid>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showInvoiceModal}
      >
        <ModalView
          action={setShowInvoiceModal}
          data={selected_invoice}
          navigate={navigation.navigate}
        />
      </Modal>
    </ScrollView>
  );
};

const ListRows = ({ key, data, action }) => {
  return(
    <Row style={styles.rowStyleWider} key={key}>
      <Col size={2}>
        <Text style={styles.table.title_text}>{`${data.total} €`}</Text>
      </Col>
      <Col size={4} style={{ paddingRight: 10, paddingLeft: 10 }}>
        <Text style={styles.table.title_text}>{data.company_name}</Text>
        <Text style={styles.table.regular_text}>{data.oper}</Text>
      </Col>
      <Col size={2}>
        <Text style={styles.table.title_text}>Išrašymo data:</Text>
        <Text style={styles.table.regular_text}>{data.date}</Text>
      </Col>
      <Col size={1}>
        <TouchableOpacity onPress={() => action(true, data.id)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ModalView = ({ data, action, navigate }) => {
  return(
    <ScrollView>
      <ModalBar action={action} value={0} />
      <Grid style={{ ...styles.gridStyle, marginTop: 0 }}>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Gavimo data:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{data.date}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Įmonė:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{data.company_name}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Paskirtis:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{data.oper}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Sąskaitos numeris:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{data.number}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Suma:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{`${data.total} €`}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Apmokėti iki:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{data.dueTo}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Apmokėta:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{`${data.paidAmount} €`}</Text></Col>
        </Row>
        <Row style={{ ...styles.rowStyle, paddingRight: 10 }}>
          <Col size={2}><Text style={styles.table.title_text}>Liko apmokėti:</Text></Col>
          <Col size={3}><Text style={styles.table.regular_text}>{`${Number(data.total) - Number(data.paidAmount)} €`}</Text></Col>
        </Row>
      </Grid>
      {
        !!data.attachedDoc &&
        <Button
          buttonStyle={styles.button.small}
          titleStyle={styles.button.title}
          onPress={() => {
            action(false, 0);
            navigate('PdfView', { uri: data.attachedDoc });
          }}
          title='Atsisiųsti dokumentą'
        />
      }
      {
        !!data.pdf &&
        <Button
          buttonStyle={styles.button.small}
          titleStyle={styles.button.title}
          onPress={() => {
            action(false, 0);
            navigate('PdfView', { uri: data.pdf });
          }}
          title='Peržiūrėti PDF'
        />
      }
    </ScrollView>
  );
};

export default Invoices;
