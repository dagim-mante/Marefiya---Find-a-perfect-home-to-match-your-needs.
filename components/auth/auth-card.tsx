import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card"
import Socials from "./socials"
import BackButton from "./back-button"

type AuthCardProps = {
    children: React.ReactNode
    cardTitle: string
    backButtonHref: string
    backButtonText: string
    showSocials?: boolean
}

export default function AuthCard({
    children,
    cardTitle,
    backButtonHref,
    backButtonText,
    showSocials
}: AuthCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocials && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonText} href={backButtonHref} />
            </CardFooter>
        </Card>
    )
}