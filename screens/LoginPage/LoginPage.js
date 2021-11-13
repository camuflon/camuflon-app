import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button} from 'react-native-ui-lib'; //eslint-disable-line
import TextInput from '../../components/TextInput';
import {signIn} from '../../utils/api';
import {
  storageSetBeaconsId,
  storageSetCompanyId,
  storageSetUserId,
} from '../../utils/storage';

export default function LoginPage() {
  const [company, setCompany] = React.useState('');
  const [token, setToken] = React.useState('');
  const [uid, setUid] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();

  const resetForm = () => {
    setCompany('');
    setToken('');
    setUid('');
  };

  const saveUserData = async userData => {
    console.log('my data', userData);
    await storageSetUserId(userData.userId);
    await storageSetBeaconsId(userData.beaconsUUID);
    await storageSetCompanyId(userData.companyId);
  };
  const onSignIn = async () => {
    setError('');
    if (!token || !company) {
      setError('Fill all fields');
      return;
    }
    setLoading(true);
    const res = await signIn(company, token, uid);
    if (res) {
      await saveUserData(res);
      resetForm();
      navigation.navigate('Home');
    } else {
      setError('Failed to authenticate');
    }
    setLoading(false);
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
        <TextInput
          placeholder="Uid (optional)"
          text={uid}
          onChangeText={text => setUid(text)}
        />
      </View>
      {error.length > 0 && (
        <Text text80M style={{textAlign: 'center', color: 'red'}}>
          {error}
        </Text>
      )}
      <Button
        label={loading ? 'loading...' : 'Sign in'}
        size={Button.sizes.large}
        disabled={loading}
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
