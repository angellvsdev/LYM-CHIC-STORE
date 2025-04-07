import { NextRequest } from "next/server";
import { GET } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    orderStatus: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Order Status by ID API", () => {
  let mockRequest: NextRequest;
  let mockUser: User;

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

    // Setup mock request
    mockRequest = {
      nextUrl: new URL("http://localhost:3000/api/order-statuses/1"),
    } as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("GET /api/order-statuses/[id]", () => {
    it("should return order status by ID", async () => {
      // Mock prisma response
      (prisma.orderStatus.findUnique as jest.Mock).mockResolvedValue({
        order_status_id: 1,
        status_name: "PENDING",
        status_description: "Order is pending",
      });

      const response = await GET(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        order_status_id: 1,
        status_name: "PENDING",
        status_description: "Order is pending",
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

    it("should return 404 if order status is not found", async () => {
      // Mock prisma response
      (prisma.orderStatus.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await GET(mockRequest, { params: { id: "999" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ message: "Order status not found" });
    });

    it("should return 400 if ID is not a number", async () => {
      const response = await GET(mockRequest, { params: { id: "invalid" } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ message: "Invalid order status ID" });
    });
  });
});
