import symbols from '../static/symbols';
import { useState, useEffect } from 'react';
import { DatePicker, DatePickerValue, NumberInput, SearchSelect, SearchSelectItem, Select, SelectItem, TextInput } from '@tremor/react';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { getSupabase } from '@/utils/supabase';
import { useExpenses, ExpenseType } from '../contexts/expenseCTX';
export function ExpenditureDialog(props : {isOpen : boolean, setIsOpen : any}) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const getCurrencySymbol = (locale : string, currency: string) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
    const [isSub, setisSub] = useState(false);
    const [currency, setCurrency] = useState('EUR');
    const [isAmountInvalid, setisAmountInvalid] = useState(false);
    const [AmountValue, setAmountValue] = useState(0);
    const [whoPaid, setWhoPaid] = useState<null|string>(null);
    const [transactionDate, setTransactionDate] = useState<DatePickerValue|Date>();
    const [transactionLabel, setTransactionLabel] = useState('');
    const [category, setCategory] = useState<null|number[]>(null)
    const [isFormValid, setisFormValid] = useState<Boolean|null>(null);
    const {expenseData, categoryData} = useExpenses()
    const {user, error, isLoading} = useUser();
    async function submitForm(fields : {label : string, amount : number, category : number[], date : DatePickerValue, currency : string, whoPaid : string|number, [index: string]: any}){
        if (!user){
            return router.push('/api/auth/login')
        }
        let inv = false
        Object.keys(fields).forEach((key : string)=>{
                console.log(key, fields[key])
                if (fields[key] == '' || fields[key] == null || fields[key] == undefined){
                    console.log(key)
                    inv = true;
                    return setisFormValid(false)
                }
        });
        if (!inv){
            getSupabase(user.accessToken).then((supabase)=>{
                //@ts-ignore
                let date = new Date(transactionDate)
                date.setUTCHours(12)
                let data : ExpenseType = {
                    amount: AmountValue,
                    category: category!,
                    recurring: isSub,
                    currency: currency,
                    label: transactionLabel,
                    refunded: false,
                    transaction_date: `${((new Date(date)).toISOString()).toLocaleString()}`,
                    user_id: user.sub,
                    files: []
                }
                console.log(data)
                supabase.from('expenses').insert(data).then()
                setLoading(false)
                props.setIsOpen(false)
            })
        }

    }
    useEffect(()=>{
        if (isFormValid == false){
                document.getElementById('submit')!.classList.toggle('animate-x_shake')
                document.getElementById('submit')!.classList.add('border-2')
                document.getElementById('submit')!.classList.add('border-red-500')
                setTimeout(()=>{
                    document.getElementById('submit')!.classList.remove('animate-x_shake')
                    document.getElementById('submit')!.classList.remove('border-2')
                    document.getElementById('submit')!.classList.remove('border-red-500')
                    setLoading(false)
                }, 750)
            setisFormValid(null)
        }
    }, [isFormValid])
    useEffect(()=>{
        let date = new Date(transactionDate as Date)
        console.log(date.getDate(), date.getMonth(), date.getFullYear())
    }, [transactionDate])
    return (
    <Dialog open={props.isOpen} onClose={() => props.setIsOpen(false)} className={'relative z-[500] '}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4 '>
        <Dialog.Panel className={`rounded-md bg-white dark:bg-black relative w-full max-w-2xl max-h-full border-2 dark:border-white`}>
            <Dialog.Title className={'flex items-start justify-between p-4 border-b rounded-t dark:border-white dark:text-white text-black'}>Quick Add an Expense</Dialog.Title>
            <div className='p-6 space-y-6 dark:bg-slate-600/80'>
            <div className={'text-base leading-relaxed text-gray-500 '}>    
                <div>
                    <label htmlFor="expLabel" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Expenditure Label
                    </label>
                    <div className="mt-2">
                        <TextInput
                        type="text"
                        name="expLabel"
                        id="expLabel"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                        placeholder="Monthly Rent"
                        value={transactionLabel}
                        onChange={(e)=>{
                            if (e.target.value == ""){
                                console.log('asdnoano')
                                e.target.classList.add('border-red-500')
                                e.target.classList.add('border-2')
                            }
                            else{ 
                                e.target.classList.remove('border-red-500')
                                e.target.classList.remove('border-2')
                            }
                            console.log(e.target.value)
                            setTransactionLabel(e.target.value)
                        }}
                        />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2">
                    <label htmlFor="expLabel" className="row-span-1 col-span-1 text-sm font-medium leading-6 text-gray-900 pt-3 dark:text-white">
                        Date
                    </label>
                    <DatePicker 
                        weekStartsOn={1}
                        id="datePicker"
                        value={transactionDate}
                        defaultValue={new Date()}
                        onValueChange={(e)=>{
                            if (e == null || e == undefined){
                                document.getElementById('datePicker')!.classList.add('border-red-500')
                                document.getElementById('datePicker')!.classList.add('border-2')
                            }
                            else{
                                document.getElementById('datePicker')!.classList.remove('border-red-500')
                                document.getElementById('datePicker')!.classList.remove('border-2')
                            }
                            return setTransactionDate(e)
                        }}
                        className="max-w-sm px-2 rounded-lg row-span-1 col-span-1 col-start-1" 
                        />
                    <label htmlFor="expLabel" className="row-span-1 col-span-1 row-start-1 col-start-2 text-sm font-medium leading-6 text-gray-900 pt-3 dark:text-white">
                        Category
                    </label>
                    <select onChange={(e : any)=>{setCategory(JSON.parse(e.target.value))}} className='max-w-sm h-fit px-2 outline-none text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-tremor-default flex flex-nowrap shadow-tremor-input focus:border-tremor-brand-subtle dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle pl-3 pr-8 py-2 border bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content border-tremor-border dark:border-dark-tremor-border'>
                            <option>Select a category...</option>
                            {categoryData.map((a : any, indexa: number)=>{
                            return (<optgroup label={a.category} key={indexa}>
                                {a.subcategories.map((b : string, indexb : number)=>{
                                    return <option key={indexb} value={JSON.stringify([indexa+1, indexb])}>{b}</option>
                                })}
                            </optgroup>)
                        }

                        )}
                    </select>
                    </div>
                    <label htmlFor="expLabel" className="inline-block text-sm font-medium relative leading-6 text-gray-900 mt-4 dark:text-white">
                        Is this a monthly subscription?
                    </label>
                        <input
                        type="checkbox"
                        name="expIsSub"
                        id="expIsSub"
                        className="inline-block ml-3 rounded-sm pb-3"
                        onChange={(e)=>{
                            setisSub(e.target.checked)
                        }}
                        />
                        {/* <div className="relative max-w-md" hidden={!isSub}>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                    </svg>
                                </div>
                            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter recurrence date (DD-MM-YYYY)"/>
                        </div> */}
                    
                    
                    <div className='h-12 grid grid-cols-2 grid-rows-1 mb-5 gap-3'>
                    <div className='col-start-1 col-span-1 '>
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 pt-3 dark:text-white">
                        Cost
                    </label>
                    <div className="block relative text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        <NumberInput
                            icon={CurrencyDollarIcon}
                            placeholder="Amount..."
                            enableStepper={false}
                            value={AmountValue}
                            error={isAmountInvalid}
                            onValueChange={(e)=>{
                                setAmountValue(e);
                            }}
                        />
                        <label htmlFor="currency" className="sr-only">
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            onChange={(e)=>{
                                setCurrency(e.target.value)
                            }
                                }
                            className="h-full absolute right-0 top-0 float-right rounded-md border-0 bg-transparent text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            value={currency}
                        >
                            {Object.keys(symbols).map((currency:string, index:number) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>

                    </div>
                    </div>
                    <div className='col-span-1 col-start-2'>
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 pt-3 dark:text-white">
                        Who paid?
                    </label>
                    <div className="max-w-sm mx-auto space-y-6">
                        <Select onValueChange={(e)=>setWhoPaid(e)} value={String(whoPaid)!}>
                            <SelectItem value={"0"} className='z-[100] hover:cursor-pointer'>Me</SelectItem>
                            <SelectItem value={"1"} className='z-[100] hover:cursor-pointer'>Parent/Guardian</SelectItem>
                        </Select>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
            <div className='flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-white'>
                <button 
                    disabled={loading ? true : false} 
                    id={'submit'}
                    data-modal-hide="defaultModal" type="button" 
                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-600/30 disabled:dark:hover:bg-blue-600/30`}
                    onClick={async()=>{
                            setLoading(!loading)
                            await submitForm({
                                label: transactionLabel,
                                amount: AmountValue,
                                date : transactionDate,
                                currency : currency,
                                whoPaid : whoPaid!,
                                category: category!,
                            })
                        }}>
                        {loading ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin dark:text-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/></svg>: null}
                        Add Expense
                </button>
                <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={()=>{props.setIsOpen(false)}}>Nevermind</button>
            </div>
        </Dialog.Panel>
        </div>
    </Dialog>
    )
}

export function Subscriptions() {
    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
            </label>
            <div className="mt-2">
                <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
                />
            </div>
        </div>
    )
}