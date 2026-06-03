// v7
const webpush = require('web-push');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(500).json({ error: 'VAPID keys not configured' });
  }

  const { subscription, fireAt, message, _direct } = req.body || {};

  if (!subscription || !fireAt) {
    return res.status(400).json({ error: 'Missing subscription or fireAt' });
  }

  // ── If this is a direct send (called back by QStash after the delay) ──
  if (_direct) {
    try {
      webpush.setVapidDetails(
        'mailto:madsmorkenborg@gmail.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: '😴 Rest Over — Time to Lift! 💪',
          body: message || 'Your 2 minute rest is done. Next set awaits!',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'rest-timer',
          renotify: true,
        })
      );
      console.log('Push sent successfully via QStash callback');
      return res.status(200).json({ sent: true });
    } catch (err) {
      console.error('Push failed:', err.statusCode, err.message);
      return res.status(500).json({ error: 'Push failed', detail: err.message });
    }
  }

  // ── Schedule via QStash ──
  const delay = Math.max(0, parseInt(fireAt) - Date.now());
  const delaySeconds = Math.min(Math.round(delay / 1000), 300);

  if (!process.env.QSTASH_TOKEN) {
    console.warn('QSTASH_TOKEN not set — sending push immediately as fallback');
    try {
      webpush.setVapidDetails(
        'mailto:madsmorkenborg@gmail.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: '😴 Rest Over — Time to Lift! 💪',
          body: message || 'Your 2 minute rest is done. Next set awaits!',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'rest-timer',
          renotify: true,
        })
      );
      return res.status(200).json({ sent: true, immediate: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  const callbackUrl = 'https://workout-t-r7pz.vercel.app/api/push';
  console.log('Scheduling via QStash, callback URL:', callbackUrl);
  console.log('Delay seconds:', delaySeconds);

  try {
    const qstashRes = await fetch(
      'https://qstash.upstash.io/v2/publish/' + callbackUrl,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
          'Content-Type': 'application/json',
          'Upstash-Delay': `${delaySeconds}s`,
          'Upstash-Retries': '2',
        },
        body: JSON.stringify({
          subscription,
          fireAt,
          message,
          _direct: true,
        }),
      }
    );

    if (!qstashRes.ok) {
      const errText = await qstashRes.text();
      console.error('QStash scheduling failed:', errText);
      return res.status(500).json({ error: 'QStash scheduling failed', detail: errText });
    }

    const qstashData = await qstashRes.json();
    console.log('QStash scheduled successfully, messageId:', qstashData.messageId);
    return res.status(200).json({
      scheduled: true,
      delay: delaySeconds,
      messageId: qstashData.messageId,
    });

  } catch (err) {
    console.error('QStash request failed:', err.message);
    return res.status(500).json({ error: 'QStash request failed', detail: err.message });
  }
};