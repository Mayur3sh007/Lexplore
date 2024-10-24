// src/app/(main)/payment/page.tsx
// This is the server component - by default in Next.js 13+, all components are server components
// unless marked with "use client"
import ClientPaymentForm from "./components/ClientPaymenForm";

export default function PaymentPage() {
  return (
    <div className="container mx-auto py-8">
      <ClientPaymentForm />
    </div>
  );
}