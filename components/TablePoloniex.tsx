import React, {useCallback, useState} from 'react';
import { ActivityIndicator, StyleSheet, ScrollView, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from './Themed';

interface IItem {
  id: string;
  name: string;
  last: string;
  highestBid: string;
  percentChange: string;
}

export default function TablePoloniex() {
  const [poloniexData, setPoloniexData] = useState<IItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const timer = setInterval(() =>
        fetch('https://poloniex.com/public?command=returnTicker')
        .then((response) => response.json())
        .then((json) => {
          const data = [];
          for (const key in json) {
            data.push({
              name: key, 
              id: json[key].id, 
              last: json[key].last, 
              highestBid: json[key].highestBid, 
              percentChange: json[key].percentChange,
            })
          }
          setPoloniexData(data);
          setError(false);
        })
        .catch((error) => {
          setError(true);
          console.error(error);
        })
        .finally(() => setLoading(false)), 5000
      );
      return () => clearInterval(timer);
    }, [])
  );

  const dataText = (text: string) => 
    <View style={[styles.tableText, styles.borderTable]}>
      <Text
        style={styles.itemText}
        lightColor="rgba(0,0,0,0.8)"
        darkColor="rgba(255,255,255,0.8)">
        {text}
      </Text>
    </View>
  
  return (
    <View style={styles.container}>
      <View style={[styles.tableView, styles.borderTable, styles.borderTableTop]}>
        {dataText("Name")}
        {dataText("Last")}
        {dataText("Highest bid")}
        {dataText("Percent change")}
      </View>
      {isError &&
        <View style={[styles.tableView, styles.borderTable, styles.errorRow]}>
          <Text style={styles.itemErrorRow}>Ошибка обновления данных</Text>
        </View>
      }
      {(!isLoading && poloniexData.length) ? 
        <ScrollView style={[styles.borderTable, styles.scrollView]}>
          {poloniexData.map(data => 
            <View
              style={styles.tableView}
              key={data.id}
            >
              {dataText(data.name)}
              {dataText(data.last)}
              {dataText(data.highestBid)}
              {dataText(data.percentChange)}
            </View>
          )}
        </ScrollView>
      : <ActivityIndicator style={styles.spinner}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '95%',
  },
  spinner: {
    marginTop: 20,
  },
  borderTableTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,.5)',
  },
  borderTable: {
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(128,128,128,.5)',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(128,128,128,.5)',
  },
  tableView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,.5)',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  tableText: {
    width: '25%',
    alignItems: 'center',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  itemText: {
    maxWidth: '95%',
    fontSize: 10,
    lineHeight: 30,
    height: 30,
  },
  errorRow: {
    backgroundColor: 'red',
  },
  itemErrorRow: {
    color: 'white',
    fontSize: 10,
  },
  scrollView: {
    width: '100%'
  },
});
