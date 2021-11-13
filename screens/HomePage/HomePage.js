import React from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button} from 'react-native-ui-lib';
import BleManager from 'react-native-ble-manager';
import Icon from 'react-native-vector-icons/AntDesign';
import InfoItem from '../../components/InfoItem';
import {postStats} from '../../utils/api';
import {getBluetoothScanPermission, getFormattedTime} from '../../utils/utils';
import {
  storageGetCompanyId,
  storageGetPause,
  storageGetUserId,
  storageReset,
  storageSetPause,
} from '../../utils/storage';
import {TouchableWithoutFeedback} from 'react-native';

const DEV_PREFIX = 'BS3046';
export default function HomePage() {
  const [company, setCompany] = React.useState('Mycompany');
  const [room, setRoom] = React.useState('');
  const [beaconId, setBeaconId] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [pause, setPause] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const eventEmitter = new NativeEventEmitter(NativeModules.BleManager);
  const [dt, setDt] = React.useState(new Date());
  const [isFirstScan, setIsFirstScan] = React.useState(true);

  const navigation = useNavigation();

  React.useEffect(() => {
    const susbcription1 = eventEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      connectionCallback,
    );
    const susbcription2 = eventEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );
    return () => {
      console.log('unmount');
      susbcription1.remove();
      susbcription2.remove();
    };
  }, []);

  const isDeviceFound = dev => {
    return dev && dev.includes(DEV_PREFIX);
  };

  const connectionCallback = async data => {
    console.log('CONNN CALLBAK');
    const id = data.advertising ? data.advertising.localName : null;
    console.log(data.name);
    if (!beaconId && isDeviceFound(id)) {
      setBeaconId(id);
    }
  };

  //scanning
  const scanAndConnect = async () => {
    if (loading || pause) {
      console.log('RETURNING!');
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    console.log('starting scanning');
    try {
      await BleManager.start({forceLegacy: true});
      console.log('check location access permission');
      await getBluetoothScanPermission();
      console.log('scanning');
      await BleManager.scan([], 2);
    } catch (e) {
      console.log('err', e);
    }
  };

  //time
  React.useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date());
    }, 1000);
    return () => clearInterval(secTimer);
  }, []);

  React.useEffect(() => {
    if (userId) {
      if (isFirstScan) {
        scanAndConnect();
        setIsFirstScan(false);
      }
      let scan = setInterval(() => {
        scanAndConnect();
      }, 12000);
      return () => clearInterval(scan);
    }
  }, [userId]);

  const handleStopScan = async () => {
    console.log('finish scan');
    try {
      setLoading(false);
    } catch (e) {
      console.log('error connecting to Device :)');
    }
  };

  React.useEffect(() => {
    (async () => {
      const pause = await storageGetPause();
      const companyId = await storageGetCompanyId();
      const uid = await storageGetUserId();
      if (!uid || !companyId) {
        //user is log out
        navigation.navigate('Login');
      } else {
        //user is logged in
        console.log('MY USER IDDD', uid);
        setPause(pause ? pause : false);
        setCompany(companyId);
        setUserId(uid);
      }
    })();
  }, []);

  const onLogOut = async () => {
    await storageReset();
    navigation.navigate('Login');
  };

  const onUpdateRoom = async () => {
    if (pause || !beaconId) {
      console.log('why returning', beaconId);
      return;
    }
    const data = await postStats(
      company,
      userId,
      beaconId,
      new Date().toISOString(),
    );

    if (data) {
      setRoom(data.locationName);
    } else {
      setRoom('');
    }
  };
  console.log('MY CURRENT', beaconId);
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
        <TouchableWithoutFeedback
          onPress={async () => {
            await onUpdateRoom(beaconId);
          }}>
          <Text
            text65M
            margin-15
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            Info
          </Text>
        </TouchableWithoutFeedback>
        <InfoItem
          property="Room: "
          value={room ? room : pause ? 'Pause' : 'Loading...'}
        />
        <InfoItem property="Uid:" value={userId} />
        <InfoItem property="Company:" value={company} />
        <InfoItem
          property="Beacon: "
          value={beaconId ? beaconId : pause ? 'Pause' : 'Loading...'}
        />
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
