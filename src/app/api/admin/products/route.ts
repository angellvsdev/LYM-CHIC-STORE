import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Product, ProductFilters, PaginatedResponse } from '@/types/admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const priceFrom = searchParams.get('priceFrom');
        const priceTo = searchParams.get('priceTo');

        const skip = (page - 1) * limit;

        // Build where clause for filtering
        const where: any = {};
        
        if (category) {
            where.categoryId = category;
        }
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (priceFrom || priceTo) {
            where.price = {};
            if (priceFrom) {
                where.price.gte = parseFloat(priceFrom);
            }
            if (priceTo) {
                where.price.lte = parseFloat(priceTo);
            }
        }

        // Get products with pagination
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    name: 'asc'
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        // Transform data for frontend
        const transformedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            category: {
                id: product.categoryId,
                name: product.category.name
            },
            price: product.price,
            stock: 0, // Default since not in schema
            status: 'active' as const,
            image: product.image || '',
            images: [product.image || ''],
            createdAt: new Date().toISOString(), // Default since not in schema
            updatedAt: new Date().toISOString(), // Default since not in schema
            size: product.size,
            color: product.color,
            featured: product.featured || false
        }));

        const response = {
            data: transformedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };

        return NextResponse.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            name, 
            description, 
            categoryId, 
            price,
            size,
            color,
            image,
            featured
        } = body;

        // Basic validations
        const hasName = typeof name === 'string' && name.trim().length > 0;
        const hasDescription = typeof description === 'string' && description.trim().length > 0;
        const hasCategoryId = typeof categoryId === 'string' && categoryId.trim().length > 0;
        const hasPrice = price !== undefined && price !== null && `${price}`.trim().length > 0;

        if (!hasName || !hasDescription || !hasCategoryId || !hasPrice) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'All required fields must be present' 
                },
                { status: 400 }
            );
        }

        const parsedPrice = typeof price === 'number' ? price : parseFloat(price);
        if (!Number.isFinite(parsedPrice)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid price'
                },
                { status: 400 }
            );
        }

        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true }
        });

        if (!categoryExists) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category not found'
                },
                { status: 400 }
            );
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                name,
                description,
                categoryId,
                price: parsedPrice,
                size: size || null,
                color: color || null,
                image: image || '',
                featured: Boolean(featured)
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}


