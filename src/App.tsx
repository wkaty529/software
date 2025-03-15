import React, { Component } from 'react'
import Private_information from './Private_information'
import {Provider as PaperProvider} from 'react-native-paper'
export default class App extends Component {
  render() {
    return (
      <PaperProvider>
      <Private_information />
      </PaperProvider>
    )
  }
}
