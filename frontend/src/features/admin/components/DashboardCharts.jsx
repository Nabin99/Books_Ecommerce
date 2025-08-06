import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Box, Paper, Typography, Grid } from '@mui/material';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const DashboardCharts = ({ dashboardData }) => {
	const { salesData, orderStatusData, topProducts, monthlyRevenue } = dashboardData;

	// Sales Trend Chart
	const salesChartData = {
		labels: monthlyRevenue?.map(item => item.month) || [],
		datasets: [
			{
				label: 'Monthly Revenue',
				data: monthlyRevenue?.map(item => item.revenue) || [],
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				fill: true,
				tension: 0.4,
			},
		],
	};

	const salesChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Monthly Revenue Trend',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function (value) {
						return '$' + value.toLocaleString();
					}
				}
			}
		}
	};

	// Order Status Chart
	const orderStatusChartData = {
		labels: orderStatusData?.map(item => item.status) || [],
		datasets: [
			{
				data: orderStatusData?.map(item => item.count) || [],
				backgroundColor: [
					'rgba(255, 99, 132, 0.8)',
					'rgba(54, 162, 235, 0.8)',
					'rgba(255, 205, 86, 0.8)',
					'rgba(75, 192, 192, 0.8)',
					'rgba(153, 102, 255, 0.8)',
				],
				borderWidth: 2,
				borderColor: '#fff',
			},
		],
	};

	const orderStatusChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom',
			},
			title: {
				display: true,
				text: 'Order Status Distribution',
			},
		},
	};

	// Top Products Chart
	const topProductsChartData = {
		labels: topProducts?.map(item => item.name) || [],
		datasets: [
			{
				label: 'Sales Count',
				data: topProducts?.map(item => item.salesCount) || [],
				backgroundColor: 'rgba(54, 162, 235, 0.8)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1,
			},
		],
	};

	const topProductsChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Top Selling Products',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<Grid container spacing={3}>
			{/* Sales Trend Chart */}
			<Grid item xs={12} lg={8}>
				<Paper elevation={2} sx={{ p: 3 }}>
					<Line data={salesChartData} options={salesChartOptions} />
				</Paper>
			</Grid>

			{/* Order Status Chart */}
			<Grid item xs={12} lg={4}>
				<Paper elevation={2} sx={{ p: 3 }}>
					<Doughnut data={orderStatusChartData} options={orderStatusChartOptions} />
				</Paper>
			</Grid>

			{/* Top Products Chart */}
			<Grid item xs={12}>
				<Paper elevation={2} sx={{ p: 3 }}>
					<Bar data={topProductsChartData} options={topProductsChartOptions} />
				</Paper>
			</Grid>
		</Grid>
	);
};

export default DashboardCharts; 