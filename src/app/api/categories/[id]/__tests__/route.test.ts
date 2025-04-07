import { NextRequest } from "next/server";
import { GET } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Category by ID API", () => {
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
      nextUrl: new URL("http://localhost:3000/api/categories/1"),
    } as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("GET /api/categories/[id]", () => {
    it("should return category by ID", async () => {
      // Mock prisma response
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({
        category_id: 1,
        category_name: "Test Category",
        category_description: "Test Description",
      });

      const response = await GET(mockRequest, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        category_id: 1,
        category_name: "Test Category",
        category_description: "Test Description",
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

    it("should return 404 if category is not found", async () => {
      // Mock prisma response
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await GET(mockRequest, { params: { id: "999" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ message: "Category not found" });
    });

    it("should return 400 if ID is not a number", async () => {
      const response = await GET(mockRequest, { params: { id: "invalid" } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ message: "Invalid category ID" });
    });
  });
});
