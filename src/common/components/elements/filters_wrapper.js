import React, {useEffect, useState} from 'react';
import { ButtonGroup } from 'react-native-elements';
import {Image, View, Text} from 'react-native';
import { Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';
import moment from 'moment';

import styles from '../styles/styles';
import { LINE_CHART, PIE_CHART, LIST } from '../../../image';

const chart_icons = {
  line: () => <Image source={ LINE_CHART } style={styles.icon} />,
  pie: () => <Image source={ PIE_CHART } style={styles.icon} />,
  table: () => <Image source={ LIST } style={styles.icon} />
};

const group_data = (filteredData) => {
  const groupedData = {};
  filteredData.forEach((data) => {
    if (!groupedData[data.group_id]) {
      groupedData[data.group_id] = {
        id: data.group_id,
        name: data.name,
        value: 0,
        all_data: [],
      };
    }
    groupedData[data.group_id].value = (Number(groupedData[data.group_id].value) + Number(data.value)).toFixed(2);
    groupedData[data.group_id].all_data.push({
      date: data.date,
      value: data.value,
    })
  });
  return Object.values(groupedData);
};

const filter_data = (all_data, months, sort_by) => {
  if (!all_data || !all_data.length) return [];
  return all_data.filter(data => moment().subtract(months, 'months').isBefore(data[sort_by]))
};


const FiltersWrapper = ({ all_data, months_buttons, chart_buttons, sort_by, list_rows, list_rows_header, modal, group, pie_chart, line_chart, navigate, data_length, single_parameter = 'id'}) => {
  const [filteredData, setFilteredData] = useState(filter_data(all_data, months_buttons[0], sort_by));
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFilteredData(filter_data(all_data, months_buttons[0], sort_by))
  }, [data_length]);

  const updateMonthIndex = (monthIndex) => {
    let currentData = all_data;
    const months = Number(months_buttons[monthIndex]);
    if (months > 0) currentData = filter_data(currentData, months, sort_by);
    setFilteredData(currentData);
    setSelectedMonthIndex(monthIndex);
    setSelectedChartIndex(0);
  };

  const showModalAction = (type, id) => {
    setShowModal(type);
    setSelectedId(id);
  };

  const final_data = group ? group_data(filteredData) : filteredData;
  const single_data = selectedId && final_data && final_data.find(data => data[single_parameter] === selectedId);

  return(
    <View>
      {
        months_buttons &&
        <ButtonGroup
          onPress={updateMonthIndex}
          selectedIndex={selectedMonthIndex}
          buttons={months_buttons.map(button => Number(button) > 0 ? `${button} mėn` : "Visi")}
          containerStyle={styles.button_group.container}
          buttonStyle={styles.button_group.default}
          selectedButtonStyle={styles.button_group.selected}
          textStyle={styles.button_group.text}
          selectedTextStyle={styles.button_group.text}
          innerBorderStyle={styles.button_group.inner_border}
        />
      }
      {
        chart_buttons &&
        <ButtonGroup
          onPress={setSelectedChartIndex}
          selectedIndex={selectedChartIndex}
          buttons={chart_buttons.map(button => ({ element: chart_icons[button] }))}
          containerStyle={styles.button_group.container}
          buttonStyle={styles.button_group.default}
          selectedButtonStyle={styles.button_group.selected}
          textStyle={styles.button_group.text}
          selectedTextStyle={styles.button_group.text}
          innerBorderStyle={styles.button_group.inner_border}
        />
      }
      {
        selectedChartIndex === 0 && !!final_data.length &&
        <Grid style={styles.gridStyle}>
          {list_rows_header && list_rows_header()}
          {final_data.sort((a, b) => Number(b.id) - Number(a.id)).map((data, i) => list_rows({ key: i, data, action: showModalAction }))}
        </Grid>
      }
      {
        selectedChartIndex === 0 && !final_data.length &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Pasirinktu periodu įrašų nerasta</Text>
        </View>
      }
      {selectedChartIndex === 1 && !!filteredData.length && line_chart({ data: filteredData })}
      {
        selectedChartIndex === 1 && !filteredData.length &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Pasirinktu periodu įrašų nerasta</Text>
        </View>
      }
      {selectedChartIndex === 2 && !!final_data.length && pie_chart({ data: final_data })}
      {
        selectedChartIndex === 2 && !final_data.length &&
        <View style={styles.center_view}>
          <Text style={styles.h1Text}>Pasirinktu periodu įrašų nerasta</Text>
        </View>
      }
      <Modal
        animationType="fade"
        transparent={false}
        visible={showModal}
      >
        {modal({ key: single_data.id, data: single_data, action: showModalAction, navigate })}
      </Modal>
    </View>
  );
};

export default FiltersWrapper;