import { auth } from "@/server/auth";
import AddAssetForm from "./add-asset-form";
import { redirect } from "next/navigation";

export default async function AddAsset(){
    const session = await auth()
    if(session?.user.role !== 'owner'){
        return redirect('/auth/login')
    }else{
        return <AddAssetForm session={session} />
    }
}