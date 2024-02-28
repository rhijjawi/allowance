import  symbols from '../static/symbols.json';
import { useState, useEffect, Fragment, useRef } from 'react';
import { DatePicker, DatePickerValue, NumberInput, SearchSelect, SearchSelectItem, Select, SelectItem, TextInput } from '@tremor/react';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { useAuth, useUser } from '@clerk/nextjs';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { getSupabase } from '@/utils/supabase';
import { useExpenses, ExpenseType } from '../contexts/expenseCTX'
import { CategorySchema, IncomeSchema } from '@/types/supabase';
import { standardizeCurrency } from '@/utils/functions/valueFormatters';
import { useAlerts } from '../contexts/alertHandler';

export function ExpenditureDialog(props : {isOpen : boolean, setIsOpen : React.Dispatch<React.SetStateAction<boolean>>}) {
    const router = useRouter()
    const [isloading, setLoading] = useState<boolean>(false)
    const getCurrencySymbol = (locale : string, currency: string) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
    const [isSub, setisSub] = useState(false);
    const [currency, setCurrency] = useState('EUR');
    const [isAmountInvalid, setisAmountInvalid] = useState(false);
    const [AmountValue, setAmountValue] = useState(0);
    // const [whoPaid, setWhoPaid] = useState<null|string>(null);
    const [transactionDate, setTransactionDate] = useState<DatePickerValue|Date|undefined>(undefined);
    const [transactionLabel, setTransactionLabel] = useState('');
    const [category, setCategory] = useState<null|[number, number]>(null)
    const [isFormValid, setisFormValid] = useState<Boolean|null>(null);
    const {expenseData, categoryData, loading, setExpenseData} = useExpenses()
    const { user, isSignedIn, isLoaded } = useUser()
    const {addAlert} = useAlerts()
    const { getToken} = useAuth();
    useEffect(()=>{
        console.log(transactionDate)
    }, [transactionDate])
    useEffect(()=>{
        console.log(props.isOpen)
    },[props.isOpen])
    async function submitForm(fields : {label : string, amount : number, category : number[], date : DatePickerValue, currency : string, [index: string]: any}){
        let inv = false
        Object.keys(fields).forEach((key : string)=>{
                if (fields[key] == '' || fields[key] == null || fields[key] == undefined){
                    inv = true;
                    return setisFormValid(false)
                }
        });
        if (!inv){
            getToken({template: "supabase"}).then(async(token)=>getSupabase(token)).then((supabase)=>{
                //@ts-ignore
                let date = new Date(transactionDate)
                date.setUTCHours(12)
                let data : ExpenseType = {
                    id : undefined,
                    amount: AmountValue,
                    category: category!,
                    recurring: isSub,
                    currency: currency,
                    label: transactionLabel,
                    refunded: false,
                    transaction_date: `${((new Date(date)).toISOString()).toLocaleString()}`,
                    user_id: user!.id,
                    files: []
                }

                supabase.from('expenses').insert(data).select().then(async(data)=>{
                    if (data.data){
                        setExpenseData([])
                        const _data = Object.assign({}, data.data[0])
                        _data['standardizedCurrency'] = await standardizeCurrency(data.data[0], user!.publicMetadata!.currency as string)
                        setExpenseData([...expenseData, _data])
                        await addAlert("success", "Added transaction to Database", 4000)
                    }
                })
                setLoading(false)
                props.setIsOpen(false)
            })
        };

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
    }, [transactionDate])
    return (
        <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>{props.setIsOpen(false)}}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Record an Expense (Money Out)
                    </Dialog.Title>
            <div className='p-6 space-y-6'>
            <div className='text-base leading-relaxed text-gray-500 '>    
                <div>
                    <label htmlFor="expLabel" className="block text-sm font-medium leading-6 text-gray-900">
                        Expenditure Label
                    </label>
                    <div className="mt-2">
                        <TextInput
                        
                        type="text"
                        error={!(transactionLabel.length > 0)}
                        name="expLabel"
                        id="expLabel"
                        required
                        className=""
                        placeholder="Monthly Rent"
                        value={transactionLabel}
                        onChange={(e)=>{
                            if (e.target.value == ""){
                                e.target.classList.add('border-red-500')
                                e.target.classList.add('border-2')
                            }
                            else{ 
                                e.target.classList.remove('border-red-500')
                                e.target.classList.remove('border-2')
                            }
                            setTransactionLabel(e.target.value)
                        }}
                        />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2">
                    <label htmlFor="expLabel" className="row-span-1 col-span-1 text-sm font-medium leading-6 text-gray-900 pt-3 ">
                        Date
                    </label>
                    <DatePicker
                        key={'datepicker'}
                        weekStartsOn={1}
                        value={transactionDate}
                        onValueChange={(e)=>{
                            // if (e == null || e == undefined){
                            //     (TransactionDate.current)!.classList.add('highlight_child')
                            // }
                            // else{
                            //     (TransactionDate.current)!.classList.remove('highlight_child')
                            // }
                            setTransactionDate(e) 
                        }}
                        className="max-w-sm px-2 rounded-lg row-span-1 col-span-1 col-start-1 w-fit" 
                        />
                    <label htmlFor="expLabel" className="row-span-1 col-span-1 row-start-1 col-start-2 text-sm font-medium leading-6 text-gray-900 pt-3 ">
                        Category
                    </label>
                    <select onChange={(e : any)=>{
                        setCategory(JSON.parse(e.target.value))}
                        } className='max-w-sm h-fit px-2 outline-none text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-tremor-default flex flex-nowrap shadow-tremor-input focus:border-tremor-brand-subtle dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle pl-3 pr-8 py-2 border bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content border-tremor-border dark:border-dark-tremor-border'>
                            <option>Select a category...</option>
                            {categoryData.map((a : CategorySchema, indexa : number)=>{
                            //@ts-ignore 
                            return (<optgroup label={a.category} key={indexa}>{a.subcategories.map((b : string, indexb : number)=>{return (<option key={indexb} value={JSON.stringify([indexa, indexb])}>{b}</option>)})}
                            </optgroup>)
                        }
                        )}
                    </select>
                    </div>
                    <label htmlFor="expLabel" className="inline-block text-sm font-medium relative leading-6 text-gray-900 mt-4 ">
                        Is this a recurring Expense (Monthly)?
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
                    <div className='h-12 grid grid-cols-2 grid-rows-1 mb-5 gap-3'>
                    <div className='col-start-1 col-span-1 '>
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 pt-3">
                        Cost
                    </label>
                    <div className="block relative text-sm font-medium leading-6 text-gray-900">
                        <NumberInput
                            icon={CurrencyDollarIcon}
                            placeholder="Amount..."
                            enableStepper={false}
                            value={AmountValue}
                            error={!AmountValue || AmountValue <= 0}
                            required
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
                    </div>
                </div>
            </div>
            </div>
            <div className="relative h-12 w-full px-6">
                <button 
                    disabled={loading ? true : false} 
                    id={'submit'}
                    data-modal-hide="defaultModal" type="button" 
                    className={`inline-flex float-right justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2`}
                    onClick={async()=>{
                            setLoading(true)
                            await submitForm({
                                label: transactionLabel,
                                amount: AmountValue,
                                date : transactionDate,
                                currency : currency,
                                category: category!,
                            })
                        }}>
                        {loading || isloading ? <svg aria-hidden="true" role="status" className="w-4 h-4 mr-3  text-white animate-spin dark:text-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/></svg>: null}
                        Add Expense
                </button>
                <button  
                    id={'cancel'}
                    data-modal-hide="defaultModal" type="button" 
                    className={`inline-flex float-left justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                    onClick={async()=>{props.setIsOpen(false)}}>
                        Cancel
                </button>
            </div>
        </Dialog.Panel>
        </Transition.Child>
        </div>
        </div>
    </Dialog>
    </Transition>
    )
}
export function IncomeDialogue(props : {isOpen : boolean, setIsOpen : React.Dispatch<any>}){
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
    const [category, setCategory] = useState<null|[number, number]>()
    const [isFormValid, setisFormValid] = useState<Boolean|null>(null);
    const {expenseData, categoryData, incomeData, incomeCategoryData, setIncomeData} = useExpenses()
    const {user, isLoaded, isSignedIn} = useUser();
    const {getToken} = useAuth();
    async function submitForm(fields : {label : string, amount : number, category : [number, number], date : DatePickerValue, currency : string, [index: string]: any}){
        if (!user) {return;};
        let inv = false
        Object.keys(fields).forEach((key : string)=>{
            if (fields[key] == '' || fields[key] == null || fields[key] == undefined){
                inv = true;
                return setisFormValid(false)
            }
        });
        if (!inv){
            getToken({template: "supabase"}).then((token)=>getSupabase(token).then((supabase)=>{
                //@ts-ignore
                let date = new Date(transactionDate)
                date.setUTCHours(12)
                let data : IncomeSchema = {
                    user_id: user!.id,
                    amount: AmountValue,
                    category: category!,
                    recurring: isSub,
                    currency: currency,
                    label: transactionLabel,
                    transaction_date: `${((new Date(date)).toISOString()).toLocaleString()}`,
                    files: []
                }
                supabase.from('income').insert(data).select().then(async(data)=>{
                    if (data.data){
                        setIncomeData([])
                        const _data = Object.assign({}, data.data[0])
                        _data['standardizedCurrency'] = await standardizeCurrency(data.data[0], user!.publicMetadata.currency as string)
                        setIncomeData([...incomeData, _data])
                    }
                })
                setLoading(false)
                props.setIsOpen(false)
            }))
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
    return (
        <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>{props.setIsOpen(false)}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Record Income
                    </Dialog.Title>
                    <div className='p-6 space-y-6'>
            <div className='text-base leading-relaxed text-gray-500 '>    
                <div>
                    <label htmlFor="expLabel" className="block text-sm font-medium leading-6 text-gray-900">
                        Income Label
                    </label>
                    <div className="mt-2">
                        <TextInput
                        type="text"
                        name="expLabel"
                        id="expLabel"
                        className=""
                        placeholder="Paycheck"
                        value={transactionLabel}
                        onChange={(e)=>{
                            if (e.target.value == ""){
                                e.target.classList.add('border-red-500')
                                e.target.classList.add('border-2')
                            }
                            else{ 
                                e.target.classList.remove('border-red-500')
                                e.target.classList.remove('border-2')
                            }
                            setTransactionLabel(e.target.value)
                        }}
                        />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2">
                    <label htmlFor="expLabel" className="row-span-1 col-span-1 text-sm font-medium leading-6 text-gray-900 pt-3 dark:text-white">
                        Date
                    </label>
                    <DatePicker 
                        key={'datepicker1'}
                        weekStartsOn={1}
                        id="datePicker"
                        value={transactionDate}
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
                            {incomeCategoryData.map((a : CategorySchema, indexa: number)=>{
                            //@ts-ignore
                            return (<optgroup label={a.category} key={indexa}>{a.subcategories.map((b : string, indexb : number)=>{return <option key={indexb} value={JSON.stringify([indexa+1, indexb])}>{b}</option>})}
                            </optgroup>)
                        }
                        )}
                    </select>
                    </div>
                    <label htmlFor="expLabel" className="inline-block text-sm font-medium relative leading-6 text-gray-900 mt-4 dark:text-white">
                        Is this part of your recurring Income? (Monthly)
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
                    <div className='h-12 grid grid-cols-2 grid-rows-1 mb-5 gap-3'>
                    <div className='col-start-1 col-span-1 '>
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 pt-3 dark:text-white">
                        Amount
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
                    </div>
                </div>
            </div>
            </div>
            <div className="relative h-12 w-full px-6">
                <button 
                    disabled={loading ? true : false} 
                    id={'submit'}
                    data-modal-hide="defaultModal" type="button" 
                    className={`inline-flex float-right justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2`}
                    onClick={async()=>{
                            setLoading(!loading)
                            await submitForm({
                                label: transactionLabel,
                                amount: AmountValue,
                                date : transactionDate,
                                currency : currency,
                                category: category!,
                            })
                        }}>
                        {loading ? <svg aria-hidden="true" role="status" className="inline w-4  h-4 mr-3 text-white animate-spin dark:text-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/></svg>: null}
                        Record Income
                </button>
                <button  
                    id={'cancel'}
                    data-modal-hide="defaultModal" type="button" 
                    className={`inline-flex float-left justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                    onClick={async()=>{
                            props.setIsOpen(false)
                        }}>
                        Cancel
                </button>
            </div>
            </Dialog.Panel>
        </Transition.Child>
        </div>
        </div>
    </Dialog>
    </Transition>
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