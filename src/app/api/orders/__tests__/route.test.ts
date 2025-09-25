import { NextRequest } from "next/server";
import { POST, GET } from "../route";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";

// Mock de getIronSession
jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

// Mock de prisma
jest.mock("@/lib/prisma/client", () => ({
  prisma: {
    order: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock de console.error
const originalConsoleError = console.error;
console.error = jest.fn();

describe("POST /api/orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restaurar console.error original
    console.error = originalConsoleError;
  });

  it("should create an order successfully", async () => {
    // Mock de la sesión del usuario
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "user",
      },
    });

    // Mock de la creación de la orden
    (prisma.order.create as jest.Mock).mockResolvedValue({
      order_id: 1,
      order_number: "ORD-123",
      user_id: 1,
      order_date: new Date(),
      order_status_id: 1,
      delivery_method: "STANDARD",
    });

    // Crear una petición de prueba
    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delivery_method: "STANDARD",
      }),
    });

    // Ejecutar la función POST
    const response = await POST(req);
    const data = await response.json();

    // Verificar la respuesta
    expect(response.status).toBe(201);
    expect(data).toHaveProperty("order_id");
    expect(data).toHaveProperty("order_number");
    expect(data).toHaveProperty("user_id", 1);
    expect(data).toHaveProperty("delivery_method", "STANDARD");

    // Verificar que se llamó a prisma.order.create
    expect(prisma.order.create).toHaveBeenCalledTimes(1);
    expect(prisma.order.create).toHaveBeenCalledWith({
      data: {
        user_id: 1,
        order_number: expect.stringMatching(/^ORD-\d+$/),
        order_date: expect.any(Date),
        order_status_id: 1,
        delivery_method: "STANDARD",
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    // Mock de la sesión sin usuario
    (getIronSession as jest.Mock).mockResolvedValue({
      user: null,
    });

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delivery_method: "STANDARD",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: "Unauthorized" });
  });

  it("should return 403 if user is not a regular user", async () => {
    // Mock de la sesión con un usuario admin
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "admin",
      },
    });

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delivery_method: "STANDARD",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({ message: "Forbidden" });
  });

  it("should handle database errors", async () => {
    // Mock de la sesión del usuario
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "user",
      },
    });

    // Mock de un error de la base de datos
    (prisma.order.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delivery_method: "STANDARD",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: "Internal Server Error" });
    expect(console.error).toHaveBeenCalledWith(
      "Error creating order:",
      expect.any(Error)
    );
  });
});

describe("GET /api/orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all orders for admin user", async () => {
    // Mock de la sesión del usuario admin
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "admin",
      },
    });

    // Mock de la lista de órdenes
    const mockOrders = [
      {
        order_id: 1,
        order_number: "ORD-123",
        user_id: 1,
        order_date: new Date(),
        order_status_id: 1,
        delivery_method: "STANDARD",
        orderStatus: {
          status_id: 1,
          status_name: "PENDING",
        },
      },
      {
        order_id: 2,
        order_number: "ORD-124",
        user_id: 1,
        order_date: new Date(),
        order_status_id: 2,
        delivery_method: "EXPRESS",
        orderStatus: {
          status_id: 2,
          status_name: "COMPLETED",
        },
      },
    ];

    (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOrders);
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 1,
      },
      include: {
        orderStatus: true,
      },
      orderBy: {
        order_date: "desc",
      },
    });
  });

  it("should return a specific order by ID", async () => {
    // Mock de la sesión del usuario admin
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "admin",
      },
    });

    // Mock de la orden específica
    const mockOrder = {
      order_id: 1,
      order_number: "ORD-123",
      user_id: 1,
      order_date: new Date(),
      order_status_id: 1,
      delivery_method: "STANDARD",
      order_details: [
        {
          order_detail_id: 1,
          product_id: 1,
          quantity: 2,
          unit_price: 29.99,
        },
      ],
      orderStatus: {
        status_id: 1,
        status_name: "PENDING",
      },
    };

    (prisma.order.findFirst as jest.Mock).mockResolvedValue(mockOrder);

    const req = new NextRequest("http://localhost:3000/api/orders?id=1", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOrder);
    expect(prisma.order.findFirst).toHaveBeenCalledWith({
      where: {
        order_id: 1,
        user_id: 1,
      },
      include: {
        order_details: true,
        orderStatus: true,
      },
    });
  });

  it("should return 404 if order not found", async () => {
    // Mock de la sesión del usuario admin
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "admin",
      },
    });

    // Mock de orden no encontrada
    (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/orders?id=999", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ message: "Order not found" });
  });

  it("should return 401 if user is not authenticated", async () => {
    // Mock de la sesión sin usuario
    (getIronSession as jest.Mock).mockResolvedValue({
      user: null,
    });

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: "Unauthorized" });
  });

  it("should return 403 if user is not an admin", async () => {
    // Mock de la sesión con un usuario regular
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "user",
      },
    });

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({ message: "Forbidden" });
  });

  it("should handle database errors", async () => {
    // Mock de la sesión del usuario admin
    (getIronSession as jest.Mock).mockResolvedValue({
      user: {
        user_id: 1,
        role: "admin",
      },
    });

    // Mock de un error de la base de datos
    (prisma.order.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const req = new NextRequest("http://localhost:3000/api/orders", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: "Internal Server Error" });
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching orders:",
      expect.any(Error)
    );
  });
});
