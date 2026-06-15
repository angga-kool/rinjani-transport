"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ===================== ROUTES =====================

export async function createRoute(data: {
  fromLocationId: string;
  toLocationId: string;
  title: string;
  slug: string;
  description?: string;
  estimatedDuration?: string;
  transferType: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  try {
    await prisma.route.create({
      data: {
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        estimatedDuration: data.estimatedDuration ?? null,
        transferType: data.transferType as "boat" | "car" | "boat_car" | "private" | "shared" | "speed_boat",
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isActive: true,
        isReturnAvailable: true,
      },
    });
    revalidatePath("/admin/routes");
    revalidatePath("/routes");
    return { success: true, message: "Route created successfully" };
  } catch (error) {
    console.error("[Admin Route Create Error]", error);
    return { success: false, message: "Failed to create route" };
  }
}

export async function updateRoute(id: string, data: Record<string, unknown>) {
  try {
    await prisma.route.update({ where: { id }, data });
    revalidatePath("/admin/routes");
    revalidatePath("/routes");
    return { success: true, message: "Route updated successfully" };
  } catch (error) {
    console.error("[Admin Route Update Error]", error);
    return { success: false, message: "Failed to update route" };
  }
}

export async function deleteRoute(id: string) {
  try {
    await prisma.route.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/admin/routes");
    revalidatePath("/routes");
    return { success: true, message: "Route deactivated" };
  } catch (error) {
    console.error("[Admin Route Delete Error]", error);
    return { success: false, message: "Failed to deactivate route" };
  }
}

// ===================== LOCATIONS =====================

export async function createLocation(data: {
  name: string;
  slug: string;
  type: string;
  region?: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  try {
    await prisma.location.create({
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type as "island" | "harbor" | "airport" | "city" | "hotel" | "attraction" | "beach" | "waterfall",
        region: data.region ?? null,
        description: data.description ?? null,
        image: data.image ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isActive: true,
      },
    });
    revalidatePath("/admin/locations");
    revalidatePath("/destinations");
    return { success: true, message: "Location created successfully" };
  } catch (error) {
    console.error("[Admin Location Create Error]", error);
    return { success: false, message: "Failed to create location" };
  }
}

export async function updateLocation(id: string, data: Record<string, unknown>) {
  try {
    await prisma.location.update({ where: { id }, data });
    revalidatePath("/admin/locations");
    revalidatePath("/destinations");
    return { success: true, message: "Location updated successfully" };
  } catch (error) {
    console.error("[Admin Location Update Error]", error);
    return { success: false, message: "Failed to update location" };
  }
}

// ===================== COMPANIES =====================

export async function createCompany(data: {
  name: string;
  slug: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  try {
    await prisma.company.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        contactEmail: data.contactEmail ?? null,
        contactPhone: data.contactPhone ?? null,
        isActive: true,
        isVerified: false,
      },
    });
    revalidatePath("/admin/companies");
    return { success: true, message: "Company created successfully" };
  } catch (error) {
    console.error("[Admin Company Create Error]", error);
    return { success: false, message: "Failed to create company" };
  }
}

export async function verifyCompany(id: string) {
  try {
    await prisma.company.update({ where: { id }, data: { isVerified: true } });
    revalidatePath("/admin/companies");
    return { success: true, message: "Company verified" };
  } catch (error) {
    console.error("[Admin Verify Error]", error);
    return { success: false, message: "Failed to verify company" };
  }
}

export async function unverifyCompany(id: string) {
  try {
    await prisma.company.update({ where: { id }, data: { isVerified: false } });
    revalidatePath("/admin/companies");
    return { success: true, message: "Company unverified" };
  } catch (error) {
    console.error("[Admin Unverify Error]", error);
    return { success: false, message: "Failed to unverify company" };
  }
}

// ===================== BOOKINGS =====================

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: status as "pending" | "confirmed" | "cancelled" | "completed" },
    });
    revalidatePath("/admin/bookings");
    return { success: true, message: `Booking status updated to ${status}` };
  } catch (error) {
    console.error("[Admin Booking Status Error]", error);
    return { success: false, message: "Failed to update booking status" };
  }
}

export async function updatePaymentStatus(bookingId: string, status: string) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: status as "pending" | "paid" | "failed" | "expired" | "refunded" },
    });
    revalidatePath("/admin/bookings");
    return { success: true, message: `Payment status updated to ${status}` };
  } catch (error) {
    console.error("[Admin Payment Status Error]", error);
    return { success: false, message: "Failed to update payment status" };
  }
}

// ===================== SERVICES =====================

export async function createService(data: {
  companyId: string;
  routeId: string;
  name: string;
  description?: string;
  serviceType?: string;
  capacity?: number;
  basePrice: number;
  childPrice?: number;
  infantPrice?: number;
  currency?: string;
  cancellationPolicy?: string;
}) {
  try {
    await prisma.service.create({
      data: {
        companyId: data.companyId,
        routeId: data.routeId,
        name: data.name,
        description: data.description ?? null,
        serviceType: data.serviceType ?? null,
        capacity: data.capacity ?? null,
        basePrice: data.basePrice,
        childPrice: data.childPrice ?? null,
        infantPrice: data.infantPrice ?? null,
        currency: data.currency ?? "EUR",
        cancellationPolicy: data.cancellationPolicy ?? null,
        isActive: true,
      },
    });
    revalidatePath("/admin/services");
    return { success: true, message: "Service created successfully" };
  } catch (error) {
    console.error("[Admin Service Create Error]", error);
    return { success: false, message: "Failed to create service" };
  }
}

