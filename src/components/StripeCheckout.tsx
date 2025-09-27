import React, { useState, useEffect } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import styled from 'styled-components';

const CheckoutContainer = styled.div`
  padding: 1rem 0;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardInput = styled.div`
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
  orderId: Id<"orders">;
  amount: number;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
}

export default function StripeCheckout({ 
  orderId, 
  amount, 
  customerEmail, 
  customerName, 
  onSuccess 
}: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Commented out for demo mode - no Stripe API calls needed
  // const createPaymentIntent = useAction(api.payments.createPaymentIntent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate a successful payment
      // Accept any card details and simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Skip Stripe API call for now - just simulate success
      console.log('Simulating payment for:', { amount, customerEmail, customerName, orderId });

      // Simulate successful payment
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
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
            Card Number (Demo - any number works)
          </label>
          <CardInput>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
              style={{ 
                border: 'none', 
                outline: 'none', 
                width: '100%', 
                fontSize: '1rem',
                backgroundColor: 'transparent'
              }}
            />
          </CardInput>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Expiry Date (Demo)
            </label>
            <CardInput>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                required
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  width: '100%', 
                  fontSize: '1rem',
                  backgroundColor: 'transparent'
                }}
              />
            </CardInput>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              CVC (Demo)
            </label>
            <CardInput>
              <input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                maxLength={4}
                required
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  width: '100%', 
                  fontSize: '1rem',
                  backgroundColor: 'transparent'
                }}
              />
            </CardInput>
          </div>
        </div>

        <PayButton type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </PayButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </PaymentForm>

      <div style={{ 
        fontSize: '0.8rem', 
        color: '#666', 
        marginTop: '1rem', 
        textAlign: 'center' 
      }}>
        🧪 Demo Mode - Any card details will work for testing
      </div>
    </CheckoutContainer>
  );
}
