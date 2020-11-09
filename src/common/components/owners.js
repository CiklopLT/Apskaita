import React, { useState } from 'react';
import {Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { Input, ButtonGroup } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';

import ModalBar from './elements/modal_bar';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';
import {LIST_ARROW, SEARCH} from "../../image";

const Owners = ({ user, navigation }) => {
  let owners = user.owners && user.owners.all;

  const [selectedOwnerId, setSelectedOwnerId] = useState(0);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const show_modal = (type, owner_id) => {
    setShowOwnerModal(type);
    setSelectedOwnerId(owner_id);
  };

  const single_owner = showOwnerModal && owners.find(owner => owner.id === selectedOwnerId);
  if (searchText !== '') {
    owners = owners.filter(owner => owner.name.includes(searchText) || owner.surname.includes(searchText) || owner.username.includes(searchText));
  }
  if (selectedOrderIndex === 0) {
    owners = owners.sort((a, b) => {
      if (a.username < b.username) return -1;
      if (a.username > b.username) return 1;
      return 0;
    });
  } else if (selectedOrderIndex === 1) {
    owners = owners.sort((a, b) => {
      if (a.address < b.address) return -1;
      if (a.address > b.address) return 1;
      return 0;
    });
  }
  if (selectedPropertyIndex === 1) {
    owners = owners.filter(owner => owner.properties.some(prop => prop.type === 'flats'));
  } else if (selectedPropertyIndex === 2) {
    owners = owners.filter(owner => owner.properties.some(prop => prop.type === 'garages'));
  }

  return(
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <NavigatorBar navigation={navigation} heading="Savininkai"/>
      <Input
        name="search"
        leftIcon={
          <Image source={ SEARCH } style={styles.icon} />
        }
        containerStyle={{ marginLeft: 10, width: 390 }}
        onChangeText={text => setSearchText(text)}
      />
      <ButtonGroup
        onPress={setSelectedOrderIndex}
        selectedIndex={selectedOrderIndex}
        buttons={['Rūšiuoti pagal vardą', 'Rūšiuoti pagal adresą']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      <ButtonGroup
        onPress={setSelectedPropertyIndex}
        selectedIndex={selectedPropertyIndex}
        buttons={['Visi turto vienetai', 'Butai', 'Garažai']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      <Grid style={styles.gridStyle}>
        <Row></Row>
        { owners && owners.map(owner => <ListRows key={owner.id} data={owner} action={show_modal}/>) }
      </Grid>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showOwnerModal}
      >
        <ModalView
          action={show_modal}
          data={single_owner}
        />
      </Modal>
    </ScrollView>
  );
};

const ListRows = ({ key, data, action }) => {
  return(
    <Row style={styles.rowStyle} key={key}>
      <Col size={5}>
        <Text style={styles.table.title_text}>{data.name} {data.surname} ({data.username})</Text>
        <Text style={styles.table.regular_text}>{data.address}</Text>
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
  console.log(data.properties);
  return(
    <ScrollView>
      <ModalBar action={action} value={0} />
      <Grid style={styles.gridStyle}>
        <Row style={{ marginBottom: 10 }}>
          <Col size={1}>
            <Text style={styles.table.title_text}>Vardas Pavardė</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.table.regular_text}>{data.name} {data.surname}</Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col size={1}>
            <Text style={styles.table.title_text}>Adresas</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.table.regular_text}>{data.address}</Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col size={1}>
            <Text style={styles.table.title_text}>Turimas statusas</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.table.regular_text}>{data.arnarys ? 'Narys' : 'Ne narys'}</Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col size={1}>
            <Text style={styles.table.title_text}>Turto vienetas/ai</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.table.regular_text}>{data.properties.map(prop => `${prop.type || '-'} : ${prop.name || '-'} `)}</Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col size={1}>
            <Text style={styles.table.title_text}>Telefono numeris</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.table.regular_text}>{data.phone}</Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col size={1}>
            <Text style={styles.table.title_text}>El. pašto adresas</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.table.regular_text}>{data.email}</Text>
          </Col>
        </Row>
      </Grid>
    </ScrollView>
  );
};

export default Owners;
