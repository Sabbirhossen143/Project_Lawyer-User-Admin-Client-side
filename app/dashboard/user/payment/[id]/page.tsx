"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLock, FaSpinner, FaCcStripe } from "react-icons/fa";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();
  const router = useRouter();

  const [requestData, setRequestData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadRequest(); }, []);

  const loadRequest = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hire-requests/user-request/${params.id}`);
      setRequestData(res.data);
      const paymentRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions/create-payment-intent`, { amount: res.data.fee });
      setClientSecret(paymentRes.data.clientSecret);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });

    if (result.error) {
      toast.error(result.error.message || "Payment Failed");
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        requestId: requestData._id,
        lawyerId: requestData.lawyerId,
        lawyerName: requestData.lawyerName,
        lawyerEmail: requestData.lawyerEmail,
        userEmail: requestData.userEmail,
        userName: requestData.userName,
        amount: requestData.fee,
        paymentIntentId: result.paymentIntent.id,
      });
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/hire-requests/${requestData._id}`, { status: "Paid" });
      toast.success("Payment Successful");
      router.push("/dashboard/user/hiring-history");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 sm:p-8 bg-[#0B1220] border border-slate-800 rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-black text-white mb-2">Secure Checkout</h2>
      <p className="text-slate-400 mb-8 text-sm">Complete your payment securely via Stripe.</p>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6 flex justify-between items-center">
        <span className="text-slate-400 text-sm">Total Amount</span>
        <span className="text-2xl font-bold text-amber-500">৳{requestData?.fee}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-4 bg-white rounded-xl mb-6">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#1a1a1a' } } }} />
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || loading}
          className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <><FaLock size={12} /> Pay Now</>}
        </button>
      </form>
      
      <div className="mt-6 flex justify-center items-center gap-2 text-slate-600 text-xs">
        <FaCcStripe size={20} />
        <span>Secured by Stripe Encryption</span>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#020617] pt-20 px-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}