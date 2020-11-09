import React, { useState } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Button, ButtonGroup, Input } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import RNFetchBlob from 'rn-fetch-blob'
import Spinner from 'react-native-loading-spinner-overlay';

import NavigatorBar from './elements/navigator_bar';
import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import styles from './styles/styles';
import DocumentPicker from "react-native-document-picker";
import {ADD_CIRCLE, SEARCH, FILE, ARROW_UP, ARROW_DOWN, REMOVE} from "../../image";

const Docs = ({ user, navigation }) => {
  let docs = user.docs.all;
  const rights = user.data.rights;

  const [selectedNavIndex, setSelectedNavIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileDescription, setUploadFileDescription] = useState('');
  const [uploadFile, setUploadFile] = useState([]);
  const [uploadFileCount, setUploadFileCount] = useState(0);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const nav_buttons = ['Visi', 'Paviešinti', 'Nepaviešinti'];
  if (selectedNavIndex === 1 || rights > 3) {
    docs = docs.filter(doc => doc.public === '1');
  } else if (selectedNavIndex === 2) {
    docs = docs.filter(doc => doc.public === '0');
  }
  if (searchText !== '') docs = docs.filter(doc => doc.name.toLowerCase().includes(searchText.toLowerCase()));

  const downloadFile = (doc) => {
    const config = {
      fileCache : true,
      addAndroidDownloads : {
        notification : true,
        title : 'Failo atsisiuntimas',
        description : `${doc.name}.${doc.type}`,
        mediaScannable : true,
        useDownloadManager : true,
      },
    };

    RNFetchBlob
      .config(config)
      .fetch('GET', doc.link, {})
      .then((res) => {
        alert_proceed('Sėkmė', `Failas sėkmingai išsaugotas ${res.path()}`);
      })
      .catch(() => alert_proceed('Klaida', 'Failas išsaugoti nepavyko!'))
  };

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const uploaded_files = uploadFile;
      uploaded_files.push(res);
      setUploadFile(uploaded_files);
      setUploadFileCount(uploaded_files.length);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('FilePickerManager Error: ', err);
      }
    }
  };

  const removeFile = (file_name) => {
    const filtered = uploadFile.filter(f => f.name !== file_name);
    setUploadFile(filtered);
    setUploadFileCount(filtered.length);
  };

  const uploadFileRequest = () => {
    setSpinnerVisible(true);
    const request_data = {
      name: uploadFileName,
      description: uploadFileDescription,
      file: uploadFile
    };

    if (!request_data.file) alert_proceed('Klaida', 'Failas neprikabintas');

    request.docsUploadRequest(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data) {
          alert_proceed('Sėkmė', 'Failas nusiųstas sėkmingai');
        } else {
          alert_proceed('Klaida', data.msg);
        }
      });
  };

  return(
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}} />
      <NavigatorBar navigation={navigation} heading="Dokumentai" />
      {
        rights <= 3 &&
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
      }
      <Input
        name="search"
        leftIcon={
          <Image source={ SEARCH } style={styles.icon} />
        }
        containerStyle={{ marginLeft: 10, width: 390 }}
        onChangeText={text => setSearchText(text)}
      />
      <View style={styles.right_view}>
        <Button
          iconRight={true}
          icon={<Image source={ showUploadFile ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
          buttonStyle={styles.button.toggle}
          titleStyle={styles.button.title_light}
          title='Įkelti dokumentą'
          onPress={() => setShowUploadFile(!showUploadFile)}
        />
      </View>
      {
        showUploadFile &&
        <React.Fragment>
          <View style={{ ...styles.center_view, marginTop: 0 }}>
            <Input
              name="name"
              label="Pavadinimas"
              labelStyle={styles.input.label}
              containerStyle={{ width: 343 }}
              onChangeText={text => setUploadFileName(text)}
            />
            <Input
              name="description"
              label="Aprašymas"
              labelStyle={styles.input.label}
              containerStyle={{ width: 343 }}
              onChangeText={text => setUploadFileDescription(text)}
            />
          </View>
          <Grid style={{marginLeft: 20, marginRight: 20}}>
            <Row>
              <Col size={3}>
                {
                  uploadFile.length
                    ?
                    <Grid style={{marginLeft: 20, marginRight: 20}}>
                      <Row/>
                      {uploadFile.map(f => <FilesList key={f.name} f={f} action={removeFile}/>)}
                    </Grid>
                    :
                    <Text style={{...styles.table.regular_text, marginTop: 20, marginLeft: 20}}>Pridėtų failų: {uploadFileCount}</Text>
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
              onPress={() => uploadFileRequest()}
              title='Įkelti'
            />
          </View>
        </React.Fragment>
      }
      { docs && docs.map((doc, i) => <DocRow key={i} doc={doc} action={downloadFile} />) }
    </ScrollView>
  );
};

const DocRow = ({ doc, action }) => {
  return (
    <Grid style={styles.gridStyle}>
      <Row style={{}}>
        <Col size={4}>
          <Text style={styles.regularText}>{doc.category}</Text>
          <Text style={styles.titleText}>{doc.name}</Text>
        </Col>
        <Col size={2}>
          <Text style={styles.regularText}>Data: {doc.date}</Text>
          <TouchableOpacity onPress={() => action(doc)}>
            <Image source={ FILE } style={styles.icon} />
          </TouchableOpacity>
        </Col>
      </Row>
    </Grid>
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

export default Docs;
