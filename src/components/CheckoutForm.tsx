import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Aunque estés en local, Stripe necesita saber a dónde regresar al usuario
        return_url: "http://localhost:5173/completion",
      },
    });

    if (error) {
      setMessage(error.message ?? "Ocurrió un error inesperado.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <button disabled={loading || !stripe}>
        {loading ? "Procesando..." : "Pagar ahora"}
      </button>
      {message && <div className="error-message">{message}</div>}
    </form>
  );
};