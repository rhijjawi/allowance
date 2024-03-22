import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const authHeader = req.headers.authorization;
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`){
        return res.status(401).json({ success: false });
    }
    await axios.post("https://mail.logmoney.app/")

}
