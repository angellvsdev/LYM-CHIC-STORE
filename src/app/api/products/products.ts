import { Category } from '@/lib/utils/validation/schemas';
import { Product,  } from './product';

export const categoriesMock: Category[] = [
    {
        id: '1',
        name: 'Calzado Deportivo',
        description: 'Encuentra el mejor calzado para tus actividades deportivas',
        image: '/images/categories/shoes.jpg',
        featured: true
    },
    {
        id: '2',
        name: 'Ropa Deportiva',
        description: 'La mejor ropa para tu entrenamiento',
        image: '/images/categories/clothing.jpg',
        featured: true
    },
    {
        id: '3',
        name: 'Accesorios',
        description: 'Complementa tu outfit deportivo',
        image: '/images/categories/accessories.jpg',
        featured: true
    },
    {
        id: '4',
        name: 'Equipamiento',
        description: 'Todo el equipo necesario para tu deporte favorito',
        image: '/images/categories/equipment.jpg',
        featured: true
    }
];

export const featuredProducts: Product[] = [
    {
        id: '1',
        name: 'Nike Running Shoe',
        price: 69.99,
        description: 'Crossing hardwood comfort with off-court flair. 80s-inspired construction.',
        category: '1',
        image: 'https://cdn3d.iconscout.com/3d/premium/thumb/svg-file-3d-icon-download-in-png-blend-fbx-gltf-formats--document-format-art-and-design-pack-development-icons-5410015.png',
        color: 'BLACK/WHITE',
        size: 'EU38',
        featured: true
    },
    {
        id: '2',
        name: 'Adidas Training Shirt',
        price: 29.99,
        description: 'Comfortable training shirt with moisture-wicking technology',
        category: '2',
        image: 'https://cdn3d.iconscout.com/3d/premium/thumb/svg-file-3d-icon-download-in-png-blend-fbx-gltf-formats--document-format-art-and-design-pack-development-icons-5410015.png',
        color: 'BLUE',
        size: 'M',
        featured: true
    },
    // ... más productos destacados por categoría
];