import { useRouter } from "next/router"
export default function success(){
    const {session_id} = useRouter().query
    return (<div> {session_id} Success!</div>)
}