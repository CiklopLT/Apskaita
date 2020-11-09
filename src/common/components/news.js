import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Image, Alert, TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview'
import { Icon, Button, Input } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import DocumentPicker from 'react-native-document-picker';

import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import ModalBar from './elements/modal_bar';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';
import { Camera } from 'expo-camera';
import CameraWrapper from './elements/camera_wrapper';
import {ADD_CIRCLE, ADD_IMAGE, LIST_ARROW, REMOVE, ARROW_UP, ARROW_DOWN} from "../../image";
import moment from "moment";

const News = ({ navigation, user }) => {
  const [news, setNews] = useState(user.news.all);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(0);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newUploadFiles, setNewUplaodFiles] = useState([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [photoPaths, setPhotoPaths] = useState([]);
  const [camera, setCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

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

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const uploaded_files = newUploadFiles;
      uploaded_files.push(res);
      setNewUplaodFiles(uploaded_files);
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
    const uploaded_files = newUploadFiles;
    const filtered = uploaded_files.filter(f => f.name !== file_name);
    setNewUplaodFiles(filtered);
    setUploadedFilesCount(filtered.length);
  };

  const createNews = () => {
    setSpinnerVisible(true);
    const request_data = {
      title: newSubject,
      text: newBody,
      file: photoPaths.concat(newUploadFiles),
    };
    request.newsCreate(request_data)
      .then((data) => {
        setSpinnerVisible(false);
        if (data.status) {
          const current_news = news;
          current_news.push({ ...request_data, id: data.data.id, date: moment().format('YYYY-MM-DD HH:mm') });
          setNews(current_news);
          setShowCreateNews(false);
          alert_proceed('Sėkmė', 'Naujiena sėkmingai išsaugota');
        } else {
          alert_proceed('Klaida', 'Naujiena išsaugoti nepavyko');
        }
      });
  };

  const setShowModal = (id) => {
    setShowNewsModal(true);
    setSelectedNewsId(id);
  };

  useEffect(() => {
    if (hasCameraPermission) return;
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === 'granted') setHasCameraPermission(true);
    })();
  });

  const rights = user.data.rights;

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <NavigatorBar navigation={navigation} heading="Informacija gyventojams"/>
      {
        rights <= 3 && !cameraMode &&
        <View>
          <View style={styles.right_view}>
            <Button
              buttonStyle={styles.button.toggle}
              titleStyle={styles.button.title_light}
              onPress={() => setShowCreateNews(!showCreateNews)}
              iconRight={true}
              icon={<Image source={ showCreateNews ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
              title='Kurti naują'
            />
          </View>
          {
            showCreateNews &&
            <React.Fragment>
              <View style={{ ...styles.center_view, marginTop: 0 }}>
                <Input
                  name="new_subject"
                  label="Pavadinimas"
                  defaultValue={newSubject}
                  labelStyle={styles.input.label}
                  containerStyle={{ width: 343 }}
                  onChangeText={text => setNewSubject(text)}
                />
                <Input
                  name="new_body"
                  label="Tekstas"
                  multiline={true}
                  numberOfLines={3}
                  defaultValue={newBody}
                  labelStyle={styles.input.label}
                  containerStyle={{ width: 343, marginTop: 20 }}
                  onChangeText={text => setNewBody(text)}
                />
              </View>
              <Grid style={{ marginLeft: 20, marginRight: 20 }}>
                <Row>
                  <Col size={4}>
                    {
                      newUploadFiles.length
                      ?
                        <Grid style={{ marginLeft: 20, marginRight: 20 }}>
                          <Row />
                          {newUploadFiles.map(f => <FilesList key={f.name} f={f} action={removeFile} />)}
                        </Grid>
                      :
                        <Text style={{ ...styles.table.regular_text, marginTop: 20, marginLeft: 20 }}>Pridėtų failų: {uploadedFilesCount}</Text>
                    }
                  </Col>
                  <Col size={4}>
                    <Button
                      onPress={() => addFile()}
                      iconRight={true}
                      icon={<Image source={ ADD_CIRCLE } style={{ ...styles.icon, marginLeft: 10 }} />}
                      buttonStyle={{ ...styles.button.add_items, marginTop: 20 }}
                      titleStyle={styles.button.title_light}
                      title='Pridėti failą'
                    />
                  </Col>
                </Row>
                <Row>
                  <Col size={4}>
                    {
                      photoPaths.length
                      ?
                        <Grid style={{ marginLeft: 20, marginRight: 20 }}>
                          <Row />
                          {photoPaths.map((photo, i) => <TakenImages key={photo} path={photo} index={i} action={removeImage} />)}
                        </Grid>
                      :
                        <Text style={{ ...styles.table.regular_text, marginTop: 20, marginLeft: 20 }}>Pridėtų nuotraukų: 0</Text>
                    }
                  </Col>
                  <Col size={4}>
                    <Button
                      iconRight={true}
                      icon={<Image source={ ADD_IMAGE } style={{ ...styles.icon, marginLeft: 10 }} />}
                      buttonStyle={{ ...styles.button.add_items, marginTop: 20 }}
                      titleStyle={styles.button.title_light}
                      onPress={() => setCameraMode(true)}
                      title='Pridėti nuotrauką'
                    />
                  </Col>
                </Row>
              </Grid>
              <View style={{ ...styles.center_view, marginTop: 0 }}>
                <Button
                  buttonStyle={{ ...styles.button.big, marginTop: 20 }}
                  titleStyle={styles.button.title}
                  onPress={() => createNews()}
                  title='Skelbti gyventojams'
                />
              </View>
            </React.Fragment>
          }
        </View>
      }
      {
        !cameraMode && !!news.length &&
        <Grid style={{ marginLeft: 20, marginRight: 20 }}>
          <Row />
          {news.sort((a, b) => Number(b.id) - Number(a.id)).map((one_new, i) => <ListRows key={i} data={one_new} action={setShowModal} />)}
        </Grid>
      }
      {
        !cameraMode && !news.length &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Nėra skelbiamų naujienų</Text>
        </View>
      }
      {
        !!cameraMode &&
        <CameraWrapper setCamera={setCamera} hasCameraPermission={hasCameraPermission} setCameraMode={setCameraMode} takePicture={takePicture}/>
      }
      <Modal
        animationType="fade"
        transparent={false}
        visible={showNewsModal}
      >
        <ModalView
          action={setShowNewsModal}
          news={news}
          setNews={setNews}
          selectedNewsId={selectedNewsId}
          user={user.data}
        />
      </Modal>
    </ScrollView>
  );
};

