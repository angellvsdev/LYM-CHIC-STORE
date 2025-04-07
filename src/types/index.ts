import { z } from "zod";

export interface User {
  user_id: number;
  name: string;
  phone_number: string;
  email_address: string;
  password?: string; // La contraseña no siempre se incluirá (ej: en la respuesta de obtener un usuario)
  registration_date: Date;
  role: string; // El rol es obligatorio
}

// Tipo para la respuesta del cliente (sin el rol)
export interface PublicUser {
  user_id: number;
  name: string;
  phone_number: string;
  email_address: string;
  registration_date: Date;
}

export interface Category {
  category_id: number;
  category_name: string;
  category_description?: string; // La descripción es opcional
}

export interface Product {
  product_id: number;
  name: string;
  description?: string; // La descripción es opcional
  price: number;
  category_id: number;
}

export interface Order {
  order_id: number;
  order_number: string;
  user_id: number;
  order_date: Date;
  order_status_id: number;
  delivery_method: string;
}

export interface OrderDetail {
  order_detail_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface OrderStatus {
  order_status_id: number;
  status_name: string;
}

export interface OrderStatusHistory {
  order_status_history_id: number;
  order_id: number;
  order_status_id: number;
  change_date: Date;
  notes?: string; // Notas es opcional
}

// Validaciones con Zod

export const UserSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  phone_number: z.string().min(1).max(20),
  email_address: z.string().email(),
  password: z.string().min(8).max(255).optional(), // La contraseña es opcional para algunas operaciones
  registration_date: z.date(),
  role: z.string().min(1).max(20), // El rol es obligatorio
});

export const PublicUserSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  phone_number: z.string().min(1).max(20),
  email_address: z.string().email(),
  registration_date: z.date(),
});

export const CategorySchema = z.object({
  category_id: z.number().int().positive(),
  category_name: z.string().min(1).max(255),
  category_description: z.string().optional(),
});

export const ProductSchema = z.object({
  product_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  category_id: z.number().int().positive(),
});

export const OrderSchema = z.object({
  order_id: z.number().int().positive(),
  order_number: z.string().min(1).max(20),
  user_id: z.number().int().positive(),
  order_date: z.date(),
  order_status_id: z.number().int().positive(),
  delivery_method: z.string().min(1).max(50),
});

export const OrderDetailSchema = z.object({
  order_detail_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
});

export const OrderStatusSchema = z.object({
  order_status_id: z.number().int().positive(),
  status_name: z.string().min(1).max(50),
});

export const OrderStatusHistorySchema = z.object({
  order_status_history_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  order_status_id: z.number().int().positive(),
  change_date: z.date(),
  notes: z.string().optional(),
});
