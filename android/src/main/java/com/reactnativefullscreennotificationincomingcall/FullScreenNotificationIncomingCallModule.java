package com.reactnativefullscreennotificationincomingcall;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;

@ReactModule(name = FullScreenNotificationIncomingCallModule.NAME)
public class FullScreenNotificationIncomingCallModule extends ReactContextBaseJavaModule {
    public static final String NAME = "FullScreenNotificationIncomingCall";
    private static final String TAG = "FullscreenModule";
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
    public void displayNotification(String uuid, @Nullable String avatar,@Nullable int timeout, ReadableMap foregroundOptions) {
      Log.d(TAG, "displayNotification ui"  );
      if(foregroundOptions == null){
        Log.d(TAG, "foregroundOptions can't null"  );
        return;
      }
      Intent intent = new Intent(getReactApplicationContext(), IncomingCallService.class);
      intent.putExtra("uuid", uuid);
      intent.putExtra("name",foregroundOptions.getString("notificationTitle") );
      intent.putExtra("avatar", avatar);
      intent.putExtra("info", foregroundOptions.getString("notificationBody"));
      intent.putExtra("channelId", foregroundOptions.getString("channelId"));
      intent.putExtra("channelName", foregroundOptions.getString("channelName"));
      intent.putExtra("timeout", timeout);
      intent.putExtra("icon",foregroundOptions.getString("notificationIcon"));
      intent.putExtra("answerText",foregroundOptions.getString("answerText"));
      intent.putExtra("declineText",foregroundOptions.getString("declineText"));
      intent.putExtra("notificationColor",foregroundOptions.getString("notificationColor"));
      intent.setAction(Constants.ACTION_SHOW_INCOMING_CALL);
      getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void hideNotification() {
     if (IncomingCallActivity.active) {
       IncomingCallActivity.getInstance().destroyActivity(false);
     }
       Intent intent = new Intent(getReactApplicationContext(), IncomingCallService.class);
       intent.setAction(Constants.HIDE_NOTIFICATION_INCOMING_CALL);
       getReactApplicationContext().stopService(intent);
    }

    @ReactMethod
    public static void sendEventToJs(String eventName,@Nullable WritableMap params) {
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private Context getAppContext() {
        return reactContext.getApplicationContext();
    }

}
