import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      
      // Handle traffic notifications when app is open
      const data = notification.request.content.data;
      if (data?.type) {
        handleTrafficNotification(data);
      }
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.type) {
        handleTrafficNotificationTap(data);
      }
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Handle traffic notifications when app is open
  const handleTrafficNotification = (data: any) => {
    console.log('Traffic notification received:', data);
    
    // You can add custom logic here like:
    // - Playing specific sounds
    // - Showing in-app alerts
    // - Updating UI state
    // - Triggering haptic feedback
    
    switch (data.type) {
      case 'traffic':
        console.log(`🚦 Traffic alert: ${data.locationName} - ${data.timeAway} away`);
        break;
      case 'road-closure':
        console.log(`🚧 Road closure: ${data.locationName} - ${data.timeAway} away`);
        break;
      case 'accident':
        console.log(`⚠️ Accident alert: ${data.locationName} - ${data.timeAway} away`);
        break;
    }
  };

  // Handle when user taps on traffic notification
  const handleTrafficNotificationTap = (data: any) => {
    console.log('User tapped traffic notification:', data);
    
    // You can add navigation logic here like:
    // - Navigate to map with coordinates
    // - Open traffic details screen
    // - Show route alternatives
    
    if (data.coordinates) {
      console.log(`Navigate to: ${data.coordinates.lat}, ${data.coordinates.lng}`);
      // Example: router.push(`/map?lat=${data.coordinates.lat}&lng=${data.coordinates.lng}`);
    }
  };

  return { expoPushToken, notification };
}

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
    return null;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
} 