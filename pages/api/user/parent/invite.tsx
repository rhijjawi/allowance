import { clerkClient } from "@clerk/nextjs"
import { User, getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST':
            return POST(req, res)
        default:
            return res.status(405).send('Method not allowed')
    }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
    const {inviteEmail} = req.body;
    const {userId} = getAuth(req)
    if (!userId){
        return res.status(401).send("")
    }
    const users = await clerkClient.users.getUserList({emailAddress : inviteEmail})
    
    let userExists = !(users.length == 0)
    console.log(userExists)
    if (userExists){
        if (userExists && users[0].publicMetadata.role == "parent"){
            await createConnectUserRequest(userId, users[0].id)
            return res.status(200).json({message : "Parent Invited!"})
        }
        else {
            return res.status(500).json({error : "User is not a parent!"})
        }  
    }
    else {
        const _ = await createUserInvite(inviteEmail, userId)
        return res.json(_.data)

    }
}

async function createUserInvite(inviteEmail : string, child : string) {
    const postUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:2999/invite_parent" : "https://mail.logmoney.app/invite_parent"
    return await axios.post(postUrl, {inviteEmail, child}, {headers : {'Content-Type' : "application/json"}})
}

async function createConnectUserRequest(child : string, parent : string) {
    const postUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:2999/pair_request" : "https://mail.logmoney.app/pair_request"
    return await axios.post(postUrl, {reqUser : child, parent}, {headers : {'Content-Type' : "application/json"}})
}

