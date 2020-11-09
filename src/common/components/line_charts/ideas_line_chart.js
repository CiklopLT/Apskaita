import React from 'react';
import {
  Text, View, processColor
} from 'react-native';
import update from 'immutability-helper';
import { Icon } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Switch from 'react-native-switch-pro';
import moment from 'moment';

import styles from '../styles/styles';

const map_y_axis = (data, attr) => data.map(idea => ({ y: Number(idea[attr]) }));

const data_sets = () => [
  { id: 0, label: 'Nėra', color: '#F44336' },
  { id: 1, label: 'Pasiūlytas', color: '#2196F3' },
  { id: 2, label: 'Svarstomas', color: '#FFEB3B' },
  { id: 3, label: 'Patvirtintas vykdymui', color: '#4CAF50' },
  { id: 4, label: 'Planuojamas', color: '#FF9800' },
  { id: 5, label: 'Vykdomas', color: '#e91e63' },
  { id: 6, label: 'Priduodamas', color: '#009688' },
  { id: 7, label: 'Atliktas', color: '#cddc39' },
  { id: 8, label: 'Patvirtintas', color: '#ffc107' },
  { id: 9, label: 'Patvirtintas valdybos', color: '#795548' },
  { id: 10, label: 'Patvirtintas susirinkimo', color: '#9e9e9e' },
  { id: 11, label: 'Pristabdytas', color: '#607d8b' },
  { id: 12, label: 'Atšauktas', color: '#00bcd4' }
];

const prepare_set = (params, data) => {
  return {
    values: map_y_axis(data, params.id),
    label: params.label,
    config: {
      color: processColor(params.color)
    }
  };
};

class IdeasLineChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: props,
      marker: {
        enabled: true,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#0D2C64'),
        textColor: processColor('white')
      },
      legend: new Set([]),
      current_data: {}
    };
    this.updateLines = this.updateLines.bind(this);
  }

  componentDidMount() {
    const data = this.state.data.data;
    const legend = this.state.legend;
    const x_axis = data.map(tax => moment(tax.date).format('MM-DD')).reverse();
    this.setState({ current_data: data });
    this.setState(
      update(this.state, {
        data: {
          $set: {
            dataSets: data_sets().filter(d_set => legend.has(d_set.name)).map(d_set => prepare_set(d_set, data)),
            current_data: data
          }
        },
        xAxis: {
          $set: {
            avoidFirstLastClipping: true,
            valueFormatter: x_axis,
            textColor: processColor('black'),
            granularityEnabled: true,
            granularity : 1
          }
        },
      })
    );
  }

  updateLines(value, line_name) {
    const data = this.state.data;
    let current_legend = this.state.legend;
    if (value) {
      current_legend.add(line_name);
    } else {
      current_legend.delete(line_name);
    }
    this.setState({ legend: current_legend});
    this.setState(
      update(this.state, {
        data: {
          $set: {
            dataSets: data_sets().filter(d_set => current_legend.has(d_set.name)).map(d_set => prepare_set(d_set, data.current_data)),
            current_data: data.current_data
          }
        }
      })
    );
  }

  render() {
    return (
      <View style={{flex: 1, height: 600}} >
        <View style={styles.container}>

          <Grid style={{ marginLeft: 20, marginRight: 20 }}>
            {
              data_sets().map(d_set => {
                return (
                  <Row style={styles.rowStyle} key={d_set.name}>
                    <Col size={1}><Icon name='fiber-manual-record' color={d_set.color} /></Col>
                    <Col size={3}><Text>{d_set.label}</Text></Col>
                    <Col size={1}>
                      <Switch
                        defaultValue={true}
                        backgroundActive="#0D2C64"
                        onSyncPress={value => this.updateLines(value, d_set.name)}
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
  }
}

export default IdeasLineChart;