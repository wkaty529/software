import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class Hello extends Component {
  render() {
    return (
      <View>
        <Text style={[{color:'red'},{fontSize:25},{fontWeight:'bold'},{margin:81}]}> 家务任务自动分配软件 </Text>
      </View>
    )
  }
}
