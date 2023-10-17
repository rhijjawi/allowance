import { BarChart } from "@tremor/react";
import { ExpenseType } from "../contexts/expenseCTX";
import { currFormatter } from "@/utils/functions/valueFormatters";
import { useUser } from "@auth0/nextjs-auth0/client";
import UserType from "../interfaces/userwithMetadata";
import { useEffect } from "react";
export default function MIMO(props: {expenses : ExpenseType[]}){
    const {user, error} = useUser() as {user: UserType, error : unknown}

    return (
    <BarChart
    data={[{
        "Money In": 2000,
        "Money Out": 2500,
      }]}
      index={"label"}
      className=""
      categories={["Money In", "Money Out"]}
      colors={["green", "red"]}
      yAxisWidth={70}
      valueFormatter={(number)=>{return new Intl.NumberFormat('en-US', { style: 'currency',  currency: user?.user_metadata ? user?.user_metadata.currency : "USD"}).format(number)}}
    />)
}