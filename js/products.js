/**
 * PRODUCT MANAGEMENT SYSTEM
 * Handles CRUD operations for products using LocalStorage.
 */

const Products = {
    STORAGE_KEY: 'ars_products',
    
    // Initial Seed Data
    INITIAL_DATA: [
        {
            id: 'p1',
            name: 'Pure Full Cream Milk',
            price: 65,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1550583724-125581dc308d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            isNew: true,
            isBestSeller: true,
            createdAt: Date.now()
        },
        {
            id: 'p2',
            name: 'Artisan Cow Ghee',
            price: 550,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1589114934421-3d91940057fd?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            isNew: false,
            isBestSeller: true,
            createdAt: Date.now()
        },
        {
            id: 'p3',
            name: 'Belgian Chocolate Ice Cream',
            price: 250,
            category: 'Ice Cream',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            isNew: true,
            isBestSeller: false,
            createdAt: Date.now()
        },
        {
            id: 'p4',
            name: 'Fresh Paneer (Cottage Cheese)',
            price: 180,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1596450514735-3129524e4d6d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            isNew: false,
            isBestSeller: true,
            createdAt: Date.now()
        },
        {
            id: 'p5',
            name: 'Greek Yogurt (Natural)',
            price: 120,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            isNew: true,
            isBestSeller: false,
            createdAt: Date.now()
        },
        {
            id: 'p6',
            name: 'Rose Lassi',
            price: 45,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed6bb6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            isNew: false,
            isBestSeller: false,
            createdAt: Date.now()
        }
    ],

    // Get all products
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            // Seed initial data if empty
            this.saveAll(this.INITIAL_DATA);
            return this.INITIAL_DATA;
        }
        return JSON.parse(data);
    },

    // Save all products to storage
    saveAll(products) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    },

    // Add new product
    add(product) {
        const products = this.getAll();
        const newProduct = {
            ...product,
            id: 'prod_' + Date.now(),
            createdAt: Date.now()
        };
        products.push(newProduct);
        this.saveAll(products);
        return newProduct;
    },

    // Update product
    update(id, updatedData) {
        const products = this.getAll();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            this.saveAll(products);
            return products[index];
        }
        return null;
    },

    // Delete product
    delete(id) {
        const products = this.getAll();
        const filtered = products.filter(p => p.id !== id);
        this.saveAll(filtered);
    },

    // Get product by ID
    getById(id) {
        const products = this.getAll();
        return products.find(p => p.id === id);
    },

    // Filter products
    filter(criteria = {}) {
        let products = this.getAll();
        
        if (criteria.category && criteria.category !== 'All') {
            products = products.filter(p => p.category === criteria.category);
        }
        
        if (criteria.search) {
            const query = criteria.search.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
        }
        
        if (criteria.isNew) {
            products = products.filter(p => p.isNew);
        }
        
        if (criteria.isBestSeller) {
            products = products.filter(p => p.isBestSeller);
        }
        
        return products;
    }
};

window.Products = Products;
