import { NextRequest } from "next/server";
import { POST, PUT, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Admin Categories API", () => {
  let mockRequest: NextRequest;
  let mockAdminUser: User;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock admin user
    mockAdminUser = {
      user_id: 1,
      name: "Admin User",
      email_address: "admin@example.com",
      phone_number: "1234567890",
      registration_date: new Date(),
      role: "admin",
    };

    // Setup mock request
    mockRequest = {
      nextUrl: new URL("http://localhost:3000/api/categories/admin"),
      json: jest.fn(),
    } as unknown as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockAdminUser,
    });
  });

  describe("POST /api/categories/admin", () => {
    it("should create a new category", async () => {
      // Mock request body
      const categoryData = {
        category_name: "New Category",
        category_description: "New Description",
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(categoryData);

      // Mock prisma response
      (prisma.category.create as jest.Mock).mockResolvedValue({
        category_id: 1,
        ...categoryData,
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        category_id: 1,
        ...categoryData,
      });
    });

    it("should return 403 if user is not admin", async () => {
      // Mock non-admin user
      (getIronSession as jest.Mock).mockResolvedValue({
        user: {
          ...mockAdminUser,
          role: "user",
        },
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({ message: "Forbidden" });
    });
  });

  describe("PUT /api/categories/admin", () => {
    it("should update a category", async () => {
      // Mock request body and query params
      const categoryData = {
        category_name: "Updated Category",
        category_description: "Updated Description",
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(categoryData);
      mockRequest.nextUrl.searchParams.set("id", "1");

      // Mock prisma response
      (prisma.category.update as jest.Mock).mockResolvedValue({
        category_id: 1,
        ...categoryData,
      });

      const response = await PUT(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        category_id: 1,
        ...categoryData,
      });
    });

    it("should return 400 if category ID is missing", async () => {
      const response = await PUT(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ message: "Category ID is required" });
    });
  });

  describe("DELETE /api/categories/admin", () => {
    it("should delete a category", async () => {
      // Mock query params
      mockRequest.nextUrl.searchParams.set("id", "1");

      // Mock prisma response
      (prisma.category.delete as jest.Mock).mockResolvedValue({});

      const response = await DELETE(mockRequest);

      expect(response.status).toBe(204);
    });

    it("should return 400 if category ID is missing", async () => {
      const response = await DELETE(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ message: "Category ID is required" });
    });
  });
});
