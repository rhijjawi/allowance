import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SECRET_KEY!
)

const approveFromHash = async ({
    parent,
    child,
    data,
}: {
    parent: string
    child: string
    data: { childId: string; supervisors: string[]; unconfirmed: string[] }[]
}) => {
    const { data: data1, error: error1 } = await supabase
        .from('oversight')
        .upsert({
            childId: child,
            supervisors: data![0].supervisors
                .filter((sup: string) => sup !== parent)
                .concat([parent]),
            unconfirmed: data![0].unconfirmed.filter(
                (sup: string) => sup !== parent
            ),
        })
        .select()
    return { data1, error1 }
}

const rejectFromHash = async ({
    parent,
    child,
    data,
}: {
    parent: string
    child: string
    data: { childId: string; supervisors: string[]; unconfirmed: string[] }[]
}) => {
    const { data: data1, error: error1 } = await supabase
        .from('oversight')
        .upsert({
            childId: child,
            supervisors: data![0].supervisors.filter(
                (sup: string) => sup !== parent
            ),
            unconfirmed: data![0].unconfirmed.filter(
                (sup: string) => sup !== parent
            ),
        })
        .select()
    return { data1, error1 }
}

async function invalidateHash(hashCheck: any, wasApproved: boolean) {
    const { data, error } = await supabase
        .from('pairingHashes')
        .update({
            ...hashCheck,
            valid: false,
            wasApproved: wasApproved,
        })
        .eq('hash', hashCheck.hash)
        .select()
    return { data, error }
}

const actFromHash = async (hash: string, wasApproved: boolean) => {
    const { data: hashCheck, error: hashCheckError } = await supabase
        .from('pairingHashes')
        .select('*')
        .eq('hash', hash)
    if (hashCheck == null || hashCheckError !== null || hashCheck.length == 0) {
        return null
    }
    if (hashCheck[0].valid == false) {
        return false
    }
    const { data, error } = (await supabase
        .from('oversight')
        .select('*')
        .eq('childId', hashCheck[0].childId)) as {
        data: {
            childId: string
            supervisors: string[]
            unconfirmed: string[]
        }[]
        error: any
    }
    invalidateHash(hashCheck[0], wasApproved).then((e) => {
        console.log(e)
    })
    if (wasApproved) {
        return await approveFromHash({
            parent: hashCheck[0].parentId,
            child: hashCheck[0].childId,
            data,
        })
    } else {
        return await rejectFromHash({
            parent: hashCheck[0].parentId,
            child: hashCheck[0].childId,
            data,
        })
    }
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
    const { action, hash } = req.query as { action: string; hash: string }
    if (['approve', 'reject'].indexOf(action!) == -1) {
        return res.status(400).send('nuh uh')
    }
    const data = await actFromHash(hash, action == 'approve')
    if (data == null) {
        return res.status(400).send('Hash does not exist!')
    }
    if (data == false) {
        return res.status(400).send('Hash is no longer valid')
    }
    return res.redirect('/')
}

export default handler
