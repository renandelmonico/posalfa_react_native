import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';

import Process from './components/Process';

class App extends Component {
  render() {
    return (
      <View>
        <Process />
      </View>
    );
  }
}

AppRegistry.registerComponent('WebDevAlfaAvaliacao', () => App);
