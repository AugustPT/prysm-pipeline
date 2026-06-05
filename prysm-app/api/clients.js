import { kv } from '@vercel/kv';

const defaultClients = [
  {
    id: "mock-1",
    clientName: "Sarah Miller",
    clientEmail: "sarah.m@example.com",
    audienceId: "yoga_wellness",
    score: "green",
    goals: ["Energy", "Gut comfort"],
    products: ["LifePak Elements", "Nu Biome"],
    date: "2026-05-15",
    status: "Scan Completed",
    presenter: "Bobby"
  },
  {
    id: "mock-2",
    clientName: "David Chen",
    clientEmail: "dchen@example.com",
    audienceId: "gym_trainer",
    score: "yellow",
    goals: ["Athletic recovery", "Energy"],
    products: ["TRMe GO Protein+", "LifePak Elements"],
    date: "2026-05-28",
    status: "Follow-up Sent",
    presenter: "Bobby"
  },
  {
    id: "mock-3",
    clientName: "Emma Rodriguez",
    clientEmail: "emma.rod@example.com",
    audienceId: "salon_spa",
    score: "orange",
    goals: ["Skin/beauty", "Stress"],
    products: ["Beauty Focus Collagen+", "Nu Biome"],
    date: "2026-06-01",
    status: "Rescan Scheduled",
    presenter: "Alex"
  },
  {
    id: "mock-4",
    clientName: "Marcus Vance",
    clientEmail: "marcus.v@example.com",
    audienceId: "scanner_builder",
    score: "red",
    goals: ["Place scanner", "Extra income"],
    products: ["Prysm iO scanner placement path", "LifePak Elements"],
    date: "2026-06-03",
    status: "Scan Completed",
    presenter: "Alex"
  },
  {
    id: "mock-5",
    clientName: "Chloe Higgins",
    clientEmail: "chloe.h@example.com",
    audienceId: "yoga_wellness",
    score: "blue",
    goals: ["Gut comfort", "Skin/beauty"],
    products: ["Beauty Focus Collagen+", "Nu Biome"],
    date: "2026-06-02",
    status: "Completed",
    presenter: "Sarah"
  },
  {
    id: "mock-6",
    clientName: "Michael Vance",
    clientEmail: "m.vance@example.com",
    audienceId: "athlete_event",
    score: "purple",
    goals: ["Athletic recovery"],
    products: ["TRMe GO Protein+"],
    date: "2026-06-03",
    status: "Scan Completed",
    presenter: "Sarah"
  },
  {
    id: "mock-7",
    clientName: "James Watson",
    clientEmail: "jwatson@example.com",
    audienceId: "gym_trainer",
    score: "yellow",
    goals: ["Energy", "Sleep"],
    products: ["LifePak Elements", "MYND360 Night Time"],
    date: "2026-05-20",
    status: "Follow-up Sent",
    presenter: "David"
  },
  {
    id: "mock-8",
    clientName: "Lisa Wong",
    clientEmail: "lisa.wong@example.com",
    audienceId: "eye_dental_chiro",
    score: "green",
    goals: ["Nutrition gaps"],
    products: ["LifePak Elements"],
    date: "2026-05-25",
    status: "Scan Completed",
    presenter: "David"
  }
];

let inMemoryClients = [...defaultClients];

async function getClients() {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const data = await kv.get('clients');
      if (data) {
        return data;
      } else {
        await kv.set('clients', defaultClients);
        return defaultClients;
      }
    }
  } catch (err) {
    console.warn('Vercel KV get failed, using memory:', err.message);
  }
  return inMemoryClients;
}

async function saveClients(list) {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set('clients', list);
      return;
    }
  } catch (err) {
    console.warn('Vercel KV set failed, using memory:', err.message);
  }
  inMemoryClients = list;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const list = await getClients();

  if (req.method === 'GET') {
    const { presenter, score } = req.query || {};
    let filtered = [...list];
    if (presenter && presenter !== 'all') {
      filtered = filtered.filter(c => c.presenter === presenter);
    }
    if (score && score !== 'all') {
      filtered = filtered.filter(c => c.score === score);
    }
    return res.status(200).json(filtered);
  }

  if (req.method === 'POST') {
    const newClient = req.body;
    if (!newClient || !newClient.clientName) {
      return res.status(400).json({ error: 'Client Name is required.' });
    }
    const updated = [newClient, ...list];
    await saveClients(updated);
    return res.status(200).json(newClient);
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body || {};
    if (!id || !status) {
      return res.status(400).json({ error: 'ID and Status are required.' });
    }
    const updated = list.map(c => c.id === id ? { ...c, status } : c);
    await saveClients(updated);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }
    const updated = list.filter(c => c.id !== id);
    await saveClients(updated);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
