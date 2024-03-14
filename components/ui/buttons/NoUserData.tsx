import { PlusCircleIcon } from '@heroicons/react/24/outline'

export function Goals(props: { openModal: () => void }) {
    return (
        <div
            className="border-dashed hover:bg-slate-200/40 my-2 cursor-pointer flex-grow border-2 rounded-md relative"
            onClick={() => props.openModal()}
        >
            <div className="absolute right-0 w-fit flex flex-col text-center h-fit left-0 top-0 bottom-0 my-auto mx-auto">
                <PlusCircleIcon className="translate-x-[50%] h-16 w-16 relative text-gray-400/30 " />
                <p className="text-slate-400">Click to add a goal</p>
            </div>
        </div>
    )
}
