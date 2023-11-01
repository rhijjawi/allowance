import { NextApiRequest, NextApiResponse } from "next";
import { getSupabase } from "@/utils/supabase";
import { clerkClient } from "@clerk/nextjs";
import { UserJSON } from "@clerk/nextjs/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method == "POST"){
        const { data } = req.body as { data: UserJSON };
        await clerkClient.users.updateUserMetadata(data.id, {
            publicMetadata: {
              role : data.unsafe_metadata.role,
              currency : data.unsafe_metadata.currency
            },
            unsafeMetadata : {
    
            }
        })
        res.status(200).json({message: "OK"})
    }
}