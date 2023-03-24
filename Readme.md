### Prerequisites
- Install Android Studio from https://developer.android.com/studio. During installation select the following items to use the app:
    -	Android SDK
    -	Android SDK Platform
    - Android Virtual Device (AVD) Manager if you don’t have a physical device to test the app on. This allows you to create a virtual device that can be used to run the app.

- Make sure you have NodeJS installed. You can check if you have NodeJS by running the command
  `node -v `
  which will give you the version of node installed. If you don’t have node installed it can be installed from https://nodejs.org/en/download/current

### Steps
- Run the command
  `git clone https://github.com/GavM281/FinalYearProject.git`
  which will clone the repository from GitHub to your local machine.
- cd into the project

- Run the command
  `npm install`
  which will install the modules required to run the app in a node_modules folder.
- Create a `local.properties` file in the android folder with a link to the location of the Android SDK on your computer

- To run the app on an Android device or emulator use the command
  `react-native run-android`
  If you're using a physical device, make sure that USB debugging is enabled and that your device is connected to your computer via USB.
  To use an emulator, you need create an emulated device in Android Studio.

The command
`adb devices`
can be used to check if your device has been detected.
