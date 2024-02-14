import { useAlerts } from "@/components/contexts/alertHandler"
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX"
import { CategorySchema } from "@/types/supabase"
import { currFormatter, standardizeCurrency, standardizeCurrencyGeneral } from "@/utils/functions/valueFormatters"
import { getSupabase, noAuthSupaBase } from "@/utils/supabase"
import { User, getAuth } from "@clerk/nextjs/server"
import { Card, Col } from "@tremor/react"
import axios from "axios"
import { GetStaticPropsContext } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true,
    }
  }

export async function getStaticProps(context : GetStaticPropsContext) {
    let filteredExpenses;
    let res;
    try{
        res = await axios.get(
            process.env.NODE_ENV == "development" ? `http://expenses.ramzihijjawi.me:3000/api/report/generate/${context.params?.uuid}` : `https://logmoney.app/api/report/generate/${context.params?.uuid}` 
        )
    }
    catch (e) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        }
    }
    if (!(res.status == 200)){
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        }
    }
    const expenses : ExpenseType[] = res.data.expenses
    const expenseData : {} = {}
    const _currency : {[index : string] : number} = {}
    let uniqueCurrencies : string[] = [];
    if (expenses.length > 0){
        filteredExpenses = expenses.filter((exp)=>{return true})
        const currencies : string[] = filteredExpenses.flatMap((element : ExpenseType) => {return element.currency});
        currencies.forEach((currency) => {if(uniqueCurrencies.indexOf(currency) == -1){uniqueCurrencies.push(currency)}})
        for (let curr of currencies) {
            !(_currency[curr]) ? _currency[curr] = await standardizeCurrencyGeneral(1, curr, res.data.parent.publicMetadata.reports.currency) : null;   
        }
    }
    return {
      props: { expenses, _currency, homeCurr : res.data.parent.publicMetadata.reports.currency },
      revalidate: 240,
    }
  }

export default function Report(props : { expenses : ExpenseType[], _currency :  {[index : string] : number}, homeCurr : string}){
    const router = useRouter()
    //const uuid = router.query.uuid;
    const [sum, setSum] = useState<{[index : number] : (CategorySchema & {sum : number})}|null>(null)
    const [categories, setCategories] = useState<CategorySchema[]|null>(null)
    const [categoryData, setCategoryData] = useState<{[index : number] : CategorySchema}|null>(null)
    const supabase = noAuthSupaBase()
    const {addAlert} = useAlerts()
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
    useEffect(()=>{
        let active = true;
        if (!categories || router.isFallback)return
        let expenseList : {[index : number] : (CategorySchema & {sum : number})} = {}
        props.expenses.forEach(async(expense)=>{
            let category = categories.find((element: any) => {
                return element.id === expense.category[0];
            }) ?? undefined;
            if (active && category){
                expenseList[category.id] ? null : expenseList[category.id] = {...category, sum : 0}
                expenseList[category.id].sum ? null : expenseList[category.id].sum = 0
                expenseList[category.id].sum += expense.amount * props._currency[expense.currency]
            }
        })
        setSum(expenseList)
        return () => {
            active = false;
        };
    }, [props.expenses])
    if (router.isFallback || !categoryData || !sum) {
        return <div className="w-full overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
        <div className="mx-auto py-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
            spinner 
        </div>
        </div>
    }
    return (
        <div className="w-full overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
            <div className="mx-auto py-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
            <Card>
                <div className="grid grid-cols-3 gap-y-5 w-full">
                        {Object.values(categoryData!).map((cat)=>{
                        return (    
                            <Card className="w-[85%]">
                                <h3 className="text-lg font-semibold mb-4 ">{cat.category}</h3>
                                <p>This month: {sum[cat.id].sum}</p>
                                <p className="mt-2 font-semibold">Total: $950</p>
                            </Card>)
                            }
                            )}
                </div>
            </Card>
            </div>
        </div>
)}