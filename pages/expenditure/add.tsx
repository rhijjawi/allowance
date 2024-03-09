import { useExpenses } from '@/components/contexts/expenseCTX'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
export default function add() {
    const { expenseData, _error, loading: isLoading } = useExpenses()
    const { user, isSignedIn, isLoaded } = useUser()
    const router = useRouter()
    useEffect(() => {
        async function a() {
            await router.push('/')
        }
        if (
            (isLoaded && !isSignedIn) ||
            (isSignedIn && user.publicMetadata.role !== 'student')
        ) {
            a()
        }
        return () => {}
    }, [isLoaded])
    console.log(expenseData)
    return (
        <>
            <p>Add Expense</p>
            <p>{JSON.stringify(expenseData)}</p>
        </>
    )
}
