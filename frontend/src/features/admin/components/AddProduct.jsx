import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Alert,
    CircularProgress,
    Card,
    CardMedia,
    IconButton
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createProductAsync, selectProductStatus } from '../../products/ProductSlice';
import { fetchBrandsAsync, selectBrands } from '../../brands/BrandSlice';
import { fetchCategoriesAsync, selectCategories } from '../../categories/CategoriesSlice';

const AddProduct = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productStatus = useSelector(selectProductStatus);
    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

    useEffect(() => {
        dispatch(fetchBrandsAsync());
        dispatch(fetchCategoriesAsync());
    }, [dispatch]);

    useEffect(() => {
        if (productStatus === 'fulfilled') {
            reset();
            setImagePreview(null);
            setImageFile(null);
            navigate('/admin/dashboard');
        } else if (productStatus === 'rejected') {
            setError('Failed to create product');
        }
    }, [productStatus, reset, navigate]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('category', data.category);
            formData.append('brand', data.brand);
            formData.append('stock', data.stock);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await dispatch(createProductAsync(formData)).unwrap();
        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Add New Product
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        {/* Product Name */}
                        <TextField
                            label="Product Name"
                            fullWidth
                            {...register('name', {
                                required: 'Product name is required',
                                minLength: { value: 3, message: 'Name must be at least 3 characters' }
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                        {/* Description */}
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            {...register('description', {
                                required: 'Description is required',
                                minLength: { value: 10, message: 'Description must be at least 10 characters' }
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        {/* Price */}
                        <TextField
                            label="Price"
                            type="number"
                            fullWidth
                            {...register('price', {
                                required: 'Price is required',
                                min: { value: 0, message: 'Price must be positive' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        {/* Stock */}
                        <TextField
                            label="Stock Quantity"
                            type="number"
                            fullWidth
                            {...register('stock', {
                                required: 'Stock quantity is required',
                                min: { value: 0, message: 'Stock must be non-negative' }
                            })}
                            error={!!errors.stock}
                            helperText={errors.stock?.message}
                        />

                        {/* Category */}
                        <FormControl fullWidth error={!!errors.category}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                {...register('category', { required: 'Category is required' })}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.category && (
                                <Typography color="error" variant="caption">
                                    {errors.category.message}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Brand */}
                        <FormControl fullWidth error={!!errors.brand}>
                            <InputLabel>Brand</InputLabel>
                            <Select
                                label="Brand"
                                {...register('brand', { required: 'Brand is required' })}
                            >
                                {brands.map((brand) => (
                                    <MenuItem key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.brand && (
                                <Typography color="error" variant="caption">
                                    {errors.brand.message}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Image Upload */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Product Image
                            </Typography>

                            {imagePreview ? (
                                <Card sx={{ maxWidth: 300, mb: 2 }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={imagePreview}
                                        alt="Product preview"
                                    />
                                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                                        <IconButton onClick={handleRemoveImage} color="error">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Card>
                            ) : (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUpload />}
                                    sx={{ mb: 2 }}
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            )}

                            <Typography variant="caption" color="text.secondary">
                                Upload a high-quality image for your product (JPG, PNG, max 5MB)
                            </Typography>
                        </Box>

                        {/* Submit Button */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading || productStatus === 'pending'}
                                sx={{ flex: 1 }}
                            >
                                {loading || productStatus === 'pending' ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Create Product'
                                )}
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/admin/dashboard')}
                                sx={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddProduct;
