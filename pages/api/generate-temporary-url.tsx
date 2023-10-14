'use server';
import { NextApiRequest, NextApiResponse } from "next";
import { generateTemporaryUrl } from "next-s3-upload";




const TempURL = async function GenerateTemporaryUrlHandler(req : NextApiRequest, res : NextApiResponse) {
    let key = req.query.key as string;
    let temporaryUrl = await generateTemporaryUrl(key, {accessKeyId: process.env.S3_UPLOAD_KEY,
        secretAccessKey: process.env.S3_UPLOAD_SECRET,
        bucket: process.env.S3_UPLOAD_BUCKET,
        region: process.env.S3_UPLOAD_REGION,
        endpoint: process.env.S3_ENDPOINT})
        res.status(200).json({ temporaryUrl });
    }
export default TempURL;