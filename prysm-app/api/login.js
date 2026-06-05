import { kv } from '@vercel/kv';

let localSession = null;

export default async function handler(req, res) {
  // Add CORS headers for local development if needed
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (email.includes('@') && password.length >= 4) {
      const name = email.split('@')[0];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      const role = email.toLowerCase().includes('manager') ? 'manager' : 'presenter';
      
      const user = { email, name: capitalized, role };

      // Try to save session in Vercel KV if available
      try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
          await kv.set(`session:${email}`, user);
        } else {
          localSession = user;
        }
      } catch (err) {
        console.warn('KV Store not configured, falling back to local memory:', err.message);
      }

      return res.status(200).json({ user });
    } else {
      return res.status(400).json({ error: 'Please enter a valid email and a password (min. 4 characters).' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
