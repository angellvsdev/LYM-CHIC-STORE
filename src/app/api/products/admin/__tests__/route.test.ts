import { NextRequest } from "next/server";
import { POST } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { User } from "@/types";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      create: jest.fn(),
    },
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

describe("Products Admin API", () => {
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
      role: "admin",
    };

    // Setup mock request
    mockRequest = {
      nextUrl: new URL("http://localhost:3000/api/products/admin"),
      json: jest.fn().mockResolvedValue({
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
        stock_quantity: 100,
        category_id: 1,
        image_url: "https://example.com/image.jpg",
      }),
    } as unknown as NextRequest;

    // Mock getIronSession
    (getIronSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("POST /api/products/admin", () => {
    it("should create a new product", async () => {
      // Mock prisma response
      (prisma.product.create as jest.Mock).mockResolvedValue({
        product_id: 1,
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
        stock_quantity: 100,
        category_id: 1,
        image_url: "https://example.com/image.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        product_id: 1,
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
        stock_quantity: 100,
        category_id: 1,
        image_url: "https://example.com/image.jpg",
        created_at: expect.any(String),
        updated_at: expect.any(String),
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

    it("should return 403 if user is not admin", async () => {
      // Mock non-admin user
      (getIronSession as jest.Mock).mockResolvedValue({
        user: { ...mockUser, role: "user" },
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({ message: "Forbidden" });
    });
  });
});
