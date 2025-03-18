import React, { Component } from 'react'
//import Private_information from './Private_information'
//import Index from './Index'
import Choice_preference from './Choice_preference'
import {Provider as PaperProvider} from 'react-native-paper'
import Private_information from './Private_information'
export default class App extends Component {
  render() {
    return (
      <PaperProvider>
        <Choice_preference/>
      </PaperProvider>
      
    )
  }
}
