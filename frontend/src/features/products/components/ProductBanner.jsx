import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import { Box, useTheme, Typography, Button, Container, Stack } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const ProductBanner = ({ images }) => {

    const theme = useTheme()

    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const bannerData = [
        {
            title: "Discover Amazing Products",
            subtitle: "Shop the latest trends with unbeatable prices",
            cta: "Shop Now",
            image: images[0]
        },
        {
            title: "Premium Quality Guaranteed",
            subtitle: "Every product meets our high standards",
            cta: "Explore Collection",
            image: images[1]
        },
        {
            title: "Fast & Secure Delivery",
            subtitle: "Get your orders delivered safely and quickly",
            cta: "Learn More",
            image: images[2]
        }
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                mb: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
        >
            <AutoPlaySwipeableViews
                style={{ overflow: "hidden" }}
                width={'100%'}
                height={'100%'}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {bannerData.map((banner, index) => (
                    <div key={index} style={{ width: "100%", height: '400px', position: 'relative' }}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: `linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url(${banner.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundBlendMode: 'overlay'
                                }}
                            >
                                <Container maxWidth="lg">
                                    <Stack
                                        direction={{ xs: 'column', md: 'row' }}
                                        spacing={4}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{ height: '100%', py: 4 }}
                                    >
                                        {/* Content */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            style={{ flex: 1 }}
                                        >
                                            <Stack spacing={3} sx={{ color: 'white' }}>
                                                <Typography
                                                    variant="h2"
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: { xs: '2rem', md: '3rem' },
                                                        lineHeight: 1.2,
                                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    {banner.title}
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 400,
                                                        opacity: 0.9,
                                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    {banner.subtitle}
                                                </Typography>

                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        endIcon={<ArrowForwardIcon />}
                                                        startIcon={<ShoppingBagIcon />}
                                                        sx={{
                                                            borderRadius: 3,
                                                            px: 4,
                                                            py: 1.5,
                                                            fontSize: '1.1rem',
                                                            fontWeight: 600,
                                                            textTransform: 'none',
                                                            background: 'rgba(255, 255, 255, 0.2)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                                            color: 'white',
                                                            '&:hover': {
                                                                background: 'rgba(255, 255, 255, 0.3)',
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                                                            }
                                                        }}
                                                    >
                                                        {banner.cta}
                                                    </Button>
                                                </motion.div>
                                            </Stack>
                                        </motion.div>

                                        {/* Image */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Box
                                                component="img"
                                                src={banner.image}
                                                alt="Banner"
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'contain',
                                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                                                    borderRadius: 2
                                                }}
                                            />
                                        </motion.div>
                                    </Stack>
                                </Container>
                            </Box>
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>

            {/* Custom Stepper */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10
                }}
            >
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    sx={{
                        background: 'transparent',
                        '& .MuiMobileStepper-dot': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            '&.MuiMobileStepper-dotActive': {
                                backgroundColor: 'white',
                                transform: 'scale(1.2)'
                            }
                        }
                    }}
                />
            </Box>

            {/* Overlay Gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                    pointerEvents: 'none'
                }}
            />
        </Box>
    )
}
