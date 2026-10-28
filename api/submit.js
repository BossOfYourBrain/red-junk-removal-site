/**
 * Vercel serverless function to handle feedback form submissions
 * Validates input and forwards to webhook
 */

const ALLOWED_GRIPES = ['price_changed', 'landfill', 'waited', 'wouldnt_take'];
const MAX_STORY_LENGTH = 2000;
const CANADIAN_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for webhook URL
  const webhookUrl = process.env.GROK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('GROK_WEBHOOK_URL environment variable is not set');
    return res.status(503).json({ 
      error: 'Service temporarily unavailable. Please try again later.' 
    });
  }

  let data;
  try {
    // Parse JSON body (Vercel parses it automatically, but handle edge cases)
    data = req.body;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const { gripes, story, email, postal_code, website } = data;

  // Honeypot check - if website field is filled, it's spam
  if (website && website.trim() !== '') {
    console.log('Spam detected via honeypot field');
    // Pretend success to avoid revealing the honeypot
    if (req.headers['content-type']?.includes('application/json')) {
      return res.status(200).json({ success: true });
    }
    return res.redirect(302, '/?sent=1');
  }

  // Validate postal code (required)
  if (!postal_code || typeof postal_code !== 'string') {
    return res.status(400).json({ error: 'Postal code is required' });
  }

  const trimmedPostalCode = postal_code.trim();
  if (!CANADIAN_POSTAL_CODE_REGEX.test(trimmedPostalCode)) {
    return res.status(400).json({ 
      error: 'Please enter a valid Canadian postal code (e.g., V8T 2P9)' 
    });
  }

  // Validate email if provided
  if (email && typeof email === 'string' && email.trim() !== '') {
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
  }

  // Validate story length if provided
  const trimmedStory = typeof story === 'string' ? story.trim() : '';
  if (trimmedStory.length > MAX_STORY_LENGTH) {
    return res.status(400).json({ 
      error: `Story is too long. Please keep it under ${MAX_STORY_LENGTH} characters.` 
    });
  }

  // Validate gripes (must be array of known values)
  const validatedGripes = [];
  if (Array.isArray(gripes)) {
    for (const gripe of gripes) {
      if (typeof gripe === 'string' && ALLOWED_GRIPES.includes(gripe)) {
        validatedGripes.push(gripe);
      }
    }
  }

  // Build webhook payload
  const payload = {
    gripes: validatedGripes,
    story: trimmedStory,
    email: typeof email === 'string' ? email.trim() : '',
    postal_code: trimmedPostalCode,
    submitted_at: new Date().toISOString(),
    page: 'coming-soon',
    user_agent: req.headers['user-agent'] || ''
  };

  // Forward to webhook
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if secret is set
    const webhookSecret = process.env.GROK_WEBHOOK_SECRET;
    if (webhookSecret) {
      headers['Authorization'] = `Bearer ${webhookSecret}`;
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!webhookResponse.ok) {
      console.error('Webhook responded with status:', webhookResponse.status);
      throw new Error('Webhook request failed');
    }

    console.log('Feedback submitted successfully');

    // Return success
    if (req.headers['content-type']?.includes('application/json')) {
      return res.status(200).json({ success: true });
    }
    return res.redirect(302, '/?sent=1');

  } catch (err) {
    console.error('Error forwarding to webhook:', err);
    return res.status(500).json({ 
      error: 'Failed to submit feedback. Please try again.' 
    });
  }
};
