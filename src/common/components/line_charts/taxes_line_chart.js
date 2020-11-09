import React, {useState} from 'react';
import {Text, View, processColor, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Switch from 'react-native-switch-pro';
import styles from '../styles/styles';

const map_y_axis = (data, attr) => data.map(tax => ({ y: Number(tax[attr]) }));

const CHART_COLORS = {
  due: {
    id: 'due',
    title: 'Mokėtina suma',
    opacity_color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    hex_color: '#8641F4',
  },
  counted: {
    id: 'counted',
    title: 'Priskaitymai be komisinių',
    opacity_color: (opacity = 1) => `rgba(23, 132, 68, ${opacity})`,
    hex_color: '#178444',
  },
  dept: {
    id: 'dept',
    title: 'Skola',
    opacity_color: (opacity = 1) => `rgba(255, 235, 59, ${opacity})`,
    hex_color: '#FFEB3B',
  },
  fine: {
    id: 'fine',
    title: 'Delspinigiai',
    opacity_color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    hex_color: '#4CAF50',
  },
  commissions: {
    id: 'commissions',
    title: 'Komisiniai už įmokas',
    opacity_color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
    hex_color: '#FF9800',
  },
  payment: {
    id: 'payment',
    title: 'Įmokos',
    opacity_color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
    hex_color: '#e91e63',
  },
};

const data_sets = () => [
  { name: 'due', label: 'Mokėtina suma', color: '#F44336' },
  { name: 'counted', label: 'Priskaitymai be komisinių', color: '#2196F3' },
  { name: 'dept', label: 'Skola', color: '#FFEB3B' },
  { name: 'fine', label: 'Delspinigiai', color: '#4CAF50' },
  { name: 'commissions', label: 'Komisiniai už įmokas', color: '#FF9800' },
  { name: 'payment', label: 'Įmokos', color: '#e91e63' }
];

const prepare_set = (params, data) => {
   return {
      values: map_y_axis(data, params.name),
      label: params.label,
      config: {
        color: processColor(params.color)
      }
    };
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
    if (data.length) {
      labels.forEach(label => {
        const current_value = data.find(f => {
          const splitted_date = f.date.split('-');
          const formatted_date = `${splitted_date[1]}.${splitted_date[2]}`;
          return formatted_date === label;
        });
        data_sets[chart.title].data.push(current_value ? current_value[chart.id] : 0);
      });
    }
  });
  return Object.values(data_sets);
};

const TaxesLineChart = ({ data }) => {
  const labels = format_labels(data);
  let data_sets = format_sets(data, labels);
  const [active_sets, setActiveSets] = useState(new Set(Object.keys(CHART_COLORS)));
  const [sets_size, setActiveSetsSize] = useState(active_sets.size);

  data_sets = data_sets.filter(set => active_sets.has(set.id));

  return (
    <View style={{flex: 1, height: 600}} >
      <View style={styles.container}>
        <LineChart
          data={{
            labels: labels,
            datasets: data_sets,
          }}
          width={Dimensions.get('window').width}
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

export default TaxesLineChart;