package com.mymarketplaceapp.org;

import android.view.View;

import com.facebook.react.ReactActivity;

import org.pweitz.reactnative.locationswitch.LocationSwitch;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "mamaapp";
    }

    // Manually pass along the `onActivityResult` event to React Native event listeners.
    // We are not extending from `ReactActivity` so we need to do this manually.
//  @Override
//  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//    LocationSwitch.getInstance().onActivityResult( this, requestCode, resultCode, data );
//  }
}
