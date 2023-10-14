import { useExpenses } from "@/components/contexts/expenseCTX"
export default function add(){
    const {expenseData, _error, isLoading} = useExpenses()
    console.log(expenseData)
    return (
        <>
            <p>Add Expense</p>
            <p>{JSON.stringify(expenseData)}</p>
        </>
    )
}
