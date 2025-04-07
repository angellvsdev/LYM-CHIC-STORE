import { NextRequest } from "next/server";
import { GET } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Categories API", () => {
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
      nextUrl: new URL("http://localhost:3000/api/categories"),
    } as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("GET /api/categories", () => {
    it("should return categories with pagination", async () => {
      // Mock prisma responses
      (prisma.category.findMany as jest.Mock).mockResolvedValue([
        {
          category_id: 1,
          category_name: "Test Category",
          category_description: "Test Description",
        },
      ]);
      (prisma.category.count as jest.Mock).mockResolvedValue(1);

      // Add query parameters
      mockRequest.nextUrl.searchParams.set("page", "1");
      mockRequest.nextUrl.searchParams.set("limit", "10");

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        data: [
          {
            category_id: 1,
            category_name: "Test Category",
            category_description: "Test Description",
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

    it("should filter categories by search term", async () => {
      // Mock prisma responses
      (prisma.category.findMany as jest.Mock).mockResolvedValue([
        {
          category_id: 1,
          category_name: "Test Category",
          category_description: "Test Description",
        },
      ]);
      (prisma.category.count as jest.Mock).mockResolvedValue(1);

      // Add search parameter
      mockRequest.nextUrl.searchParams.set("search", "test");

      await GET(mockRequest);

      // Verify prisma was called with correct search parameters
      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                category_name: expect.objectContaining({
                  contains: "test",
                  mode: "insensitive",
                }),
              }),
              expect.objectContaining({
                category_description: expect.objectContaining({
                  contains: "test",
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
