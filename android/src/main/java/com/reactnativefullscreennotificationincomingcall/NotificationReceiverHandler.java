package com.reactnativefullscreennotificationincomingcall;


import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class NotificationReceiverHandler {
  private static final String TAG = "NotificationReceiverHandler";
  private static boolean canClick = true;
  private static boolean openedInComing = true;
  static void handleNotification(Context context, Intent intent) {
    handleNotificationIntent(context, intent);
  }

  static void updateCanClick(Boolean status){
    canClick=status;
    openedInComing=status;
  }

  static void disableClick(){
    canClick=false;
  }

  static Boolean getStatusClick(){
    return canClick;
  }

  private static void handleNotificationIntent(Context context, Intent intent) {
    if(!canClick) return;
    String action= intent.getAction();
    switch (action) {
      case Constants.onPressNotification:
        if(!openedInComing) return;
        openedInComing=false;
        handleNotificationPressIntent(context, intent);
        break;
      case Constants.ACTION_PRESS_ANSWER_CALL:
        canClick=false;
        handleNotificationActionIntent(context,intent);
        break;
    }
  }

  private static void handleNotificationActionIntent(Context context, Intent intent) {
    Bundle bundle = intent.getExtras();
    String uuid="";
    String eventName="";
    if (bundle != null) {
      if (bundle.containsKey("uuid")) {
        uuid = bundle.getString("uuid");
      }
      if(bundle.containsKey("eventName")){
        eventName=bundle.getString("eventName");
      }
    }
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S)  {
      Intent it = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
      context.sendBroadcast(it);
    }
    if (IncomingCallActivity.active) {
      IncomingCallActivity.getInstance().destroyActivity(false);
    }
    WritableMap params = Arguments.createMap();
    if(bundle.containsKey("payload")){
      params.putString("payload",bundle.getString("payload"));
    }
    params.putBoolean("accept", true);
    params.putString("callUUID", uuid);
    FullScreenNotificationIncomingCallModule.sendEventToJs(eventName, params);
    context.stopService(new Intent(context, IncomingCallService.class));
  }

  @SuppressLint("LongLogTag")
  private static void handleNotificationPressIntent(Context context, Intent intent) {
    Intent newIntent = new Intent(context, IncomingCallActivity.class);
    Log.d(TAG, "Handle press notification content");
    Bundle bundle = intent.getExtras();
    if (bundle != null) {
      newIntent.putExtras(bundle);
    }
    newIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(newIntent);
  }
}
