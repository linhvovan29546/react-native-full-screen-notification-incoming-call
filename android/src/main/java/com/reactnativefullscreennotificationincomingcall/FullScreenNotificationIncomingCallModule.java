package com.reactnativefullscreennotificationincomingcall;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@ReactModule(name = FullScreenNotificationIncomingCallModule.NAME)
public class FullScreenNotificationIncomingCallModule extends ReactContextBaseJavaModule {
    public static final String NAME = "FullScreenNotificationIncomingCall";
    public static ReactApplicationContext reactContext;
    public FullScreenNotificationIncomingCallModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void displayNotification(String uuid, String name, String avatar, String info,String channelId,String channelName, int timeout) {
      Intent intent = new Intent(getReactApplicationContext(), IncomingCallService.class);
      intent.putExtra("uuid", uuid);
      intent.putExtra("name",name );
      intent.putExtra("avatar", avatar);
      intent.putExtra("info", info);
      intent.putExtra("channelId", channelId);
      intent.putExtra("channelName", channelName);
      intent.putExtra("timeout", timeout);
      intent.setAction(Constants.ACTION_SHOW_INCOMING_CALL);
      getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void hideNotification() {
//      if (UnlockScreenActivity.active) {
//        UnlockScreenActivity.getInstance().destroyActivity(false);
//      }
       Intent intent = new Intent(getReactApplicationContext(), IncomingCallService.class);
       intent.setAction(Constants.HIDE_NOTIFICATION_INCOMING_CALL);
       getReactApplicationContext().stopService(intent);
    }

    @ReactMethod
    public static void sendEventToJs(String eventName, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,params);
    }




    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(int a, int b, Promise promise) {
        promise.resolve(a * b);
    }

    public static native int nativeMultiply(int a, int b);
}
