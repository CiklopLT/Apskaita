import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const TaxesPieChart = ({ data }) => {
  if (!data.length) return false;
  let accumulated_data = {};
  let color_index = 0;

  const color_select = () => {
    const available_colors = ['#F44336', '#2196F3', '#4CAF50', '#FF9800', '#4C2350'];
    return available_colors[color_index];
  }

  data.forEach((tax) => {
    tax.details &&  tax.details.forEach((tax_detail) => {
      if (Number(tax_detail.kaupId) === 915) return;
      const color = color_select();
      if (!accumulated_data[tax_detail.kaupId]) {
        accumulated_data[tax_detail.kaupId] = {
          name: tax_detail.name,
          amount: 0,
          color,
          legendFontColor: color,
          legendFontSize: 7
        };
        color_index += 1;
      }
      accumulated_data[tax_detail.kaupId].amount += Number(tax_detail.moketina);
    });
  });

  return (
    <ScrollView style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <PieChart
          data={Object.values(accumulated_data)}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
        />
      </View>
    </ScrollView>
  );
};

export default TaxesPieChart;