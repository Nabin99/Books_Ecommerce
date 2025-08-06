import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme, Box, Chip, IconButton, Button, Rating } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';

export const ProductCard = ({ id, title, price, thumbnail, brand, stockQuantity, handleAddRemoveFromWishlist, isWishlistCard, isAdminCard, discountPercentage, averageRating, reviewCount }) => {

    const navigate = useNavigate()
    const wishlistItems = useSelector(selectWishlistItems)
    const loggedInUser = useSelector(selectLoggedInUser)
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()
    let isProductAlreadyinWishlist = -1

    const theme = useTheme()
    const is1410 = useMediaQuery(theme.breakpoints.down(1410))
    const is932 = useMediaQuery(theme.breakpoints.down(932))
    const is752 = useMediaQuery(theme.breakpoints.down(752))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is608 = useMediaQuery(theme.breakpoints.down(608))
    const is488 = useMediaQuery(theme.breakpoints.down(488))
    const is408 = useMediaQuery(theme.breakpoints.down(408))

    isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)

    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id)

    // Calculate discounted price
    const discountedPrice = discountPercentage ? price - (price * discountPercentage / 100) : price

    const handleAddToCart = async (e) => {
        e.stopPropagation()
        const data = { user: loggedInUser?._id, product: id }
        dispatch(addToCartAsync(data))
    }

    return (
        <>
            {isProductAlreadyinWishlist !== -1 ? (
                <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            cursor: "pointer",
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                                border: '1px solid rgba(37, 99, 235, 0.15)',
                                transform: 'translateY(-8px)',
                            }
                        }}
                        onClick={() => navigate(`/product-details/${id}`)}
                    >
                        {/* Image Container */}
                        <Box
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                aspectRatio: '1/1',
                                '&:hover .product-image': {
                                    transform: 'scale(1.08)',
                                }
                            }}
                        >
                            <img
                                className="product-image"
                                width={'100%'}
                                style={{
                                    aspectRatio: 1 / 1,
                                    objectFit: "contain",
                                    transition: 'transform 0.4s ease',
                                    padding: '1.5rem'
                                }}
                                height={'100%'}
                                src={thumbnail}
                                alt={`${title} photo unavailable`}
                            />

                            {/* Discount Badge */}
                            {discountPercentage > 0 && (
                                <Chip
                                    icon={<LocalOfferIcon />}
                                    label={`${Math.round(discountPercentage)}% OFF`}
                                    color="error"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        '& .MuiChip-icon': {
                                            color: 'white',
                                            fontSize: '1rem'
                                        }
                                    }}
                                />
                            )}

                            {/* Quick Actions Overlay */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    opacity: 1,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {!isAdminCard && (
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        animate={!isProductAlreadyinWishlist ? {
                                            scale: [1, 1.05, 1],
                                            transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
                                        } : {}}
                                    >
                                        <IconButton
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                checked={isProductAlreadyinWishlist}
                                                onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                                                icon={<FavoriteBorder sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />}
                                                checkedIcon={<Favorite sx={{ color: '#e53e3e' }} />}
                                                sx={{
                                                    p: 0,
                                                    '&:hover': {
                                                        '& .MuiSvgIcon-root': {
                                                            color: '#e53e3e'
                                                        }
                                                    }
                                                }}
                                            />
                                        </IconButton>
                                    </motion.div>
                                )}

                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/product-details/${id}`);
                                        }}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            }
                                        }}
                                    >
                                        <VisibilityIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                                    </IconButton>
                                </motion.div>
                            </Box>

                            {/* Stock Badge */}
                            {stockQuantity <= 20 && (
                                <Chip
                                    label={stockQuantity === 1 ? "Last One!" : "Low Stock"}
                                    color="warning"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 12,
                                        left: 12,
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        backgroundColor: '#f59e0b',
                                        color: 'white'
                                    }}
                                />
                            )}
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Stack spacing={1.5} sx={{ flex: 1 }}>
                                {/* Brand */}
                                <Chip
                                    label={brand}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        alignSelf: 'flex-start',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        backgroundColor: 'rgba(37, 99, 235, 0.05)'
                                    }}
                                />

                                {/* Title */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        lineHeight: 1.4,
                                        color: 'text.primary',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        minHeight: '2.6rem',
                                        mb: 0.5
                                    }}
                                >
                                    {title}
                                </Typography>

                                {/* Rating */}
                                {(averageRating > 0 || reviewCount > 0) && (
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Rating
                                            value={averageRating || 0}
                                            readOnly
                                            size="small"
                                            sx={{ fontSize: '0.9rem' }}
                                        />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.75rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            ({reviewCount || 0})
                                        </Typography>
                                    </Stack>
                                )}

                                {/* Price and Actions */}
                                <Box sx={{ mt: 'auto', pt: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1}>
                                        <Stack spacing={0.5}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: 'primary.main',
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1
                                                }}
                                            >
                                                ${discountedPrice.toFixed(2)}
                                            </Typography>
                                            {discountPercentage > 0 && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textDecoration: 'line-through',
                                                        color: 'text.secondary',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    ${price.toFixed(2)}
                                                </Typography>
                                            )}
                                        </Stack>

                                        {!isWishlistCard && !isAdminCard && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                {isProductAlreadyInCart ? (
                                                    <Chip
                                                        label="In Cart"
                                                        color="success"
                                                        size="small"
                                                        icon={<ShoppingCartIcon />}
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<ShoppingCartIcon />}
                                                        onClick={(e) => handleAddToCart(e)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            px: 2,
                                                            py: 0.75,
                                                            fontSize: '0.8rem',
                                                            minWidth: 'fit-content'
                                                        }}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                )}
                                            </motion.div>
                                        )}
                                    </Stack>
                                </Box>

                                {/* Stock Warning */}
                                {stockQuantity <= 20 && (
                                    <FormHelperText
                                        error
                                        sx={{
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            color: '#dc2626',
                                            borderRadius: 1,
                                            px: 1,
                                            py: 0.5,
                                            border: '1px solid rgba(239, 68, 68, 0.2)'
                                        }}
                                    >
                                        {stockQuantity === 1 ? "Only 1 stock is left" : "Only few are left"}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Box>
                    </Paper>
                </motion.div>
            ) : ''}
        </>
    )
}
