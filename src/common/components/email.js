import React, { useState } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Button, CheckBox, Input} from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import DocumentPicker from "react-native-document-picker";

import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';
import {ADD_CIRCLE, ARROW_DOWN, ARROW_UP, CIRCLE, CIRCLE_O, REMOVE} from "../../image";

const Email = ({ user, navigation }) => {
  const emails = user.emails;
  let recipients_list = new Set();
  if (emails && emails.recipients) emails.recipients.forEach(rec => recipients_list.add(rec.id));

  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showCreateEmail, setShowCreateEmail] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [enableAll, setEnableAll] = useState(true);
  const [_enabledCount, setEnabledCount] = useState(recipients_list.size);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [recipientsList, setRecipientsList] = useState(recipients_list);

  const sendEmail = () => {
    setSpinnerVisible(true);
    const request_data = {
      subject: newSubject,
      text: newBody,
      file: uploadFiles,
      receivers: [...recipientsList].join(','),
    };

    request.emailSend(request_data)
      .then((data) => {
        setShowCreateEmail(false);
        setSpinnerVisible(false);
        if (data.status) {
          alert_proceed('Sėkmė', 'El. laiškai išsiųsti sėkmingai');
        } else {
          alert_proceed('Klaida', 'El. laiškų išsiųsti nepavyko');
        }
      });
  }

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const uploaded_files = uploadFiles;
      uploaded_files.push(res);
      setUploadFiles(uploaded_files);
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
    const filtered = uploadFiles.filter(f => f.name !== file_name);
    setUploadFiles(filtered);
    setUploadedFilesCount(filtered.length);
  };

  const handleRecipientAllChange = () => {
    setRecipientsList(!enableAll ? recipients_list : new Set());
    setEnableAll(!enableAll);
    setEnabledCount(recipientsList.size);
  };

  const handleRecipientChange = (id, value) => {
    let new_recipients_list = recipientsList;
    value ? new_recipients_list.add(id) : new_recipients_list.delete(id);
    setRecipientsList(new_recipients_list);
    setEnabledCount(new_recipients_list.size);
    setEnableAll(recipientsList.size === recipients_list.size);
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <NavigatorBar navigation={navigation} heading="Siųsti el. laišką"/>
      <View style={{ ...styles.headerStyle, marginTop: 0 }}>
        <View style={styles.right_view}>
          <Button
            buttonStyle={styles.button.toggle}
            titleStyle={styles.button.title_light}
            iconRight={true}
            icon={<Image source={ showContacts ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
            title='Pasirinkti gavėjus'
            onPress={() => setShowContacts(!showContacts)}
          />
        </View>
        {
          !!showContacts && !!emails.recipients &&
          <React.Fragment>
            <CheckBox
              title='jungti/Išjungti visus'
              checkedIcon={<Image source={ CIRCLE_O } style={styles.icon} />}
              uncheckedIcon={<Image source={ CIRCLE } style={styles.icon} />}
              uncheckedColor={styles.radio.circle_inactive_color}
              checkedColor={styles.radio.circle_active_color}
              checked={enableAll}
              onPress={() => handleRecipientAllChange()}
            />
            {
              emails.recipients.map((rec) => {
                const active = recipientsList.has(rec.id);
                return (
                  <CheckBox
                    key={rec.id}
                    title={`${rec.name} ${rec.surname}`}
                    checkedIcon={<Image source={CIRCLE_O} style={styles.icon}/>}
                    uncheckedIcon={<Image source={CIRCLE} style={styles.icon}/>}
                    uncheckedColor={styles.radio.circle_inactive_color}
                    checkedColor={styles.radio.circle_active_color}
                    checked={active}
                    onPress={() => handleRecipientChange(rec.id, !active)}
                  />
                )
              })
            }
          </React.Fragment>
        }
        {
          !!showContacts && !emails.recipients &&
          <View style={{ ...styles.center_view, marginBottom: 20 }}>
            <Text style={styles.h1Text}>Nėra aktyvių gavėjų, siuntimas negalimas</Text>
          </View>
        }
        <React.Fragment>
          <View style={{ ...styles.center_view, marginTop: 0 }}>
            <Input
              name="new_subject"
              label="Tema"
              labelStyle={styles.input.label}
              containerStyle={{ width: 343 }}
              defaultValue={newSubject}
              onChangeText={text => setNewSubject(text)}
            />
            <Input
              name="new_body"
              label="Kurti el. laišką"
              multiline={true}
              numberOfLines={3}
              defaultValue={newBody}
              labelStyle={styles.input.label}
              containerStyle={{ width: 343, marginTop: 20 }}
              onChangeText={text => setNewBody(text)}
            />
          </View>
          <Grid style={{marginLeft: 20, marginRight: 20}}>
            <Row>
              <Col size={3}>
                {
                  uploadFiles.length
                    ?
                    <Grid style={{marginLeft: 20, marginRight: 20}}>
                      <Row/>
                      {uploadFiles.map(f => <FilesList key={f.name} f={f} action={removeFile}/>)}
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
              onPress={() => sendEmail()}
              title='Siųsti'
            />
          </View>
        </React.Fragment>
      </View>
      {
        emails.all && !!emails.all.length
          ?
            <Grid style={styles.gridStyle}>
              <Row><Text>Išsiųsti</Text></Row>
              {emails.all.map(email => <SentList key={email.id} data={email} />)}
            </Grid>
          :
            <View style={styles.center_view}>
              <Text style={styles.h1Text}>Nėra išsiųstų laiškų</Text>
            </View>
      }
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

const SentList = ({ data }) => {
  return (
    <Row style={styles.rowStyle}>
      <Col size={1}>
        <Text style={styles.table.regular_text}>{data.time}</Text>
      </Col>
      <Col size={2}>
        <Text style={styles.table.title_text}>{data.subject}</Text>
      </Col>
    </Row>
  );
};

export default Email;
