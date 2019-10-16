import firebase from 'react-native-firebase'
import {Platform } from 'react-native'
import dbstore from 'react-native-simple-store'

export const requestPermission = () => {
  firebase.messaging().hasPermission()
  .then(enabled => {
    if (enabled) {
      // user has permissions
      firebase.messaging().getToken().then(token => {
        console.log(token)
        dbstore.save('pushKey', token)
        //await AsyncStorage.setItem('@MySuperStore:key', token);
        createNotificationListeners()
      })
    } else {
      firebase.messaging().requestPermission()
      .then(() => {
        //User Now Has Permission
        firebase.messaging().getToken().then(token => {
          console.log(token)
          dbstore.save('pushKey', token)
          createNotificationListeners()
        })
      })
      .catch(error => {
        // User has rejected permissions
        console.log("Rejected permissions", error)
      });
    }
  });
}

export const createNotificationListeners = () => {
  this.messageListener = firebase.messaging().onMessage((message) => {
    // Process your message as required
    console.log(message)
  });
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    // Get the action triggered by the notification being opened
    // Get information about the notification that was opened
    console.log(notificationOpen)
    const notification = notificationOpen.notification;
    firebase.notifications().removeDeliveredNotification(notification.notificationId);
    console.log(notification)

  });
  this.notificationListener = firebase.notifications().onNotification((notification) => {
    // Process your notification as required
    console.log(notification)
    const localNotif = new firebase.notifications.Notification()
      .setNotificationId(notification._notificationId)
      .setTitle(notification._title || "OnMyGrad")
      .setSubtitle(notification._subtitle)
      .setBody(notification._body)
      .setData(notification._data)
      //.setSound('default')

      if (Platform.OS === "android"){
        localNotif.android.setChannelId('onmygrd-channel')
          //.android.setSmallIcon("ic_notification")
          .android.setColor("black")
          .android.setPriority(firebase.notifications.Android.Priority.High)
        
        // Build a channel
        const channel = new firebase.notifications.Android.Channel('onmygrd-channel', 'Onmygrad Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('Onmygrad Channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);
      }

    firebase.notifications().displayNotification(localNotif)
  });
}