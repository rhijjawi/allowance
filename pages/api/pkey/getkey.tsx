import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            return await GET(req, res)
        case 'POST':
        // return await POST(req, res)
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    const user = getAuth(req)
    //const {data, error} = await getSupabase().from('parents').select('*').eq('clerk_id', req.body.clerk_id)
    return res.status(200).json({ key: user })
}
