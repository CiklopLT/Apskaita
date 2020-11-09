import React, { useState } from 'react';
import { Text, View, Dimensions } from 'react-native';

import { Icon } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Switch from 'react-native-switch-pro';

import styles from '../styles/styles';

const ATTR = 'diff';
const CHART_COLORS = {
  40: {
    id: 40,
    title: 'Karštas vanduo',
    opacity_color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    hex_color: '#8641F4',
  },
  43: {
    id: 43,
    title: 'Šildymas',
    opacity_color: (opacity = 1) => `rgba(23, 132, 68, ${opacity})`,
    hex_color: '#178444',
  }
};

const format_labels = (data) => {
  let x_axis_set = new Set();
  data.forEach((meter) => {
    const date = meter.date.split('-');
    x_axis_set.add(`${date[1]}.${date[2]}`);
  });
  return [...x_axis_set].reverse();
};

const format_sets = (data, labels) => {
  const data_sets = {};
  Object.values(CHART_COLORS).forEach(chart => {
    data_sets[chart.title] = { id: chart.id, color: chart.opacity_color, data: [] };
    const filtered_data = data.filter(meter => Number(meter.tax_id) === chart.id);
    if (filtered_data.length) {
      labels.forEach(label => {
        const current_value = filtered_data.find(f => {
          const splitted_date = f.date.split('-');
          const formatted_date = `${splitted_date[1]}.${splitted_date[2]}`;
          return formatted_date === label;
        });
        data_sets[chart.title].data.push(current_value ? Number(current_value[ATTR]) : 0);
      });
    } else {
      labels.forEach(() => data_sets[chart.title].data.push(0))
    }
  });
  return Object.values(data_sets);
};

const MeterLineChartScreen = ({ data }) => {

  const labels = format_labels(data);
  let data_sets = format_sets(data, labels);
  const [active_sets, setActiveSets] = useState(new Set(Object.keys(CHART_COLORS).map(c => Number(c))));
  const [sets_size, setActiveSetsSize] = useState(active_sets.size);

  data_sets = data_sets.filter(set => active_sets.has(set.id));

  return (
    <View style={{flex: 1, height: 600}} >
      <View style={{ ...styles.container, paddingLeft: 5}}>
        <LineChart
          data={{
            labels: labels,
            datasets: data_sets,
          }}
          width={Dimensions.get('window').width - 10}
          height={220}
          chartConfig={{
            backgroundColor: '#0D2C64',
            backgroundGradientFrom: '#3166c4',
            backgroundGradientTo: '#000712',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 8 }}
        />
        <Grid style={{ marginLeft: 20, marginRight: 20 }}>
          {
            Object.values(CHART_COLORS).map(color => {
              return (
                <Row style={styles.rowStyle} key={color.id}>
                  <Col style={{ width: 30 }}><Icon name='fiber-manual-record' color={color.hex_color} /></Col>
                  <Col size={3}><Text style={{ lineHeight: 22 }}>{color.title}</Text></Col>
                  <Col size={1}>
                    <Switch
                      value={active_sets.has(color.id)}
                      backgroundActive="#FFD56C"
                      backgroundInactive="#989595"
                      circleColorActive="#FCBD2E"
                      circleColorInactive="#F1F1F1"
                      onSyncPress={value => {
                        if (value) {
                          active_sets.add(color.id);
                        } else {
                          active_sets.delete(color.id);
                        }
                        setActiveSets(active_sets);
                        setActiveSetsSize(active_sets.size);
                      }}
                    />
                  </Col>
                </Row>
              );
            })
          }
        </Grid>
      </View>
    </View>
  );
};

export default MeterLineChartScreen;
