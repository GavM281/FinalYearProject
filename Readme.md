# Wiki feature
This wiki feature allows users to create notes for their modules. It offers the ability to share these notes with other students in the module. Users can comment on notes to ask questions or start discussions.
Users can also filter notes based off the notes privacy or a search query.

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


<hr>

### Built Using
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [React Native](https://reactnative.dev/) - Front End Framework
- [NodeJS](https://nodejs.org/en/) - Server Environment
- [Heroku](https://www.heroku.com/) - Server Hosting

### Screenshots
Module Selection
 
<img src="https://user-images.githubusercontent.com/25159545/230784504-f5314782-6f85-4e8f-a28f-477e4a1d53cc.jpg" width="200" />

##### List of Notes for Module
<img src="https://user-images.githubusercontent.com/25159545/230784536-8ff58291-12c6-4b7f-b8e3-184eae58d54b.jpg" width="200" />

##### Note
<img src="https://user-images.githubusercontent.com/25159545/230784557-3224ca32-6add-4099-be1a-34081fc30fc2.jpg" width="200" />

##### Comments
<img src="https://user-images.githubusercontent.com/25159545/230784583-426cb4c7-8d35-4ad9-aae8-f764506008eb.jpg" width="200" />

##### Search function
<img src="https://user-images.githubusercontent.com/25159545/230784608-57a5653a-dbb8-43fb-908b-5c2e2c775928.jpg" width="200" />

##### Filter Function
<img src="https://user-images.githubusercontent.com/25159545/230784613-dd06f73d-8124-4e23-ac0a-5e1fb1822dc4.jpg" width="200" />

