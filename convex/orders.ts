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
    customerPhone: v.string(),
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
        ? `<p><strong>Delivery Address:</strong> ${args.deliveryAddress}</p>`
        : "<p><strong>Pickup:</strong> Saturday pickup available</p>";

    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8B4513; text-align: center;">Chef Jeff Cookies</h1>
        <h2 style="color: #D2691E;">Order Confirmation</h2>
        
        <p>Dear ${args.customerName},</p>
        
        <p>Thank you for your order! We've received your cookie order and will begin preparing your delicious treats.</p>
        
        <div style="background-color: #FFF8DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B4513; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${args.orderId}</p>
          <ul style="margin: 10px 0;">
            ${itemsList}
          </ul>
          <p><strong>Total:</strong> $${args.totalAmount.toFixed(2)}</p>
          ${deliveryInfo}
        </div>
        
        <div style="background-color: #F4A460; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2C1810; margin-top: 0;">Important Information</h3>
          <p><strong>Baking Schedule:</strong> Cookies are baked fresh every Friday</p>
          <p><strong>Pickup/Delivery:</strong> Available on Saturdays</p>
          <p>We'll contact you soon with specific pickup/delivery details!</p>
        </div>
        
        <p>If you have any questions, please don't hesitate to reach out.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Chef Jeff Cookies Team</strong>
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
        from: "Chef Jeff Cookies <schramindustries@gmail.com>",
        to: args.customerEmail,
        subject: `Order Confirmation - Chef Jeff Cookies (#${args.orderId})`,
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

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("desc")
      .collect();
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
