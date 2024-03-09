import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            await GET(req, res)
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    return res.status(200).json({ banks: ['revolut', 'commerzbank', 'wise'] })
}
