import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import PDF from 'react-native-pdf';
import NavigatorBar from './elements/navigator_bar';

const styles = {
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
};

const PdfView = ({ route, navigation }) => {
  const view_params = route.params;
  return (
    <ScrollView>
      <NavigatorBar navigation={navigation} heading="Dokumento peržiūra" />
      <PDF
        source={{ uri: view_params.uri }}
        style={styles.pdf}
      />
    </ScrollView>
  );
};

export default PdfView;