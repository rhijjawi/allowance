import { CheckIcon, PencilIcon, TrashIcon, HeartIcon} from "@heroicons/react/24/solid"
import {ChevronDownIcon, ChevronUpIcon, HomeIcon, BoltIcon, GiftIcon, ShoppingCartIcon, AcademicCapIcon, FilmIcon, PaperAirplaneIcon, ScissorsIcon, CloudIcon, QuestionMarkCircleIcon, FireIcon, BanknotesIcon, XMarkIcon} from '@heroicons/react/24/outline'
import { CategorySchema } from "@/types/supabase"
import { Badge, Color } from "@tremor/react"
export default function CategoryBadge() : {[key: number]: [any, Color|null]} {
    return {
        0 : [XMarkIcon, "red"],
        1 : [HomeIcon, "blue"],
        2 : [BoltIcon, "yellow"],
        3 : [null, "zinc"],
        4 : [ShoppingCartIcon, "green"],
        5 : [AcademicCapIcon, "violet"] , 
        6: [HeartIcon, "red"],
        7: [FilmIcon, "pink"],
        8: [PaperAirplaneIcon, "sky"],
        9 : [ScissorsIcon, "purple"],
        10: [BanknotesIcon, "blue"],
        11 : [GiftIcon, "red"],
        12: [CloudIcon, "lime"],
        13: [QuestionMarkCircleIcon, "lime"],
        14: [FireIcon, "lime"],
        15: [HomeIcon, "zinc"],
    }
}
export function getBadge(id : number) {
    let badges = CategoryBadge()
    return (badges[id][0])
}

export function getIDByCategoryName(name : string, categoryData : CategorySchema[]) : number {
    return (categoryData.find((element : CategorySchema) => {return element.category === name}))!.id!
}
export function getBadgeById(id : number, categoryData : CategorySchema[], size : string = "md", styling : string = "") {
    let badges = CategoryBadge()
    return (<Badge size={size} color={getColor((categoryData.find((element : CategorySchema) => {return element.id === id})!.id!))} className={`select-none dark:bg-black/0 border border-${getColor((categoryData.find((element : CategorySchema) => {return element.id === id}))!.id!)}-500 ${styling}`} icon={getBadge((categoryData.find((element : CategorySchema) => {return element.id === id}))!.id!)}>{(categoryData.find((element : CategorySchema) => {return element.id === id}))!.category}</Badge>)
}
export function getBadgeByCategoryName(name : string, categoryData : CategorySchema[], size : string = "md", styling : string = "") {
    let badges = CategoryBadge()
    return (<Badge size={size} color={getColor((categoryData.find((element : CategorySchema) => {return element.category === name})!.id!))} className={`select-none dark:bg-black/0 border border-${getColor((categoryData.find((element : CategorySchema) => {return element.category === name}))!.id!)}-500 ${styling}`} icon={getBadge((categoryData.find((element : CategorySchema) => {return element.category === name}))!.id!)}>{(categoryData.find((element : CategorySchema) => {return element.category === name}))!.category}</Badge>)
}
export function getColor(id : number) {
    let badges = CategoryBadge()
    return (badges[id][1])
}

