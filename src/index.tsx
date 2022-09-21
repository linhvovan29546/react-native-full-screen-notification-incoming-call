import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
const isAndroid = Platform.OS === 'android';
const RNNotificationIncomingCall = NativeModules.FullScreenNotificationIncomingCall;
let eventEmitter: any
if (isAndroid) {
  eventEmitter = new NativeEventEmitter(RNNotificationIncomingCall);
}
enum RNNotificationEvent {
  RNNotificationAnswerAction = 'RNNotificationAnswerAction',
  RNNotificationEndCallAction = 'RNNotificationEndCallAction'
}

interface foregroundOptionsModel {
  channelId: string,
  channelName: string,
  notificationIcon: string,//mipmap
  notificationTitle: string,
  notificationBody: string,
  answerText: string,
  declineText: string,
  notificationColor?: string
}
class RNNotificationCall {
  private _notificationEventHandlers;
  constructor() {
    this._notificationEventHandlers = new Map();
  }

  displayNotification = (uuid: string, avatar: string | null, timeout: number | null, foregroundOptions: foregroundOptionsModel) => {
    if (!isAndroid) return
    RNNotificationIncomingCall.displayNotification(uuid, avatar, timeout ? timeout : 0, foregroundOptions)
  }

  hideNotification = () => {
    if (!isAndroid) return
    RNNotificationIncomingCall.hideNotification()
  }

  addEventListener = (type: any, handler: any) => {
    if (!isAndroid) return
    let listener;
    if (type === 'answer') {
      listener = eventEmitter.addListener(
        RNNotificationEvent.RNNotificationAnswerAction,
        (eventPayload: any) => {
          handler(eventPayload);
        }
      );
    } else if (type === 'endCall') {
      listener = eventEmitter.addListener(
        RNNotificationEvent.RNNotificationEndCallAction,
        (eventPayload: any) => {
          handler(eventPayload);
        }
      );
    }
    else {
      return;
    }
    this._notificationEventHandlers.set(type, listener);
  };

  removeEventListener = (type: any) => {
    if (!isAndroid) return
    const listener = this._notificationEventHandlers.get(type);
    if (!listener) {
      return;
    }

    listener.remove();
    this._notificationEventHandlers.delete(type);
  };
}

export default new RNNotificationCall();