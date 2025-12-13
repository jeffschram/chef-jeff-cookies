import React, { useState, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutContainer = styled.div`
  padding: 1rem 0;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PayButton = styled.button`
  background-color: var(--text-1);
  color: var(--text-2);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #22c55e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface StripeCheckoutProps {
  orderId?: Id<"orders"> | null;
  amount: number;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
  onCreateOrder?: () => Promise<Id<"orders"> | null>;
}

function CheckoutForm({
  orderId: initialOrderId,
  amount,
  customerEmail,
  customerName,
  onSuccess,
  onCreateOrder,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<Id<"orders"> | null>(
    initialOrderId || null
  );

  const createPaymentIntent = useAction(api.payments.createPaymentIntent);
  const confirmPayment = useAction(api.payments.confirmPayment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm payment with Stripe using PaymentElement
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
      } else if (paymentIntent && currentOrderId) {
        // Payment succeeded, confirm on backend
        await confirmPayment({
          paymentIntentId: paymentIntent.id,
          orderId: currentOrderId,
        });

        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <CheckoutContainer>
        <SuccessMessage>
          ✅ Payment successful! Your order has been confirmed.
        </SuccessMessage>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <h4 style={{ color: "var(--text-1)", marginBottom: "1rem" }}>
        Payment Details
      </h4>

      <PaymentForm onSubmit={handleSubmit}>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />

        <PayButton type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </PayButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </PaymentForm>
    </CheckoutContainer>
  );
}

function StripeCheckoutWrapper(props: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const createPaymentIntent = useAction(api.payments.createPaymentIntent);

  useEffect(() => {
    const initializePayment = async () => {
      // Create order if needed
      let orderId = props.orderId;
      if (!orderId && props.onCreateOrder) {
        orderId = await props.onCreateOrder();
      }

      if (orderId) {
        const { clientSecret: secret } = await createPaymentIntent({
          amount: props.amount,
          customerEmail: props.customerEmail,
          customerName: props.customerName,
          orderId,
        });
        setClientSecret(secret);
      }
    };

    initializePayment();
  }, [props.orderId, props.amount]);

  if (!clientSecret) {
    return <div style={{ padding: "1rem" }}>Loading payment options...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
}

export default StripeCheckoutWrapper;
