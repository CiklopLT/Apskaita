import React, { useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import { Icon, ButtonGroup } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './styles/styles';
import NavigatorBar from './elements/navigator_bar';
import ModalBar from './elements/modal_bar';
import {ARROW_DOWN, ARROW_UP, LIST_ARROW} from "../../image";

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const Contacts = ({ user, navigation }) => {
  const [selectedNavIndex, setSelectedNavIndex] = useState(0);
  const [accountantShow, setAccountantShow] = useState(false);
  const [chairmanShow, setChairmanShow] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  const contacts = user.contacts.all;
  const serviceProviders = user.service_providers.all;
  const partners = user.partners.all;
  const rows = partners && partners.rows;

  const nav_buttons = ['Bendrijos', 'Paslaugų tiekėjų', 'Partnerių'];

  const showModal = (type, id) => {
    setShowCategoryModal(type);
    setSelectedCategoryId(id);
  };

  if (!contacts) {
    navigation.navigate('Home');
    return false;
  }

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <NavigatorBar navigation={navigation} heading="Kontaktai"/>
      <ButtonGroup
        onPress={setSelectedNavIndex}
        selectedIndex={selectedNavIndex}
        buttons={nav_buttons}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      {
        selectedNavIndex === 0 &&
        <Grid style={styles.gridStyle}>
          <Row>
            <Col><Text style={styles.titleText}>Pavadinimas:</Text></Col>
            <Col>
              <Text style={styles.regularText}>{entities.decode(contacts.name)}</Text>
            </Col>
          </Row>
          <Row>
            <Col><Text style={styles.titleText}>Kodas:</Text></Col>
            <Col><Text style={styles.regularText}>{contacts.code}</Text></Col>
          </Row>
          <Row>
            <Col><Text style={styles.titleText}>Adresas:</Text></Col>
            <Col><Text style={styles.regularText}>{entities.decode(contacts.address)}, {entities.decode(contacts.city)}</Text></Col>
          </Row>
          <Row style={{ marginTop: 20, paddingBottom: 15, borderBottomColor: '#616161', borderBottomWidth: 0.5 }}>
            <Col size={4}>
              <Text style={styles.titleText}>{contacts.pirmininkas_pareigos}</Text>
              <Text style={{...styles.regularText}}>{`${contacts.pirmininkas_name} ${contacts.pirmininkas_surname}`}</Text>
            </Col>
            <Col size={1}>
              <TouchableOpacity onPress={() => setChairmanShow(!chairmanShow)}>
                <Image source={ chairmanShow ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />
              </TouchableOpacity>
            </Col>
          </Row>
          {
            chairmanShow &&
            <Row>
              <Col>
                <Text style={{...styles.regularText, marginTop: 10}}>Tel.: {contacts.pirmininkas_phone}</Text>
                <Text style={styles.regularText}>El. paštas: {contacts.pirmininkas_email}</Text>
              </Col>
            </Row>
          }
          <Row style={{ marginTop: 20, paddingBottom: 5, borderBottomColor: '#616161', borderBottomWidth: 0.5 }}>
            <Col size={4}>
              <Text style={styles.titleText}>{contacts.buh_pareigos || '-'}</Text>
              <Text style={{...styles.regularText, marginBottom: 10}}>{`${contacts.buh_name} ${contacts.buh_surname}`}</Text>
            </Col>
            <Col size={1}>
              <TouchableOpacity onPress={() => setAccountantShow(!accountantShow)}>
                <Image source={ accountantShow ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />
              </TouchableOpacity>
            </Col>
          </Row>
          {
            accountantShow &&
            <Row>
              <Col>
                <Text style={{...styles.regularText, marginTop: 10}}>Tel.: {contacts.buh_phone}</Text>
                <Text style={styles.regularText}>El. paštas: {contacts.buh_email}</Text>
              </Col>
            </Row>
          }
        </Grid>
      }
      {
        selectedNavIndex === 1 && serviceProviders &&
        <View>
          { serviceProviders.map(provider => <ProvidersList key={provider.id} data={provider} />) }
        </View>
      }
      {
        selectedNavIndex === 1 && !serviceProviders &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Paslaugų tiekėjų nerasta</Text>
        </View>
      }
      {
        selectedNavIndex === 2 && !!partners.categories.length &&
        <Grid style={styles.gridStyle}>
          {
            partners.categories.map(category => <ListRows key={category.id} category={category} action={showModal} />)
          }
        </Grid>
      }
      {
        selectedNavIndex === 2 && !partners.categories.length &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Partnerių nerasta</Text>
        </View>
      }
      <Modal
        animationType="fade"
        transparent={false}
        visible={showCategoryModal}
      >
        <ModalView rows={rows} selectedCategoryId={selectedCategoryId} action={showModal} />
      </Modal>
    </ScrollView>
  );
};

const ListRows = ({ category, action, key }) => {
  return(
    <Row style={styles.rowStyle} key={key} >
      <Col size={5}><Text style={styles.table.regular_text}>{category.name}</Text></Col>
      <Col size={1}>
        <TouchableOpacity onPress={() => action(true, category.id)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ProvidersList = ({ data }) => {
  const [show, setShow] = useState(false);

  return(
    <Grid style={styles.gridStyle}>
      <Row style={styles.rowStyle}>
        <Col size={2}>
          <Text style={styles.titleText}>{data.service}</Text>
          <Text style={styles.regularText}>{data.name}</Text>
        </Col>
        <Col size={1}>
          <Icon
            name={(show ? 'chevron-up' : 'chevron-down')}
            type='font-awesome'
            color='#0D2C64'
            onPress={() => setShow(!show)}
          />
        </Col>
      </Row>
      {
        show &&
        <Row>
          <Col>
            <Text style={styles.regularText}>Tel.: {data.phone}</Text>
            <Text style={styles.regularText}>Tel. 2: {data.phone2}</Text>
            <Text style={styles.regularText}>El. paštas: {data.email}</Text>
            <Text style={styles.regularText}>El. paštas 2: {data.email2}</Text>
            <Text style={styles.regularText}>WWW: {data.www}</Text>
          </Col>
        </Row>
      }
    </Grid>
  );
};

const PartnersList = ({ data }) => {
  return (
    <Row style={styles.rowStyleWider}>
      <Col size={3}>
        <Text style={styles.titleText}>{data.pavadinimas}</Text>
        <Text style={styles.regularText}>{data.apibudinimas}</Text>
      </Col>
      <Col size={1}>
        <Grid>
          <Row style={styles.rowStars}>
            { [...Array(Number(data.rating)).keys()].map(rating => <StarRate key={rating} />) }
          </Row>
          <Row>
            <Col>
              <Text style={styles.regularText}>{data.city}</Text>
              <Text style={styles.regularText}>{data.created.split(' ')[0]}</Text>
            </Col>
          </Row>
        </Grid>
      </Col>
    </Row>
  );
};

const StarRate = () => (
  <Col>
    <Icon name="star" color='#0D2C64' />
  </Col>
);

const ModalView = ({ rows, selectedCategoryId, action }) => {
  const selected_categories = Object.values(rows).filter(row => row.catId === selectedCategoryId);
  return(
    <ScrollView>
      <ModalBar action={action} value={0} />
      <Grid style={styles.gridStyle}>
        <Row></Row>
        { selected_categories.map(category => <PartnersList key={category.id} data={category} />) }
      </Grid>
    </ScrollView>
  );
};

export default Contacts;
