import { getAuth } from "@clerk/nextjs/server";
import { APIRoute, sanitizeKey } from "next-s3-upload";
console.log(process.env.S3_UPLOAD_KEY, process.env.S3_UPLOAD_SECRET, process.env.S3_UPLOAD_BUCKET, process.env.S3_UPLOAD_REGION, process.env.S3_ENDPOINT)
export default APIRoute.configure({
    key : async(req, filename) => {
        const {userId} = getAuth(req)
        console.log(`${userId}/${req.body.transactionId}/${sanitizeKey(filename)}`)
        return `${userId}/${req.body.transactionId}/${sanitizeKey(filename)}`;
    },
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
    bucket: process.env.S3_UPLOAD_BUCKET,
    region: process.env.S3_UPLOAD_REGION,
    endpoint: process.env.S3_ENDPOINT
});