// ===================== SCHEDULES =====================

export async function createSchedule(data: {
  serviceId: string;
  departureTime: string;
  arrivalTime?: string;
  dayOfWeek?: number;
}) {
  try {
    await prisma.schedule.create({
      data: {
        serviceId: data.serviceId,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime ?? null,
        dayOfWeek: data.dayOfWeek ?? null,
        isAvailable: true,
      },
    });
    revalidatePath("/admin/schedules");
    return { success: true, message: "Schedule created" };
  } catch (error) {
    console.error("[Admin Schedule Error]", error);
    return { success: false, message: "Failed to create schedule" };
  }
}

export async function deleteSchedule(id: string) {
  try {
    await prisma.schedule.delete({ where: { id } });
    revalidatePath("/admin/schedules");
    return { success: true, message: "Schedule deleted" };
  } catch (error) {
    console.error("[Admin Schedule Delete Error]", error);
    return { success: false, message: "Failed to delete schedule" };
  }
}

// ===================== PRICING =====================

export async function createPricing(data: {
  serviceId: string;
  adultPrice: number;
  childPrice?: number;
  infantPrice?: number;
  currency?: string;
  validFrom?: string;
  validUntil?: string;
}) {
  try {
    await prisma.price.create({
      data: {
        serviceId: data.serviceId,
        adultPrice: data.adultPrice,
        childPrice: data.childPrice ?? null,
        infantPrice: data.infantPrice ?? null,
        currency: data.currency ?? "EUR",
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
      },
    });
    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing created" };
  } catch (error) {
    console.error("[Admin Pricing Error]", error);
    return { success: false, message: "Failed to create pricing" };
  }
}

// ===================== FAQ =====================

export async function createFaq(data: {
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
}) {
  try {
    await prisma.faq.create({
      data: {
        category: data.category,
        question: data.question,
        answer: data.answer,
        sortOrder: data.sortOrder ?? 0,
        isActive: true,
      },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true, message: "FAQ created" };
  } catch (error) {
    console.error("[Admin FAQ Error]", error);
    return { success: false, message: "Failed to create FAQ" };
  }
}

export async function updateFaq(id: string, data: Record<string, unknown>) {
  try {
    await prisma.faq.update({ where: { id }, data });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true, message: "FAQ updated" };
  } catch (error) {
    console.error("[Admin FAQ Update Error]", error);
    return { success: false, message: "Failed to update FAQ" };
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.faq.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true, message: "FAQ deactivated" };
  } catch (error) {
    console.error("[Admin FAQ Delete Error]", error);
    return { success: false, message: "Failed to deactivate FAQ" };
  }
}

// ===================== TRAVEL TIPS =====================

function slugifyTip(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createTravelTip(data: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  image?: string;
  category?: string;
  readTime?: string;
  author?: string;
  sortOrder?: number;
  isPublished?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}) {
  try {
    const finalSlug = data.slug?.trim() ? slugifyTip(data.slug) : slugifyTip(data.title);
    await prisma.travelTip.create({
      data: {
        title: data.title,
        slug: finalSlug,
        excerpt: data.excerpt ?? null,
        content: data.content,
        image: data.image ?? null,
        category: data.category ?? "Travel Tips",
        readTime: data.readTime ?? null,
        author: data.author ?? null,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? true,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
      },
    });
    revalidatePath("/admin/travel-tips");
    revalidatePath("/travel-tips");
    return { success: true, message: "Travel tip created" };
  } catch (error) {
    console.error("[Admin Travel Tip Create Error]", error);
    return { success: false, message: "Failed to create travel tip" };
  }
}

export async function updateTravelTip(id: string, data: Record<string, unknown>) {
  try {
    await prisma.travelTip.update({ where: { id }, data });
    revalidatePath("/admin/travel-tips");
    revalidatePath("/travel-tips");
    return { success: true, message: "Travel tip updated" };
  } catch (error) {
    console.error("[Admin Travel Tip Update Error]", error);
    return { success: false, message: "Failed to update travel tip" };
  }
}

export async function deleteTravelTip(id: string) {
  try {
    await prisma.travelTip.delete({ where: { id } });
    revalidatePath("/admin/travel-tips");
    revalidatePath("/travel-tips");
    return { success: true, message: "Travel tip deleted" };
  } catch (error) {
    console.error("[Admin Travel Tip Delete Error]", error);
    return { success: false, message: "Failed to delete travel tip" };
  }
}

// ===================== USERS =====================

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId?: string;
}) {
  try {
    const { hashPassword } = await import("@/lib/password");
    const passwordHash = await hashPassword(data.password);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as "admin" | "operator" | "customer",
        companyId: data.companyId ?? null,
      },
    });
    revalidatePath("/admin/users");
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("[Admin User Create Error]", error);
    return { success: false, message: "Failed to create user" };
  }
}
