import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API requests to your backend server
      '/profile': {
        target: 'http://localhost:8081',  // Replace with your backend server URL
        changeOrigin: true,
        secure: false,  
        rewrite: (path) => path.replace(/^\/profile/, '/profile')  // Rewrite the path if needed
        
      },
      '/uploadProfilePicture': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploadProfilePicture/, '/uploadProfilePicture')
      },
      '/products': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/products/, '/products'),
      },
      // '/product': {
      //   target: 'http://localhost:8081',  // Your backend server
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/product/, '/product')
      // },
      // '/updateProfile': {
      //           target: 'http://localhost:8081', // Your backend server
      //           changeOrigin: true,
      //           secure: false,
      //           rewrite: (path) => path.replace(/^\/updateProfile/, '/updateProfile')
      //       }
      '/alogins': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/logins/, '')
      },
      '/categories': {
        target: 'http://localhost:8081', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/categories/, '/categories')
      },
      '/cart': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
      '/order': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
      '/reviews': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/review/, '/review')
      },
      '/resetPassword': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/resetPassword/, '/resetPassword')
      },
      '/admindash': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
        
      },
      '/admin/users': {
                target: 'http://localhost:8081', // Adjust this if needed
                changeOrigin: true,
                secure: false,
      },
      '/admin/userorders': {
                target: 'http://localhost:8081', // Adjust this if needed
                changeOrigin: true,
                secure: false,
      },
      '/admin/orders/items/': {
                target: 'http://localhost:8081', // Adjust this if needed
                changeOrigin: true,
                secure: false,
      },
      '/users': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
        
      },
    }
  },

})
