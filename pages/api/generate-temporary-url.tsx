import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { generateTemporaryUrl, sanitizeKey } from "next-s3-upload";


export default async function POST(req : NextApiRequest, res : NextApiResponse) {
    const {userId} = getAuth(req)
    const {txId, keys} = req.body;
    let temporaryUrls = await Promise.all(keys.map(async(key : string)=>{return [`${userId}/${txId}/${key}`,await generateTemporaryUrl(`${userId}/${txId}/${sanitizeKey(key)}`, {accessKeyId: process.env.S3_UPLOAD_KEY,
        secretAccessKey: process.env.S3_UPLOAD_SECRET,
        bucket: process.env.S3_UPLOAD_BUCKET,
        region: process.env.S3_UPLOAD_REGION,
        endpoint: process.env.S3_ENDPOINT})]}));
    res.status(200).json({ temporaryUrls });
}