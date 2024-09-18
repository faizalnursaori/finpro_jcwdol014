'use client'
import AddNewAddressCard from "@/components/AddNewAddressCard"
import AddressCard from "@/components/AddressCard"
import { getUserAddresses } from "@/api/address"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"



export default function  Addresses() {
    const {data} =  useSession()
    const [addresses, setAddresses] = useState<any>()

    const getUserAddress = async () =>{
        const res = await getUserAddresses(data?.user?.id)
        setAddresses(res?.address)
    }

    useEffect(() => {
        getUserAddress()
    },[data?.user])


    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
            <AddNewAddressCard/>
            {addresses?.map((address:any, index:number) => {
                return <AddressCard key={index} address={address} id={address.id}/>
            })}
        </div>
    )
}