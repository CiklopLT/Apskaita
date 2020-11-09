import React from 'react';
import {
  Text, processColor, ScrollView
} from 'react-native';
import update from 'immutability-helper';
import { Icon } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Switch from 'react-native-switch-pro';
import moment from 'moment';

import styles from '../styles/styles';

const map_y_axis = (data, attr) => data.map(tax => ({ y: Number(tax[attr]) }));

const data_sets = () => [
  { name: 'due', label: 'Mokėtina suma', color: '#F44336' },
  { name: 'counted', label: 'Priskaitymai be komisinių', color: '#2196F3' },
  { name: 'dept', label: 'Skola', color: '#FFEB3B' },
  { name: 'fine', label: 'Delspinigiai', color: '#4CAF50' },
  { name: 'commissions', label: 'Komisiniai už įmokas', color: '#FF9800' },
  { name: 'payment', label: 'Įmokos', color: '#e91e63' }
];

const get_random_color = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const prepare_set = (data) => {
  const rand_color = get_random_color();
  return {
    values: map_y_axis(data, 'value'),
    label: data[0].name,
    color: rand_color,
    id: data[0].id,
    config: {
      color: processColor(rand_color)
    }
  };
};

const group_data = (filteredData) => {
  let groupedData = {};
  filteredData.forEach((data) => {
    if (!groupedData[data.group_id]) groupedData[data.group_id] = [];
    groupedData[data.group_id].push({
      id: data.group_id,
      name: data.name,
      value: Number(data.value).toFixed(2),
      date: data.date
    });
  });
  return groupedData;
};

class FinanceLineChart extends React.Component {

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
    };
    this.updateLines = this.updateLines.bind(this);
  }

  componentDidMount() {
    const data = this.state.data.data;
    const grouped_data = group_data(data);
    const x_axis = Object.values(grouped_data)[0].map(finance => moment(finance.date).format('MM-DD'));
    const legend = Object.values(grouped_data).map(finance => finance[0].id);
    const prepared_data = Object.values(grouped_data).map(d_set => prepare_set(d_set));
    this.setState({ current_data: grouped_data, prepared_data, legend });
    this.setState(
      update(this.state, {
        data: {
          $set: {
            dataSets: prepared_data
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

  updateLines(value, id) {
    const data = this.state.current_data;
    let current_legend = new Set(this.state.legend);
    if (value) {
      current_legend.add(id);
    } else {
      current_legend.delete(id);
    }
    const prepared_data = [...current_legend].map(d_set => prepare_set(data[d_set]));
    this.setState({ legend: current_legend });
    this.setState(
      update(this.state, {
        data: {
          $set: {
            dataSets: prepared_data
          }
        }
      })
    );
  }

  render() {
    const { prepared_data } = this.state;
    return (
      <ScrollView style={{flex: 1}} >
          <LineChart
            style={{height: 300, flex: 1}}
            data={this.state.data}
            chartDescription={{text: ''}}
            legend={{enabled: false}}
            marker={this.state.marker}
            xAxis={this.state.xAxis}
            drawGridBackground={false}
            borderColor={processColor('teal')}
            borderWidth={1}
            drawBorders={true}

            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}

            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}

            keepPositionOnRotation={false}
          />
          <Grid style={{ marginLeft: 20, marginRight: 20 }}>
            {
              prepared_data && prepared_data.map((d_set, i) => {
                return (
                  <Row style={styles.rowStyleMedium} key={i}>
                    <Col size={1}><Icon name='fiber-manual-record' color={d_set.color} /></Col>
                    <Col size={3}><Text>{d_set.label}</Text></Col>
                    <Col size={1}>
                      <Switch
                        defaultValue={true}
                        backgroundActive="#0D2C64"
                        onSyncPress={value => this.updateLines(value, d_set.id)}
                      />
                    </Col>
                  </Row>
                );
              })
            }
          </Grid>
      </ScrollView>
    );
  }
}

export default FinanceLineChart;