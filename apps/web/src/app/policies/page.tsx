
import { PrivacyPolicyText } from "@/utils/PrivacyPolicyTexts"

export default function PrivacyPolicy() {




    return(
        <div className="w-[80vw] m-auto">
            <h1 className="font-bold text-4xl mb-10">
                Privacy Policy
            </h1>
            <div className="divider"></div>
            {PrivacyPolicyText.map((data, index) => {
                return <div key={index}>
                    <h2 className="font-semibold mb-3 text-lg">{data.title}</h2>
                    <p className="mb-3">{data.text}</p>
                    
                </div>
            })}
        </div>
    )
}