import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
const isAndroid = Platform.OS === 'android';
// Ensure the native module is correctly linked
const LINKING_ERROR = `
The package 'react-native-full-screen-notification-incoming-call' doesn't seem to be linked. Make sure:
- You rebuilt the app after installing the package
- You are not using Expo Go
`;

const RNNotificationIncomingCall =
  NativeModules.FullScreenNotificationIncomingCall
    ? NativeModules.FullScreenNotificationIncomingCall
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      );
let eventEmitter: any;

if (isAndroid) {
  eventEmitter = new NativeEventEmitter(RNNotificationIncomingCall);
}
enum RNNotificationEvent {
  RNNotificationAnswerAction = 'RNNotificationAnswerAction',
  RNNotificationEndCallAction = 'RNNotificationEndCallAction',
}
enum CallAction {
  ACTION_END_CALL = 'ACTION_END_CALL',
  /** Indicates the call was explicitly declined by the user, either by pressing the decline button or invoking the `declineCall` function. */
  ACTION_REJECTED_CALL = 'ACTION_REJECTED_CALL',
  /** Indicates the notification was automatically hidden due to a timeout. */
  ACTION_HIDE_CALL = 'ACTION_HIDE_CALL',
  ACTION_SHOW_INCOMING_CALL = 'ACTION_SHOW_INCOMING_CALL',
  HIDE_NOTIFICATION_INCOMING_CALL = 'HIDE_NOTIFICATION_INCOMING_CALL',
  ACTION_PRESS_ANSWER_CALL = 'ACTION_PRESS_ANSWER_CALL',
  ACTION_PRESS_DECLINE_CALL = 'ACTION_PRESS_DECLINE_CALL',
  ACTION_START_ACTIVITY = 'ACTION_START_ACTIVITY',
}
/**
 * Options for the foreground notification
 */
export interface ForegroundOptionsModel {
  /** Channel ID of the notification */
  channelId: string;
  /** Channel name of the notification */
  channelName: string;
  /** Icon of the notification (mipmap) */
  notificationIcon: string; //mipmap
  /** Title of the notification */
  notificationTitle: string;
  /** Body of the notification */
  notificationBody?: string | null;
  /** Label for the answer button */
  answerText: string;
  /** Label for the decline button */
  declineText: string;
  /** Color of the notification (optional) */
  notificationColor?: string;
  /** Sound of the notification (raw, optional) */
  notificationSound?: string;
  /** Main component name for custom incoming call screen (optional) */
  mainComponent?: string;
  /** Indicates if the call is a video call (default is false, optional) */
  isVideo?: boolean;
  /** Additional data (optional) */
  payload?: any; //more info
}
/**
 * Properties for the custom incoming activity
 */
export interface CustomIncomingActivityProps extends ForegroundOptionsModel {
  /**
   * Unique identifier for the call.
   * This ID helps to distinguish between different call instances.
   */
  avatar?: string;
  /** Additional information (optional) */
  info?: string;
  /** Unique identifier for the call */
  uuid: string;
  /** Caller name */
  name: string;
  /**
   * Additional data related to the call (optional).
   * This can be any JSON string containing extra information about the call.
   */
  payload?: any;
}
/**
 * Payload for the answer event
 */
export interface AnswerPayload {
  /**
   * Unique identifier for the call.
   * This ID helps to distinguish between different call instances.
   */
  callUUID: string;
  /**
   * Additional data related to the call (optional).
   * This can be any JSON string containing extra information about the call.
   */
  payload?: string;
}

/**
 * Payload for the decline event
 */
export interface DeclinePayload {
  /**
   * Unique identifier for the call.
   * This ID helps to distinguish between different call instances.
   */
  callUUID: string;
  /**
   * Additional data related to the call (optional).
   * This can be any JSON string containing extra information about the call.
   */
  payload?: string;
  /**
   * Action taken to end the call.
   * - `ACTION_REJECTED_CALL`: Indicates the call was explicitly declined by the user, either by pressing the decline button or invoking the `declineCall` function.
   * - `ACTION_HIDE_CALL`: Indicates the notification was automatically hidden due to a timeout.
   */
  endAction: 'ACTION_REJECTED_CALL' | 'ACTION_HIDE_CALL';
}
class RNNotificationCall {
  private _notificationEventHandlers = new Map<string, any>();

  /**
   * Display an incoming call notification
   * @param uuid - Unique identifier for the call
   * @param avatar - URL of the avatar image (optional)
   * @param timeout - Timeout duration in milliseconds (optional)
   * @param foregroundOptions - Options for the foreground notification
   */

  displayNotification = (
    uuid: string,
    avatar: string | null,
    timeout: number | null,
    foregroundOptions: ForegroundOptionsModel
  ) => {
    if (!isAndroid) return;
    RNNotificationIncomingCall.displayNotification(
      uuid,
      avatar,
      timeout ? timeout : 0,
      foregroundOptions
    );
  };

  /**
   * Hide the incoming call notification
   */
  hideNotification = () => {
    if (!isAndroid) return;
    RNNotificationIncomingCall.hideNotification();
  };
  /**
   * Bring the app to the foreground
   */
  backToApp = () => {
    if (!isAndroid) return;
    RNNotificationIncomingCall.backToApp();
  };

  /**
   * Add an event listener for notification actions
   * @param type - The type of event ('answer' or 'endCall')
   * @param handler - The event handler function
   */
  addEventListener = (
    type: 'answer' | 'endCall',
    handler: (payload: AnswerPayload | DeclinePayload) => void
  ) => {
    if (!isAndroid) return;
    const eventMap = {
      answer: RNNotificationEvent.RNNotificationAnswerAction,
      endCall: RNNotificationEvent.RNNotificationEndCallAction,
    };
    const listener = eventEmitter.addListener(eventMap[type], handler);
    this._notificationEventHandlers.set(type, listener);
  };

  /**
   * Remove an event listener for notification actions
   * @param type - The type of event ('answer' or 'endCall')
   */
  removeEventListener = (type: 'answer' | 'endCall') => {
    if (!isAndroid) return;
    const listener = this._notificationEventHandlers.get(type);
    listener?.remove();
    this._notificationEventHandlers.delete(type);
  };

  /**
   * Decline an incoming call
   * @param uuid - Unique identifier for the call
   * @param payload - Additional data (optional)
   */
  declineCall = (uuid: string, payload?: string) => {
    this.hideNotification();
    const data = {
      callUUID: uuid,
      endAction: CallAction.ACTION_REJECTED_CALL,
      payload,
    };
    DeviceEventEmitter.emit(
      RNNotificationEvent.RNNotificationEndCallAction,
      data
    );
  };

  /**
   * Answer an incoming call
   * @param uuid - Unique identifier for the call
   * @param payload - Additional data (optional)
   */
  answerCall = (uuid: string, payload?: string) => {
    this.hideNotification();
    const data = { callUUID: uuid, payload };
    DeviceEventEmitter.emit(
      RNNotificationEvent.RNNotificationAnswerAction,
      data
    );
  };
}

export default new RNNotificationCall();
