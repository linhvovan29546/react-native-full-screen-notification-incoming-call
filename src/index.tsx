import { NativeEventEmitter, NativeModules } from 'react-native';

const RNNotificationIncomingCall = NativeModules.FullScreenNotificationIncomingCall;
const eventEmitter = new NativeEventEmitter(RNNotificationIncomingCall);

enum RNNotificationEvent {
  RNNotificationAnswerAction = 'RNNotificationAnswerAction',
  RNNotificationEndCallAction = 'RNNotificationEndCallAction'
}


class RNNotificationCall {
  private _notificationEventHandlers;
  constructor() {
    this._notificationEventHandlers = new Map();
  }
  displayNotification = (uuid: string, avatar: string | null, timeout: number | null, foregroundOptions: any) => {

    RNNotificationIncomingCall.displayNotification(uuid, avatar, timeout ? timeout : 0, foregroundOptions)
  }
  hideNotification = () => {
    RNNotificationIncomingCall.hideNotification()
  }
  addEventListener = (type: any, handler: any) => {
    let listener;
    if (type === 'answer') {
      listener = eventEmitter.addListener(
        RNNotificationEvent.RNNotificationAnswerAction,
        (eventPayload) => {
          handler(eventPayload);
        }
      );
    } else if (type === 'endCall') {
      listener = eventEmitter.addListener(
        RNNotificationEvent.RNNotificationEndCallAction,
        (eventPayload) => {
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
    const listener = this._notificationEventHandlers.get(type);
    if (!listener) {
      return;
    }

    listener.remove();
    this._notificationEventHandlers.delete(type);
  };
}

export default new RNNotificationCall();