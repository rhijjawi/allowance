import axios from "axios";
export async function generateTemporaryUrl(keys : string[], txId : number|string){
    const res = await axios.post('/api/generate-temporary-url', {
        keys : keys,
        txId
    })
    if (res.status == 200){
        return {data : res.data.temporaryUrls, error : null}
    }
    else {
        return {data : null, error : res.status}
    }
}