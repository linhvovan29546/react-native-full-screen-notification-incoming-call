package com.reactnativefullscreennotificationincomingcall;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class NotificationReceiverActivity extends Activity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    NotificationReceiverHandler.handleNotification(this, getIntent());
    finish();
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    NotificationReceiverHandler.handleNotification(this, intent);
    finish();
  }
}
