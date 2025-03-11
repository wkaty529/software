/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/Hello';
import {name as appName} from './app.json';
  console.log('Hello World!');

AppRegistry.registerComponent(appName, () => App);
