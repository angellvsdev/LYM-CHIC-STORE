export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
    size?: string;
    color?: string;
    featured?: boolean;
}

export type ProductCategory = {
    id: string;
    name: string;
    description: string;
    image: string;
    featured: boolean;
}