export class Debt {
    original: { balance: number }
    name: string
    balance: number
    interestRate: number
    minimumPayment: number
    priority: number

    constructor(
        name: string,
        balance: number,
        interestRate: number,
        minimumPayment?: number
    ) {
        this.original = { balance }
        this.name = name
        this.balance = balance
        this.interestRate = interestRate
        this.minimumPayment = minimumPayment ? minimumPayment : 0
        this.priority = this.balance * this.interestRate
    }

    monthlyInterest() {
        return (this.balance * (this.interestRate / 100)) / 12
    }
    applyPayment(paymentAmount: number) {
        const interest = this.monthlyInterest()
        const paymentTowardsPrincipal = paymentAmount - interest
        this.balance = Math.max(0, this.balance - paymentTowardsPrincipal)
        return this.balance
    }
}
function customRound(num: number) {
    if (Math.abs(num) < 0.01) {
        return 0
    }
    return Number(num.toFixed(2))
}

export function simulateRepayments(
    debts: Debt[],
    totalMonthlyPayment: number,
    strategy: string
) {
    let sortedDebts: Debt[]
    if (strategy === 'avalanche') {
        sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate)
    } else if (strategy === 'snowball') {
        sortedDebts = [...debts].sort((a, b) => a.balance - b.balance)
    } else {
        throw new Error('Invalid repayment strategy')
    }

    let totalInterestPaid = 0

    const monthlyBalances: any[] = [
        {
            month: 'Month 0',
            ...debts.reduce(
                (acc, curr) => ({
                    ...acc,
                    [curr.name]: customRound(curr.balance),
                }),
                {}
            ),
        },
    ]
    let month = 0

    while (sortedDebts.some((debt) => customRound(debt.balance) > 0)) {
        month++
        let remainingPayment = totalMonthlyPayment
        let monthlyInterestPaid = 0

        const currentMonthBalances: { [index: string]: string | number } = {
            month: `Month ${month}`,
        }

        for (const debt of sortedDebts) {
            if (debt.balance === 0) continue

            const payment = Math.min(debt.balance, remainingPayment)
            const interest = debt.monthlyInterest()
            monthlyInterestPaid += interest
            debt.applyPayment(payment)
            remainingPayment -= payment
            currentMonthBalances[debt.name] = customRound(debt.balance)
        }

        monthlyBalances.push(currentMonthBalances)
        totalInterestPaid += monthlyInterestPaid
    }
    console.log(monthlyBalances)
    return { monthlyBalances, totalInterestPaid }
}

export function createRepaymentPlan(
    debts: Debt[],
    strategy = 'avalanche',
    totalMonthlyPayment: number
) {
    switch (strategy) {
        case 'avalanche':
            return avalancheStrategy(debts, totalMonthlyPayment)
        case 'snowball':
            return snowballStrategy(debts, totalMonthlyPayment)
        default:
            throw new Error('Invalid repayment strategy')
    }
}

export function avalancheStrategy(debts: Debt[], totalMonthlyPayment: number) {
    // Sort debts by interest rate, descending
    const sortedDebts = [...debts].sort(
        (a, b) => b.interestRate - a.interestRate
    )
    return allocatePayments(sortedDebts, totalMonthlyPayment)
}
export function snowballStrategy(debts: Debt[], totalMonthlyPayment: number) {
    // Sort debts by balance, ascending
    const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance)
    return allocatePayments(sortedDebts, totalMonthlyPayment)
}

export function allocatePayments(debts: Debt[], totalMonthlyPayment: number) {
    let remainingPayment = totalMonthlyPayment
    const paymentPlan = debts.map((debt: Debt) => {
        console.log(debt.balance, debt.monthlyInterest(), remainingPayment)
        const payment = Math.min(
            debt.balance + debt.monthlyInterest(),
            remainingPayment
        )
        remainingPayment -= payment
        return { debt, payment } // Include the original debt object here
    })

    // Check for any leftover payment and distribute it
    if (remainingPayment > 0) {
        paymentPlan.forEach((plan: { debt: Debt; payment: number }) => {
            if (remainingPayment > 0) {
                const extraPayment = Math.min(
                    plan.debt.balance - plan.payment,
                    remainingPayment
                )
                plan.payment += extraPayment // Apply the extra payment to the plan
                plan.debt.balance -= extraPayment // Update the original debt's balance
                remainingPayment -= extraPayment
            }
        })
    }

    return paymentPlan.map(
        ({ debt, payment }: { debt: Debt; payment: number }) => ({
            name: debt.name,
            payment,
        })
    ) // Return simplified plan for display
}

export function calculateRepaymentRatios(debts: Debt[]) {
    const totalPriority = debts.reduce((sum, debt) => sum + debt.priority, 0)
    return debts.map((debt) => debt.priority / totalPriority)
}
