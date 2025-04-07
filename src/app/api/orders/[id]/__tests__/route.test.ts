import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    orderDetail: {
      deleteMany: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Order by ID API", () => {
  let mockRequest: NextRequest;
  let mockUser: User;
  let mockAdminUser: User;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock user
    mockUser = {
      user_id: 1,
      name: "Test User",
      email_address: "test@example.com",
      phone_number: "1234567890",
      registration_date: new Date(),
      role: "user",
    };

    // Setup mock admin user
    mockAdminUser = {
      user_id: 2,
      name: "Admin User",
      email_address: "admin@example.com",
      phone_number: "1234567890",
      registration_date: new Date(),
      role: "admin",
    };

    // Setup mock request
    mockRequest = {
      nextUrl: new URL("http://localhost:3000/api/orders/1"),
      json: jest.fn(),
    } as unknown as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("GET /api/orders/[id]", () => {
    it("should return order by ID", async () => {
      // Mock prisma response
      (prisma.order.findFirst as jest.Mock).mockResolvedValue({
        order_id: 1,
        user_id: 1,
        order_number: "ORD-123",
        order_date: new Date(),
        order_status_id: 1,
        delivery_method: "STANDARD",
        orderStatus: {
          status_id: 1,
          status_name: "PENDING",
        },
        order_details: [],
      });

      const response = await GET(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        order_id: 1,
        user_id: 1,
        order_number: "ORD-123",
        order_date: expect.any(String),
        order_status_id: 1,
        delivery_method: "STANDARD",
        orderStatus: {
          status_id: 1,
          status_name: "PENDING",
        },
        order_details: [],
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthenticated session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: null,
      });

      const response = await GET(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: "Unauthorized" });
    });

    it("should return 404 if order is not found", async () => {
      // Mock prisma response
      (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await GET(mockRequest, { params: { id: "999" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ message: "Order not found" });
    });
  });

  describe("PUT /api/orders/[id]", () => {
    beforeEach(() => {
      // Mock admin session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: mockAdminUser,
      });
    });

    it("should update order status", async () => {
      // Mock request body
      const updateData = {
        order_status_id: 2,
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(updateData);

      // Mock prisma response
      (prisma.order.update as jest.Mock).mockResolvedValue({
        order_id: 1,
        order_status_id: 2,
        orderStatus: {
          status_id: 2,
          status_name: "COMPLETED",
        },
      });

      const response = await PUT(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        order_id: 1,
        order_status_id: 2,
        orderStatus: {
          status_id: 2,
          status_name: "COMPLETED",
        },
      });
    });

    it("should return 403 if user is not admin", async () => {
      // Mock non-admin session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const response = await PUT(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({ message: "Forbidden" });
    });
  });

  describe("DELETE /api/orders/[id]", () => {
    beforeEach(() => {
      // Mock admin session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: mockAdminUser,
      });
    });

    it("should delete order and its details", async () => {
      // Mock prisma responses
      (prisma.orderDetail.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.order.delete as jest.Mock).mockResolvedValue({});

      const response = await DELETE(mockRequest, { params: { id: "1" } });

      expect(response.status).toBe(204);
      expect(prisma.orderDetail.deleteMany).toHaveBeenCalledWith({
        where: { order_id: 1 },
      });
      expect(prisma.order.delete).toHaveBeenCalledWith({
        where: { order_id: 1 },
      });
    });

    it("should return 403 if user is not admin", async () => {
      // Mock non-admin session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const response = await DELETE(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({ message: "Forbidden" });
    });
  });
});
