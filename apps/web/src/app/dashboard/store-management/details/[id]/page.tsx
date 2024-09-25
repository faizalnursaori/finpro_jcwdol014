'use client'
import AddNewAddressCard from "@/components/AddNewAddressCard"
import AddressCard from "@/components/AddressCard"
import { getWarehouse } from "@/api/warehouse"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"


export default function  Addresses() {
    const {data} =  useSession()
    const [warehouse, setWarehouse] = useState<any>()
    const {id} = useParams()

    const getWarehouseById = async () =>{
        const res = await getWarehouse(id as string)
        
        setWarehouse(res?.warehouse)
    }

    useEffect(() => {
        getWarehouseById()
    },[])


    return(
        <div>
            <div className="card card-compact shadow-xl bg-base-100 w-[40vw]">
                <div className="card-body">
                    <h2 className="text-xl font-medium">{warehouse?.name}</h2>
                    <div className="divider my-1"></div>
                    <div className="grid grid-cols-1 gap-y-5 gap-x-8 py-2">
                        <div className='flex justify-between items-center'>
                            <p className="font-medium">Address: </p>
                            <p className="text-right">{warehouse?.address}</p>
                        </div>
                        <div className='flex justify-between items-center '>
                            <p className='font-medium'>City: </p>
                            <p className="text-right">{warehouse?.city.name}</p>
                        </div>
                        <div className='flex justify-between items-center '>
                            <p className='font-medium'>Province: </p>
                            <p className="text-right">{warehouse?.province.name}</p>
                        </div>
                        <div className='flex justify-between items-center '>
                            <p className='font-medium'>Latitude: </p>
                            <p className="text-right">{warehouse?.latitude}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='font-medium'>Longitude: </p>
                            <p className="text-right">{warehouse?.longitude}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='font-medium'>Store Radius: </p>
                            <p className="text-right">{warehouse?.storeRadius}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='font-medium'>Store Admin: </p>
                            <p className="text-right">{warehouse?.user.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}