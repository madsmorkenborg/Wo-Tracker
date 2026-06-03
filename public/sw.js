self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch (e) { data = { title: '💪 Rest Over!', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || '😴 Rest Over — Time to Lift! 💪', {
      body: data.body || 'Your 2 minute rest is done. Next set awaits!',
      icon: data.icon || '/favicon.ico',
      badge: data.badge || '/favicon.ico',
      tag: data.tag || 'rest-timer',
      renotify: data.renotify || true,
      vibrate: [200, 100, 200, 100, 400],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});