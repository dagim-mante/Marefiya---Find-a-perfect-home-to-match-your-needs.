import {AlertCircle} from "lucide-react"

export default function FormError({message}: {message: string}){
    if(!message) return null
    return (
        <div className='bg-destructive/25 flex items-center gap-2 my-2 text-secondary-foreground p-3 rounded-md'>
            <AlertCircle className='w-4 h-4'/>
            <p>{message}</p>
        </div>
    )
}