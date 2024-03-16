import { clerkClient } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'PUT':
            return await PUT(req, res)
        case 'GET':
            return await GET(req, res)
        case 'POST':
            return await POST(req, res)
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

function overwriteNestedKey(obj: any, path: string, value: string) {
    const keys = path.split('.')
    let currentObject = obj

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!currentObject[key]) {
            currentObject[key] = {}
        }
        currentObject = currentObject[key]
    }

    const lastKey = keys[keys.length - 1]
    currentObject[lastKey] = value
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
    let { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    try {
        let user = await clerkClient.users.getUser(userId)

        let metadata = Object.assign({}, user.publicMetadata)
        for (const path in req.body) {
            const value = req.body[path]
            if (path == 'role') {
                return
            }
            overwriteNestedKey(metadata, path, value)
        }
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: metadata,
            unsafeMetadata: {},
        })

        res.status(200).json({ updatedKey: [...Object.keys(req.body)] })
    } catch (error) {
        console.error('Error updating user metadata:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
async function PUT(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)
    console.log(req.body)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    let user = await clerkClient.users.getUser(userId)
    let metadata = Object.assign({}, user.publicMetadata)
    metadata['reports'] = req.body.pub.reports
    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: metadata,
        unsafeMetadata: {},
    })
    res.status(200).send({})
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)
    let user
    console.log(req.body)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })
    try {
        user = await clerkClient.users.getUser(userId)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
    return res.status(200).json({ metadata: user.publicMetadata })
}

export default handler
