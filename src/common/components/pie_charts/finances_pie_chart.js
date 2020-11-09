import React from 'react';
import {ScrollView, View, Dimensions} from 'react-native';
import PieChart from "react-native-chart-kit/dist/PieChart";

const FinancePieChart = ({ data }) => {
  let formatted_data = {};

  const get_random_color = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  data.forEach((finance) => {
    const color = get_random_color();
    if (!formatted_data[finance.name]) {
      formatted_data[finance.name] = {
        name: finance.name,
        value: 0,
        color,
        legendFontColor: color,
        legendFontSize: 8
      }
    }
    formatted_data[finance.name].value += Number(finance.value);
  });

  return (
    <ScrollView style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <PieChart
          data={Object.values(formatted_data)}
          width={Dimensions.get('window').width}
          height={300}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="20"
        />
      </View>
    </ScrollView>
  );
};

export default FinancePieChart;