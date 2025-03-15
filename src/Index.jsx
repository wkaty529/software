import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native';
export default class Index extends Component {
  render() {
    return (
      <View>
        <Text style={[{color:'red'},{fontSize:25},{fontWeight:'bold'},{margin:81}]}> 家务任务自动分配软件 </Text>
        <Text style={styles.instructions}> 核心需求： </Text>
        <Text style={styles.welcome}> 任务分配及公平性 </Text>
        <Text style={styles.welcome}> 任务跟踪与提醒 </Text>
        <Text style={styles.welcome}> 任务分类与优先级 </Text>
        <Text style={styles.welcome}> 多设备同步 </Text>
        <Text style={styles.welcome}> 奖励机制 </Text>
        <Text style={styles.welcome}> 隐私保护与数据安全 </Text>
        <Text style={styles.instructions}> 用户角色： </Text>
        <Text style={styles.welcome}> 管理员（家长） </Text>
        <Text style={styles.welcome}> 成员（孩子、配偶） </Text>
        
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor:'#aabbcc'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  }
})

