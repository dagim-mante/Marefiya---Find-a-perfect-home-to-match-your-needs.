export default function getBaseURL(){
    console.log("process.env.VERCEL_URL", process.env.VERCEL_URL)
    console.log("process.env.DOMAIN_URL", process.env.DOMAIN_URL)
    console.log(typeof window)
    if(typeof window === undefined) return ""
    if(process.env.VERCEL_URL) {
        return `https://${process.env.DOMAIN_URL}`
    }
    return 'http://localhost:3000'
}