const ListRows = ({ data, action }) => {
  return(
    <Row style={styles.rowStyle}>
      <Col size={5}>
        <Text style={styles.table.title_text}>{data.title}</Text>
        <Text style={styles.table.regular_text}>{`Data: ${data.date}`}</Text>
      </Col>
      <Col size={1}>
        <TouchableOpacity onPress={() => action(data.id)}>
          <Image source={ LIST_ARROW } style={styles.icon} />
        </TouchableOpacity>
      </Col>
    </Row>
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

const TakenImages = ({ path, photo_paths, index, action }) => {
  return(
    <Row style={styles.rowStyle}>
      <Col size={2}>
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: path }}
        />
      </Col>
      <Col size={1} style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => action(index)}>
          <Image
            source={ REMOVE }
            style={styles.icon}
          />
        </TouchableOpacity>
      </Col>
    </Row>
  );
};

const ModalView = ({ action, setNews, news, user, selectedNewsId }) => {
  const data = news.find(this_new => this_new.id === selectedNewsId);
  if (!data) return false;
  const rights = user.rights;
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setDataComments] = useState(data.comments);

  const deleteNews = (id) => {
    Alert.alert(
      'Patvirtinti',
      'Ar tikrai norite ištrinti šią naujieną?',
      [
        {text: 'Ne', onPress: () => {}, style: 'cancel'},
        {text: 'Taip', onPress: () => {
            setSpinnerVisible(true);
            request.newsDelete({ id })
              .then((data) => {
                setSpinnerVisible(false);
                if (data.status) {
                  const current_news = news.filter(this_new => this_new.id !== id);
                  setNews(current_news);
                  alert_proceed('Sėkmė', 'Naujiena ištrinta sėkmingai');
                  action(false, 0);
                } else {
                  alert_proceed('Klaida', 'Naujienos ištrinti nepavyko');
                }
              });
          }}
      ],
      { cancelable: false }
    );
  };

  const addComment = (id) => {
    setSpinnerVisible(true);
    let request_data = {
      parent: id,
      text: newComment,
    };

    request.newsCommentCreate(request_data)
      .then((response_data) => {
        setSpinnerVisible(false);
        setNewComment('');
        if (response_data.status) {
          const current_comments = comments;
          current_comments.push({
            id: Math.max(...comments.map(m => Number(m.id))) + 1,
            name: `${user.name} ${user.surname}`,
            text: request_data.text,
            date: moment().format('YYYY-MM-DD HH:mm'),
          });
          const news_current = news.filter(this_new => this_new.id !== selectedNewsId);
          data.comments = current_comments;
          news_current.push(data);
          setDataComments(current_comments);
          setNews(news_current);
        } else {
          alert_proceed('Klaida', 'Komentaro išsaugoti nepavyko');
        }
      });
  };

  return (
    <ScrollView>
      <ModalBar action={action} value={0} />
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <Grid style={styles.gridStyle}>
        <Row>
          <Col size={3}>
            <Text style={styles.titleText}>{data.title}</Text>
          </Col>
          <Col size={1}>
            <Text style={styles.regularText}>{data.date}</Text>
          </Col>
          <Col size={1}>
          </Col>
        </Row>
        <Row style={{ marginTop: 20}}>
          <Col size={4}></Col>
          <Col size={1}>
            {rights <= 3 && <Icon name='delete' color='#212529' onPress={() => deleteNews(data.id)} /> }
          </Col>
        </Row>
        {
          data.url
            ?
            <Row>
              <WebView
                source={{uri: data.url}}
                scrollEnabled={true}
                style={{marginTop: 20, height: 250}}
              />
            </Row>
            :
            <Row>
              <Text>{data.text}</Text>
            </Row>
        }
        {
          !!comments &&
          <ScrollView style={{ height: 200 }}>
            {comments.sort((a, b) => Number(b.id) - Number(a.id)).map(comment => <Comment key={comment.id} comment={comment} />)}
          </ScrollView>
        }
        <Input
          name="new_comment"
          label="Jūsų komentaras"
          labelStyle={styles.input.label}
          containerStyle={{ width: 343 }}
          multiline={true}
          numberOfLines={3}
          defaultValue={newComment}
          onChangeText={text => setNewComment(text)}
        />
        <Button
          buttonStyle={{ ...styles.button.big, marginTop: 10}}
          titleStyle={styles.button.title}
          onPress={() => addComment(data.id)}
          title='Komentuoti'
        />
      </Grid>
    </ScrollView>
  );
};

const Comment = ({ comment }) => {
  return(
    <Row style={{ marginBottom: 10 }}>
      <Col size={2}>
        <Text style={styles.titleText}>{comment.name}</Text>
        <Text style={styles.regularText}>{comment.text}</Text>
      </Col>
      <Col size={1}>
        <Text style={styles.regularText}>{comment.date}</Text>
      </Col>
    </Row>
  );
};

export default News;
