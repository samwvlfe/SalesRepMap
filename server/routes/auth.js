export default async function authRoutes(fastify) {

  // Step 1: redirect rep to HubSpot login
  fastify.get('/login', async (request, reply) => {
    const params = new URLSearchParams({
      client_id: process.env.HUBSPOT_CLIENT_ID,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
      scope: 'crm.objects.contacts.read crm.objects.owners.read',
    })
    reply.redirect(`https://app.hubspot.com/oauth/authorize?${params}`)
  })

  // Step 2: HubSpot redirects back here with a code
  fastify.get('/callback', async (request, reply) => {
    const { code } = request.query

    if (!code) {
      return reply.status(400).send({ error: 'No code provided' })
    }

    try {
      const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
          code,
        })
      })

      const tokens = await response.json()

      if (tokens.error) {
        return reply.status(400).send(tokens)
      }

      // For now, send tokens to frontend via redirect with query params
      // We'll improve this with proper session handling later
      const frontendParams = new URLSearchParams({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      })

      reply.redirect(`http://localhost:5173/auth-success?${frontendParams}`)

    } catch (err) {
      reply.status(500).send({ error: 'Token exchange failed', detail: err.message })
    }
  })
}