import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const createPaymentIntent = action({
  args: {
    amount: v.number(),
    customerEmail: v.string(),
    customerName: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(args.amount * 100), // Convert to cents
        currency: "usd",
        receipt_email: args.customerEmail,
        metadata: {
          orderId: args.orderId,
          customerName: args.customerName,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new Error("Failed to create payment intent");
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
      const paymentIntent = await stripe.paymentIntents.retrieve(args.paymentIntentId);
      
      if (paymentIntent.status === "succeeded") {
        // Update order status to confirmed
        await ctx.runMutation(internal.orders.updateOrderStatusInternal, {
          orderId: args.orderId,
          status: "confirmed",
        });
        
        return { success: true, status: paymentIntent.status };
      }
      
      return { success: false, status: paymentIntent.status };
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw new Error("Failed to confirm payment");
    }
  },
});
