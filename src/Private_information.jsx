import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Menu, Button } from 'react-native-paper';

const Private_information = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [visibleYear, setVisibleYear] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(false);
  const [visibleDay, setVisibleDay] = useState(false);

  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.hintText}> 这个框可以用来做提示，提示用户请真实选择，选择的数据信息将用于后续任务分配的依据 </Text>
      <View style={styles.pickerRow}>
        <Menu
          visible={visibleYear}
          onDismiss={() => setVisibleYear(false)}
          anchor={<Button onPress={() => setVisibleYear(true)}>{selectedYear}</Button>}
        >
          {years.map((year) => (
            <Menu.Item key={year} onPress={() => { setSelectedYear(year); setVisibleYear(false); }} title={year.toString()} />
          ))}
        </Menu>
        <Menu
          visible={visibleMonth}
          onDismiss={() => setVisibleMonth(false)}
          anchor={<Button onPress={() => setVisibleMonth(true)}>{selectedMonth}</Button>}
        >
          {months.map((month) => (
            <Menu.Item key={month} onPress={() => { setSelectedMonth(month); setVisibleMonth(false); }} title={month.toString()} />
          ))}
        </Menu>
        <Menu
          visible={visibleDay}
          onDismiss={() => setVisibleDay(false)}
          anchor={<Button onPress={() => setVisibleDay(true)}>{selectedDay}</Button>}
        >
          {days.map((day) => (
            <Menu.Item key={day} onPress={() => { setSelectedDay(day); setVisibleDay(false); }} title={day.toString()} />
          ))}
        </Menu>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  hintText: {
    marginBottom: 20,
    textAlign: 'center'
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
});

export default Private_information;