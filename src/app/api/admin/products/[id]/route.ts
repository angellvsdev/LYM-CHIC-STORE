import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: params.id
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

        if (!product) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Product not found' 
                },
                { status: 404 }
            );
        }

        // Transform data for frontend
        const transformedProduct = {
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
        };

        return NextResponse.json({
            success: true,
            data: transformedProduct
        });

    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        if (!name || !description || !categoryId || !price) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'All required fields must be present' 
                },
                { status: 400 }
            );
        }

        // Update product
        const product = await prisma.product.update({
            where: {
                id: params.id
            },
            data: {
                name,
                description,
                categoryId,
                price: parseFloat(price),
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
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: params.id
            }
        });

        if (!existingProduct) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Product not found' 
                },
                { status: 404 }
            );
        }

        // Prevent deleting products referenced by orders
        const referencedCount = await prisma.orderDetail.count({
            where: {
                product_id: params.id
            }
        });

        if (referencedCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cannot delete product because it is referenced by existing orders'
                },
                { status: 400 }
            );
        }

        // Delete product
        await prisma.product.delete({
            where: {
                id: params.id
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error' 
            },
            { status: 500 }
        );
    }
}
