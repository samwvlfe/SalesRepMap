export default async function listRoutes(fastify) {

  fastify.post('/lists/create', async (request, reply) => {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.status(401).send({ error: 'No token provided' })
    }

    const accessToken = authHeader.replace('Bearer ', '')
    const { listName, contactIds } = request.body

    if (!listName || !listName.trim()) {
      return reply.status(400).send({ error: 'listName is required' })
    }
    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return reply.status(400).send({ error: 'contactIds must be a non-empty array' })
    }

    // Step 1: Create the static list
    let listId
    try {
      const createRes = await fetch('https://api.hubapi.com/crm/v3/lists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName.trim(),
          processingType: 'MANUAL',
          objectTypeId: '0-1',
        }),
      })

      const createData = await createRes.json()

      if (!createRes.ok) {
        console.error('HubSpot create list error:', JSON.stringify(createData, null, 2))
        return reply.status(createRes.status).send({
          error: 'Failed to create HubSpot list',
          detail: createData.message || JSON.stringify(createData),
        })
      }
      console.log('createData full response:', JSON.stringify(createData))
      listId = createData.list?.listId ?? createData.listId
    } catch (err) {
      return reply.status(500).send({ error: 'Error calling HubSpot create list API', detail: err.message })
    }

    // Step 2: Add contacts to the list
    try {
      const addRes = await fetch(`https://api.hubapi.com/crm/v3/lists/${listId}/memberships/add`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( contactIds ),
      })

      const addData = await addRes.json()

      if (!addRes.ok) {
        return reply.status(addRes.status).send({
          error: 'List created but failed to add contacts',
          detail: addData.message || JSON.stringify(addData),
          listId,
        })
      }

      return reply.send({ success: true, listId, listName: listName.trim() })
    } catch (err) {
      return reply.status(500).send({
        error: 'List created but error calling HubSpot add members API',
        detail: err.message,
        listId,
      })
    }
  })
}
