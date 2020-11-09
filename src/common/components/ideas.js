import React, { useState } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-community/picker';
import moment from 'moment';

import IdeasPieChart from './pie_charts/ideas_pie_chart';
import FiltersWrapper from './elements/filters_wrapper';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import ModalBar from './elements/modal_bar';
import * as request from '../../server/api';
import DocumentPicker from "react-native-document-picker";
import {ADD_CIRCLE, ARROW_DOWN, ARROW_UP, LIST_ARROW, REMOVE} from "../../image";
import styles from './styles/styles';

const status = {
  1: "Pasiūlytas",
  2: "Svarstomas",
  3: "Patvirtintas vykdymui",
  4: "Planuojamas",
  5: "Vykdomas",
  6: "Priduodamas",
  7: "Atliktas",
  8: "Patvirtintas",
  9: "Patvirtintas valdybos",
  10: "Patvirtintas susirinkimo",
  11: "Pristabdytas",
  12: "Atšauktas"
};

const type = {
  1: "Skubus",
  2: "Svarbus"
};

const Ideas = ({ user, navigation }) => {
  const [rows, setRows] = useState(user.ideas.all.rows);
  const [rowsLength, setRowsLength] = useState((rows && rows.length) || 0);
  const [showSpreadIdea, setShowSpreadIdea] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaContent, setIdeaContent] = useState('');
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showCreateIdea, setShowCreateIdea] = useState(false);
  const [ideaCreateName, setIdeaCreateName] = useState('');
  const [ideaCreateDescription, setIdeaCreateDescription] = useState('');
  const [ideaCreateType, setIdeaCreateType] = useState(1);
  const [ideaCreateStatus, setIdeaCreateStatus] = useState(1);
  const [ideaCreateEndDate, setIdeaCreateEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [ideaCreateUploadFiles, setIdeaCreateUploadFiles] = useState([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  const rights = user.data.rights;

  const spreadIdeaSubmit = () => {
    setSpinnerVisible(true);
    const request_data = {
      pavadinimas: ideaTitle,
      apibudinimas: ideaContent,
    };

    request.ideasSaveRequest(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data) {
          setShowSpreadIdea(false);
          alert_proceed('Sėkmė', 'Jūsų pasiūlymas sėkmingai užregistruotas');
        } else {
          alert_proceed('Klaida', 'Pasiūlymo užregistruoti nepavyko');
        }
      });
  };

  const createIdeaSubmit = () => {
    setSpinnerVisible(true);
    const request_data = {
      pavadinimas: ideaCreateName,
      apibudinimas: ideaCreateDescription,
      typeId: ideaCreateType,
      statusId: ideaCreateStatus,
      dueTo: ideaCreateEndDate,
      file: ideaCreateUploadFiles,
      statusChanged: moment().format('YYYY-MM-DD'),
    };

    request.ideasMasterCreateRequest(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data.status) {
          const current_rows = rows;
          current_rows.push(data.data);
          setRows(current_rows);
          setShowCreateIdea(false);
          setRowsLength(current_rows.length);
          alert_proceed('Sėkmė', 'Jūsų darbas sėkmingai užregistruotas');
        } else {
          alert_proceed('Klaida', 'Darbo užregistruoti nepavyko');
        }
      });
  };

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const uploaded_files = ideaCreateUploadFiles;
      uploaded_files.push(res);
      setIdeaCreateUploadFiles(uploaded_files);
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
    const filtered = ideaCreateUploadFiles.filter(f => f.name !== file_name);
    setIdeaCreateUploadFiles(filtered);
    setUploadedFilesCount(filtered.length);
  };

  return(
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Bendrijos darbai" />
      {
        rights <= 3 &&
        <View style={styles.right_view}>
          <Button
            buttonStyle={styles.button.toggle}
            titleStyle={styles.button.title_light}
            iconRight={true}
            icon={<Image source={ showSpreadIdea ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
            title='Siūlyti darbą'
            onPress={() => setShowSpreadIdea(!showSpreadIdea)}
          />
        </View>
      }
      {
        showSpreadIdea &&
        <View style={{ ...styles.center_view, marginTop: 0 }}>
          <Input
            name="idea_title"
            label="Pavadinimas"
            defaultValue={ideaTitle}
            labelStyle={styles.input.label}
            containerStyle={{ width: 343 }}
            onChangeText={text => setIdeaTitle(text)}
          />
          <Input
            name="idea_content"
            label="Aprašymas"
            multiline={true}
            numberOfLines={3}
            defaultValue={ideaContent}
            labelStyle={styles.input.label}
            containerStyle={{ width: 343 }}
            onChangeText={text => setIdeaContent(text)}
          />
          <Button
            buttonStyle={{ ...styles.button.big, marginTop: 20 }}
            titleStyle={styles.button.title}
            onPress={() => spreadIdeaSubmit()}
            title='Siūlyti'
          />
        </View>
      }
      {
        rights <= 3 &&
        <View style={styles.right_view}>
          <Button
            buttonStyle={styles.button.toggle}
            titleStyle={styles.button.title_light}
            iconRight={true}
            icon={<Image source={ showCreateIdea ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
            title='Kurti darbą'
            onPress={() => setShowCreateIdea(!showCreateIdea)}
          />
        </View>
      }
      {
        showCreateIdea &&
        <React.Fragment>
          <View style={{ ...styles.center_view, marginTop: 0 }}>
            <Input
              name="idea_create_title"
              label="Pavadinimas"
              defaultValue={ideaCreateName}
              labelStyle={styles.input.label}
              containerStyle={{ width: 343 }}
              onChangeText={text => setIdeaCreateName(text)}
            />
            <Input
              name="idea_create_content"
              label="Aprašymas"
              multiline={true}
              numberOfLines={3}
              defaultValue={ideaCreateDescription}
              labelStyle={styles.input.label}
              containerStyle={{ width: 343, marginTop: 10 }}
              onChangeText={text => setIdeaCreateDescription(text)}
            />
          </View>
          <Grid style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
            <Row>
              <Col size={3}>
                <Text style={{ ...styles.input.label, marginLeft: 25 }}>Tipas</Text>
              </Col>
              <Col size={5}>
                <Picker
                  selectedValue={ideaCreateType}
                  itemStyle={{ height: 120, width: 190, marginLeft: 20 }}
                  onValueChange={(itemValue) => setIdeaCreateType(itemValue)}>
                  { Object.entries(type).map(([key, value]) => <Picker.Item key={key} label={value} value={key} />)}
                </Picker>
              </Col>
            </Row>
          </Grid>
          <Grid style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
            <Row>
              <Col size={3}>
                <Text style={{ ...styles.input.label, marginLeft: 25 }}>Statusas</Text>
              </Col>
              <Col size={5}>
                <Picker
                  selectedValue={ideaCreateStatus}
                  itemStyle={{ height: 120, width: 190, marginLeft: 20 }}
                  onValueChange={(itemValue) => setIdeaCreateStatus(itemValue)}>
                  { Object.entries(status).map(([key, value]) => <Picker.Item key={key} label={value} value={key} />)}
                </Picker>
              </Col>
            </Row>
          </Grid>
          <Grid style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
            <Row>
              <Col size={3}>
                <Text style={{ ...styles.input.label, marginLeft: 25 }}>Terminas</Text>
              </Col>
              <Col size={5}>
                <DatePicker
                  style={{width: 190, marginLeft: 20}}
                  date={ideaCreateEndDate}
                  mode="date"
                  placeholder="Pasirinkite datą"
                  format="YYYY-MM-DD"
                  minDate={moment().format('YYYY-MM-DD')}
                  maxDate={moment().add(1, 'year').format('YYYY-MM-DD')}
                  showIcon={false}
                  confirmBtnText="Patvirtinti"
                  cancelBtnText="Atšaukti"
                  onDateChange={date => setIdeaCreateEndDate(date)}
                />
              </Col>
            </Row>
          </Grid>
          <Grid style={{marginLeft: 20, marginRight: 20}}>
            <Row>
              <Col size={3}>
                {
                  ideaCreateUploadFiles.length
                    ?
                    <Grid style={{marginLeft: 20, marginRight: 20}}>
                      <Row/>
                      {ideaCreateUploadFiles.map(f => <FilesList key={f.name} f={f} action={removeFile}/>)}
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
              onPress={() => createIdeaSubmit()}
              title='Kurti'
            />
          </View>
        </React.Fragment>
      }
      <FiltersWrapper
        months_buttons={[3, 6, -1]}
        chart_buttons={['table', 'pie']}
        sort_by="pasiulyta"
        list_rows={ListRows}
        line_chart={PieChart} // TODO: ugly solution
        modal={ModalView}
        all_data={rows}
        data_length={rowsLength}
      />
    </ScrollView>
  );
};

const ListRows = ({ key, data, action }) => {
  return(
    <Row style={styles.rowStyle} key={key}>
      <Col size={3}>
        <Text style={styles.table.title_text}>{data.pavadinimas}</Text>
        <Text style={styles.table.regular_text}>Autorius: {data.owner}</Text>
      </Col>
      <Col size={2}>
        <Text style={styles.table.regular_text}>Būsena: {status[data.statusId] || "Nėra"}</Text>
        <Text style={styles.table.regular_text}>Data: {data.pasiulyta}</Text>
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
      <Grid style={{ padding: 20 }}>
        <Row>
          <Col size={2}><Text style={styles.titleText}>Sukūrimo data: </Text></Col>
          <Col size={4}><Text style={styles.regularText}>{data.pasiulyta}</Text></Col>
        </Row>
        <Row>
          <Col size={2}><Text style={styles.titleText}>Pavadimas: </Text></Col>
          <Col size={4}><Text style={styles.regularText}>{data.pavadinimas}</Text></Col>
        </Row>
        <Row>
          <Col size={2}><Text style={styles.titleText}>Būsena: </Text></Col>
          <Col size={4}><Text style={styles.regularText}>{status[data.statusId] || "Nėra"}</Text></Col>
        </Row>
        <Row>
          <Col size={2}><Text style={styles.titleText}>Apibūdinimas: </Text></Col>
          <Col size={4}><Text style={styles.regularText}>{data.apibudinimas}</Text></Col>
        </Row>
        <Row>
          <Col size={2}><Text style={styles.titleText}>Terminas: </Text></Col>
          <Col size={4}><Text style={styles.regularText}>{data.dueTo || "-"}</Text></Col>
        </Row>
        <Row>
          <Col size={2}><Text style={styles.titleText}>Rūšis: </Text></Col>
          <Col size={4}><Text style={styles.regularText}>{type[data.typeId] || "Nėra"}</Text></Col>
        </Row>
      </Grid>
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


const PieChart = ({ data }) => {
  return (
    <IdeasPieChart data={data} />
  );
};

export default Ideas;
