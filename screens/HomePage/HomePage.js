import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button} from 'react-native-ui-lib'; //eslint-disable-line
import TextInput from '../../components/TextInput';
import Icon from 'react-native-vector-icons/AntDesign';
import InfoItem from '../../components/InfoItem';

function getFormattedTime(date) {
  var time =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return time;
}
export default function HomePage() {
  const [company, setCompany] = React.useState('Mycompany');
  const [room, setRoom] = React.useState('Kitchen');
  const [pause, setPause] = React.useState(false);
  const [dt, setDt] = React.useState(new Date());

  const navigation = useNavigation();

  React.useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date());
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  const onPause = () => {
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

        <Icon
          name="logout"
          size={20}
          color="white"
          style={{position: 'absolute', right: 15, top: 15}}
        />
      </View>
      {/*clock */}
      <View
        style={{
          flexDirection: 'column',
          alignSelf: 'center',
          justifyContent: 'center',
          width: 200,
          height: 200,
          marginTop: 50,
          borderRadius: 200 / 2,
          borderWidth: 1,
          borderColor: 'white',
        }}>
        <Text text40M margin-15 style={{textAlign: 'center', color: 'white'}}>
          {getFormattedTime(dt)}
        </Text>
      </View>
      {/*info */}
      <View style={{marginTop: 50, flexDirection: 'column'}}>
        <Text
          text65M
          margin-15
          style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
          Info
        </Text>
        <InfoItem property="Company:" value={company} />
        <InfoItem property="Room: " value={room} />
      </View>
      <View>
        <Button
          label={pause ? 'Now on Pause' : 'Now Active'}
          size={Button.sizes.large}
          style={{
            marginBottom: 20,
            marginTop: 20,
            width: 300,
            alignSelf: 'center',
          }}
          backgroundColor={pause ? 'orange' : '#5848FE'}
          onPress={() => setPause(!pause)}
        />
      </View>
    </View>
  );
}
