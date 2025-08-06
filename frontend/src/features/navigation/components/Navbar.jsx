import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Chip, Stack, useMediaQuery, useTheme, Box, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser, selectIsAuthChecked } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import { motion } from 'framer-motion';

export const Navbar = ({ isProductList = false }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo)
  const cartItems = useSelector(selectCartItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  const wishlistItems = useSelector(selectWishlistItems)
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)
  const isAuthChecked = useSelector(selectIsAuthChecked)

  // Debug logging
  React.useEffect(() => {
    console.log('Navbar - loggedInUser:', loggedInUser);
    console.log('Navbar - userInfo:', userInfo);
  }, [loggedInUser, userInfo]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters())
  }

  const handleCartClick = () => {
    console.log('Cart button clicked');
    console.log('Current user state:', loggedInUser);
    if (!loggedInUser) {
      console.log('No user logged in, redirecting to login');
      navigate('/login');
    } else {
      console.log('User logged in, navigating to cart');
      navigate('/cart');
    }
  }

  const handleWishlistClick = () => {
    console.log('Wishlist button clicked');
    console.log('Current user state:', loggedInUser);
    if (!loggedInUser) {
      console.log('No user logged in, redirecting to login');
      navigate('/login');
    } else {
      console.log('User logged in, navigating to wishlist');
      navigate('/wishlist');
    }
  }

  const handleTestClick = () => {
    console.log('=== AUTHENTICATION DEBUG ===');
    console.log('loggedInUser:', loggedInUser);
    console.log('userInfo:', userInfo);
    console.log('isAuthChecked:', isAuthChecked);
    console.log('Cart items:', cartItems);
    console.log('Wishlist items:', wishlistItems);
    console.log('===========================');
  }

  const settings = [
    { name: "Home", to: "/" },
    { name: 'Profile', to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile" },
    { name: loggedInUser?.isAdmin ? 'Orders' : 'My orders', to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders" },
    { name: 'Logout', to: "/logout" },
  ];

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
        color: 'white',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{
          p: { xs: 1, md: 1.5 },
          height: { xs: "3.5rem", md: "4rem" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontWeight: 800,
                letterSpacing: '.15rem',
                color: 'white',
                textDecoration: 'none',
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontSize: { md: '1.5rem', lg: '1.75rem' },
                '&:hover': {
                  textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              MERN SHOP
            </Typography>
          </motion.div>

          {/* Mobile Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                display: { xs: 'flex', md: 'none' },
                fontWeight: 800,
                color: 'white',
                textDecoration: 'none',
                flexGrow: 1,
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontSize: '1.25rem'
              }}
            >
              MERN SHOP
            </Typography>
          </motion.div>

          {/* Right Side Actions */}
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            columnGap={{ xs: 1, md: 1.5 }}
            sx={{ ml: 'auto' }}
          >

            {/* Filter Button for Product List */}
            {isProductList && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title="Filter Products" arrow>
                  <IconButton
                    onClick={handleToggleFilters}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: { xs: 40, md: 44 },
                      height: { xs: 40, md: 44 },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <TuneIcon sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }} />
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}

            {/* Debug Button (temporary) */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Debug Auth" arrow>
                <IconButton
                  onClick={handleTestClick}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    width: { xs: 40, md: 44 },
                    height: { xs: 40, md: 44 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 0, 0, 0.4)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>?</Typography>
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Wishlist" arrow>
                <IconButton
                  onClick={handleWishlistClick}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: { xs: 40, md: 44 },
                    height: { xs: 40, md: 44 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Badge
                    badgeContent={wishlistItems.length}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '9px'
                      }
                    }}
                  >
                    <FavoriteBorderIcon sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }} />
                  </Badge>
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Shopping Cart" arrow>
                <IconButton
                  onClick={handleCartClick}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: { xs: 40, md: 44 },
                    height: { xs: 40, md: 44 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Badge
                    badgeContent={totalCartItems}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '9px'
                      }
                    }}
                  >
                    <ShoppingCartOutlinedIcon sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }} />
                  </Badge>
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* User Menu */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title="Account Settings" arrow>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '50%',
                    width: { xs: 40, md: 44 },
                    height: { xs: 40, md: 44 },
                    '&:hover': {
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Avatar
                    alt={userInfo?.name || loggedInUser?.name || 'User'}
                    src={userInfo?.avatar || null}
                    sx={{
                      width: { xs: 36, md: 40 },
                      height: { xs: 36, md: 40 },
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {(userInfo?.name || loggedInUser?.name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* User Menu Dropdown */}
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  minWidth: '180px'
                }
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {loggedInUser?.isAdmin && (
                <MenuItem
                  onClick={handleCloseUserMenu}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)'
                    }
                  }}
                >
                  <Typography
                    component={Link}
                    color={'text.primary'}
                    sx={{
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                    to="/admin/add-product"
                    textAlign="center"
                  >
                    Add new Product
                  </Typography>
                </MenuItem>
              )}

              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={handleCloseUserMenu}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)'
                    }
                  }}
                >
                  <Typography
                    component={Link}
                    color={'text.primary'}
                    sx={{
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                    to={setting.to}
                    textAlign="center"
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};