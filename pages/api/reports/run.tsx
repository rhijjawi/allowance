import { clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req : NextApiRequest, res : NextApiResponse){
    const authHeader = req.headers.authorization
    if (process.env.NODE_ENV == "development" || authHeader == `Bearer ${process.env.VERCEL_CRON_SECRET}` ){
        let numUsers = await clerkClient.users.getCount();
        let users = []
        for (let page = 0; page <= numUsers; page += 500){
            users.push(...await clerkClient.users.getUserList({offset : page*500, limit: 500}))
        }
        return res.json({parents : users.filter((user)=>user.publicMetadata.role == "parent")})
    }
    else {
        return res.status(401).json({error : "You are not Vercel :("})
    }
}