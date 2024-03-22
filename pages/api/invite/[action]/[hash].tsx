import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { clerkClient } from '@clerk/nextjs/server'


async function actFromHash(hash: string, accepted: boolean, from : string){
    if (accepted){
        return `/sign-up?role=parent&hash=${hash}&from=${from}`
    }
    return null
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return await GET(req, res)
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { action, hash, from } = req.query as { action: string; hash: string, from : string }
    if (['approve'].indexOf(action!) == -1) {
        return res.status(400).send('nuh uh')
    }
    const data = await actFromHash(hash, action == 'approve', from)
    if (data == null) {
        return res.status(400).send('Hash does not exist!')
    }
    // if (data == false) {
    //     return res.status(400).send('Hash is no longer valid')
    // }
    return res.redirect(data)
}

export default handler