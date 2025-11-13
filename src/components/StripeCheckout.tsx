import React, { useState, useEffect } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutContainer = styled.div`
  padding: 1rem 0;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardElementContainer = styled.div`
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  background-color: white;
`;

const PayButton = styled.button`
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: var(--secondary-color);
  }

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

function CheckoutForm({ orderId: initialOrderId, amount, customerEmail, customerName, onSuccess, onCreateOrder }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<Id<"orders"> | null>(initialOrderId || null);

  const createPaymentIntent = useAction(api.payments.createPaymentIntent);
  const confirmPayment = useAction(api.payments.confirmPayment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // If no order exists yet, create it first
      let orderId = currentOrderId;
      if (!orderId && onCreateOrder) {
        orderId = await onCreateOrder();
        if (!orderId) {
          setError('Failed to create order. Please try again.');
          setIsProcessing(false);
          return;
        }
        setCurrentOrderId(orderId);
      }

      if (!orderId) {
        setError('Order ID is missing. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Create payment intent on the backend
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        amount,
        customerEmail,
        customerName,
        orderId,
      });

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend to trigger order update and email
        await confirmPayment({
          paymentIntentId: paymentIntentId,
          orderId: orderId,
        });

        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
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
      <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
        Payment Details
      </h4>

      <PaymentForm onSubmit={handleSubmit}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Card Information
          </label>
          <CardElementContainer>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </CardElementContainer>
        </div>

        <PayButton type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </PayButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </PaymentForm>
    </CheckoutContainer>
  );
}

export default function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
