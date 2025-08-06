import React from 'react';
import { ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = () => {
	return (
		<ReactToastContainer
			position="top-right"
			autoClose={4000}
			hideProgressBar={false}
			newestOnTop={true}
			closeOnClick={true}
			rtl={false}
			pauseOnFocusLoss={true}
			draggable={true}
			pauseOnHover={true}
			theme="light"
			toastStyle={{
				borderRadius: '12px',
				boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
				border: '1px solid rgba(0, 0, 0, 0.05)',
				fontSize: '14px',
				fontWeight: 500,
				padding: '16px 20px',
				minHeight: 'auto',
				maxWidth: '400px'
			}}
			progressStyle={{
				background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
				height: '3px',
				borderRadius: '0 0 12px 12px'
			}}
			closeButton={false}
		/>
	);
};

export default ToastContainer; 