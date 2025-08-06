import { axiosi } from '../../config/axios';

// Get all products with filtering, sorting, and pagination
export const fetchProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        // Add pagination
        if (filters.pagination) {
            params.append('page', filters.pagination.page);
            params.append('limit', filters.pagination.limit);
        }

        // Add sorting
        if (filters.sort) {
            params.append('sortBy', filters.sort.sort);
            params.append('sortOrder', filters.sort.order);
        }

        // Add filters
        if (filters.category) {
            params.append('category', filters.category);
        }
        if (filters.brand) {
            params.append('brand', filters.brand);
        }
        if (filters.minPrice) {
            params.append('minPrice', filters.minPrice);
        }
        if (filters.maxPrice) {
            params.append('maxPrice', filters.maxPrice);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }

        const response = await axiosi.get(`/products?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching products' };
    }
};

// Get product by ID
export const fetchProductById = async (id) => {
    try {
        const response = await axiosi.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching product' };
    }
};

// Create new product with image upload
export const createProduct = async (productData) => {
    try {
        const response = await axiosi.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating product' };
    }
};

// Update product with image upload
export const updateProduct = async (id, productData) => {
    try {
        const response = await axiosi.patch(`/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating product' };
    }
};

// Delete product
export const deleteProduct = async (id) => {
    try {
        const response = await axiosi.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error deleting product' };
    }
};

// Get products by category
export const fetchProductsByCategory = async (categoryId) => {
    try {
        const response = await axiosi.get(`/products/category/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching products by category' };
    }
};

// Get products by brand
export const fetchProductsByBrand = async (brandId) => {
    try {
        const response = await axiosi.get(`/products/brand/${brandId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching products by brand' };
    }
};
