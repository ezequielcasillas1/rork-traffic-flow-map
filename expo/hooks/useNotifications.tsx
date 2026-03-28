import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      handleTrafficNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      handleTrafficNotificationTap(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'b40a5dce-6ee6-4fde-b20f-b725c944a52b',
    })).data;
    console.log('Expo push token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

function handleTrafficNotification(notification: Notifications.Notification) {
  console.log('Traffic notification received:', notification);
  // Handle different types of traffic notifications
  const { title, body, data } = notification.request.content;
  
  if (data?.type === 'traffic') {
    console.log('Traffic alert:', title, body);
  } else if (data?.type === 'road-closure') {
    console.log('Road closure alert:', title, body);
  } else if (data?.type === 'accident') {
    console.log('Accident alert:', title, body);
  }
}

function handleTrafficNotificationTap(response: Notifications.NotificationResponse) {
  console.log('Traffic notification tapped:', response);
  const { title, body, data } = response.notification.request.content;
  
  // Handle navigation or other actions when notification is tapped
  if (data?.type === 'traffic') {
    console.log('Navigate to traffic incident:', data.location);
  } else if (data?.type === 'road-closure') {
    console.log('Navigate to road closure:', data.location);
  } else if (data?.type === 'accident') {
    console.log('Navigate to accident location:', data.location);
  }
} 