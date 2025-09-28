import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Stripe from "stripe";

// Initialize Stripe with proper error handling
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil", // Use the required API version
  });
} else {
  console.error("STRIPE_SECRET_KEY environment variable is not set");
}

export const createPaymentIntent = action({
  args: {
    amount: v.number(),
    customerEmail: v.string(),
    customerName: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    try {
      // Check if Stripe is properly initialized
      if (!stripe) {
        throw new Error(
          "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable."
        );
      }

      console.log("Creating payment intent for amount:", args.amount);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(args.amount * 100), // Convert to cents
        currency: "usd",
        receipt_email: args.customerEmail,
        metadata: {
          orderId: args.orderId,
          customerName: args.customerName,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log("Payment intent created successfully:", paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);

      // Provide more specific error information
      if (error instanceof Error) {
        throw new Error(`Failed to create payment intent: ${error.message}`);
      } else {
        throw new Error("Failed to create payment intent: Unknown error");
      }
    }
  },
});

export const confirmPayment = action({
  args: {
    paymentIntentId: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    try {
      // Check if Stripe is properly initialized
      if (!stripe) {
        throw new Error(
          "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable."
        );
      }

      console.log("Confirming payment for:", args.paymentIntentId);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        args.paymentIntentId
      );

      if (paymentIntent.status === "succeeded") {
        // Update order status to confirmed
        await ctx.runMutation(internal.orders.updateOrderStatusInternal, {
          orderId: args.orderId,
          status: "confirmed",
        });

        console.log("Payment confirmed and order updated:", args.orderId);
        return { success: true, status: paymentIntent.status };
      }

      console.log("Payment not succeeded, status:", paymentIntent.status);
      return { success: false, status: paymentIntent.status };
    } catch (error) {
      console.error("Error confirming payment:", error);

      if (error instanceof Error) {
        throw new Error(`Failed to confirm payment: ${error.message}`);
      } else {
        throw new Error("Failed to confirm payment: Unknown error");
      }
    }
  },
});
