import React, { Component } from 'react';
import {StyleSheet, ScrollView, View, Dimensions} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    margin: 10
  }
});

const status = {
  0: "Nėra",
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

const IdeasPieChart = ({ data }) => {
  if (!data.length) return false;
  const accumulated_data = [];
  let color_index = 0;

  const color_select = () => {
    const available_colors = ['#F44336', '#2196F3', '#4CAF50', '#FF9800', '#4C2350', '#FF9800', '#e91e63', '#009688', '#cddc39', '#ffc107', '#795548'];
    return available_colors[color_index];
  };

  const all_data = Object.values(data).map(data => status[data.statusId]);
  const unique_status = [...new Set(all_data)];

  unique_status.forEach((status) => {
    const color = color_select();
    accumulated_data.push({
      name: status,
      instances: all_data.filter(data => data === status).length,
      color,
      legendFontColor: color,
      legendFontSize: 8
    });
    color_index += 1;
  });

  return (
    <ScrollView style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <PieChart
          data={accumulated_data}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="instances"
          backgroundColor="transparent"
          paddingLeft="0"
        />
      </View>
    </ScrollView>
  );
};

export default IdeasPieChart;