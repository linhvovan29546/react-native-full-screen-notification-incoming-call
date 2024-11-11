import { Platform } from 'react-native';
import RNNotificationCall, {
  type AnswerPayload,
  type DeclinePayload,
} from '../../../src/index';
import RNCallKeep from 'react-native-callkeep';
import type { HandleType } from 'react-native-callkeep';
import {
  check,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';

const appName = 'Incoming-Test';
const isAndroid = Platform.OS === 'android';
const answerOption = {
  channelId: 'com.abc.incomingcall',
  channelName: 'Incoming Call',
  notificationIcon: 'ic_launcher', //mipmap
  notificationTitle: 'Linh Vo',
  answerText: 'Answer',
  declineText: 'Decline',
  notificationColor: 'colorAccent', //path color in android
  notificationSound: undefined, //raw
};
// this service only focus for Android

export class CallKeepService {
  private static _instance?: CallKeepService;
  static navigation: any;
  private static otherInformation: any;
  private static payload: any;
  constructor() {
    //setup callkeep
    // this.setupCallKeep();
  }
  static instance(): CallKeepService {
    if (!CallKeepService._instance) {
      CallKeepService._instance = new CallKeepService();
    }
    return CallKeepService._instance;
  }

  async setupCallKeep() {
    await new Promise((resolve) => {
      console.log('setup call keep done in promise');
      this.setupCallKeepFunc().then(resolve);
    });
  }

  async setupCallKeepFunc() {
    const granted = await requestMultiple([
      PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ]);
    if (granted[PERMISSIONS.ANDROID.READ_PHONE_NUMBERS] !== RESULTS.GRANTED)
      return;
    //only setup when granted permission
    await this.setup();
    //setup done
    if (isAndroid) {
      RNCallKeep.setAvailable(true);
    }
    this.registerEvent();
  }
  async setup() {
    try {
      await RNCallKeep.setup({
        ios: {
          appName: appName,
          maximumCallGroups: '1',
          maximumCallsPerCallGroup: '1',
          includesCallsInRecents: false,
          imageName: 'callkitIcon', //image name from ios
        },
        android: {
          alertTitle: 'Permissions required',
          alertDescription:
            'This application needs to access your phone accounts',
          cancelButton: 'Cancel',
          okButton: 'ok',
          selfManaged: true,
          additionalPermissions: [],
          foregroundService: {
            channelId: 'com.test.app.callkeep',
            channelName: 'Incoming Call',
            notificationTitle: 'Incoming Call',
            notificationIcon: 'ic_launcher_round',
          },
        },
      });
      return {
        result: 'setupDone',
      };
    } catch (error) {
      console.log('error setup callkeep', error);
      return error;
    }
  }
  registerEvent() {
    isAndroid &&
      RNCallKeep.addEventListener(
        'createIncomingConnectionFailed',
        this.onFailCallAction
      );
    RNCallKeep.addEventListener('answerCall', this.onCallKeepAnswerCallAction);
    RNCallKeep.addEventListener('endCall', this.onCallKeepEndCallAction);
    if (isAndroid) {
      //event only on android
      RNCallKeep.addEventListener(
        'showIncomingCallUi',
        // @ts-ignore:next-line
        ({ callUUID, name, hasVideo = 'false' }) => {
          const isVideo = hasVideo === 'true';
          RNNotificationCall.displayNotification(
            callUUID,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKet-b99huP_BtZT_HUqvsaSz32lhrcLtIDQ&s',
            30000,
            {
              ...answerOption,
              channelId:
                CallKeepService.otherInformation?.channelId ||
                'com.abc.incomingcall',
              channelName: 'Incoming Call',
              notificationTitle: name,
              notificationBody: isVideo
                ? 'Incoming video call'
                : 'Incoming call',
              isVideo: isVideo,
              mainComponent: CallKeepService.otherInformation?.mainComponent,
              notificationSound: CallKeepService.otherInformation?.ringtone,
              payload: {
                callerName: name,
              },
            }
          );
        }
      );
      // Listen to headless action events
      RNNotificationCall.addEventListener(
        'endCall',
        (data: DeclinePayload | AnswerPayload) => {
          const { callUUID } = data;
          // End call action here
          console.log('endCall', callUUID);
          RNCallKeep.endCall(callUUID);
        }
      );
      RNNotificationCall.addEventListener(
        'answer',
        (data: AnswerPayload | DeclinePayload) => {
          const { callUUID, payload } = data;
          CallKeepService.payload = JSON.parse(payload || '');
          //open app from quit state
          RNNotificationCall.backToApp();
          //call api answer
          RNCallKeep.answerIncomingCall(callUUID);
        }
      );
      // You can listener firebase message event here
    }
  }
  onFailCallAction() {
    RNCallKeep.endAllCalls();
  }

  //handle event
  onCallKeepAnswerCallAction() {
    // const { callUUID } = answerData;
    // called when the user answer the incoming call
    //navigate to another screen
    //some project need to rehandle with redux state or other state manager refer https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/17#issuecomment-1318225574
    CallKeepService.navigation.navigate('Detail', {
      payload: CallKeepService.payload,
    });
  }
  onCallKeepEndCallAction() {
    // const { callUUID } = answerData;
    //end call action of callkit
    //action destroy screen
    //You need to call RNCallKeep.endCall(callUUID) to end call
  }

  async displayCall(data: {
    uuid: string;
    handle: string;
    localizedCallerName: string;
    handleType: HandleType;
    hasVideo: boolean;
    callerImage?: string;
    other?: any;
  }) {
    const {
      uuid,
      handle,
      localizedCallerName,
      handleType,
      hasVideo,
      callerImage,
      other,
    } = data;
    const granted = await check(PERMISSIONS.ANDROID.READ_PHONE_NUMBERS);
    //only display call when permission granted
    if (granted !== RESULTS.GRANTED) return;
    CallKeepService.otherInformation = other;
    RNCallKeep.displayIncomingCall(
      uuid,
      handle,
      localizedCallerName,
      handleType,
      hasVideo,
      {
        callerImage,
      }
    );
  }
  endAllCall() {
    RNCallKeep.endAllCalls();
  }
}
