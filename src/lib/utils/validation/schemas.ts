import { z } from "zod";
import {
  UserSchema,
  CategorySchema,
  ProductSchema,
  OrderSchema,
  OrderStatusSchema,
} from "@/types";

export const CreateUserSchema = UserSchema.omit({
  user_id: true,
  role: true,
  registration_date: true,
}).extend({
  password: z.string().min(8).max(255),
});

export const LoginUserSchema = UserSchema.omit({
  user_id: true,
  registration_date: true,
  name: true,
  phone_number: true,
  role: true,
}).extend({
  password: z.string().min(8).max(255),
});
//todo: add update user schema
export const UpdateUserSchema = UserSchema.omit({
  user_id: true,
  registration_date: true,
  password: true,
  role: true,
});

export const CreateCategorySchema = CategorySchema.omit({
  category_id: true,
}).extend({
  category_name: z.string().min(1).max(255),
  category_description: z.string().max(1000).optional(),
});

export const UpdateCategorySchema = CategorySchema.omit({
  category_id: true,
}).extend({
  category_name: z.string().min(1).max(255),
  category_description: z.string().max(1000).optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  product_id: true,
}).extend({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category_id: z.number().int().positive(),
});

export const UpdateProductSchema = ProductSchema.omit({
  product_id: true,
}).extend({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category_id: z.number().int().positive(),
});

export const CreateOrderSchema = OrderSchema.omit({
  order_id: true,
  order_number: true,
  order_date: true,
  order_status_id: true,
}).extend({
  delivery_method: z.string().min(1).max(50),
  order_details: z.array(
    z.object({
      product_id: z.number().int().positive(),
      quantity: z.number().int().positive(),
      unit_price: z.number().positive(),
    })
  ),
});

export const UpdateOrderSchema = z.object({
  order_status_id: z.number().int().positive(),
});

export const CreateOrderStatusSchema = OrderStatusSchema.omit({
  order_status_id: true,
}).extend({
  status_name: z.string().min(1).max(50),
});

export const UpdateOrderStatusSchema = OrderStatusSchema.omit({
  order_status_id: true,
}).extend({
  status_name: z.string().min(1).max(50),
});
