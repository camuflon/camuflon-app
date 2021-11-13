import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button} from 'react-native-ui-lib'; //eslint-disable-line
import TextInput from '../../components/TextInput';
export default function LoginPage() {
  const [company, setCompany] = React.useState('');
  const [token, setToken] = React.useState('');
  const [error, setError] = React.useState('');

  const navigation = useNavigation();

  const onSignIn = () => {
    /*  () => {
      navigation.navigate('Details');
    }*/
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {/*header */}
      <View style={{backgroundColor: 'black', width: '100%', height: 50}}>
        <Text text60M margin-15 style={{textAlign: 'left', color: 'white'}}>
          Camuflon
        </Text>
      </View>

      {/*body */}
      <View style={{marginTop: 50}}>
        <Text
          text50M
          margin-15
          style={{textAlign: 'center', color: 'white', marginBottom: 50}}>
          Log in to the app
        </Text>
        <TextInput
          placeholder="Company name"
          text={company}
          onChangeText={text => setCompany(text)}
        />
        <TextInput
          placeholder="Token"
          text={token}
          onChangeText={text => setToken(text)}
        />
      </View>
      {error.length > 0 && (
        <Text text80M style={{textAlign: 'center', color: 'red'}}>
          Failed to authenticate
        </Text>
      )}
      <Button
        label={'Sign in'}
        size={Button.sizes.large}
        style={{
          marginBottom: 20,
          marginTop: 20,
          width: 300,
          alignSelf: 'center',
        }}
        backgroundColor="#5848FE"
        onPress={onSignIn}
      />
    </View>
  );
}
