import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button, ButtonGroup, Input } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Camera } from 'expo-camera';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import {ADD_CIRCLE, ADD_IMAGE, LIST_ARROW, REMOVE} from '../../image';

import FiltersWrapper from './elements/filters_wrapper';
import * as request from '../../server/api';
import MeterLineChartScreen from './line_charts/meters_line_chart';
import ModalBar from './elements/modal_bar';
import NavigatorBar from './elements/navigator_bar';
import alert_proceed from './elements/alert_proceed';
import styles from './styles/styles';
import CameraWrapper from "./elements/camera_wrapper";

const Meter = ({ navigation, user }) => {
  const available_meters = (user.meters && user.meters.available) || [];
  const meters_history = (user.meters && user.meters.history) || [];
  const date = moment().format('YYYY-MM-DD');

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMeterIndex, setSelectedMeterIndex] = useState(0);
  const [metersTo, setMetersTo] = useState(0);
  const [notes, setNotes] = useState('');
  const [notesCollapsed, setNotesCollapsed] = useState(true);
  const [camera, setCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [photoPaths, setPhotoPaths] = useState([]);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const current_meters = available_meters[selectedMeterIndex];
  const meters_from = current_meters && current_meters.from;
  const meter_buttons = available_meters.map(meter => meter.tax_name);
  const meters_diff = meters_from ? Number(metersTo) - Number(meters_from) : 0;

  const takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    const photo_paths = photoPaths;
    photo_paths.push(photo.uri);
    setPhotoPaths(photo_paths);
    setCameraMode(false);
  };

  const removeImage = (index) => {
    const photo_paths = photoPaths;
    delete photo_paths[index];
    const paths_copy = photo_paths.filter(n => !!n);
    setPhotoPaths(paths_copy);
  };

  const handleMeterSubmit = () => {
    setSpinnerVisible(true);
    const meters = available_meters[selectedMeterIndex];
    const request_data = {
      obj_id: meters.obj_id,
      tax_id: meters.tax_id,
      date,
      nuo: meters.from,
      iki: metersTo,
      notes,
      file: photoPaths
    };

    if (Number(request_data.nuo) >= Number(request_data.iki)) {
      setSpinnerVisible(false);
      alert_proceed('Klaida', 'Klaidingi deklaravimo duomenys (NUO/IKI)');
    } else {
      request.meterSaveRequest(request_data)
        .then((data) => {
          setSpinnerVisible(false);
          if (data.status) {
            alert_proceed('Sėkmė', 'Skaitiklio rodmenys sėkmingai deklaruoti');
          } else {
            alert_proceed('Klaida', data.msg);
          }
        });
    }
  };

  useEffect(() => {
    if (hasCameraPermission) return;
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === 'granted') setHasCameraPermission(true);
    })();
  });

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Skaitikliai" />
      {
        !cameraMode &&
        <ButtonGroup
          onPress={setSelectedIndex}
          selectedIndex={selectedIndex}
          buttons={[`Deklaruoti`, 'Deklaravimų istorija']}
          containerStyle={styles.button_group.container}
          buttonStyle={styles.button_group.default}
          selectedButtonStyle={styles.button_group.selected}
          textStyle={styles.button_group.text}
          selectedTextStyle={styles.button_group.text}
          innerBorderStyle={styles.button_group.inner_border}
        />
      }
      {
        selectedIndex === 0 && !cameraMode && !!current_meters &&
        <View>
          <ScrollView>
            <View style={styles.center_view}>
              <Text style={styles.title}>{date}</Text>
            </View>
            <ButtonGroup
              onPress={setSelectedMeterIndex}
              selectedIndex={selectedMeterIndex}
              buttons={meter_buttons}
              containerStyle={styles.button_group.container}
              buttonStyle={styles.button_group.default}
              selectedButtonStyle={styles.button_group.selected}
              textStyle={styles.button_group.text}
              selectedTextStyle={styles.button_group.text}
              innerBorderStyle={styles.button_group.inner_border}
            />
            <Grid style={{ marginLeft: 40, marginRight: 40, marginTop: 10 }}>
              <Row style={{ height: 50 }}>
                <Col style={styles.table.head} size={3}>
                  <Text>Nuo</Text>
                </Col>
                <Col style={styles.table.head} size={3}>
                  <Text>Iki</Text>
                </Col>
                <Col style={styles.table.head} size={3}>
                  <Text>Skirtumas</Text>
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Col style={styles.table.col} size={3}><Text>{meters_from || 0}</Text></Col>
                <Col style={styles.table.col} size={3}>
                  <Input
                    name="meters_to"
                    keyboardType='numeric'
                    width={80}
                    onChangeText={(text) => setMetersTo(text)}
                  />
                </Col>
                <Col style={styles.table.col} size={3}>
                  <Text>{meters_diff >= 0 ? meters_diff : '-'}</Text>
                </Col>
              </Row>
            </Grid>
            <View style={styles.center_view}>
              <Button
                iconRight={true}
                icon={<Image source={ ADD_CIRCLE } style={{ ...styles.icon, marginLeft: 10 }} />}
                buttonStyle={styles.button.small_light}
                titleStyle={styles.button.title_light}
                onPress={() => setNotesCollapsed(!notesCollapsed)}
                title='Pridėti pastabą'
              />
              {
                !notesCollapsed &&
                <View style={styles.center_view}>
                  <Input
                    name="notes"
                    label="Pastabos tekstas"
                    multiline={true}
                    numberOfLines={3}
                    defaultValue={notes}
                    labelStyle={styles.input.label}
                    containerStyle={{ width: 343 }}
                    onChangeText={text => setNotes(text)}
                  />
                </View>
              }
            </View>
            <View style={styles.center_view}>
              <Button
                iconRight={true}
                icon={<Image source={ ADD_IMAGE } style={{ ...styles.icon, marginLeft: 10 }} />}
                buttonStyle={styles.button.small_light}
                titleStyle={styles.button.title_light}
                onPress={() => setCameraMode(true)}
                title='Pridėti nuotrauką'
              />
              {
                !!photoPaths.length &&
                <Grid style={{ marginLeft: 40, marginRight: 40, marginTop: 10 }}>
                  {photoPaths.map((photo, i) => <TakenImages key={photo} path={photo} index={i} action={removeImage} />)}
                </Grid>
              }
            </View>
            <View style={styles.center_view}>
              <Button
                buttonStyle={styles.button.big}
                titleStyle={styles.button.title}
                title="PATEIKTI"
                onPress={() => handleMeterSubmit()}
              />
            </View>
          </ScrollView>
        </View>
      }
      {
        selectedIndex === 1 && !cameraMode &&
        <ScrollView style={{ height: 800, marginTop: 30 }}>
          <FiltersWrapper
            months_buttons={[3, 6, 12]}
            chart_buttons={['table', 'line']}
            sort_by="date"
            list_rows={ListRows}
            list_rows_header={ListRowsHeader}
            line_chart={LineChart}
            modal={ModalView}
            navigate={navigation.navigate}
            all_data={meters_history}
            single_parameter="id"
          />
        </ScrollView>
      }
      {
        !current_meters && !cameraMode &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Nėra galimų deklaravimų</Text>
        </View>
      }
      {
        cameraMode &&
        <CameraWrapper setCamera={setCamera} hasCameraPermission={hasCameraPermission} setCameraMode={setCameraMode} takePicture={takePicture}/>
      }
    </ScrollView>
  );
};

