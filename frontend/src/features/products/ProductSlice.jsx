import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductsByCategory,
    fetchProductsByBrand
} from './ProductApi';

// Async thunks
export const fetchProductsAsync = createAsyncThunk(
    'products/fetchProducts',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await fetchProducts(filters);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProductByIdAsync = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchProductById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createProductAsync = createAsyncThunk(
    'products/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await createProduct(productData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateProductAsync = createAsyncThunk(
    'products/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await updateProduct(id, productData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteProductAsync = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteProduct(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProductsByCategoryAsync = createAsyncThunk(
    'products/fetchProductsByCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await fetchProductsByCategory(categoryId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProductsByBrandAsync = createAsyncThunk(
    'products/fetchProductsByBrand',
    async (brandId, { rejectWithValue }) => {
        try {
            const response = await fetchProductsByBrand(brandId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    products: [],
    currentProduct: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 12,
        pages: 1
    },
    filters: {
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },
    status: 'idle',
    error: null,
    loading: false,
    isFilterOpen: false
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        toggleFilters: (state) => {
            state.isFilterOpen = !state.isFilterOpen;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProductsAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.products = action.payload.products || action.payload;
                if (action.payload.pagination) {
                    state.pagination = action.payload.pagination;
                }
            })
            .addCase(fetchProductsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch products';
            })
            // Fetch Product by ID
            .addCase(fetchProductByIdAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductByIdAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch product';
            })
            // Create Product
            .addCase(createProductAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(createProductAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.products.unshift(action.payload);
            })
            .addCase(createProductAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create product';
            })
            // Update Product
            .addCase(updateProductAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                if (state.currentProduct && state.currentProduct._id === action.payload._id) {
                    state.currentProduct = action.payload;
                }
            })
            .addCase(updateProductAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update product';
            })
            // Delete Product
            .addCase(deleteProductAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.products = state.products.filter(p => p._id !== action.payload.id);
            })
            .addCase(deleteProductAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete product';
            })
            // Fetch Products by Category
            .addCase(fetchProductsByCategoryAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByCategoryAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductsByCategoryAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch products by category';
            })
            // Fetch Products by Brand
            .addCase(fetchProductsByBrandAsync.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByBrandAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductsByBrandAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch products by brand';
            });
    }
});

export const {
    clearCurrentProduct,
    setFilters,
    clearFilters,
    setPage,
    clearError,
    toggleFilters
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductStatus = (state) => state.products.status;
export const selectProductLoading = (state) => state.products.loading;
export const selectProductError = (state) => state.products.error;
export const selectProductPagination = (state) => state.products.pagination;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductIsFilterOpen = (state) => state.products.isFilterOpen;

// Additional exports for backward compatibility
export const selectSelectedProduct = selectCurrentProduct;
export const selectProductFetchStatus = selectProductStatus;
export const selectProductUpdateStatus = selectProductStatus;
export const clearSelectedProduct = clearCurrentProduct;
export const resetProductFetchStatus = clearError;
export const resetProductUpdateStatus = clearError;
export const updateProductByIdAsync = updateProductAsync;

export default productSlice.reducer;
