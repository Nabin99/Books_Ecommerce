import { Box, IconButton, TextField, Typography, useMediaQuery, useTheme, Container, Button, Divider } from '@mui/material'
import { Stack } from '@mui/material'
import React from 'react'
import { QRCodePng, appStorePng, googlePlayPng, facebookPng, instagramPng, twitterPng, linkedinPng } from '../../assets'
import SendIcon from '@mui/icons-material/Send';
import { MotionConfig, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

export const Footer = () => {

    const theme = useTheme()
    const is700 = useMediaQuery(theme.breakpoints.down(700))

    const labelStyles = {
        fontWeight: 400,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: 'secondary.main',
            transform: 'translateX(5px)'
        }
    }

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                }
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    sx={{
                        paddingTop: "4rem",
                        paddingBottom: "2rem",
                        rowGap: "4rem"
                    }}
                >
                    {/* Upper Section */}
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={4}
                        justifyContent="space-between"
                        flexWrap="wrap"
                    >
                        {/* Newsletter Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ flex: 1, minWidth: 300 }}
                        >
                            <Stack spacing={3}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    MERN SHOP
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Subscribe to our newsletter
                                </Typography>
                                <Typography sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                                    Get 10% off your first order and stay updated with our latest products and offers
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        placeholder="Enter your email"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'secondary.main',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <IconButton
                                            sx={{
                                                backgroundColor: 'secondary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'secondary.dark',
                                                }
                                            }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </motion.div>
                                </Stack>
                            </Stack>
                        </motion.div>

                        {/* Support Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{ flex: 1, minWidth: 250 }}
                        >
                            <Stack spacing={3}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Support
                                </Typography>
                                <Stack spacing={2}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <LocationOnIcon sx={{ color: 'secondary.main' }} />
                                        <Typography sx={labelStyles}>
                                            11th Main Street, Dhaka, DH 1515, California.
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <EmailIcon sx={{ color: 'secondary.main' }} />
                                        <Typography sx={labelStyles}>
                                            exclusive@gmail.com
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <PhoneIcon sx={{ color: 'secondary.main' }} />
                                        <Typography sx={labelStyles}>
                                            +88015-88888-9999
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </motion.div>

                        {/* Account Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{ flex: 1, minWidth: 200 }}
                        >
                            <Stack spacing={3}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Account
                                </Typography>
                                <Stack spacing={1}>
                                    {['My Account', 'Login / Register', 'Cart', 'Wishlist', 'Shop'].map((item) => (
                                        <Typography key={item} sx={labelStyles}>
                                            {item}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Stack>
                        </motion.div>

                        {/* Quick Links Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ flex: 1, minWidth: 200 }}
                        >
                            <Stack spacing={3}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Quick Links
                                </Typography>
                                <Stack spacing={1}>
                                    {['Privacy Policy', 'Terms Of Use', 'FAQ', 'Contact'].map((item) => (
                                        <Typography key={item} sx={labelStyles}>
                                            {item}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Stack>
                        </motion.div>

                        {/* Download App Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            style={{ flex: 1, minWidth: 300 }}
                        >
                            <Stack spacing={3}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Download App
                                </Typography>
                                <Typography sx={{ opacity: 0.8, fontWeight: 500 }}>
                                    Save $3 with App New User Only
                                </Typography>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                        sx={{
                                            width: '80px',
                                            height: "80px",
                                            backgroundColor: 'white',
                                            borderRadius: 2,
                                            p: 1
                                        }}
                                    >
                                        <img
                                            src={QRCodePng}
                                            height={'100%'}
                                            width={'100%'}
                                            style={{ objectFit: 'contain' }}
                                            alt="QR Code"
                                        />
                                    </Box>

                                    <Stack spacing={1}>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <img
                                                style={{ width: "120px", height: "35px", cursor: "pointer" }}
                                                src={googlePlayPng}
                                                alt="GooglePlay"
                                            />
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <img
                                                style={{ width: "120px", height: '35px', cursor: "pointer" }}
                                                src={appStorePng}
                                                alt="AppStore"
                                            />
                                        </motion.div>
                                    </Stack>
                                </Stack>

                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <MotionConfig whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                        <motion.img
                                            style={{ cursor: "pointer", width: '24px', height: '24px' }}
                                            src={facebookPng}
                                            alt="Facebook"
                                        />
                                        <motion.img
                                            style={{ cursor: "pointer", width: '24px', height: '24px' }}
                                            src={twitterPng}
                                            alt="Twitter"
                                        />
                                        <motion.img
                                            style={{ cursor: "pointer", width: '24px', height: '24px' }}
                                            src={instagramPng}
                                            alt="Instagram"
                                        />
                                        <motion.img
                                            style={{ cursor: "pointer", width: '24px', height: '24px' }}
                                            src={linkedinPng}
                                            alt="Linkedin"
                                        />
                                    </MotionConfig>
                                </Stack>
                            </Stack>
                        </motion.div>
                    </Stack>

                    {/* Divider */}
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                    {/* Lower Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Stack alignItems="center" spacing={2}>
                            <Typography
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    textAlign: 'center',
                                    fontSize: '0.875rem'
                                }}
                            >
                                &copy; MERN SHOP {new Date().getFullYear()}. All rights reserved
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textAlign: 'center',
                                    fontSize: '0.75rem'
                                }}
                            >
                                Built with ❤️ using React, Node.js, and MongoDB
                            </Typography>
                        </Stack>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    )
}