const TakenImages = ({ path, action, index }) => {
  return (
    <Row>
      <Col style={{ width: 55 }}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: path }}
        />
      </Col>
      <Col style={{ width: 25 }}>
        <TouchableOpacity onPress={() => action(index)}>
          <Image
            source={ REMOVE }
            style={styles.icon}
          />
        </TouchableOpacity>
      </Col>
    </Row>
  )
};

const ModalView = ({ data, action }) => {
  return(
    <ScrollView>
      <ModalBar action={action} value={0} />
      <View style={{ ...styles.center_view, marginTop: 0 }}>
        <Text style={styles.title}>
          {data.date}
        </Text>
      </View>
      <View style={{ ...styles.center_view, marginTop: 0, marginBottom: 10 }}>
        <Text style={{ ...styles.title, opacity: 1 }}>
          {data.tax_name}
        </Text>
      </View>
      <Grid style={{ marginLeft: 40, marginRight: 40, marginTop: 10 }}>
        <Row style={{ height: 50 }}>
          <Col style={styles.table.head} size={3}>
            <Text>Nuo</Text>
          </Col>
          <Col style={styles.table.head} size={3}>
            <Text>Iki</Text>
          </Col>
          <Col style={styles.table.head} size={3}>
            <Text>Skirtumas</Text>
          </Col>
        </Row>
        <Row style={{ height: 50 }}>
          <Col style={styles.table.col} size={3}><Text>{data.from}</Text></Col>
          <Col style={styles.table.col} size={3}><Text>{data.to}</Text></Col>
          <Col style={styles.table.col} size={3}><Text>{data.diff}</Text></Col>
        </Row>
        {
          !!data.notes &&
          <Row style={{ height: 50 }}>
            <Col style={styles.table.col} size={9}><Text>{data.notes}</Text></Col>
          </Row>
        }
      </Grid>
    </ScrollView>
  );
};

const ListRows = ({ data, action, key }) => {
  return(
    <Row style={styles.rowStyle} key={key} >
      <Col size={2}><Text style={styles.table.regular_text}>{data.date}</Text></Col>
      <Col size={5}><Text style={styles.table.regular_text}>{data.tax_name}</Text></Col>
      <Col size={2}><Text style={styles.table.regular_text}>{data.diff}</Text></Col>
      <Col size={1}>
        <TouchableOpacity onPress={() => action(true, data.id)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ListRowsHeader = () => {
  return (
    <Row style={{ height: 20 }}>
      <Col size={2}><Text style={styles.titleText}>Data</Text></Col>
      <Col size={5}><Text style={styles.titleText}>Skaitiklis</Text></Col>
      <Col size={2}><Text style={styles.titleText}>Skirtumas</Text></Col>
      <Col size={1} />
    </Row>
  );
};

const LineChart = ({ data }) => {
  return (
    <MeterLineChartScreen data={data} />
  );
};

export default Meter;
