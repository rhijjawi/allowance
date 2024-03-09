import { AddDebtModal } from '@/components/ui/modals/DebtCalc'
import type { Database } from '@/types/supabase'
import { getSupabase } from '@/utils/supabase'
import { useAuth, useUser } from '@clerk/nextjs'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Card, Col, Title, Text } from '@tremor/react'
import { useEffect, useState } from 'react'

export default function Overview() {
    const { getToken } = useAuth()
    const { user } = useUser()
    const [debtData, setDebtData] = useState<null | any[]>(null)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        async function a() {
            if (debtData) return
            const supabase = await getSupabase(
                await getToken({ template: 'supabase' })
            )
            const { data, error } = (await supabase
                .from('debts')
                .select('*')) as {
                data: Database['public']['Tables']['debts']['Row'][]
                error: any
            }
            if (data && !error) {
                setDebtData(data)
            }
        }
        a()
    }, [])
    return (
        <>
            <AddDebtModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                getToken={getToken}
            />
            <main className="bg-dark-tremor-background-muted/75 min-h-screen p-12">
                <Col
                    numColSpan={1}
                    numColSpanLg={3}
                    className="mt-6 gap-6 min-h-screen"
                >
                    <Title className="text-white">Debts 🏦</Title>
                    <Text className="text-slate-300">Debts. Broken down.</Text>
                    <Card className="mt-6 border-2 border-slate-400 bg-white h-fit py-2 grid grid-cols-3">
                        {debtData?.map((debt) => {
                            return (
                                <>
                                    <Card className="aspect-square outline-[0.1px] outline-dashed border-slate-400 ring-0 w-80 shadow-slate-300 shadow-md mx-auto hover:bg-gray-100 hover:cursor-pointer">
                                        <PlusCircleIcon className="text-gray-300 h-12 w-12 absolute left-0 right-0 mx-auto my-auto bottom-0 top-0 rounded-full" />
                                    </Card>
                                </>
                            )
                        })}
                        <Card
                            onClick={() => setIsOpen(true)}
                            className="aspect-square outline-[0.01px] outline-dashed border-slate-400 ring-0 w-80 shadow-slate-300  mx-auto hover:bg-gray-100 dark:hover:bg-dark-tremor-background-muted/90 hover:cursor-pointer"
                        >
                            <PlusCircleIcon className="text-gray-300 h-12 w-12 absolute left-0 right-0 mx-auto my-auto bottom-0 top-0 rounded-full" />
                        </Card>
                    </Card>
                </Col>
            </main>
        </>
    )
}
