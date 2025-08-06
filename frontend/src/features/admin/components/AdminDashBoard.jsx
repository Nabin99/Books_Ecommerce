import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    IconButton,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ShoppingCart,
    People,
    AttachMoney,
    Inventory,
    TrendingUp,
    LocalShipping,
    CheckCircle,
    Cancel,
    Visibility
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardCharts from './DashboardCharts';
import PaymentManagement from '../../payment/components/PaymentManagement';
import { axiosi } from '../../../config/axios';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalProducts: 0,
        recentOrders: [],
        orderStatusData: [],
        topProducts: [],
        monthlyRevenue: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real dashboard data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axiosi.get('/dashboard/stats');
                setDashboardData(response.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Dispatched':
                return 'info';
            case 'Out for delivery':
                return 'primary';
            case 'Completed':
                return 'success';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

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
                Admin Dashboard
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Orders
                                    </Typography>
                                    <Typography variant="h4">
                                        {dashboardData.totalOrders}
                                    </Typography>
                                </Box>
                                <ShoppingCart color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Users
                                    </Typography>
                                    <Typography variant="h4">
                                        {dashboardData.totalUsers}
                                    </Typography>
                                </Box>
                                <People color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="h4">
                                        ${dashboardData.totalRevenue.toFixed(2)}
                                    </Typography>
                                </Box>
                                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Products
                                    </Typography>
                                    <Typography variant="h4">
                                        {dashboardData.totalProducts}
                                    </Typography>
                                </Box>
                                <Inventory color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Box sx={{ mb: 4 }}>
                <DashboardCharts dashboardData={dashboardData} />
            </Box>

            {/* Recent Orders */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h6">Recent Orders</Typography>
                            <Button component={Link} to="/admin/orders" variant="outlined" size="small">
                                View All
                            </Button>
                        </Stack>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dashboardData.recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell>${order.amount}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={order.status}
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary">
                                                    <Visibility />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Stack spacing={2}>
                            <Button
                                component={Link}
                                to="/admin/add-product"
                                variant="contained"
                                fullWidth
                                startIcon={<Inventory />}
                            >
                                Add Product
                            </Button>
                            <Button
                                component={Link}
                                to="/admin/orders"
                                variant="outlined"
                                fullWidth
                                startIcon={<LocalShipping />}
                            >
                                Manage Orders
                            </Button>
                            <Button
                                component={Link}
                                to="/profile"
                                variant="outlined"
                                fullWidth
                                startIcon={<People />}
                            >
                                View Users
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
