import React from "react";
const billingInfo = [
    { label: "Name", value: "EV ZONE AFRICA" },
    { label: "Email ID", value: "evzoneafrica@gmail.com" },
    { label: "Country Code", value: "Uganda(+256)" },
    { label: "Personal WhatsApp Number", value: "0704938137" },
];
const paymentInfo=[
    {label:'Renews On',value:'15 December 2024'},
    {label:'Visa',value:'************2558'}
]
const BillingInformation=()=>{

    return(
        <>
            <div className="billinginfo_container">
        <table className="billing__table">
            <caption className="billingcaption">Billing Contact</caption>
            <tbody>
                {
                    billingInfo.map((data,index)=>(
                        <tr key={index}>
                            <th className="billing_label">{data.label}</th>
                            <th className="billing_value">{data.value}</th>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <table className="billing__table">
            <caption className="billingcaption">Payment Method</caption>
            <tbody>
                {
                    paymentInfo.map((data,index)=>(
                        <tr key={index}>
                            <th className="billing_label">{data.label}</th>
                            <th className="billing_value">{data.value}</th>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
        </>
    )
}
export default BillingInformation;