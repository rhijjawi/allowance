import { useAlerts } from "@/components/contexts/alertHandler"
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX"
import { getBadgeById, getColor } from "@/components/static/categories"
import {HoverCurrGeneral} from "@/components/ui/buttons/hoverSwitchCurr"
import { CategorySchema } from "@/types/supabase"
import { currFormatter, standardizeCurrencyGeneral } from "@/utils/functions/valueFormatters"
import { noAuthSupaBase } from "@/utils/supabase"
import { useAuth } from "@clerk/nextjs"
import { User, clerkClient, getAuth } from "@clerk/nextjs/server"
import { ExclamationCircleIcon, ShareIcon } from "@heroicons/react/24/outline"
import { createClient } from "@supabase/supabase-js"
import { AreaChart, Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react"
import { GetServerSidePropsContext, } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"



export async function getServerSideProps(context : GetServerSidePropsContext & {params : {uuid : string[]}}) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);
    let filteredExpenses;
    let res;
        const user = getAuth(context.req);
        let req;
        if (user.userId && context.params.uuid.length == 1){
            req = supabase.from('reports').select('parent_id, forchild, date_range, no_login, uuid').eq("uuid", context.params?.uuid[0]).eq("parent_id", user.userId)
        }
        else if (context.params.uuid.length > 1){
            req = supabase.from('reports').select('parent_id, forchild, date_range, no_login, uuid').eq("uuid", context.params?.uuid[0]).eq("no_login", context.params?.uuid[1])
        }
        const {data, error} = await req!
        if (error || !data){
            return {props : {error : {title: "Something happened", message : "We're sorry, but we weren't able to find the report you requested."}}}
        }
        if (data.length == 0){
            return {props : {error : {title: "Report not found", message : "If you clicked a link to get here, send us a message using the button below"}}}
        }
        let [_user, child] = await clerkClient.users.getUserList({userId : [data[0].parent_id, data[0].forchild]}) as User[]
        console.log(_user.publicMetadata, child.publicMetadata.role)
        const {data: _expenses, error : expensesError} = await supabase.from('expenses').select("*").eq("user_id", data![0].forchild).gte("transaction_date", new Date(data[0].date_range[0]).toISOString()).lte("transaction_date", new Date(data[0].date_range[1]).toISOString())
        if (_expenses && !expensesError){
            const expenses : ExpenseType[] = _expenses
            const expenseData : {} = {}
            const _currency : {[index : string] : number} = {}
            let uniqueCurrencies : string[] = [];
            console.log((new Date()).toTimeString())
            if (expenses.length > 0){
                filteredExpenses = expenses.filter((exp)=>{return true})
                const currencies : string[] = filteredExpenses.flatMap((element : ExpenseType) => {return element.currency});
                currencies.forEach((currency) => {if(uniqueCurrencies.indexOf(currency) == -1){uniqueCurrencies.push(currency)}})
                console.log("startConversion", new Date)
                for (let curr of currencies) {
                    !(_currency[curr]) ? _currency[curr] = await standardizeCurrencyGeneral(1, curr, (_user.publicMetadata.reports as {currency : string}).currency) : null;   
                }
            }
            let shareLink;
            if (_user.id == data[0].parent_id){
                shareLink = `${data[0].uuid}/${data[0].no_login}`
            }
            else {
                shareLink = null;
            }
            return {
                props: { expenses, _currency, dates : data[0].date_range, homeCurr : (_user.publicMetadata.reports as {currency : string}).currency, child : {firstName : child.firstName, lastName : child.lastName, metadata : child.publicMetadata}, parent : {id : _user.id}, shareLink : shareLink },
              }
        }
        else {
            return {
                redirect: {
                    permanent: true,
                    destination: "/500",
                },
            }
        }


  }

