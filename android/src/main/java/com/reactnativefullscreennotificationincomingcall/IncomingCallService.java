package com.reactnativefullscreennotificationincomingcall;


import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.io.File;


public class IncomingCallService extends Service {
  private static Runnable handleTimeout;
  public static Handler callhandle;
  private String uuid = "";
  private Integer timeoutNumber=0;
  private boolean isRegistered = false;
  // you can perform a click only once time
  private Bundle bundleData;
  private static final String TAG = "FullscreenSevice";
  public int onStartCommand(Intent intent, int flags, int startId) {
    String action = intent.getAction();
    if (action != null) {
      if (action.equals(Constants.ACTION_SHOW_INCOMING_CALL)) {
        NotificationReceiverHandler.updateCanClick(true);
        registerBroadcastPressEvent();
        Bundle bundle = intent.getExtras();
        uuid= bundle.getString("uuid");
        if(bundle.containsKey("timeout")){
          Log.d(TAG, "has time out");
          timeoutNumber=bundle.getInt("timeout");
        }
        Notification notification = buildNotification(getApplicationContext(), intent);
        startForeground(1, notification);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S)  {
          sendBroadcast(new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS));
        }
      }else if(action.equals(Constants.HIDE_NOTIFICATION_INCOMING_CALL)){
        stopSelf();
      }else if(action.equals(Constants.ACTION_START_ACTIVITY)){

      }
    }
    return START_NOT_STICKY;
  }

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  @Override
  public void onTaskRemoved(Intent rootIntent) {
    super.onTaskRemoved(rootIntent);
    stopSelf();
  }


  private PendingIntent onButtonNotificationClick(int id, String action,String eventName) {
    if(action == Constants.ACTION_PRESS_DECLINE_CALL){
      Intent  buttonIntent= new Intent();
      buttonIntent.setAction(action);
      return PendingIntent.getBroadcast(this,id , buttonIntent,PendingIntent.FLAG_UPDATE_CURRENT  | PendingIntent.FLAG_IMMUTABLE);
    }
    Intent emptyScreenIntent = new Intent(this, NotificationReceiverActivity.class);
    emptyScreenIntent.setAction(action);
    emptyScreenIntent.putExtras(bundleData);
    emptyScreenIntent.putExtra("eventName",eventName);
    return PendingIntent.getActivity(this, 0, emptyScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
  }

  private Notification buildNotification(Context context, Intent intent) {

    Intent emptyScreenIntent = new Intent(context, NotificationReceiverActivity.class);
    Bundle bundle = intent.getExtras();
    bundleData=bundle;
    emptyScreenIntent.putExtras(bundle);
    emptyScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    emptyScreenIntent.setAction(Constants.onPressNotification);
    String channelId=bundle.getString("channelId");
    PendingIntent emptyPendingIntent = PendingIntent.getActivity(context, 0, emptyScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    String customSound=bundle.getString("notificationSound");
    Uri sound=RingtoneManager.getActualDefaultRingtoneUri(getApplicationContext(), RingtoneManager.TYPE_RINGTONE);
    if(customSound != null){
           sound= Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + File.pathSeparator + File.separator + File.separator + getPackageName() + "/raw/" + customSound);
    }
    NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel=new NotificationChannel(channelId, bundle.getString("channelName"), NotificationManager.IMPORTANCE_HIGH);
        notificationChannel.setSound(sound,
        new AudioAttributes.Builder()
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .setUsage(AudioAttributes.USAGE_NOTIFICATION)
          .build());
      notificationChannel.enableLights(true);
      notificationChannel.enableVibration(true);
      notificationChannel.setLightColor(Color.WHITE);
      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      notificationChannel.setVibrationPattern(new long[] { 0, 1000, 800});
      notificationManager.createNotificationChannel(notificationChannel);
    }
    NotificationCompat.Builder notificationBuilder;
    notificationBuilder = new NotificationCompat.Builder(context,channelId);
    notificationBuilder.setContentTitle(bundle.getString("name"))
        .setContentText(bundle.getString("info"))
        .setPriority(NotificationCompat.PRIORITY_MAX)
        .setCategory(NotificationCompat.CATEGORY_CALL)
        .setContentIntent(emptyPendingIntent)
        .addAction(
          0,
          bundle.getString("declineText"),
          onButtonNotificationClick(0,Constants.ACTION_PRESS_DECLINE_CALL,Constants.RNNotificationEndCallAction)
       )
        .addAction(
            0,
         bundle.getString("answerText"),
              onButtonNotificationClick(1,Constants.ACTION_PRESS_ANSWER_CALL,Constants.RNNotificationAnswerAction)
        )
      .setAutoCancel(true)
      .setOngoing(true)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setVibrate(new long[] { 0, 1000, 800})
      .setSound(sound)
        // Use a full-screen intent only for the highest-priority alerts where you
        // have an associated activity that you would like to launch after the user
        // interacts with the notification. Also, if your app targets Android 10
        // or higher, you need to request the USE_FULL_SCREEN_INTENT permission in
        // order for the platform to invoke this notification.
        .setFullScreenIntent(emptyPendingIntent, true);
    if(bundle.getString("notificationColor")!=null){
      notificationBuilder.setColor(getColorForResourceName(context,bundle.getString("notificationColor")));
    }
    String iconName = bundle.getString("icon");
    if (iconName != null) {
      notificationBuilder.setSmallIcon(getResourceIdForResourceName(context, iconName));
    }
    if(timeoutNumber > 0){
      setTimeOutEndCall(uuid);
    }
    return notificationBuilder.build();
  }

  @Override
  public void onCreate() {
    super.onCreate();
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    Log.d(TAG, "onDestroy service");
    cancelTimer();
    stopForeground(true);
    unregisterBroadcastPressEvent();
  }

  public void registerBroadcastPressEvent() {
    if (isRegistered) return;
    IntentFilter filter = new IntentFilter();
    filter.addAction(Constants.ACTION_PRESS_DECLINE_CALL);
    getApplicationContext().registerReceiver(mReceiver, filter);
    isRegistered = true;
  }

  public void unregisterBroadcastPressEvent() {
    if (!isRegistered) return;
    getApplicationContext().unregisterReceiver(mReceiver);
    isRegistered = false;
  }

  public  void setTimeOutEndCall(String uuid) {
    callhandle=new Handler();
    handleTimeout=new Runnable() {
      public void run() {
          if (IncomingCallActivity.active) {
            IncomingCallActivity.getInstance().destroyActivity(false);
          }
            WritableMap params = Arguments.createMap();
            params.putString("callUUID", uuid);
            params.putString("endAction",Constants.ACTION_HIDE_CALL);
            FullScreenNotificationIncomingCallModule.sendEventToJs(Constants.RNNotificationEndCallAction,params);
          cancelTimer();
          stopForeground(true);
      }
    };
    callhandle.postDelayed(handleTimeout, timeoutNumber);
  }
  public void cancelTimer(){
    if(handleTimeout != null){
      callhandle.removeCallbacks(handleTimeout);
    }
  }

  private int getResourceIdForResourceName(Context context, String resourceName) {
    int resourceId = context.getResources().getIdentifier(resourceName, "drawable", context.getPackageName());
    if (resourceId == 0) {
      resourceId = context.getResources().getIdentifier(resourceName, "mipmap", context.getPackageName());
    }
    return resourceId;
  }

  private int getColorForResourceName(Context context, String colorPath){
    // java
    Resources res = context.getResources();
    String packageName = context.getPackageName();

    int colorId = res.getIdentifier(colorPath, "color", packageName);
    int desiredColor = ContextCompat.getColor(context, colorId);

    return desiredColor;
  }

  private BroadcastReceiver mReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      if (action != null) {
        if(action.equals(Constants.ACTION_PRESS_DECLINE_CALL)){
          boolean canClick=NotificationReceiverHandler.getStatusClick();
          if(!canClick)return;
          NotificationReceiverHandler.disableClick();
          cancelTimer();
          if (IncomingCallActivity.active) {
            IncomingCallActivity.getInstance().destroyActivity(false);
          }
          WritableMap params = Arguments.createMap();
          params.putString("callUUID", uuid);
          params.putString("endAction", Constants.ACTION_REJECTED_CALL);
          FullScreenNotificationIncomingCallModule.sendEventToJs(Constants.RNNotificationEndCallAction,params);
          stopForeground(true);
        }
      }
    }
  };


}



