import { SiMediamarkt } from "react-icons/si";

import { useSelector } from "react-redux";
import { StateProps, StoreProduct } from "../../types";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import FormattedPrice from "./FormattedPrice";

export default function CartPayment() {
    const {productData, userInfo} = useSelector((state:StateProps) => state.next)
    const [totalamount, setTotalAmount] = useState(0)

    useEffect(() => {
        let amount  = 0;
        productData.map((item:StoreProduct) => {
            amount += item.price * item.quantity;
            return;
        })
        setTotalAmount(amount)
    }, [productData])

    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
    const { data: session } = useSession();
  
    const handleCheckout = async () => {
      const stripe = await stripePromise;
  
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: productData, email: session?.user?.email }),
      });
      const checkoutSession = await response.json();
      
      const result: any = await stripe?.redirectToCheckout({
        sessionId: checkoutSession.id,
      });
      if (result.error) {
        alert(result?.error.message);
      }
    };

  return (
    <div className="flex flex-col gap-4">
        <div className="flex gap-2">
            <span className="bg-green-600 rounded-full p-l h-6 w-6 
            text-sm text-white flex items-center justify-center"><SiMediamarkt /></span>
             <p className="text-sm">
          Your order qualifies for FREE Shipping by Choosing this option at
          checkout. See details....
        </p>
        </div>
        <p className="flex items-center justify-between px-2 font-semibold">Total:
            <span className="font-bold">
                <FormattedPrice amount={totalamount}/>
            </span>
        </p>
       {userInfo ? (
         <div className="flex flex-col items-center">
         <button onClick={handleCheckout} className="w-full h-10 text-sm font-semibold bg-amazon_blue bg-opacity-50 text-white rounded-lg">
           Proceed to Buy
         </button>
       </div>
       ): (
        <div className="flex flex-col items-center">
        <button className="w-full h-10 text-sm font-semibold bg-amazon_blue bg-opacity-50 text-white rounded-lg cursor-not-allowed">
          Proceed to Buy
        </button>
        <p className="text-xs mt-1 text-red-500 font-semibold animate-bounce">
          Please login to continue
        </p>
      </div>
       )}
    </div>
  )
}
