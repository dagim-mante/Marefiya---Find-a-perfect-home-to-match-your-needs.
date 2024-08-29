import DashboardNav from "@/components/navigation/dashboard-nav"
import { auth } from "@/server/auth"
import { BarChart, House, PenSquare, Settings, Star } from "lucide-react"

export default async function DashboardLayout(
    {children}: {children: React.ReactNode}
){
    const session = await auth()
    const userLinks = [
        {
            label: 'Settings',
            path: '/dashboard/settings',
            icon: <Settings size={16} />
        },
        {
            label: 'Favourites',
            path: '/dashboard/favourites',
            icon: <Star size={16} />
        }
    ]

    const ownerLinks =  [
        {
            label: 'Settings',
            path: '/dashboard/settings',
            icon: <Settings size={16} />
        },
        {
            label: 'Assets',
            path: '/dashboard/assets',
            icon: <House size={16} />
        },
        {
            label: 'Create',
            path: '/dashboard/add-asset',
            icon: <PenSquare size={16} />
        },
        {
            label: 'Analytics',
            path: '/dashboard/analytics',
            icon: <BarChart size={16} />
        },
        {
            label: 'Favourites',
            path: '/dashboard/favourites',
            icon: <Star size={16} />
        }
    ]

    const allLinks = session?.user.role === 'owner' ? ownerLinks : userLinks

    return (
        <div>
            <DashboardNav allLinks={allLinks} />
            {children}
        </div>
    )
}