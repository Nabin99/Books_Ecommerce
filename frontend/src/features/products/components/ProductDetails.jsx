import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProductByIdAsync, resetProductFetchStatus, selectProductFetchStatus, selectSelectedProduct } from '../ProductSlice'
import { Box, Checkbox, Rating, Stack, Typography, useMediaQuery, Button, Paper, IconButton } from '@mui/material'
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { fetchReviewsByProductIdAsync, resetReviewFetchStatus, selectReviewFetchStatus, selectReviews, } from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { toast } from 'react-toastify'
import { MotionConfig, motion } from 'framer-motion'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import Favorite from '@mui/icons-material/Favorite'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice'
import { useTheme } from '@mui/material'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MobileStepper from '@mui/material/MobileStepper';
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const COLORS = ['#020202', '#F6F6F6', '#B82222', '#BEA9A9', '#E2BB8D']

// Custom Image Carousel Component
const ImageCarousel = ({ images, selectedImageIndex, onImageChange }) => {
    const [activeStep, setActiveStep] = useState(selectedImageIndex);
    const maxSteps = images?.length || 0;

    const handleNext = () => {
        const newStep = (activeStep + 1) % maxSteps;
        setActiveStep(newStep);
        onImageChange(newStep);
    };

    const handleBack = () => {
        const newStep = activeStep === 0 ? maxSteps - 1 : activeStep - 1;
        setActiveStep(newStep);
        onImageChange(newStep);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
        onImageChange(step);
    };

    useEffect(() => {
        setActiveStep(selectedImageIndex);
    }, [selectedImageIndex]);

    if (!images || images.length === 0) {
        return (
            <Box sx={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>No images available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Box
                sx={{
                    position: 'relative',
                    height: 400,
                    overflow: 'hidden',
                    borderRadius: 2,
                }}
            >
                <img
                    src={images[activeStep]}
                    alt={`Product ${activeStep + 1}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                />

                {/* Navigation Arrows */}
                {maxSteps > 1 && (
                    <>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                left: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                            }}
                            onClick={handleBack}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                            }}
                            onClick={handleNext}
                        >
                            <KeyboardArrowRight />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Dots Indicator */}
            {maxSteps > 1 && (
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    sx={{
                        bgcolor: 'transparent',
                        '& .MuiMobileStepper-dot': {
                            bgcolor: 'rgba(0,0,0,0.3)',
                        },
                        '& .MuiMobileStepper-dotActive': {
                            bgcolor: 'primary.main',
                        }
                    }}
                    nextButton={null}
                    backButton={null}
                />
            )}
        </Box>
    );
};

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItems = useSelector(selectCartItems)
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColorIndex, setSelectedColorIndex] = useState(-1)
    const reviews = useSelector(selectReviews)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const theme = useTheme()
    const is1420 = useMediaQuery(theme.breakpoints.down(1420))
    const is990 = useMediaQuery(theme.breakpoints.down(990))
    const is840 = useMediaQuery(theme.breakpoints.down(840))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const is387 = useMediaQuery(theme.breakpoints.down(387))
    const is340 = useMediaQuery(theme.breakpoints.down(340))

    const wishlistItems = useSelector(selectWishlistItems)

    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)

    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews && Array.isArray(reviews) ? reviews.reduce((acc, review) => acc + review.rating, 0) : 0
    const totalReviews = reviews && Array.isArray(reviews) ? reviews.length : 0
    const averageRating = totalReviews > 0 ? parseInt(Math.ceil(totalReviewRating / totalReviews)) : 0

    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    }, [id])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart")
        }
        else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding product to cart, please try again later')
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist")
        }
        else if (wishlistItemAddStatus === 'rejected') {
            toast.error('Error adding product to wishlist, please try again later')
        }
    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist")
        }
        else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error('Error removing product from wishlist, please try again later')
        }
    }, [wishlistItemDeleteStatus])

    useEffect(() => {
        if (productFetchStatus === 'fulfilled' || productFetchStatus === 'rejected') {
            dispatch(resetProductFetchStatus())
        }
    }, [productFetchStatus])

    useEffect(() => {
        if (reviewFetchStatus === 'fulfilled' || reviewFetchStatus === 'rejected') {
            dispatch(resetReviewFetchStatus())
        }
    }, [reviewFetchStatus])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled' || cartItemAddStatus === 'rejected') {
            dispatch(resetCartItemAddStatus())
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled' || wishlistItemAddStatus === 'rejected') {
            dispatch(resetWishlistItemAddStatus())
        }
    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled' || wishlistItemDeleteStatus === 'rejected') {
            dispatch(resetWishlistItemDeleteStatus())
        }
    }, [wishlistItemDeleteStatus])

    const handleAddToCart = () => {
        if (!loggedInUser) {
            navigate('/login')
            return
        }
        if (!selectedSize) {
            toast.error('Please select a size')
            return
        }
        if (selectedColorIndex === -1) {
            toast.error('Please select a color')
            return
        }
        dispatch(addToCartAsync({ productId: id, quantity, size: selectedSize, color: COLORS[selectedColorIndex] }))
    }

    const handleDecreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncreaseQty = () => {
        setQuantity(quantity + 1)
    }

    const handleSizeSelect = (size) => {
        setSelectedSize(size)
    }

    const handleAddRemoveFromWishlist = (e) => {
        e.stopPropagation()
        if (!loggedInUser) {
            navigate('/login')
            return
        }
        if (isProductAlreadyinWishlist) {
            const wishlistItem = wishlistItems.find((item) => item.product._id === id)
            dispatch(deleteWishlistItemByIdAsync(wishlistItem._id))
        } else {
            dispatch(createWishlistItemAsync({ productId: id }))
        }
    }

    const handleImageChange = (index) => {
        setSelectedImageIndex(index);
    };

    if (productFetchStatus === 'pending') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Lottie animationData={loadingAnimation} style={{ width: 200 }} />
            </Box>
        )
    }

    if (productFetchStatus === 'rejected') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">Error loading product</Typography>
            </Box>
        )
    }

    if (!product) {
        return null
    }

    return (
        <MotionConfig
            transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6
            }}
        >
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
                <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: 3, overflow: 'hidden' }}>
                            <Box sx={{ display: 'flex', flexDirection: is990 ? 'column' : 'row' }}>
                                {/* Product Images */}
                                <Box sx={{
                                    width: is990 ? '100%' : '50%',
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}>
                                    <ImageCarousel
                                        images={product.images}
                                        selectedImageIndex={selectedImageIndex}
                                        onImageChange={handleImageChange}
                                    />

                                    {/* Thumbnail Images */}
                                    {product.images && product.images.length > 1 && (
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            {product.images.map((image, index) => (
                                                <Box
                                                    key={index}
                                                    onClick={() => handleImageChange(index)}
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: 1,
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        border: index === selectedImageIndex ? '2px solid primary.main' : '2px solid transparent',
                                                        '&:hover': { opacity: 0.8 }
                                                    }}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                {/* Product Details */}
                                <Box sx={{
                                    width: is990 ? '100%' : '50%',
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3
                                }}>
                                    {/* Product Title and Price */}
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h5" color="primary" fontWeight="bold">
                                            ${product.price}
                                        </Typography>
                                    </Box>

                                    {/* Rating */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Rating value={averageRating} readOnly />
                                        <Typography variant="body2" color="text.secondary">
                                            ({totalReviews} reviews)
                                        </Typography>
                                    </Box>

                                    {/* Description */}
                                    <Typography variant="body1" color="text.secondary">
                                        {product.description}
                                    </Typography>

                                    {/* Size Selection */}
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Size</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {SIZES.map((size) => (
                                                <Button
                                                    key={size}
                                                    variant={selectedSize === size ? 'contained' : 'outlined'}
                                                    onClick={() => handleSizeSelect(size)}
                                                    sx={{ minWidth: 50 }}
                                                >
                                                    {size}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Color Selection */}
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Color</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {COLORS.map((color, index) => (
                                                <Box
                                                    key={index}
                                                    onClick={() => setSelectedColorIndex(index)}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        bgcolor: color,
                                                        cursor: 'pointer',
                                                        border: index === selectedColorIndex ? '3px solid primary.main' : '2px solid #ddd',
                                                        '&:hover': { transform: 'scale(1.1)' },
                                                        transition: 'transform 0.2s'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Quantity */}
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Quantity</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleDecreaseQty}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <Typography variant="h6">{quantity}</Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={handleIncreaseQty}
                                            >
                                                +
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleAddToCart}
                                            disabled={isProductAlreadyInCart}
                                            sx={{ flex: 1, minWidth: 200 }}
                                        >
                                            {isProductAlreadyInCart ? 'Already in Cart' : 'Add to Cart'}
                                        </Button>

                                        <IconButton
                                            onClick={handleAddRemoveFromWishlist}
                                            sx={{
                                                border: '2px solid',
                                                borderColor: isProductAlreadyinWishlist ? 'primary.main' : 'grey.300',
                                                color: isProductAlreadyinWishlist ? 'primary.main' : 'grey.500',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main'
                                                }
                                            }}
                                        >
                                            {isProductAlreadyinWishlist ? <Favorite /> : <FavoriteBorder />}
                                        </IconButton>
                                    </Box>

                                    {/* Features */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocalShippingOutlinedIcon color="primary" />
                                            <Typography variant="body2">Free shipping on orders over $50</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CachedOutlinedIcon color="primary" />
                                            <Typography variant="body2">30-day return policy</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Reviews Section */}
                        <Box sx={{ mt: 4 }}>
                            <Reviews
                                productId={id}
                                averageRating={averageRating}
                                reviewCount={totalReviews}
                            />
                        </Box>
                    </motion.div>
                </Box>
            </Box>
        </MotionConfig>
    )
}
