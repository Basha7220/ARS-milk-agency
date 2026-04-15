/**
 * SERVICE MANAGEMENT SYSTEM
 * Handles CRUD operations for services.
 */

const Services = {
    STORAGE_KEY: 'ars_services',
    
    INITIAL_DATA: [
        {
            id: 's1',
            title: 'Daily Milk Delivery',
            description: 'Fresh milk delivered to your doorstep every morning before 7 AM.',
            icon: 'truck'
        },
        {
            id: 's2',
            title: 'Bulk Supply',
            description: 'Specialized supply for events, hotels, and retail stores at wholesale prices.',
            icon: 'package-check'
        },
        {
            id: 's3',
            title: 'Subscription Plans',
            description: 'Save up to 15% with our monthly and yearly dairy subscription packages.',
            icon: 'calendar-check'
        }
    ],

    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            this.saveAll(this.INITIAL_DATA);
            return this.INITIAL_DATA;
        }
        return JSON.parse(data);
    },

    saveAll(services) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(services));
    },

    add(service) {
        const services = this.getAll();
        const newService = {
            ...service,
            id: 'serv_' + Date.now()
        };
        services.push(newService);
        this.saveAll(services);
        return newService;
    },

    update(id, updatedData) {
        const services = this.getAll();
        const index = services.findIndex(s => s.id === id);
        if (index !== -1) {
            services[index] = { ...services[index], ...updatedData };
            this.saveAll(services);
            return services[index];
        }
        return null;
    },

    delete(id) {
        const services = this.getAll();
        const filtered = services.filter(s => s.id !== id);
        this.saveAll(filtered);
    }
};

window.Services = Services;
