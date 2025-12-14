import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  orders: defineTable({
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    items: v.array(v.object({
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    deliveryType: v.union(v.literal("pickup"), v.literal("delivery")),
    deliveryAddress: v.optional(v.string()),
    totalAmount: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("completed")),
    fulfillmentStatus: v.optional(v.union(v.literal("pending"), v.literal("fulfilled"))),
    orderDate: v.string(),
    isTestOrder: v.optional(v.boolean()),
  }),
  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
