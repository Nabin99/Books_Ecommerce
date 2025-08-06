import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Slider,
    Stack,
    Chip,
    Pagination,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
    IconButton
} from '@mui/material';
import {
    Search,
    FilterList,
    Clear,
    ExpandMore,
    Sort
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProductsAsync,
    setFilters,
    clearFilters,
    setPage,
    selectProducts,
    selectProductLoading,
    selectProductError,
    selectProductPagination,
    selectProductFilters
} from '../ProductSlice';
import { fetchBrandsAsync, selectBrands } from '../../brands/BrandSlice';
import { fetchCategoriesAsync, selectCategories } from '../../categories/CategoriesSlice';
import { ProductCard } from './ProductCard';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { toast } from 'react-toastify';

const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const loading = useSelector(selectProductLoading);
    const error = useSelector(selectProductError);
    const pagination = useSelector(selectProductPagination);
    const filters = useSelector(selectProductFilters);
    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000]);
    const [selectedCategories, setSelectedCategories] = useState(filters.category ? [filters.category] : []);
    const [selectedBrands, setSelectedBrands] = useState(filters.brand ? [filters.brand] : []);
    const [sortBy, setSortBy] = useState(filters.sortBy || 'createdAt');
    const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'desc');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        dispatch(fetchBrandsAsync());
        dispatch(fetchCategoriesAsync());
    }, [dispatch]);

    // Handle wishlist status changes
    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            dispatch(resetWishlistItemAddStatus());
        } else if (wishlistItemAddStatus === 'rejected') {
            toast.error('Error adding to wishlist');
            dispatch(resetWishlistItemAddStatus());
        }
    }, [wishlistItemAddStatus, dispatch]);

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            dispatch(resetWishlistItemDeleteStatus());
        } else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error('Error removing from wishlist');
            dispatch(resetWishlistItemDeleteStatus());
        }
    }, [wishlistItemDeleteStatus, dispatch]);

    useEffect(() => {
        const currentFilters = {
            search: searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            category: selectedCategories.length > 0 ? selectedCategories[0] : '',
            brand: selectedBrands.length > 0 ? selectedBrands[0] : '',
            sortBy,
            sortOrder,
            pagination: {
                page: pagination.page,
                limit: pagination.limit
            }
        };

        dispatch(setFilters(currentFilters));
        dispatch(fetchProductsAsync(currentFilters));
    }, [searchTerm, priceRange, selectedCategories, selectedBrands, sortBy, sortOrder, pagination.page]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        dispatch(setPage(1));
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
        dispatch(setPage(1));
    };

    const handleCategoryChange = (categoryId) => {
        const newCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        setSelectedCategories(newCategories);
        dispatch(setPage(1));
    };

    const handleBrandChange = (brandId) => {
        const newBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId];
        setSelectedBrands(newBrands);
        dispatch(setPage(1));
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        dispatch(setPage(1));
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
        dispatch(setPage(1));
    };

    const handlePageChange = (event, page) => {
        dispatch(setPage(page));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setPriceRange([0, 1000]);
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSortBy('createdAt');
        setSortOrder('desc');
        dispatch(clearFilters());
        dispatch(setPage(1));
    };

    const handleApplyFilters = () => {
        const currentFilters = {
            search: searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            category: selectedCategories.length > 0 ? selectedCategories[0] : '',
            brand: selectedBrands.length > 0 ? selectedBrands[0] : '',
            sortBy,
            sortOrder,
            pagination: {
                page: 1,
                limit: pagination.limit
            }
        };

        dispatch(setFilters(currentFilters));
        dispatch(setPage(1));
        dispatch(fetchProductsAsync(currentFilters));
    };

    const handleAddRemoveFromWishlist = (e, productId) => {
        e.stopPropagation();

        if (!loggedInUser) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        const isInWishlist = wishlistItems.some((item) => item.product._id === productId);

        if (isInWishlist) {
            // Remove from wishlist
            const wishlistItem = wishlistItems.find((item) => item.product._id === productId);
            if (wishlistItem) {
                dispatch(deleteWishlistItemByIdAsync(wishlistItem._id));
            }
        } else {
            // Add to wishlist
            const data = { user: loggedInUser._id, product: productId };
            dispatch(createWishlistItemAsync(data));
        }
    };

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Products
            </Typography>

            {/* Search and Sort Bar */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <TextField
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ minWidth: 250 }}
                    />

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                            <MenuItem value="createdAt">Newest</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 100 }}>
                        <InputLabel>Order</InputLabel>
                        <Select value={sortOrder} onChange={handleSortOrderChange} label="Order">
                            <MenuItem value="desc">Desc</MenuItem>
                            <MenuItem value="asc">Asc</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Clear />}
                        onClick={handleClearFilters}
                        color="error"
                    >
                        Clear
                    </Button>
                </Stack>
            </Paper>

            {/* Filters Panel */}
            {showFilters && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Filters
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Price Range */}
                        <Grid item xs={12} md={6}>
                            <Typography gutterBottom>Price Range</Typography>
                            <Slider
                                value={priceRange}
                                onChange={handlePriceChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={1000}
                                step={10}
                            />
                            <Typography variant="caption">
                                ${priceRange[0]} - ${priceRange[1]}
                            </Typography>
                        </Grid>

                        {/* Categories */}
                        <Grid item xs={12} md={6}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>Categories</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {categories.map((category) => (
                                            <FormControlLabel
                                                key={category._id}
                                                control={
                                                    <Checkbox
                                                        checked={selectedCategories.includes(category._id)}
                                                        onChange={() => handleCategoryChange(category._id)}
                                                    />
                                                }
                                                label={category.name}
                                            />
                                        ))}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* Brands */}
                        <Grid item xs={12} md={6}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>Brands</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {brands.map((brand) => (
                                            <FormControlLabel
                                                key={brand._id}
                                                control={
                                                    <Checkbox
                                                        checked={selectedBrands.includes(brand._id)}
                                                        onChange={() => handleBrandChange(brand._id)}
                                                    />
                                                }
                                                label={brand.name}
                                            />
                                        ))}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                        <Button variant="outlined" onClick={handleClearFilters}>
                            Clear All
                        </Button>
                    </Stack>
                </Paper>
            )}

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || searchTerm) && (
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Active Filters:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {searchTerm && (
                            <Chip
                                label={`Search: ${searchTerm}`}
                                onDelete={() => setSearchTerm('')}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {selectedCategories.map(categoryId => {
                            const category = categories.find(c => c._id === categoryId);
                            return category ? (
                                <Chip
                                    key={categoryId}
                                    label={`Category: ${category.name}`}
                                    onDelete={() => handleCategoryChange(categoryId)}
                                    color="secondary"
                                    variant="outlined"
                                />
                            ) : null;
                        })}
                        {selectedBrands.map(brandId => {
                            const brand = brands.find(b => b._id === brandId);
                            return brand ? (
                                <Chip
                                    key={brandId}
                                    label={`Brand: ${brand.name}`}
                                    onDelete={() => handleBrandChange(brandId)}
                                    color="info"
                                    variant="outlined"
                                />
                            ) : null;
                        })}
                    </Stack>
                </Paper>
            )}

            {/* Products Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                <ProductCard
                                    id={product._id}
                                    title={product.title || product.name}
                                    price={product.price}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand?.name || product.brand}
                                    stockQuantity={product.stockQuantity}
                                    discountPercentage={product.discountPercentage}
                                    averageRating={product.averageRating}
                                    reviewCount={product.reviewCount}
                                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                    isWishlistCard={false}
                                    isAdminCard={false}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={pagination.pages}
                                page={pagination.page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}

                    {/* Results Info */}
                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} results
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ProductList;
