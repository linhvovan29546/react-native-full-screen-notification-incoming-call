package com.reactnativefullscreennotificationincomingcall;


import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.airbnb.lottie.LottieAnimationView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.facebook.react.ReactFragment;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.squareup.picasso.Picasso;

public class IncomingCallActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

  private static final String TAG = "MessagingService";
  private static final String TAG_KEYGUARD = "Incoming:unLock";
  private TextView tvName;
  private TextView tvInfo;
  private TextView tvDecline;
  private TextView tvAccept;
  private ImageView ivAvatar;
  private LottieAnimationView acceptCallBtn;
  private LottieAnimationView rejectCallBtn;
  private LinearLayout lnDeclineCall;
  private LinearLayout lnAcceptCall;

  private String uuid = "";
  static boolean active = false;
  static IncomingCallActivity instance;

  public static IncomingCallActivity getInstance() {
    return instance;
  }
  @Override
  public void onStart() {
    super.onStart();
    active=true;
    instance = this;
  }

  @Override
  public void onStop() {
    super.onStop();
  }
  @Override
  public void onDestroy() {
    Log.d(TAG, "onDestroy: ");
    if(active){
      dismissIncoming(Constants.ACTION_REJECTED_CALL);
    }
    super.onDestroy();
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true);
      setTurnScreenOn(true);
      //Some devices need the code below to work when the device is locked
      KeyguardManager keyguardManager = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
      if (keyguardManager.isDeviceLocked()) {
        KeyguardManager.KeyguardLock keyguardLock = keyguardManager.newKeyguardLock(TAG_KEYGUARD);
        keyguardLock.disableKeyguard();
      }
    }
    getWindow().addFlags(
      WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
        | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
        | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
        | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        | WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON);
    Bundle bundle = getIntent().getExtras();
    if (bundle.containsKey("mainComponent") && bundle.getString("mainComponent")!=null) {
      setContentView(R.layout.custom_ingcoming_call_rn);
       Fragment reactNativeFragment = new ReactFragment.Builder()
      .setComponentName(bundle.getString("mainComponent"))
         .setLaunchOptions(bundle)
      .build();
    getSupportFragmentManager()
      .beginTransaction()
      .add(R.id.reactNativeFragment, reactNativeFragment)
      .commit();
      if (bundle.containsKey("uuid")) {
        uuid = bundle.getString("uuid");
      }
    return;
    }else{
      setContentView(R.layout.activity_call_incoming);
    }
    tvName = findViewById(R.id.tvName);
    tvInfo = findViewById(R.id.tvInfo);
    ivAvatar = findViewById(R.id.ivAvatar);
    tvDecline=findViewById(R.id.tvDecline);
    tvAccept=findViewById(R.id.tvAccept);
    lnDeclineCall = findViewById(R.id.lnDeclineCall);
    lnAcceptCall = findViewById(R.id.lnAcceptCall);
    if (bundle != null) {
      if (bundle.containsKey("uuid")) {
        uuid = bundle.getString("uuid");
      }
      if (bundle.containsKey("name")) {
        String name = bundle.getString("name");
        tvName.setText(name);
      }
      if (bundle.containsKey("info")) {
        String info = bundle.getString("info");
        tvInfo.setText(info);
      }
      if (bundle.containsKey("avatar")) {
        String avatar = bundle.getString("avatar");
        if (avatar != null) {
          Picasso.get().load(avatar).transform(new CircleTransform()).into(ivAvatar);
        }
      }
      if(bundle.containsKey("declineText")){
        String declineText = bundle.getString("declineText");
        tvDecline.setText(declineText);
      }
      if(bundle.containsKey("answerText")){
        String answerText = bundle.getString("answerText");
        tvAccept.setText(answerText);
      }
    }

    lnAcceptCall.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
          acceptDialing();
      }
    });

    lnDeclineCall.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        dismissDialing(Constants.ACTION_REJECTED_CALL);
      }
    });

  }

  @Override
  public void onBackPressed() {
    // Dont back
  }

  public void dismissIncoming(String action) {
    dismissDialing(action);
  }
  public void destroyActivity(Boolean isReject) {
    active=isReject;
    if (android.os.Build.VERSION.SDK_INT >= 21) {
      finishAndRemoveTask();
    } else {
      finish();
    }
  }

  private void acceptDialing() {
    active=false;
    WritableMap params = Arguments.createMap();
    Bundle bundle = getIntent().getExtras();
    if(bundle.containsKey("payload")){
      params.putString("payload",bundle.getString("payload"));
    }
    params.putString("callUUID", uuid);
    FullScreenNotificationIncomingCallModule.sendEventToJs(Constants.RNNotificationAnswerAction, params);
    stopService(new Intent(this, IncomingCallService.class));

    if (Build.VERSION.SDK_INT >= 21) {
      finishAndRemoveTask();
    } else {
      finish();
    }
  }

  private void dismissDialing(String action) {
    active=false;
    WritableMap params = Arguments.createMap();
    Bundle bundle = getIntent().getExtras();
    if(bundle.containsKey("payload")){
      params.putString("payload",bundle.getString("payload"));
    }
    params.putString("callUUID", uuid);
    params.putString("endAction",action);
    FullScreenNotificationIncomingCallModule.sendEventToJs(Constants.RNNotificationEndCallAction, params);
    stopService(new Intent(this, IncomingCallService.class));
    if (android.os.Build.VERSION.SDK_INT >= 21) {
      finishAndRemoveTask();
    } else {
      finish();
    }
  }

  @Override
  public void invokeDefaultOnBackPressed() {
    super.onBackPressed();
  }
}
