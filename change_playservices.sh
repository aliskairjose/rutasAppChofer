gsed -i 's/com.google.android.gms:play-services-location:11+/com.google.android.gms:play-services-location:17.0.0/g' ./android/app/capacitor.build.gradle
gsed -i 's/com.google.android.gms:play-services-location:11+/com.google.android.gms:play-services-location:17.0.0/g' ./android/capacitor-cordova-android-plugins/build.gradle
mkdir ./android/capacitor-cordova-android-plugins/src/main/res/values/
cp ./android/app/src/main/res/values/strings.xml ./android/capacitor-cordova-android-plugins/src/main/res/values/
cp ./android/app/src/main/res/values/ic_launcher_background.xml ./android/capacitor-cordova-android-plugins/src/main/res/values/
cp -f ./android/capacitor-cordova-geolocation-files/authenticator.xml ./android/capacitor-cordova-android-plugins/src/main/res/xml