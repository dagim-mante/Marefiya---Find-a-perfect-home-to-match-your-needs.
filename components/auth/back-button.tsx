import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BackButton({label, href}: {label:string, href:string}){
    return (
        <Button asChild variant={'link'} className="w-full font-medium">
            <Link aria-label={label} href={href}>
                {label}
            </Link>
        </Button>
    )
}