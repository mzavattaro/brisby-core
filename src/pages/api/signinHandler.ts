import type { NextApiHandler } from 'next';
import { parseBody } from '../../utils/parseBody';
import { parseError } from '../../utils/error';

type requestPayload = {
  email: string;
  csrfToken: string;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, csrfToken } = parseBody<requestPayload>(req);

  if (typeof email !== 'string' && typeof csrfToken !== 'string') {
    const error = new Error('Missing required fields');

    res.status(400).json({ message: error.message });
    return;
  }

  const data = parseBody<requestPayload>(req);

  console.log('Single stringify', data);
  console.log('Double stringified', JSON.stringify(data));

  try {
    console.log('before fetch');
    await fetch('/api/auth/signin/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('after fetch');
    res.status(200).json({ message: 'Success' });
    return;
  } catch (error) {
    const message = parseError(error);

    res.status(500).json({ message });
  }
};

export default handler;
