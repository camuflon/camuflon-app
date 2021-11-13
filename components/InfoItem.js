import React, {Component} from 'react';
import {StyleSheet, Alert, FlatList} from 'react-native';
import {
  Colors,
  BorderRadiuses,
  View,
  Image,
  ListItem,
  Text,
} from 'react-native-ui-lib';

export default function InfoItem({property, value}) {
  return (
    <View
      style={{
        marginBottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
      }}>
      <Text
        text70
        style={{
          textAlign: 'center',
          color: 'grey',
          fontStyle: 'italic',
          marginRight: 10,
        }}
        numberOfLines={1}>
        {property}
      </Text>
      <Text text70 style={{textAlign: 'center', color: 'white'}}>
        {value}
      </Text>
    </View>
  );
}
