import { z } from "zod";

// User
export const UserSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  phone_number: z.string().min(1).max(20),
  email_address: z.string().email(),
  password: z.string().min(8).max(255),
  registration_date: z.date(),
  role: z.string().min(1).max(20),
});

export const CreateUserSchema = UserSchema.omit({
  user_id: true,
  registration_date: true,
  role: true,
});

export const UpdateUserSchema = UserSchema.omit({
  user_id: true,
  registration_date: true,
  password: true,
  role: true,
});

export const LoginUserSchema = z.object({
  email_address: z.string().email(),
  password: z.string().min(8).max(255),
});

// Category
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
  image: z.string(),
  featured: z.boolean(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
}).extend({
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
  image: z.string(),
  featured: z.boolean().optional(),
});

export const UpdateCategorySchema = CategorySchema.omit({
  id: true,
}).partial();

// Product
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  description: z.string(),
  image: z.string(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  categoryId: z.string().uuid(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
}).extend({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  description: z.string(),
  image: z.string(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  categoryId: z.string().uuid(),
});

export const UpdateProductSchema = ProductSchema.omit({
  id: true,
}).partial();

// Order
export const OrderSchema = z.object({
  order_id: z.number().int().positive(),
  order_number: z.string().min(1).max(50),
  user_id: z.number().int().positive(),
  order_date: z.date(),
  order_status_id: z.number().int().positive(),
  delivery_method: z.string().min(1).max(50),
});

export const CreateOrderSchema = OrderSchema.omit({
  order_id: true,
  order_number: true,
  order_date: true,
}).extend({
  user_id: z.number().int().positive(),
  order_status_id: z.number().int().positive(),
  delivery_method: z.string().min(1).max(50),
  order_details: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive(),
      unit_price: z.number().positive(),
    })
  ),
});

export const UpdateOrderSchema = z.object({
  order_status_id: z.number().int().positive(),
});

// OrderDetail
export const OrderDetailSchema = z.object({
  order_detail_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
});

// OrderStatus
export const OrderStatusSchema = z.object({
  order_status_id: z.number().int().positive(),
  status_name: z.string().min(1).max(50),
});

export const CreateOrderStatusSchema = OrderStatusSchema.omit({
  order_status_id: true,
});

export const UpdateOrderStatusSchema = OrderStatusSchema.omit({
  order_status_id: true,
});

// OrderStatusHistory
export const OrderStatusHistorySchema = z.object({
  order_status_history_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  order_status_id: z.number().int().positive(),
  change_date: z.date(),
  notes: z.string().optional(),
});

// Types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;

export type OrderDetail = z.infer<typeof OrderDetailSchema>;

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type CreateOrderStatus = z.infer<typeof CreateOrderStatusSchema>;
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

export type OrderStatusHistory = z.infer<typeof OrderStatusHistorySchema>;
