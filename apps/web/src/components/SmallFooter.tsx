import Image from "next/image"

export default function SmallFooter(){



    return(
        <div className="m-auto max-w-[80vw] w-full">
            <div className="flex justify-between w-[100%] py-5 items-center">
                <div className="flex flex-col gap-y-4">
                    <p className="text-xs">*All prices incl.VAT</p>
                    <p className="text-xs">© 2024, Hemart. All rights reserved.</p>
                </div>
                <div className="flex flex-col gap-y-4 text-xs">
                    <div className="flex gap-3">
                        <Image src='/PaymentLogo/BCA.png' alt="BCA" width={30} height={30}/>
                        <Image src='/PaymentLogo/BNI.png' alt="BNI" width={30} height={30}/>
                        <Image src='/PaymentLogo/BRI.png' alt="BRI" width={30} height={30}/>
                        <Image src='/PaymentLogo/Mandiri.png' alt="Mandiri" width={30} height={30}/>
                    </div>
                    Made with 💚 in Purwadhika
                </div>
            </div>
        </div>
    )
}