import 'react-native-gesture-handler';
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from 'react-native-splash-screen';
import { StatusBar, Platform } from 'react-native';
import { MyDrawer } from "./src/common/config/routes";
import { createStore } from "redux";
import { combineReducers } from 'redux';
import user from "./src/common/reducers/user";

const store = createStore(combineReducers({ user: user }));

const Apskaita = () => {
  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <Provider store={store}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </Provider>
  );
};

export default Apskaita;


