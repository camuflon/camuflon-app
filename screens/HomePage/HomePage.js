import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button} from 'react-native-ui-lib'; //eslint-disable-line
import TextInput from '../../components/TextInput';
import Icon from 'react-native-vector-icons/AntDesign';
import InfoItem from '../../components/InfoItem';
import {getStats} from '../../utils/api';
import {
  storageGetBeaconsId,
  storageGetCompanyId,
  storageGetPause,
  storageGetUserId,
  storageReset,
  storageSetPause,
} from '../../utils/storage';

const data = [
  {
    beaconMajor: 'MMMMMMM',
    beaconMinor: '000000',
  },
  {
    beaconMajor: 'NNNN',
    beaconMinor: '000000',
  },
  {
    beaconMajor: 'OOO',
    beaconMinor: '000000',
  },
];

function getFormattedTime(date) {
  var time =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return time;
}
export default function HomePage() {
  const [company, setCompany] = React.useState('Mycompany');
  const [room, setRoom] = React.useState('Kitchen');
  const [beaconId, setBeaconId] = React.useState('');
  const [beaconMinor, setBeaconMinor] = React.useState('');
  const [beaconMajor, setBeaconMajor] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [pause, setPause] = React.useState(false);

  const [dt, setDt] = React.useState(new Date());

  const navigation = useNavigation();

  React.useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date());
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  React.useEffect(() => {
    let checkRoom = setInterval(() => {
      !pause && onUpdateRoom(data[Math.floor(Math.random() * data.length)]);
    }, 5000);

    return () => clearInterval(checkRoom);
  }, [pause]);

  React.useEffect(() => {
    (async () => {
      const pause = await storageGetPause();
      const companyId = await storageGetCompanyId();
      const uid = await storageGetUserId();
      const beaconsId = await storageGetBeaconsId();
      if (!uid || !beaconsId || !companyId) {
        //user is log out
        navigation.navigate('Login');
      } else {
        //user is logged in
        setPause(pause ? pause : false);
        setCompany(companyId);
        setUserId(uid);
        setBeaconId(beaconsId);
      }
    })();
  }, []);

  const onLogOut = async () => {
    await storageReset();
    navigation.navigate('Login');
  };

  const onUpdateRoom = async ({beaconMajor, beaconMinor}) => {
    if (pause) {
      return;
    }
    const data = await getStats(
      company,
      beaconMajor,
      beaconMinor,
      userId,
      new Date().toISOString(),
    );

    if (data) {
      setRoom(data.locationName);
    }
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
          onPress={onLogOut}
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
          borderWidth: 2,
          borderColor: pause ? 'orange' : 'white',
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
        <InfoItem property="Room: " value={room ? room : 'no room'} />
        <InfoItem property="Uid:" value={userId} />
        <InfoItem property="Company:" value={company} />
        <InfoItem property="Beacon: " value={beaconId} />
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
          onPress={() => {
            setPause(!pause);
            storageSetPause((!pause).toString());
          }}
        />
      </View>
    </View>
  );
}
