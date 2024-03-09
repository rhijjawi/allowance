import { User, getAuth } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { clerkClient, useAuth } from '@clerk/nextjs'
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SECRET_KEY!
)
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return await GET(req, res)
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { uuid, noauth } = req.query
    const { data, error } = await supabase
        .from('reports')
        .select('parent_id, forchild, date_range, no_login')
        .eq('uuid', uuid)
    const { userId } = useAuth()
    let user,
        child = null
    if (data && data.length == 0) {
        return res.status(404).json({ error: 'Not Found' })
    }
    if (error) {
        return res.status(500).json({ error: error.message })
    }
    if (noauth && data[0].no_login !== noauth) {
        return res.status(401).json({ error: 'Not allowed' })
    }
    try {
        user = await clerkClient.users.getUser(data[0].parent_id)
        child = await clerkClient.users.getUser(data[0].forchild)
        const expenses = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', data![0].forchild)
            .gte(
                'transaction_date',
                new Date(data[0].date_range[0]).toISOString()
            )
            .lte(
                'transaction_date',
                new Date(data[0].date_range[1]).toISOString()
            )

        if (expenses.data && !expenses.error) {
            return res.json({
                expenses: expenses.data,
                dates: data[0].date_range,
                parent: user as User,
                child: child as User,
                share: `${uuid}/${data[0].no_login}`,
            })
        } else {
            return res.json({ error: expenses.error.message })
        }
    } catch (e) {
        return res.status(500).send(e ? `${e}` : 'Internal Server Error')
    }
}

export default handler
