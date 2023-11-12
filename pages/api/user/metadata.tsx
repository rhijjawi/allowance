import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'PUT':
            return await PUT(req, res);
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

async function PUT(req: NextApiRequest, res : NextApiResponse){
    const { userId } = getAuth(req);
    console.log(req.body)
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    let user = await clerkClient.users.getUser(userId)
    let metadata = Object.assign({}, user.publicMetadata)
    metadata['reports'] = req.body.pub.reports
    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: metadata,
        unsafeMetadata: {}
    });
    res.status(200).send({})
};

export default handler;