export default function Report(props : { expenses : ExpenseType[], dates: [number, number], _currency :  {[index : string] : number}, homeCurr : string, shareLink : string, parent : User, child : User, error? : {title : string, message : string}}){
    const router = useRouter()
    const user = useAuth()
    const [sum, setSum] = useState<{[index : number] : (CategorySchema & {sum : number})}|null>(null)
    const [categories, setCategories] = useState<CategorySchema[]|null>(null)
    const [categoryData, setCategoryData] = useState<{[index : number] : CategorySchema}|null>(null)
    const [dayByDay, setdayByDay] = useState<any[]|null>(null);
    const supabase = noAuthSupaBase()
    const {addAlert} = useAlerts()

    if (props.error){
        return (
        <>
        <div className="w-full h-[96vh] relative overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
            <div className="w-fit h-fit absolute right-0 left-0 top-0 bottom-0 my-auto mx-auto">
            <ExclamationCircleIcon className="w-24 h-24 mb-3\  text-white mx-auto dark:text-white fill-red-600"/>
            <p className="text-3xl text-center">{props.error.title}</p>
            <p>{props.error.message}</p>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
        </>)
    }
    const customTooltip = (_ : any) => {
        const { payload, active } = _;
        if (!active || !payload) return null;
        return (
            <Card className="w-56 rounded-tremor-default border relative border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
            {payload.map((category : any, idx : number) => {
                return (
                    <div key={idx} className="flex flex-1 space-x-2.5">
                        <div
                            className={`flex w-1 flex-col bg-${category.color}-500 rounded`} />
                        <div className="space-y-1">
                            <p className="text-tremor-content dark:text-white font-bold">{category.dataKey}</p>
                            <p className="font-medium text-tremor-content-emphasis dark:text-slate-400">
                                {currFormatter(category.value, props.homeCurr)}
                            </p>
                        </div>
                    </div>
                )
            })}
            <p className="text-tremor-content dark:text-slate-500 text-xs text-right">{payload[0].payload.prettyDate}</p>
          </Card>
        );
    };

    useEffect(()=>{
        let categoryList: any = {};
        async function _(){
            const {data, error}  = await supabase.from('categories').select('*').order('id', { ascending: true })
            if (data){
                let categoryData = data;
                data.forEach((e: any) => {
                    categoryList[e.id] = e.category;
                });
                setCategoryData(categoryData)
                setCategories(data)
            }
            if (error){
                await addAlert("error", "Something happened. Please try again later.")
            }
        }
        _()
    }, [])
    useEffect(() => {
        let active = true;
        if (!categories || !props.expenses) return;
        let expenseList: { [index: number]: (CategorySchema & { sum: number }) } = {};
        let _dayByDay: { [index: string]: {sum : number} } = {};
        
        const sortedExpenses = props.expenses.sort((a, b) => {
            return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        });
        sortedExpenses.forEach((expense) => {
            let category = categories.find((element: any) => {
                return element.id === expense.category[0];
            }) ?? undefined;
            if (category) {
                expenseList[category.id] ? null : expenseList[category.id] = { ...category, sum: 0 };
                expenseList[category.id].sum ? null : expenseList[category.id].sum = 0;
                expenseList[category.id].sum += expense.amount * props._currency[expense.currency];
                const date = new Date(expense.transaction_date)
                const [d, m, y] = [date.getDate(), date.getMonth(), date.getFullYear()]
                const newDate = new Date(y, m, d, 5, 0, 0, 0)
                _dayByDay[Number(newDate)] ? _dayByDay[Number(newDate)].sum += (expense.amount * props._currency[expense.currency]) : _dayByDay[Number(newDate)] = {sum : (expense.amount * props._currency[expense.currency])};
            }
        });
        let previous = 0;
        const dateArray = Object.keys(_dayByDay).map((key, index : number)=>{
            const a = {
                date : new Date(Number(key)),
                today: (_dayByDay[key].sum),
                prettyDate: (new Date(Number(key))).toLocaleDateString(),
                "Expenditure" : index > 0 ? (_dayByDay[key].sum + Object.values(_dayByDay)[index-1].sum) : _dayByDay[key].sum, 
                prev : previous,
                "Overall Expenditure" : _dayByDay[key].sum + previous
            }
            previous += _dayByDay[key].sum;
            return a
        });
        if (active) {setSum(expenseList);setdayByDay(dateArray);}
        return () => {
            active = false;
        };
    }, [props.expenses, categories]);
        
    if (!categoryData || !dayByDay || !categories) {
        return (<div className="w-full h-[96vh] relative overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
            <div className="w-fit h-fit absolute right-0 left-0 top-0 bottom-0 my-auto mx-auto">
            <svg aria-hidden="true" className="w-12 h-12 mb-12  text-gray-200 animate-spin mx-auto dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <p>This can sometimes take a while. If you run into any issues, report a bug using the button below.</p>
            </div>
            <span className="sr-only">Loading...</span>
        </div>)
    }
    else return (
        <div className="w-full overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
            <div className="mx-auto py-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
            <Card>
                {props.parent.id == user.userId && <div className="h-12 absolute right-0 pr-6">
                    <Button iconPosition="left" onClick={() => {navigator.clipboard ? navigator.clipboard.writeText(`https://logmoney.app/report/${props.shareLink}`) : alert(`https://logmoney.app/report/${props.shareLink}`)}} icon={ShareIcon} className=" float-right inline-flex justify-center rounded-md border-none bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none  focus-visible:ring-red-500 focus-visible:ring-offset-2">Share</Button>
                </div>}
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Expenditure Report</h3>      
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{(new Date(Number(props.dates[0]))).toDateString()} ⇔ {(new Date(Number(props.dates[1]))).toDateString()}</h3>      
                <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{sum && currFormatter(Object.values(sum!).reduce((previous, current)=>{return (current.sum + previous)}, 0), props.homeCurr)} </p>
                <AreaChart
                    curveType="step"
                    showGradient={true}
                    data={dayByDay}
                    categories={["Overall Expenditure"]}
                    index="prettyDate"
                    className="h-96 mb-5"
                    yAxisWidth={100}
                    customTooltip={customTooltip}
                    valueFormatter={(val)=>currFormatter(val, props.homeCurr)}
                />
                <div className="grid grid-cols-3 gap-y-5 w-full">
                        {Object.values(categoryData!).map((cat)=>{
                        return (    
                            sum && sum[cat.id] && <Card className={`border-${getColor(cat.id)}-300 dark:border-${getColor(cat.id)}-300 border-2 mx-auto w-[85%]`}>
                                <h3 className="text-lg font-semibold mb-4 ">{cat.category}</h3>
                                <p>Of Total Expenditure: {((sum[cat.id].sum/Object.values(sum!).reduce((previous, current)=>{return (current.sum + previous)}, 0))*100).toFixed(2)}%</p>
                                <p className="mt-2 font-semibold">Total: {currFormatter(sum[cat.id].sum, props.homeCurr)}</p>
                            </Card>)
                            }
                            )}
                        <Card className="col-span-3 w-fit min-h-12 mx-auto">
                            {props.expenses.length > 0 ? <Table className="w-fit mx-auto">
                                <TableHead className="w-full">
                                    <TableHeaderCell>
                                        Date
                                    </TableHeaderCell>
                                    <TableHeaderCell>
                                        Label
                                    </TableHeaderCell>
                                    <TableHeaderCell>
                                        Amount
                                    </TableHeaderCell>

                                    <TableHeaderCell>
                                        Category
                                    </TableHeaderCell>
                                </TableHead>
                                <TableBody>
                                    {props.expenses.map((exp)=>{
                                    return(<TableRow>
                                        <TableCell>
                                            {new Date(exp.transaction_date).toDateString()}
                                        </TableCell>
                                        <TableCell className="w-fit">
                                            {exp.label}
                                        </TableCell>
                                        <TableCell>
                                            <HoverCurrGeneral size="md" expense={exp} currency={[ props.homeCurr, props._currency[exp.currency]]}/>
                                        </TableCell>
                                        <TableCell>
                                            {categories && getBadgeById(exp.category, categories!)}
                                        </TableCell>
                                    </TableRow>)
                                    })}
                                </TableBody>
                            </Table> : <><p className="text-center">It seems like {props.child.firstName} hasn't recorded any transcations for this month 😔.</p><p className="text-center">Send them a reminder!</p></>}
                        </Card>
                        
                </div>
            </Card>
            </div>
        </div>
)}