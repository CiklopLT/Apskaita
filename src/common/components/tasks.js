import React, { useState } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Icon, Button, Input, ButtonGroup } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-community/picker';

import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import ModalBar from './elements/modal_bar';
import * as request from '../../server/api';
import styles from './styles/styles';
import {ADD_CIRCLE, ARROW_DOWN, ARROW_UP, LIST_ARROW, REMOVE} from "../../image";

const type = {
  0: "Kita",
  1: "Darbo sntykių pakeitimai",
  2: "Turto vienetų pakeitimai",
  3: "Skubus apmokėjimas, atsiskaitymas",
  4: "Ataskaitų reikalavimas",
  5: "Gyventojų mokėjimo duomenys",
  6: "Mokesčių gyventojams pakeitimai",
  7: "Vėluojami pateikti dokumentai"
};

const months = {
  1: "Sausis",
  2: "Vasaris",
  3: "Kovas",
  4: "Balandis",
  5: "Gegužė",
  6: "Birželis",
  7: "Liepa",
  8: "Rugpjūtis",
  9: "Rugsėjis",
  10: "Spalis",
  11: "Lapkritis",
  12: "Gruodis"
}

const Tasks = ({ user, navigation }) => {
  const rights = user.data.rights;
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [taskType, setTaskType] = useState(0);
  const [taskDue, setTaskDue] = useState(moment().format('YYYY-MM'));
  const [taskComment, setTaskComment] = useState(moment().format('YYYY-MM'));
  const [showSaveTask, setShowSaveTask] = useState(false);
  const [taskSaveUploadFiles, setTaskSaveUploadFiles] = useState([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  const effectsMonth = useState(moment().format('YYYY-MM'));
  const tasks = user.tasks && user.tasks.all;

  if (!tasks) {
    navigation.navigate('Home');
    return false;
  }

  const saveTask = () => {
    setSpinnerVisible(true);
    const request_data = {
      apibudinimas: taskComment,
      itakoja_men: effectsMonth,
      atlikti_iki: taskDue,
      tipas: taskType,
      file: taskSaveUploadFiles,
    };

    request.tasksSave(request_data)
      .then((data) => {
        setShowSaveTask(false);
        setSpinnerVisible(false);
        if (data) {
          alert_proceed('Sėkmė', 'Darbas pateiktas sėkmingai');
        } else {
          alert_proceed('Klaida', 'Darbo pateikti nepavyko');
        }
      });
  };

  const saveComment = (id) => {
    setSpinnerVisible(true);
    const request_data = {
      parent: id,
      text: comment,
    };

    request.tasksSaveReply(request_data)
      .then((data) => {
        setShowComment(false);
        setSpinnerVisible(false);
        if (data) {
          alert_proceed('Sėkmė', 'Jūsų komentaras sėkmingai išsaugotas');
        } else {
          alert_proceed('Klaida', 'Komentaro išsaugoti nepavyko');
        }
      });
  }

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const uploaded_files = taskSaveUploadFiles;
      uploaded_files.push(res);
      setTaskSaveUploadFiles(uploaded_files);
      setUploadedFilesCount(uploaded_files.length);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('FilePickerManager Error: ', err);
      }
    }
  };

  const removeFile = (file_name) => {
    const filtered = taskSaveUploadFiles.filter(f => f.name !== file_name);
    setTaskSaveUploadFiles(filtered);
    setUploadedFilesCount(filtered.length);
  };

  const openModal = (show, id) => {
    setSelectedId(id);
    setShowModal(show);
  };

  const single_data = selectedId && tasks.filter(data => data.id === selectedId)[0];
  const filtered_tasks = (tasks && tasks.length && tasks.filter(task => task.executor === selectedIndex)) || [];

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Darbų nurodymai" />
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={['Pirmininkui', 'Buhalteriui']}
        containerStyle={styles.button_group.container}
        buttonStyle={styles.button_group.default}
        selectedButtonStyle={styles.button_group.selected}
        textStyle={styles.button_group.text}
        selectedTextStyle={styles.button_group.text}
        innerBorderStyle={styles.button_group.inner_border}
      />
      {
        rights <= 3 &&
        <View style={styles.right_view}>
          <Button
            buttonStyle={styles.button.toggle}
            titleStyle={styles.button.title_light}
            iconRight={true}
            icon={<Image source={ showSaveTask ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
            title='Pateikti darbą'
            onPress={() => setShowSaveTask(!showSaveTask)}
          />
        </View>
      }
      {
        showSaveTask &&
        <React.Fragment>
          <Grid style={{ marginLeft: 20, marginRight: 20 }}>
            <Row>
              <Col size={3}>
                <Text style={{ ...styles.input.label, marginLeft: 25, paddingTop: 10 }}>Tipas</Text>
              </Col>
              <Col size={5}>
                <Picker
                  selectedValue={taskType}
                  itemStyle={{ height: 120, width: 190, marginLeft: 20 }}
                  onValueChange={itemValue => setTaskType(itemValue)}>
                  { Object.entries(type).map(([key, value]) => <Picker.Item key={key} label={value} value={key} />)}
                </Picker>
              </Col>
            </Row>
          </Grid>
          <Grid style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
            <Row>
              <Col size={3}>
                <Text style={{ ...styles.input.label, marginLeft: 25 }}>Atlikti iki</Text>
              </Col>
              <Col size={5}>
                <DatePicker
                  style={{width: 190, marginLeft: 20}}
                  date={taskDue}
                  mode="date"
                  placeholder="Pasirinkite datą"
                  format="YYYY-MM-DD"
                  minDate={moment().format('YYYY-MM-DD')}
                  maxDate={moment().add(1, 'year').format('YYYY-MM-DD')}
                  showIcon={false}
                  confirmBtnText="Patvirtinti"
                  cancelBtnText="Atšaukti"
                  onDateChange={date => setTaskDue(date)}
                />
              </Col>
            </Row>
          </Grid>
          <View style={{ ...styles.center_view, marginTop: 20 }}>
            <Input
              name="idea_create_title"
              label="Pavadinimas"
              defaultValue={taskComment}
              labelStyle={styles.input.label}
              containerStyle={{ width: 343 }}
              onChangeText={text => setTaskComment(text)}
            />
          </View>
          <Grid style={{marginLeft: 20, marginRight: 20}}>
            <Row>
              <Col size={3}>
                {
                  taskSaveUploadFiles.length
                    ?
                    <Grid style={{marginLeft: 20, marginRight: 20}}>
                      <Row/>
                      {taskSaveUploadFiles.map(f => <FilesList key={f.name} f={f} action={removeFile}/>)}
                    </Grid>
                    :
                    <Text style={{...styles.table.regular_text, marginTop: 20, marginLeft: 20}}>Pridėtų failų: {uploadedFilesCount}</Text>
                }
              </Col>
              <Col size={4}>
                <Button
                  onPress={() => addFile()}
                  iconRight={true}
                  icon={<Image source={ADD_CIRCLE} style={{...styles.icon, marginLeft: 10}}/>}
                  buttonStyle={{...styles.button.add_items, marginTop: 20, marginRight: 25}}
                  titleStyle={styles.button.title_light}
                  title='Pridėti failą'
                />
              </Col>
            </Row>
          </Grid>
          <View style={{ ...styles.center_view, marginTop: 0, marginBottom: 20 }}>
            <Button
              buttonStyle={{ ...styles.button.big, marginTop: 20 }}
              titleStyle={styles.button.title}
              onPress={() => saveTask()}
              title='Pateikti'
            />
          </View>
        </React.Fragment>
      }
      <Grid style={{ ...styles.gridStyle, marginTop: 0 }}>
        <Row></Row>
        {filtered_tasks.map(task => <ListRows key={task.id} data={task} action={openModal} />)}
      </Grid>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showModal}
      >
        <ModalView
          data={single_data}
          action={setShowModal}
          showComment={showComment}
          coment={comment}
          action_comment={setComment}
          changeShowComment={setShowComment}
          action_submit_comment={saveComment}
        />
      </Modal>
    </ScrollView>
  );
};

