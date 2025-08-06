import {
    Button,
    IconButton,
    LinearProgress,
    Pagination,
    Rating,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    Box,
    Chip,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReviewAsync, resetReviewAddStatus, resetReviewDeleteStatus, resetReviewUpdateStatus, selectReviewAddStatus, selectReviewDeleteStatus, selectReviewStatus, selectReviewUpdateStatus, selectReviews } from '../ReviewSlice'
import { ReviewItem } from './ReviewItem'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { toast } from 'react-toastify'
import CreateIcon from '@mui/icons-material/Create';
import { MotionConfig, motion } from 'framer-motion'
import { useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export const Reviews = ({ productId, averageRating, reviewCount }) => {

    const dispatch = useDispatch()
    const reviewsData = useSelector(selectReviews)
    // Handle both old format (array) and new format (object with reviews property)
    const reviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData?.reviews || [])
    const [value, setValue] = useState(5)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const loggedInUser = useSelector(selectLoggedInUser)
    const reviewStatus = useSelector(selectReviewStatus)
    const ref = useRef(null)

    const [sortBy, setSortBy] = useState('newest')
    const [filterRating, setFilterRating] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [reviewsPerPage] = useState(5)

    const reviewAddStatus = useSelector(selectReviewAddStatus)
    const reviewDeleteStatus = useSelector(selectReviewDeleteStatus)
    const reviewUpdateStatus = useSelector(selectReviewUpdateStatus)

    const [writeReview, setWriteReview] = useState(false)
    const theme = useTheme()

    const is840 = useMediaQuery(theme.breakpoints.down(840))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    useEffect(() => {
        if (reviewAddStatus === 'fulfilled') {
            toast.success("Review added successfully!")
        }
        else if (reviewAddStatus === 'rejected') {
            toast.error("Error posting review, please try again later")
        }

        reset()
        setValue(5)

    }, [reviewAddStatus])

    useEffect(() => {
        if (reviewDeleteStatus === 'fulfilled') {
            toast.success("Review deleted successfully!")
        }
        else if (reviewDeleteStatus === 'rejected') {
            toast.error("Error deleting review, please try again later")
        }
    }, [reviewDeleteStatus])

    useEffect(() => {
        if (reviewUpdateStatus === 'fulfilled') {
            toast.success("Review updated successfully!")
        }
        else if (reviewUpdateStatus === 'rejected') {
            toast.error("Error updating review, please try again later")
        }
    }, [reviewUpdateStatus])

    useEffect(() => {
        return () => {
            dispatch(resetReviewAddStatus())
            dispatch(resetReviewDeleteStatus())
            dispatch(resetReviewUpdateStatus())
        }
    }, [])

    // Calculate rating distribution
    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    }

    if (reviews && Array.isArray(reviews)) {
        reviews.forEach((review) => {
            ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1
        })
    }

    const totalReviews = reviews && Array.isArray(reviews) ? reviews.length : 0

    // Filter and sort reviews
    const filteredReviews = reviews && Array.isArray(reviews) ? reviews.filter(review => {
        if (filterRating === 'all') return true
        return review.rating === parseInt(filterRating)
    }) : []

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt)
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt)
            case 'highest':
                return b.rating - a.rating
            case 'lowest':
                return a.rating - b.rating
            case 'helpful':
                return (b.helpful?.count || 0) - (a.helpful?.count || 0)
            default:
                return new Date(b.createdAt) - new Date(a.createdAt)
        }
    })

    // Pagination
    const indexOfLastReview = currentPage * reviewsPerPage
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage
    const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview)

    const handleAddReview = (data) => {
        const review = {
            ...data,
            rating: value,
            user: loggedInUser._id,
            product: productId
        }
        dispatch(createReviewAsync(review))
        setWriteReview(false)
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

    return (
        <Stack rowGap={4} alignSelf={"flex-start"} width={is480 ? "90vw" : is840 ? "25rem" : '40rem'}>
            {/* Reviews Header */}
            <Stack>
                <Typography gutterBottom variant='h4' fontWeight={600} sx={{ mb: 2 }}>
                    Customer Reviews
                </Typography>

                {totalReviews > 0 ? (
                    <Stack rowGap={3}>
                        {/* Rating Summary */}
                        <Box sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Stack alignItems="center" spacing={1}>
                                    <Typography variant='h2' fontWeight={800} color="primary.main">
                                        {averageRating?.toFixed(1) || '0.0'}
                                    </Typography>
                                    <Rating
                                        readOnly
                                        value={averageRating || 0}
                                        size="large"
                                        icon={<StarIcon sx={{ color: 'primary.main' }} />}
                                    />
                                    <Typography variant='body2' color='text.secondary'>
                                        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                                    </Typography>
                                </Stack>

                                <Divider orientation="vertical" flexItem />

                                <Stack spacing={1} sx={{ flex: 1 }}>
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = ratingCounts[rating] || 0
                                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                                        return (
                                            <Stack key={rating} direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="body2" sx={{ minWidth: 30 }}>
                                                    {rating}★
                                                </Typography>
                                                <LinearProgress
                                                    sx={{
                                                        flex: 1,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)'
                                                        }
                                                    }}
                                                    variant='determinate'
                                                    value={percentage}
                                                />
                                                <Typography variant="body2" sx={{ minWidth: 40 }}>
                                                    {count}
                                                </Typography>
                                            </Stack>
                                        )
                                    })}
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                ) : (
                    <Box sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <StarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant='h6' color='text.secondary' fontWeight={400}>
                            {loggedInUser?.isAdmin ? "No reviews yet" : "Be the first to review this product!"}
                        </Typography>
                    </Box>
                )}
            </Stack>

            {/* Filter and Sort Controls */}
            {totalReviews > 0 && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Sort by</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort by"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="newest">Newest</MenuItem>
                            <MenuItem value="oldest">Oldest</MenuItem>
                            <MenuItem value="highest">Highest Rated</MenuItem>
                            <MenuItem value="lowest">Lowest Rated</MenuItem>
                            <MenuItem value="helpful">Most Helpful</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select
                            value={filterRating}
                            label="Filter"
                            onChange={(e) => setFilterRating(e.target.value)}
                        >
                            <MenuItem value="all">All Ratings</MenuItem>
                            <MenuItem value="5">5 Stars</MenuItem>
                            <MenuItem value="4">4 Stars</MenuItem>
                            <MenuItem value="3">3 Stars</MenuItem>
                            <MenuItem value="2">2 Stars</MenuItem>
                            <MenuItem value="1">1 Star</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            )}

            {/* Reviews List */}
            <Stack rowGap={2}>
                {currentReviews?.map((review) => (
                    <ReviewItem
                        key={review._id}
                        id={review._id}
                        userid={review.user._id}
                        comment={review.comment}
                        title={review.title}
                        createdAt={review.createdAt}
                        rating={review.rating}
                        username={review.user.name}
                        helpful={review.helpful}
                        verified={review.verified}
                        purchaseVerified={review.purchaseVerified}
                        images={review.images}
                    />
                ))}
            </Stack>

            {/* Pagination */}
            {totalReviews > reviewsPerPage && (
                <Stack alignItems="center">
                    <Pagination
                        count={Math.ceil(totalReviews / reviewsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size={is480 ? "small" : "medium"}
                    />
                </Stack>
            )}

            {/* Write Review Form */}
            {writeReview ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Stack
                        rowGap={3}
                        position={'relative'}
                        component={'form'}
                        noValidate
                        onSubmit={handleSubmit(handleAddReview)}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}
                    >
                        <TextField
                            {...register("title", { required: "Review title is required" })}
                            label="Review Title"
                            placeholder="Summarize your experience..."
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            {...register("comment", { required: "Review comment is required" })}
                            sx={{ mt: 2 }}
                            multiline
                            rows={4}
                            fullWidth
                            label="Your Review"
                            placeholder='Share your detailed experience with this product...'
                            error={!!errors.comment}
                            helperText={errors.comment?.message}
                        />

                        <Stack>
                            <Typography gutterBottom variant='body1' fontWeight={500}>
                                How would you rate this product?
                            </Typography>
                            <motion.div style={{ width: "fit-content" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Rating
                                    size='large'
                                    value={value}
                                    onChange={(e) => setValue(parseInt(e.target.value))}
                                    icon={<StarIcon sx={{ color: 'primary.main' }} />}
                                />
                            </motion.div>
                        </Stack>

                        <Stack flexDirection={'row'} alignSelf={'flex-end'} alignItems={'center'} columnGap={1}>
                            <MotionConfig whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
                                <motion.div>
                                    <LoadingButton
                                        sx={{ textTransform: "none", fontSize: is480 ? "0.875rem" : "1rem" }}
                                        size={is480 ? "small" : "medium"}
                                        loading={reviewStatus === 'pending'}
                                        type='submit'
                                        variant='contained'
                                    >
                                        Submit Review
                                    </LoadingButton>
                                </motion.div>
                                <motion.div>
                                    <Button
                                        onClick={() => setWriteReview(false)}
                                        color='error'
                                        size={is480 ? "small" : "medium"}
                                        variant='outlined'
                                        sx={{ textTransform: "none", fontSize: is480 ? "0.875rem" : "1rem" }}
                                    >
                                        Cancel
                                    </Button>
                                </motion.div>
                            </MotionConfig>
                        </Stack>
                    </Stack>
                </motion.div>
            ) : (
                !loggedInUser?.isAdmin && (
                    <motion.div
                        onClick={() => setWriteReview(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ width: "fit-content" }}
                    >
                        <Button
                            disableElevation
                            size={is480 ? "medium" : 'large'}
                            variant='contained'
                            sx={{
                                color: 'white',
                                textTransform: "none",
                                fontSize: "1rem",
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
                                }
                            }}
                            startIcon={<CreateIcon />}
                        >
                            Write a Review
                        </Button>
                    </motion.div>
                )
            )}
        </Stack>
    )
}
