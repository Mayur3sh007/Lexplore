"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { collection, addDoc } from "firebase/firestore";
import { AlertCircle } from "lucide-react";
import { db } from "@/config/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDonate = (event: React.MouseEvent) => {
    event.preventDefault();
    if (amount) {
      alert(`Payment of Rs.${amount} Done successfully`);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !amount) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add donation to Firestore
      await addDoc(collection(db, "donations"), {
        amount: parseFloat(amount),
        name,
        created: new Date(),
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setAmount("");
      setName("");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (err) {
      console.error("Error processing donation:", err);
      alert("Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      {showSuccess && (
        <Alert className="mb-4 bg-green-50 text-green-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Thank you for your donation! Your payment was successful.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-start">
        <div className="w-2/3 pr-8 border-r">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Make a Donation</h2>
            <p className="text-gray-500 text-sm">Support our cause with your generous donation</p>
          </div>

          <div className="space-y-6">
            <div className="flex space-x-4">
              <button className="flex-1 py-3 px-4 bg-blue-50 text-blue-600 rounded-lg font-medium">
                Pay With Credit Card
              </button>
              <button className="flex-1 py-3 px-4 bg-gray-50 text-gray-600 rounded-lg font-medium">
                Pay With Bank Debit
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6" />
              <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
              <img src="/api/placeholder/40/25" alt="UnionPay" className="h-6" />
              <img src="/api/placeholder/40/25" alt="Discover" className="h-6" />
              <img src="/api/placeholder/40/25" alt="CB" className="h-6" />
              <img src="/api/placeholder/40/25" alt="JCB" className="h-6" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on the card
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Mr John Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg pr-12"
                    placeholder="4444 4444 4444 4444"
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <img src="/api/placeholder/30/20" alt="Visa" className="h-6" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      placeholder="123"
                      required
                    />
                    <button className="absolute right-3 top-3 text-blue-600">
                      <div className="w-5 h-5 text-blue-500">i</div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="save-card"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="save-card" className="ml-2 text-sm text-gray-700">
                  Save card for future donations
                </label>
              </div>

              <button
                type="button"
                onClick={handleDonate}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/3 pl-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Donation Amount</span>
              <span className="text-xl font-semibold">
                ${amount ? parseFloat(amount).toFixed(2) : "0.00"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDonate}
              disabled={loading}
              className="w-full bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-lg mt-4 hover:bg-blue-200 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientPaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <DonationForm />
    </Elements>
  );
};

export default ClientPaymentForm;