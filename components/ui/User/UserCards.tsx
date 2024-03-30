'use client'
import { User } from '@clerk/clerk-sdk-node'
import {
    PlusCircleIcon,
    TrashIcon,
    ClipboardDocumentIcon,
} from '@heroicons/react/24/outline'
import { Button, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import { TextInput } from '@tremor/react'
import { useAlerts } from '@/components/contexts/alertHandler'
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { useUser } from '@clerk/nextjs'
import Loading from '@/pages/_loading'

export function UserCard({
    user,
    supervisorDelete,
}: {
    user: User
    supervisorDelete: () => Promise<void>
}) {
    user = user as User
    return (
        <div className="dark: relative my-1 grid h-fit w-full grid-cols-10 grid-rows-1 rounded-md border-2 bg-gray-300/20 hover:bg-gray-300/40 dark:border-white/30">
            <div className="col-span-1 h-fit">
                <img
                    src={user.imageUrl}
                    alt=""
                    className="my-2 ml-2 w-[80%] rounded-lg"
                />
            </div>
            <div className="col-span-8 h-fit">
                <p className="pt-2 text-2xl text-black">
                    {user.firstName} {user.lastName}
                </p>
                <p className="pb-2 text-sm text-black">
                    {user.emailAddresses[0].emailAddress}
                </p>
            </div>
            <Button
                className="relative m-auto aspect-square max-w-full"
                icon={TrashIcon}
                color="red"
                onClick={async () => {
                    await supervisorDelete()
                }}
            ></Button>
        </div>
    )
}

export function UserAddCard(props: {
    type : "email"|"code"
    isReadOnly?: boolean
    code?: string
    setSupervisors?: (supervisors: string[]) => void
}) {
    const {user, isLoaded, isSignedIn} = useUser()
    const [code, setCode] = useState<null[] | string[]>([
        null,
        null,
        null,
        null,
        null,
        null,
    ])
    const [inviteEmail, setInviteEmail] = useState<string>("")
    useEffect(() => {
        if (props.isReadOnly) {
            if (props.type == "code"){
                fetch('/api/user/parent').then(async (res) => {
                    if (res.status == 200) {
                        const r = await res.json()
                        setCode(r.code.split(''))
                    }
                })
            }
            if (props.type == "email"){
                setInviteEmail(user!.emailAddresses[0].emailAddress!)
            }
        }
    }, [props.isReadOnly])
    const { addAlert } = useAlerts();
    const isEmail = (email : string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    if (!isLoaded){
        return <Loading/>
    }
    return (
        <>
            <div className="w-full rounded-md bg-slate-100 py-2">
            <div className="flex max-w-full flex-row w-full gap-x-2 h-fit overflow-x-scroll justify-center align-middle flex-nowrap">
                {props.type == "email" && <>
                    <TextInput icon={EnvelopeIcon} type="email" onValueChange={(e)=>{
                        
                        setInviteEmail(e)
                    }} value={inviteEmail} className='h-12 flex-shrink w-auto' />
                </>}

                {props.type == "code" && 
                [0, 1, 2, 3, 4, 5].map((e) => (
                        <input
                            id={String(e)}
                            key={e}
                            maxLength={1}
                            type="text"
                            readOnly={props.isReadOnly}
                            disabled={props.isReadOnly}
                            defaultValue={code[e] || ''}
                            onInput={() => {
                                let _code = Object.assign([], code) as string[]
                                _code[e as number] = String(
                                    (
                                        document.getElementById(
                                            String(e)
                                        ) as HTMLInputElement
                                    ).value
                                ).toUpperCase()
                                setCode(_code)
                                document.getElementById(String(e + 1))?.focus()
                            }}
                            className="border-3 h-20 w-[3.5rem] max-w-[auto] min-w-[4rem] mx-2 bg-gray-300 rounded-md border-cyan-800/80 bg-cyan-700/30 text-center text-xl uppercase text-black read-only:outline-none"
                        />
                ))}

                <Button
                    disabled={props.type == "code" ? !(code.join('').length == 6) : !isEmail(inviteEmail)}
                    className={props.type == "code" ? "max-h-full w-16 aspect-square" : ""}
                    icon={
                        props.isReadOnly
                            ? ClipboardDocumentIcon
                            : PlusCircleIcon
                    }
                    color={props.isReadOnly ? 'blue' : 'green'}
                    onClick={
                        props.type == "code" ? 
                    async () => {
                        if (!props.isReadOnly) {
                            if (!(code.join('').length == 6)) return
                            fetch('/api/user/parent', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    code: code.join(''),
                                }),
                            }).then(async (res) => {
                                if (res.status == 200) {
                                    const r = await res.json()
                                    addAlert('success', 'Request sent.')
                                } else if (
                                    res.status == 400 ||
                                    (await res.json()).error == 'exists'
                                ) {
                                    addAlert(
                                        'error',
                                        'Parent already exists!',
                                        2000
                                    )
                                } else if (res.status == 404) {
                                    addAlert('error', 'Code not found!', 2000)
                                }
                            })
                        } else {
                            try {
                                await navigator.clipboard.writeText(
                                    code.join('')
                                )
                            } catch {
                                alert(
                                    `Error copying to clipboard: ${code.join('')}`
                                )
                            }
                        }
                    } 
                    : async () => {
                        if (props.isReadOnly){
                            try {
                                await navigator.clipboard.writeText(inviteEmail)
                            } catch {
                                alert(
                                    `Error copying to clipboard: ${inviteEmail}`
                                )
                            }
                        }
                        if (!isEmail(inviteEmail)){
                            return await addAlert("error", "The email entered is not valid!", 5000)
                        }
                        else {
                            fetch('/api/user/parent/invite', {
                                method : "POST",
                                headers : {
                                    'Content-Type' : "application/json"
                                },
                                body : JSON.stringify({
                                    inviteEmail
                                })
                            }).then(async(res)=>{
                                const data = (await res.json())
                                res.status == 200 ? addAlert("success", data.message, 3000) : addAlert("error", data.error, 3000)
                            })
                        }
                    }
                }
                />
            </div>
        </div>
        </>
    )
}
