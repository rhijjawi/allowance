import { ExpenseType } from "@/components/contexts/expenseCTX";
export function sortData(sortBy : any, expenses : ExpenseType[]){
        if (sortBy[0] === 1 && sortBy[1] === 1) {
            return (expenses.sort((a: ExpenseType, b: ExpenseType) => a.label.localeCompare(b.label)));
        } else if (sortBy[0] === 1 && sortBy[1] === 2) {
            return (expenses.sort((a: ExpenseType, b: ExpenseType) => b.label.localeCompare(a.label)));
        } else if (sortBy[0] === 2 && sortBy[1] === 1) {
            let sorted = (expenses.sort((b: ExpenseType, a: ExpenseType) => {
                return (new Date(a.transaction_date)) < (new Date(b.transaction_date)) ? 1 : -1
            }));
            return sorted;
        } else if (sortBy[0] === 2 && sortBy[1] === 2) {    
            let sorted = (expenses.sort((a: ExpenseType, b: ExpenseType) => {
                return (new Date(a.transaction_date)) < (new Date(b.transaction_date)) ? 1 : -1
            }))
            return sorted;
        } else if (sortBy[0] === 3 && sortBy[1] === 1) {
            return (expenses.sort((a: ExpenseType, b: ExpenseType) => a.amount - b.amount));
        } else if (sortBy[0] === 3 && sortBy[1] === 2) {
            return (expenses.sort((a: ExpenseType, b: ExpenseType) => b.amount - a.amount));
        } else if (sortBy[0] === 4 && sortBy[1] === 1) {
            return (expenses.sort((b : ExpenseType, a : ExpenseType) => {if (a.currency.toUpperCase() < b.currency.toUpperCase()) {return -1;}if (a.currency.toUpperCase() > b.currency.toUpperCase()) {return 1;}return 0}));
        } else if (sortBy[0] === 4 && sortBy[1] === 2) {
            return (expenses.sort((a : ExpenseType, b : ExpenseType) => {if (a.currency.toUpperCase() < b.currency.toUpperCase()) {return -1;}if (a.currency.toUpperCase() > b.currency.toUpperCase()) {return 1;}return 0}));
        }
        console.log(expenses)
        return (expenses.sort((a: ExpenseType, b: ExpenseType) => b.id! - a.id!));
    }
