package com.reactnativefullscreennotificationincomingcall;


import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;


public class IncomingCallService extends Service {
  private static Vibrator vibrator;
  private static Ringtone ringtone;
  private static Runnable handleTimeout;
  public static Handler callhandle;
  private String uuid = "";
  private Integer timeoutNumber=0;
  private static final String TAG = "FullscreenSevice";
  public int onStartCommand(Intent intent, int flags, int startId) {
    String action = intent.getAction();
    if (action != null) {
      if (action.equals(Constants.ACTION_SHOW_INCOMING_CALL)) {
        IntentFilter filter = new IntentFilter();
        filter.addAction(Constants.ACTION_PRESS_ANSWER_CALL);
        filter.addAction(Constants.ACTION_PRESS_DECLINE_CALL);
        getApplicationContext().registerReceiver(mReceiver, filter);
        Bundle bundle = intent.getExtras();
        uuid= bundle.getString("uuid");
        if(bundle.containsKey("timeout")){
          Log.d(TAG, "has time out");
          timeoutNumber=bundle.getInt("timeout");
        }
        Notification notification = buildNotification(getApplicationContext(), intent);
        startForeground(1, notification);
        startRinging();
        sendBroadcast(new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS));
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

  private PendingIntent onButtonNotificationClick(int id, String action) {
    Intent  buttonIntent= new Intent();
    buttonIntent.setAction(action);
    return PendingIntent.getBroadcast(this,id , buttonIntent, 0);
  }

  private Notification buildNotification(Context context, Intent intent) {
    Intent fullScreenIntent = new Intent(context, IncomingCallActivity.class);
    Bundle bundle = intent.getExtras();
    fullScreenIntent.putExtra("uuid", uuid);
    fullScreenIntent.putExtra("name", bundle.getString("name"));
    fullScreenIntent.putExtra("avatar", bundle.getString("avatar"));
    fullScreenIntent.putExtra("info", bundle.getString("info"));
    fullScreenIntent.putExtra("declineText", bundle.getString("declineText"));
    fullScreenIntent.putExtra("answerText", bundle.getString("answerText"));
    fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(context, 0, fullScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT);
    NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    NotificationCompat.Builder notificationBuilder;
    notificationBuilder = new NotificationCompat.Builder(context);
    notificationBuilder.setContentTitle(bundle.getString("name"))
        .setContentText(bundle.getString("info"))
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setCategory(NotificationCompat.CATEGORY_CALL)
        .addAction(
          0,
          bundle.getString("declineText"),
          onButtonNotificationClick(0,Constants.ACTION_PRESS_DECLINE_CALL)
       )
        .addAction(
            0,
         bundle.getString("answerText"),
              onButtonNotificationClick(1,Constants.ACTION_PRESS_ANSWER_CALL)
        )
      .setAutoCancel(true)
      .setColor(getResources().getColor(R.color.colorAccent))
        // Use a full-screen intent only for the highest-priority alerts where you
        // have an associated activity that you would like to launch after the user
        // interacts with the notification. Also, if your app targets Android 10
        // or higher, you need to request the USE_FULL_SCREEN_INTENT permission in
        // order for the platform to invoke this notification.
        .setFullScreenIntent(fullScreenPendingIntent, true);
    String iconName = bundle.getString("icon");
    if (iconName != null) {
      notificationBuilder.setSmallIcon(getResourceIdForResourceName(context, iconName));
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel=new NotificationChannel(bundle.getString("channelId"), bundle.getString("channelName"), NotificationManager.IMPORTANCE_HIGH);
      notificationChannel.setSound(null, null);
      notificationChannel.enableVibration(false);
      notificationManager.createNotificationChannel(notificationChannel);
      notificationBuilder.setChannelId(bundle.getString("channelId"));
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
    stopRinging();
    cancelTimer();
    stopForeground(true);
  }
private void startRinging() {
    long[] pattern = {0, 1000, 800};
    vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
    int ringerMode = ((AudioManager) getSystemService(Context.AUDIO_SERVICE)).getRingerMode();
    if(ringerMode == AudioManager.RINGER_MODE_SILENT) return;

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      VibrationEffect vibe = VibrationEffect.createWaveform(pattern, 2);
      vibrator.vibrate(vibe);
    }else{
      vibrator.vibrate(pattern, 0);
    }
    if(ringerMode == AudioManager.RINGER_MODE_VIBRATE) return;
    ringtone = RingtoneManager.getRingtone(this, RingtoneManager.getActualDefaultRingtoneUri(getApplicationContext(), RingtoneManager.TYPE_RINGTONE));
    ringtone.play();
  }

  private  void stopRinging() {
    if (vibrator != null){
      vibrator.cancel();
    }
    int ringerMode = ((AudioManager) getSystemService(Context.AUDIO_SERVICE)).getRingerMode();
    if(ringerMode != AudioManager.RINGER_MODE_NORMAL) return;

    if(ringtone != null){
    ringtone.stop();
    }
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
          stopRinging();
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
  private BroadcastReceiver mReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      if (action != null) {
        if (action.equals(Constants.ACTION_PRESS_ANSWER_CALL)) {
          cancelTimer();
          Intent it = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
          context.sendBroadcast(it);
          if (IncomingCallActivity.active) {
            IncomingCallActivity.getInstance().destroyActivity(false);
          }
          WritableMap params = Arguments.createMap();
          params.putString("callUUID", uuid);
          FullScreenNotificationIncomingCallModule.sendEventToJs(Constants.RNNotificationAnswerAction,params);
          stopRinging();
          stopForeground(true);
        }else if(action.equals(Constants.ACTION_PRESS_DECLINE_CALL)){
          cancelTimer();
          if (IncomingCallActivity.active) {
            IncomingCallActivity.getInstance().destroyActivity(false);
          }
            WritableMap params = Arguments.createMap();
            params.putString("callUUID", uuid);
            params.putString("endAction", Constants.ACTION_REJECTED_CALL);
          FullScreenNotificationIncomingCallModule.sendEventToJs(Constants.RNNotificationEndCallAction,params);
            stopRinging();
          stopForeground(true);
        }
      }
    }
  };
  private int getResourceIdForResourceName(Context context, String resourceName) {
    int resourceId = context.getResources().getIdentifier(resourceName, "drawable", context.getPackageName());
    if (resourceId == 0) {
      resourceId = context.getResources().getIdentifier(resourceName, "mipmap", context.getPackageName());
    }
    return resourceId;
  }
}



