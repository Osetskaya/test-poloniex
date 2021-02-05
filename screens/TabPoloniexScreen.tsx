import * as React from 'react';
import { StyleSheet } from 'react-native';

import { TablePoloniex } from '../components/TablePoloniex';
import { View } from '../components/Themed';

export const TabTwoScreen = () => {
  return (
    <View style={styles.container}>
      <TablePoloniex />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
});
