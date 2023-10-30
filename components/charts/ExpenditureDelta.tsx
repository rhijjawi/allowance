import { CategorySchema } from "@/types/supabase";
import { ExpenseType, IncomeType } from "../contexts/expenseCTX";
import { BadgeDelta, Flex, Metric, Title, Text, Subtitle, DeltaType, Card } from "@tremor/react";
import {MonthExpenses, From1sttoNowEXP, From1sttoNowINC} from "@/utils/functions/filterData"
import { currFormatter } from "@/utils/functions/valueFormatters";
import Metadata from "../interfaces/userwithMetadata";
import { useUser } from "@clerk/nextjs";
export function ExpenditureDelta(props: {category : CategorySchema, expenses : ExpenseType[]}){
    const categorySum = From1sttoNowEXP(props.expenses, props.category)
    const lastMonthSum = categorySum[1].reduce((a, b) => a + b.standardizedCurrency!, 0)
    const thisMonthSum = categorySum[0].reduce((a, b) => a + b.standardizedCurrency!, 0)
    const {user, isSignedIn, isLoaded} = useUser()
    let ExpenditureDelta = 0
    let direction;
    if (lastMonthSum > thisMonthSum){
        direction = 'less'
        ExpenditureDelta = lastMonthSum - thisMonthSum

    }
    if (lastMonthSum < thisMonthSum){
        direction = 'more'
        ExpenditureDelta = thisMonthSum - lastMonthSum
    }
    let percentageChange = ((thisMonthSum - lastMonthSum) / lastMonthSum) * 100
    let deltaType : DeltaType = 'unchanged';
    let isIncreasePositive = false;
    switch (percentageChange){
        case Infinity:
            deltaType = 'increase'
            isIncreasePositive = false;
            break;
        case -Infinity:
            isIncreasePositive = true;
            break;
        case NaN:
            deltaType = 'unchanged'
            isIncreasePositive = false;
            break;
        default:
            if (percentageChange > 0){
                deltaType = 'moderateIncrease'
                if (percentageChange == -100){
                    deltaType = 'increase'
                }   
                isIncreasePositive = true;
            }
            if (percentageChange < 0){
                deltaType = 'moderateDecrease'
                if (percentageChange == -100){
                deltaType = 'decrease'
                }   
                isIncreasePositive = false;
            }
            if (percentageChange == 0) {
                deltaType = 'unchanged'
                isIncreasePositive = false;
            }
            break;
    }
    if (Number.isNaN(percentageChange)){
        return (<></>)
    }
    return (
        <Card className="w-[90%] my-2 dark:border-2 dark:border-orange-400">
            <Flex justifyContent="between" alignItems="center">
                <Title>{props.category.category}</Title>
                <BadgeDelta deltaType={deltaType} isIncreasePositive={isIncreasePositive} size="xs">
                    {percentageChange && percentageChange.toFixed(2)}%
                </BadgeDelta>
            </Flex>
            <Text className="dark:text-slate-300">{currFormatter(ExpenditureDelta, user?.publicMetadata!.currency as string)} {direction} than last period</Text>
        </Card>
    )
}

export function IncomeDelta(props: {category : CategorySchema, incomes : IncomeType[]}){
    const categorySum = From1sttoNowINC(props.incomes, props.category)
    console.log(categorySum)
    const lastMonthSum = categorySum[1].reduce((a, b) => a + b.standardizedCurrency!, 0)
    const thisMonthSum = categorySum[0].reduce((a, b) => a + b.standardizedCurrency!, 0)
    const {user} = useUser()
    let IncomeDelta = 0
    let direction;
    if (lastMonthSum > thisMonthSum){
        direction = 'less'
        IncomeDelta = lastMonthSum - thisMonthSum

    }
    if (lastMonthSum < thisMonthSum){
        direction = 'more'
        IncomeDelta = thisMonthSum - lastMonthSum
    }
    let percentageChange = ((thisMonthSum - lastMonthSum) / lastMonthSum) * 100
    let deltaType : DeltaType = 'unchanged';
    let isIncreasePositive = false;
    switch (percentageChange){
        case Infinity:
            deltaType = 'increase'
            isIncreasePositive = true;
            break;
        case -Infinity:
            isIncreasePositive = true;
            break;
        case NaN:
            deltaType = 'unchanged'
            isIncreasePositive = false;
            break;
        default:
            if (percentageChange > 0){
                deltaType = 'moderateIncrease'
                if (percentageChange == -100){
                    deltaType = 'increase'
                }   
                isIncreasePositive = true;
            }
            if (percentageChange < 0){
                deltaType = 'moderateDecrease'
                if (percentageChange == -100){
                deltaType = 'decrease'
                }   
                isIncreasePositive = false;
            }
            if (percentageChange == 0) {
                deltaType = 'unchanged'
                isIncreasePositive = false;
            }
            break;
    }
    if (Number.isNaN(percentageChange)){
        return (<></>)
    }
    return (
        <Card className="w-[90%] my-2 dark:border-2 dark:border-orange-400">
            <Flex justifyContent="between" alignItems="center">
                <Title>{props.category.category}</Title>
                <BadgeDelta deltaType={deltaType} isIncreasePositive={isIncreasePositive} size="xs">
                    {percentageChange && percentageChange.toFixed(2)}%
                </BadgeDelta>
            </Flex>
            <Text className="dark:text-slate-300">{currFormatter(IncomeDelta, user!.publicMetadata.currency as string)} {direction} than last period</Text>
        </Card>
    )
}
