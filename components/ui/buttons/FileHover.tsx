import { ExpenseSchema } from '@/types/supabase'
import { EyeIcon } from '@heroicons/react/24/outline'
import { Button, Text } from '@tremor/react'
import { useState } from 'react'
export function FileHover(props: {
    expense: ExpenseSchema
    size: 'sm' | 'md' | 'xs' | 'lg' | 'xl'
    onClick: () => any
}) {
    const exp = props.expense
    const [isMouseOut, setIsMouseOut] = useState<boolean>(true)

    return (
        <>
            <Button
                variant="secondary"
                color="gray"
                size={props.size}
                className={`w-32 cursor-pointer hover:bg-gray-200 border-2 dark:border-white`}
                onMouseEnter={() => {
                    setIsMouseOut(false)
                }}
                onClick={(e) => {
                    props.onClick()
                    e.stopPropagation()
                }}
                onMouseLeave={() => {
                    setIsMouseOut(true)
                }}
            >
                {
                    <div className="w-full h-6 dark:text-white text-tremor-content">
                        {isMouseOut ? (
                            props.expense.files.length == 1 ? (
                                `${exp.files.length} file`
                            ) : (
                                `${exp.files.length} files`
                            )
                        ) : (
                            <>
                                <EyeIcon className=" h-full" />
                            </>
                        )}
                    </div>
                }
            </Button>
        </>
    )
}
