'use client'
import AddNewAddressCard from "@/components/AddNewAddressCard"
import AddressCard from "@/components/AddressCard"
import { getUserAddresses } from "@/api/address"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { deleteUserAddresses } from "@/api/address"




export default function  Addresses() {
    const {data} =  useSession()
    const [addresses, setAddresses] = useState<any>()

    const getUserAddress = async () =>{
        const res = await getUserAddresses(data?.user?.id)
        setAddresses(res?.address)
    }

    const handleDelete = async (id :any) => {
        try {
            await deleteUserAddresses(id);
            const newAddress = addresses.filter((address:{id: number}) => {
                    return address.id != id
            })
            setAddresses(newAddress)
          } catch (error) {
            console.log(error);
            
          }
    }

    useEffect(() => {
        getUserAddress()
        
    },[data?.user])


    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 m-auto md:m-0">
            <AddNewAddressCard/>
            {addresses?.map((address:any, index:number) => {
                return <AddressCard key={index} address={address} handleDelete={handleDelete}/>
            })}
        </div>
    )
}