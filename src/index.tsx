import { DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';
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
enum CallAction {
  ACTION_END_CALL = "ACTION_END_CALL",
  ACTION_REJECTED_CALL = "ACTION_REJECTED_CALL",
  ACTION_HIDE_CALL = "ACTION_HIDE_CALL",
  ACTION_SHOW_INCOMING_CALL = "ACTION_SHOW_INCOMING_CALL",
  HIDE_NOTIFICATION_INCOMING_CALL = "HIDE_NOTIFICATION_INCOMING_CALL",
  ACTION_PRESS_ANSWER_CALL = "ACTION_PRESS_ANSWER_CALL",
  ACTION_PRESS_DECLINE_CALL = "ACTION_PRESS_DECLINE_CALL",
  ACTION_START_ACTIVITY = "ACTION_START_ACTIVITY",
}

export interface foregroundOptionsModel {
  channelId: string;
  channelName: string;
  notificationIcon: string;//mipmap
  notificationTitle: string;
  notificationBody: string;
  answerText: string;
  declineText: string;
  notificationColor?: string;
  notificationSound?: string;//raw
  mainComponent?: string;
  payload?:any//more info
}
export interface customIncomingActivityProps {
  avatar?: string;
  info?: string;
  uuid: string;
  payload?: any
}
export interface answerPayload{
  callUUID:string;
  payload?:string; // jsonString
}
export interface declinePayload{
  callUUID:string;
  payload?:string; // jsonString
  endAction:"ACTION_REJECTED_CALL"|"ACTION_HIDE_CALL"; //ACTION_REJECTED_CALL => press button decline or call function declineCall
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

  //function only work when open app from quit state
  backToApp = () => {
    if (!isAndroid) return
    RNNotificationIncomingCall.backToApp()
  }

  addEventListener = (type: string, handler: any) => {
    if (!isAndroid) return
    let listener;
    if (type === 'answer') {
      listener = eventEmitter.addListener(
        RNNotificationEvent.RNNotificationAnswerAction,
        (eventPayload: answerPayload) => {
          handler(eventPayload);
        }
      );
    } else if (type === 'endCall') {
      listener = eventEmitter.addListener(
        RNNotificationEvent.RNNotificationEndCallAction,
        (eventPayload: declinePayload) => {
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
  declineCall = (uuid: string ,payload?:string) => {
    this.hideNotification()
    const data = {
      callUUID: uuid,
      endAction: CallAction.ACTION_REJECTED_CALL,
      payload
    }
    DeviceEventEmitter.emit(RNNotificationEvent.RNNotificationEndCallAction, data)
  }
  answerCall = (uuid: string ,payload?:string) => {
    this.hideNotification()
    const data = { callUUID: uuid,payload }
    DeviceEventEmitter.emit(RNNotificationEvent.RNNotificationAnswerAction, data)
  }
}

export default new RNNotificationCall();