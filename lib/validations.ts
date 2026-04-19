import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["ORG_ADMIN", "ORG_AGENT", "SOLO_AGENT"]),
    organizationName: z.string().optional(),
  })
  .refine(
    (data) =>
      !(
        ["ORG_ADMIN", "ORG_AGENT"].includes(data.role) &&
        !data.organizationName
      ),
    { message: "Organization name required for org roles", path: ["organizationName"] }
  );

export const ingestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  agentId: z.string().optional(),
});

export const clientSignupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  budget: z.string().optional(),
  location: z.string().optional(),
  propertyType: z.string().optional(),
  timeline: z.string().optional(),
  agentId: z.string().optional(),
});

export const clientLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const bookingSchema = z.object({
  slot: z.string().optional(),
});

export const assignSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
});

export const inviteSchema = z.object({
  email: z.string().email(),
});

export const sendMessageSchema = z.object({
  leadId: z.string().min(1),
  content: z.string().min(1),
  sender: z.enum(["client", "agent"]),
});

export const avatarSchema = z.object({
  avatar: z.string().min(1),
});

export const propertyTypeEnum = z.enum([
  "single_family",
  "condo",
  "townhouse",
  "apartment",
  "multi_family",
  "land",
]);

export const propertyStatusEnum = z.enum([
  "active",
  "pending",
  "sold",
  "off_market",
]);

export const propertyCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().int().positive(),
  beds: z.number().int().nonnegative(),
  baths: z.number().nonnegative(),
  sqft: z.number().int().positive().optional(),
  type: propertyTypeEnum,
  status: propertyStatusEnum.optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const propertySearchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  minBeds: z.coerce.number().int().optional(),
  type: propertyTypeEnum.optional(),
  status: propertyStatusEnum.optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  skip: z.coerce.number().int().nonnegative().optional(),
});

export const saveSchema = z.object({
  propertyId: z.string().min(1),
});

export const tourCreateSchema = z.object({
  propertyId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  type: z.enum(["in_person", "virtual"]),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
});
