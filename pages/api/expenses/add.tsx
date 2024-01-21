import {parse as fnsparse} from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import {parse} from 'csv-parse/sync';
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { ExpenseSchema } from '@/types/supabase';
import { json } from 'stream/consumers';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const form = formidable({});
    let userId;
    form.parse(req, async (err, fields, files) => {
        try{
            userId = ((getAuth(req)).userId);
        }
        catch (e){
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (err) {
          res.status(500).json({ error: 'Error parsing form data' });
          return;
        }
        try {
            const supportedBanks = ['revolut', 'commerzbank'];
            if (!supportedBanks.includes(fields.bank![0])){
                return res.status(400).json({ error: 'Unsupported bank' });
            }
            console.log()
            const result = convertCsvToJson(files.csvFile![0].toString(), userId!, fields.bank![0]);
            if (result == null){
                return res.status(400).json({ error: 'Unsupported bank' });
            }
            const { data, error } = await supabase.from('expenses').insert(result);
            // if (error) {
            //     return res.status(500).json({ error: 'Internal Server Error' });
            // }

            result.length > 0 ? res.status(200).json({results: result, count: result.length}) : res.status(304).json({results: result, count: result.length});
        } catch (error) {
            console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });   
    
};
function Revolut(line : any) : any | null{
    console.log(line)
    let transactionDate, label, amount, currency = null;
    line = line.split(',') as string[];
    if (line[0] !== "CARD_PAYMENT"){
        return null
    }
    else {
    }
    [ , , transactionDate, , label, amount, , currency] = line
    transactionDate = new Date(Date.parse(transactionDate));
    return {transaction_date : transactionDate, label : label, amount : amount, currency : currency}
}
function convertCsvToJson(csvFilePath: string, userId : string, bank : string) : any[]{
    let result : ExpenseSchema[] = [];
    const csv = csvFilePath.split('\n');
    let results = csv.splice(1).map((line : any) => {
        console.log(line)
        let transactionDate, label, amount, currency, formattedTransactionDate = null;
        let category : [number, number] = [0, 0];
        let bankData;
        switch (bank){
            case 'revolut':
                bankData = Revolut(line)
                break;
            case 'commerzbank':
                bankData = CommerzBank(line)
                break;
            default:
                bankData = null;
                break;
        }
        if (bankData == null){
            return null;
        }
        bankData = bankData as ExpenseSchema;
        amount = Math.abs(parseFloat(String(bankData.amount)));
        category = [0, 0];
        const files : string[] = []; 
        const jsonObject : ExpenseSchema = {
            amount : amount,
            currency : bankData.currency,
            category,
            label : bankData.label,
            transaction_date: bankData.transaction_date,
            user_id : userId,
            recurring : false,
            files : files,
            refunded: true,
        };
        return jsonObject;
    })
    return results.filter((value) => {
        return value != null;
    })
  };

function CommerzBank(str : string) : any | null{
    const prse = parse(str, { delimiter: ',', raw: true, skipEmptyLines: true, columns: false, relax_column_count: true })
    let transaction_date, label, amount, currency = null
    if (prse.length > 0){
        if (prse[0].record[2] == "debit"){
            [transaction_date, , , label, amount, currency, , ,] = prse[0].record
            const parsedDate = fnsparse(transaction_date, 'dd.MM.yyyy', new Date());
            transaction_date = parsedDate;
            label = label.split('/')[0]
        }
        else{
            return null;
        }
    }
    else {
        return null;
    }
    return {transaction_date : transaction_date, label : label, amount : amount, currency : currency}
}