const ListRows = ({ key, data, action }) => {
  return(
    <Row style={{ ...styles.rowStyle, height: 90 }} key={key}>
      <Col size={2}>
        <Text style={styles.table.title_text}>Atlikti iki:</Text>
        <Text style={styles.table.regular_text}>{data.atlikti_iki}</Text>
      </Col>
      <Col size={5} style={{ overflow: 'hidden', marginBottom: 15 }}>
        <Text style={styles.table.regular_text}>Būsena: {data.apibudinimas}</Text>
      </Col>
      <Col size={1} style={{ paddingLeft: 10 }}>
        <TouchableOpacity onPress={() => action(true, data.id)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ModalView = ({ data, action, showComment, comment, action_comment, changeShowComment, action_submit_comment }) => {
  return (
    <ScrollView>
      <ModalBar action={action} value={0} />
      <View>
        <Grid style={styles.gridStyle}>
          <Row style={{ marginBottom: 10 }}>
            <Col size={2}>
              <Text style={styles.table.title_text}>Darbas pateiktas:</Text>
            </Col>
            <Col size={3}>
              <Text style={styles.table.regular_text}>{data.pateikta}</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col size={2}>
              <Text style={styles.table.title_text}>Atlikti iki:</Text>
            </Col>
            <Col size={3}>
              <Text style={styles.table.regular_text}>{data.atlikti_iki}</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col size={2}>
              <Text style={styles.table.title_text}>Atlikta:</Text>
            </Col>
            <Col size={3}>
              <Text style={styles.table.regular_text}>{data.atlikta}</Text>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col size={2}>
              <Text style={styles.table.title_text}>Apibūdinimas:</Text>
            </Col>
            <Col size={3}>
              <Text style={styles.table.regular_text}>{data.apibudinimas}</Text>
            </Col>
          </Row>
        </Grid>
        <Input
          name="comment"
          label="Komentaras"
          multiline={true}
          numberOfLines={3}
          defaultValue={comment}
          labelStyle={styles.input.label}
          containerStyle={{ width: 343 }}
          onChangeText={(text) => action_comment(text)}
        />
        <Button
          buttonStyle={{ ...styles.button.big, marginTop: 20 }}
          titleStyle={styles.button.title}
          onPress={() => action_submit_comment(data.id)}
          title='Komentuoti'
        />
      </View>
    </ScrollView>
  );
};

const FilesList = ({ f, action }) => {
  return(
    <Row style={styles.rowStyle}>
      <Col size={2}>
        <Text style={styles.table.title_text}>{f.name}</Text>
      </Col>
      <Col size={1} style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => action(f.name)}>
          <Image
            source={ REMOVE }
            style={styles.icon}
          />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

export default Tasks;
