'use client'

import { newVerification } from "@/server/actions/tokens"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import AuthCard from "./auth-card"
import FormError from "./form-error"
import FormSuccess from "./form-success"

export default function VerifyEmailForm(){
    const token = useSearchParams().get('token')
    const router = useRouter()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const handleVerification = useCallback(() => {
        if(success || error) return
        if(!token){
            setError('No token found.')
            return
        }
        newVerification(token)
            .then(data => {
                if(data.error){
                    setError(data.error)
                }
                if(data.success){
                    setSuccess(data.success)
                    router.push('/auth/login')
                }
            })
    }, [])
    useEffect(() => { 
        handleVerification()
    }, [])

    return (
        <AuthCard cardTitle="Verify Email" backButtonText="Back to login" backButtonHref="/auth/login">
            <div className="flex flex-col items-center justify-center w-full">
                <p>{!success && !error ? 'Verifying' : null }</p>
                <FormError message={error} />
                <FormSuccess message={success} />
            </div>
        </AuthCard>
    )
}