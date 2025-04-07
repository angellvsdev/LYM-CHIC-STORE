import { NextRequest } from "next/server";
import { GET } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    orderStatus: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Order Statuses API", () => {
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
      nextUrl: new URL("http://localhost:3000/api/order-statuses"),
    } as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("GET /api/order-statuses", () => {
    it("should return order statuses with pagination", async () => {
      // Mock prisma responses
      (prisma.orderStatus.findMany as jest.Mock).mockResolvedValue([
        {
          order_status_id: 1,
          status_name: "PENDING",
          status_description: "Order is pending",
        },
      ]);
      (prisma.orderStatus.count as jest.Mock).mockResolvedValue(1);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        data: [
          {
            order_status_id: 1,
            status_name: "PENDING",
            status_description: "Order is pending",
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

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

    it("should filter order statuses by search term", async () => {
      const searchTerm = "pending";
      mockRequest.nextUrl.searchParams.set("search", searchTerm);

      // Mock prisma responses
      (prisma.orderStatus.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.orderStatus.count as jest.Mock).mockResolvedValue(0);

      await GET(mockRequest);

      // Verify prisma was called with correct search parameters
      expect(prisma.orderStatus.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                status_name: expect.objectContaining({
                  contains: searchTerm,
                  mode: "insensitive",
                }),
              }),
              expect.objectContaining({
                status_description: expect.objectContaining({
                  contains: searchTerm,
                  mode: "insensitive",
                }),
              }),
            ]),
          }),
        })
      );
    });
  });
});
