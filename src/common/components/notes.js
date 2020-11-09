import React, { useState } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import { Alert } from 'react-native';

import * as request from '../../server/api';
import alert_proceed from './elements/alert_proceed';
import NavigatorBar from './elements/navigator_bar';
import styles from './styles/styles';
import {ARROW_DOWN, ARROW_UP, EDIT, REMOVE} from "../../image";

const Notes = ({ user, navigation }) => {
  const rights = user.data.rights;
  const [notes, setNotes] = useState((user.notes && user.notes.all) || []);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    setSpinnerVisible(true);
    const request_data = {
      name: newTitle,
      text: newNote,
    };

    request.notesSave(request_data)
      .then((data) => {
        setShowAddNote(false);
        setSpinnerVisible(false);
        if (data && data.status) {
          const new_note = { id: data.data.id, title: request_data.name, text: request_data.text };
          const updated_notes = notes;
          updated_notes.push(new_note);
          setNotes(updated_notes);
          setNewNote('');
          setNewTitle('');
          alert_proceed('Sėkmė', 'Įrašas išsaugotas sėkmingai');
        } else {
          alert_proceed('Klaida', 'Įrašo išsaugoti nepavyko');
        }
      });
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Spinner visible={spinnerVisible} textContent={"Palaukite..."} textStyle={{color: '#FFF'}}/>
      <NavigatorBar navigation={navigation} heading="Užrašinė"/>
      {
        rights <= 3 &&
        <View style={styles.right_view}>
          <Button
            buttonStyle={styles.button.toggle}
            titleStyle={styles.button.title_light}
            iconRight={true}
            icon={<Image source={ showAddNote ? ARROW_UP : ARROW_DOWN } style={{ ...styles.icon, marginLeft: 10 }} />}
            title='Pridėti įrašą'
            onPress={() => setShowAddNote(!showAddNote)}
          />
        </View>
      }
      {
        showAddNote &&
        <View style={{ ...styles.center_view, marginTop: 20 }}>
          <Input
            name="new_title"
            label="Pavadinimas"
            defaultValue={newTitle}
            labelStyle={styles.input.label}
            containerStyle={{ width: 343, marginBottom: 20 }}
            onChangeText={text => setNewTitle(text)}
          />
          <Input
            name="new_note"
            label="Užrašai"
            multiline={true}
            numberOfLines={3}
            labelStyle={styles.input.label}
            containerStyle={{ width: 343 }}
            defaultValue={newNote}
            onChangeText={text => setNewNote(text)}
          />
          <Button
            buttonStyle={{ ...styles.button.big, marginTop: 20 }}
            titleStyle={styles.button.title}
            onPress={() => addNote()}
            title='Pridėti'
          />
        </View>
      }
      {
        notes.length
          ?
            <Grid style={{ ...styles.gridStyle, marginTop: 0 }}>
              <Row></Row>
              {notes.sort((a, b) => Number(b.id) - Number(a.id)).map(note => <ListRows key={note.id} data={note} spinner_action={setSpinnerVisible} />)}
            </Grid>
          :
            <View style={styles.center_view}>
              <Text style={styles.h1Text}>Nėra sukurtų užrašų</Text>
            </View>
      }
    </ScrollView>
  );
};

const ListRows = ({ data, spinner_action }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [editNote, setEditNote] = useState(data.text);

  const updateNote = () => {
    spinner_action(true);
    const request_data = {
      id: data.id,
      name: data.title,
      text: data.edit_note,
    };

    request.notesSave(request_data)
      .then((data) => {
        spinner_action(false);
        setShowEdit(false);
        if (data) {
          alert_proceed('Sėkmė', 'Įrašas pakoreguotas sėkmingai');
        } else {
          alert_proceed('Klaida', 'Įrašo koregavimas nepavyko');
        }
      });
  };

  const deleteNote = () => {
    const request_data = {
      id: data.id
    };

    Alert.alert(
      'Patvirtinti',
      'Ar tikrai norite ištrinti šį užrašą?',
      [
        {text: 'Ne', onPress: () => {}, style: 'cancel'},
        {text: 'Taip', onPress: () => {
            spinner_action(true);
            request.notesDelete(request_data)
              .then((data) => {
                spinner_action(false);
                if (data) {
                  alert_proceed('Sėkmė', 'Įrašas ištrintas sėkmingai');
                } else {
                  alert_proceed('Klaida', 'Klaida ištrynimo metu');
                }
              });
          }},
      ],
      { cancelable: false }
    );
  };

  const rowHeight = showEdit ? 300 : 100;
  return(
    <Row style={{ ...styles.rowStyle, height: rowHeight, overflow: 'hidden' }}>
      {
        showEdit &&
        <Col size={4}>
          <Text style={styles.table.title_text}>{data.title}</Text>
          <Input
            name="edit_note"
            multiline={true}
            numberOfLines={3}
            defaultValue={editNote}
            labelStyle={styles.input.label}
            containerStyle={{ width: 343 }}
            onChangeText={text => setEditNote(text)}
          />
          <Grid style={{ marginTop: 10 }}>
            <Row>
              <Col size={2} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  buttonStyle={{ ...styles.button.small, width: 150 }}
                  titleStyle={styles.button.title}
                  title='Redaguoti'
                  onPress={() => updateNote()}
                />
              </Col>
              <Col size={2} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  buttonStyle={{ ...styles.button.small_light, width: 150 }}
                  titleStyle={styles.button.title_light}
                  title='Atšaukti'
                  onPress={() => setShowEdit(false)}
                />
              </Col>
            </Row>
          </Grid>
        </Col>
      }
      {
        !showEdit &&
        <React.Fragment>
          <Col size={7} style={{ paddingRight: 10 }}>
            <Text style={styles.table.title_text}>{data.title}</Text>
            <Text style={styles.table.regular_text}>{data.text}</Text>
          </Col>
          <Col size={1}>
            <TouchableOpacity onPress={() => setShowEdit(true)}>
              <Image source={ EDIT } style={styles.icon} />
            </TouchableOpacity>
          </Col>
          <Col size={1}>
            <TouchableOpacity onPress={() => deleteNote()}>
              <Image source={ REMOVE } style={styles.icon} />
            </TouchableOpacity>
          </Col>
        </React.Fragment>
      }
    </Row>
  )
};

export default Notes;
