import React from 'react';
import {View, TextInput} from 'react-native';

export default function CustomTextInput({text, onChangeText, placeholder}) {
  return (
    <View style={{flex: 1, marginBottom: 60, alignItems: 'center'}}>
      <View style={{width: '80%', height: 50}}>
        <TextInput
          placeholder={placeholder}
          style={{
            backgroundColor: '#eee',
            borderRadius: 10,
            color: 'black',
            borderWidth: 2,
            borderColor: 'white',
            padding: 10,
          }}
          onChangeText={onChangeText}
          value={text}
        />
      </View>
    </View>
  );
}
