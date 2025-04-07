import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Orders API", () => {
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
      nextUrl: new URL("http://localhost:3000/api/orders"),
      json: jest.fn().mockResolvedValue({ delivery_method: "STANDARD" }),
    } as unknown as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("GET /api/orders", () => {
    it("should return orders with pagination", async () => {
      // Add query parameters
      mockRequest.nextUrl.searchParams.set("page", "1");
      mockRequest.nextUrl.searchParams.set("limit", "10");
      mockRequest.nextUrl.searchParams.set("sortBy", "order_date");
      mockRequest.nextUrl.searchParams.set("sortOrder", "desc");
      mockRequest.nextUrl.searchParams.set("deliveryMethod", "STANDARD");

      // Mock prisma responses
      (prisma.order.findMany as jest.Mock).mockResolvedValue([
        {
          order_id: 1,
          user_id: 1,
          order_number: "ORD-123",
          order_date: new Date(),
          order_status_id: 1,
          delivery_method: "STANDARD",
          orderStatus: {
            order_status_id: 1,
            status_name: "PENDING",
          },
          order_details: [],
          user: {
            user_id: 1,
            name: "Test User",
          },
        },
      ]);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        data: [
          {
            order_id: 1,
            user_id: 1,
            order_number: "ORD-123",
            order_date: expect.any(String),
            order_status_id: 1,
            delivery_method: "STANDARD",
            orderStatus: {
              order_status_id: 1,
              status_name: "PENDING",
            },
            order_details: [],
            user: {
              user_id: 1,
              name: "Test User",
            },
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    }, 10000); // Increase timeout to 10 seconds

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthenticated session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: null,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: "Unauthorized" });
    });

    it("should filter orders by status", async () => {
      // Add query parameters
      mockRequest.nextUrl.searchParams.set("status", "1");
      mockRequest.nextUrl.searchParams.set("sortBy", "order_date");
      mockRequest.nextUrl.searchParams.set("sortOrder", "desc");
      mockRequest.nextUrl.searchParams.set("deliveryMethod", "STANDARD");

      // Mock prisma responses
      (prisma.order.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.order.count as jest.Mock).mockResolvedValue(0);

      await GET(mockRequest);

      // Verify prisma was called with correct filter
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            order_status_id: 1,
          }),
        })
      );
    }, 10000); // Increase timeout to 10 seconds
  });

  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      // Mock prisma response
      (prisma.order.create as jest.Mock).mockResolvedValue({
        order_id: 1,
        user_id: mockUser.user_id,
        order_number: "ORD-123",
        order_date: new Date(),
        order_status_id: 1,
        delivery_method: "STANDARD",
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        order_id: 1,
        user_id: mockUser.user_id,
        order_number: expect.any(String),
        order_date: expect.any(String),
        order_status_id: 1,
        delivery_method: "STANDARD",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      // Mock unauthenticated session
      (getIronSession as jest.Mock).mockResolvedValue({
        user: null,
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: "Unauthorized" });
    });
  });
});
