import { auth } from "@/server/auth";
import SettingsCard from "./settings-card";
import { redirect } from "next/navigation";

export default async function Settings(){
    const session = await auth()
    if(!session) return redirect('/')
    if(session) return <SettingsCard session={session} />
} 