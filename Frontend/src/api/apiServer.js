// apiService.js
const apiBaseUrl = 'http://localhost:8081'; // Change to your backend API URL

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token); // Log the token for debugging
    return token;
};

// Function to handle GET requests
const get = async (endpoint) => {
    const token = getAuthToken(); // Fetch the token here
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in headers
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return response.json();
};

// Function to handle DELETE requests
const remove = async (endpoint) => {
    const token = getAuthToken(); // Fetch the token here
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in headers
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return response.json();
};

// Export the API functions
export default {
    get,
    remove,
};
