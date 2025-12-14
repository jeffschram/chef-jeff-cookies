import {
  mutation,
  query,
  internalMutation,
  internalAction,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Resend } from "resend";

export const createOrder = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    deliveryType: v.union(v.literal("pickup"), v.literal("delivery")),
    deliveryAddress: v.optional(v.string()),
    totalAmount: v.number(),
    isTestOrder: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const orderDate = new Date().toISOString().split("T")[0];

    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      fulfillmentStatus: "pending",
      orderDate,
    });

    // Don't send confirmation emails yet - wait for payment confirmation
    return orderId;
  },
});

export const sendOrderEmails = internalAction({
  args: {
    orderId: v.id("orders"),
    customerName: v.string(),
    customerEmail: v.string(),
    totalAmount: v.number(),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    deliveryType: v.union(v.literal("pickup"), v.literal("delivery")),
    deliveryAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set");
      throw new Error("Email service not configured");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Create order summary HTML
    const itemsList = args.items
      .map(
        (item) =>
          `<li>${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</li>`
      )
      .join("");

    const deliveryInfo =
      args.deliveryType === "delivery"
        ? `<p><strong>Delivery Address:</strong> ${args.deliveryAddress}</p><p>Will be delivered on Sunday Dec. 21st</p>`
        : "<p><strong>Pickup:</strong> Saturday Dec. 20th from 12pm - 4pm at the <a href='https://www.google.com/maps/place/Danger+Gallery/@41.0754056,-73.5212585,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2a1add5015f11:0xc93c1e07e6b83389!8m2!3d41.0754056!4d-73.5186782!16s%2Fg%2F11c5fzl55c?entry=ttu&g_ep=EgoyMDI1MTExMS4wIKXMDSoASAFQAw%3D%3D'>Danger Gallery in Stamford, CT</a>.</p>";

    const emailHtml = `
      <div style="font-family:Arial, Helvetica, sans-serif;max-width:600px;margin:40px auto 0 auto;padding:20px;background:#fbdd56;">
        <img src="/images/logo.png" alt="Chef Jeff Cookies Logo" style="width: 150px;position: relative; top: -40px; left: -40px; margin-bottom: -40px;" />
        <h2 style="color:#000000; font-weight: bold; padding: 5px; background: #ffffff; width: max-content;">ORDER CONFIRMATION</h2>        
        
        <div style="background-color:#ffffff;padding:20px;margin:20px 0">
          <p><b>Dear ${args.customerName},</b></p>
          <p>Thank you for your order! We've received your cookie order and will begin preparing your delicious treats.</p>
        </div>
        
        <div style="background-color:#ffffff;padding:20px;margin:20px 0">
          <h3 style="color: #000000; margin-top: 0;">ORDER DETAILS</h3>
          <p><strong>Order ID:</strong> ${args.orderId}</p>
          <ul style="margin: 10px 0;">
            ${itemsList}
          </ul>
          <p><strong>Total:</strong> $${args.totalAmount.toFixed(2)}</p>
          ${deliveryInfo}
        
        <p style="margin-top: 20px;">Payments are processed through Stripe. You will also receive a confirmation email from them.</p>
        <p>If you have any questions, please don't hesitate to reach out to Chef Jeff at <a href="mailto:schramindustries@gmail.com">schramindustries@gmail.com</a></p>
        
        <p style="margin-top: 20px;">
          Thanks again and enjoy!,<br>
          <strong>- Chef Jeff and the team</strong>
        </p>
      </div>
    `;

    try {
      console.log("Attempting to send email to:", args.customerEmail);
      console.log(
        "Using API key:",
        process.env.RESEND_API_KEY ? "Set" : "Not set"
      );

      const { data, error } = await resend.emails.send({
        // Use your verified domain email address as the sender
        from: "Chef Jeff Cookies <noreply@chefjeffcookies.com>",
        to: args.customerEmail,
        subject: `Order Confirmation - Chef Jeff Cookies!`,
        html: emailHtml,
      });

      if (error) {
        console.error("Resend API error:", JSON.stringify(error, null, 2));
        throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
      }

      console.log("Email sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Email error:", error);
      console.error("Recipient:", args.customerEmail);
      throw error;
    }
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});

export const updateFulfillmentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    fulfillmentStatus: v.union(v.literal("pending"), v.literal("fulfilled")),
  },
  handler: async (ctx, args) => {
    console.log("Updating fulfillment status for order:", args.orderId, "to:", args.fulfillmentStatus);
    await ctx.db.patch(args.orderId, {
      fulfillmentStatus: args.fulfillmentStatus,
    });
    console.log("Fulfillment status updated successfully");
  },
});

export const updateOrderStatusInternal = internalMutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});

export const getRealOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    // Filter out test orders
    return orders.filter(order => !order.isTestOrder);
  },
});

export const getTestOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    // Only return test orders
    return orders.filter(order => order.isTestOrder === true);
  },
});

// Keep getOrders for backward compatibility (returns all orders)
export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getOrderById = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getOrderByIdInternal = internalQuery({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});
