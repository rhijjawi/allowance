
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import {parse} from 'csv-parse/sync';
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { ExpenseSchema } from '@/types/supabase';
import {readFile} from "fs/promises"
import { functions } from '@/components/static/supportedbanks';
import { InsertExp } from '@/components/contexts/expenseCTX';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);
export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const form = formidable({allowEmptyFiles : false});
    const {userId} = getAuth(req)
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'Error parsing form data', msg: err });
          return;
        }
        try {
            console.log(fields, files)
            if (!Object.keys(functions).includes(fields.bank![0])){
                return res.status(400).json({ error: 'Unsupported bank' });
            }
            const f = await readFile(files.csvFile![0].filepath, {encoding : "utf-8"})
            const result = convertCsvToJson(f.toString(), userId!, fields.bank![0]);
            if (result.length == 0){
                res.status(400).json({error: "Something Happened"})
            }
            const { data, error } = await supabase.from('expenses').insert(result).eq("user_id", userId).select("amount,currency,category,label,transaction_date,recurring,files,refunded,is_displayed");
            if (!error){
                return res.status(200).json({results: data, count: result.length}) 
            }
            else {
                throw Error(error.message)
            }
        } catch (error) {
            console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });   
    
};



function convertCsvToJson(csvString: string, userId : string, bank : string) : any[]{
    const csv = parse(csvString, {encoding : "utf-8", skip_empty_lines : true})
    let results = csv.splice(1).map((line : any) => {
        let bankData = functions[bank](line)
        if (bankData == null){
            return null;
        }
        bankData = bankData as InsertExp;
        const files : string[] = []; 
        const jsonObject : ExpenseSchema = {
            amount : bankData.amount,
            currency : bankData.currency,
            category : bankData.category,
            label : bankData.label,
            transaction_date: bankData.transaction_date,
            user_id : userId,
            recurring : bankData.recurring,
            files : bankData.files,
            refunded: bankData.recurring,
            is_displayed : bankData.is_displayed
        };
        console.log(jsonObject)
        return jsonObject;
    })
    return results.filter((value : any) => {
        return value != null;
    })
  };


