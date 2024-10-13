const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));







app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`); // Unique filename
    }
});

const upload = multer({ storage });

//connection to phpmyadmin
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'test'
});


const signToken = (user) => {
    const payload = {
        id: user.id,
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
};



//verify token
const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (authHeader) {
        const accessToken = authHeader.split(' ')[1];
        console.log('Token:', accessToken);

        jwt.verify(accessToken, SECRET_KEY, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ message: 'Token not valid' });
            }
            
            req.user = user;
            console.log('Decoded User:', req.user); // Log the decoded user information
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        console.log('No Authorization header present'); // Log for debugging
        res.status(401).json({ message: 'You are not authenticated' });
    }
};

app.get('/verify-token', verify, (req, res) => {
    // If the token is valid, respond with a valid status
    res.json({ valid: true });
});


app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
    

//     const checkEmailSql = 'SELECT * FROM user WHERE UserEmail = ?';
    
//     db.query(checkEmailSql, [email], (err, results) => {
//         if (err) return res.status(500).json({ error: 'Database query error' });

//         if (results.length === 0) {
//             return res.status(400).json({ error: 'Invalid email. Please sign up.' });
//         }

//         const user = results[0];
//         const storedPassword = user.password;

//         if (password !== storedPassword) {
//             return res.status(400).json({ error: 'Incorrect password. Please try again.' });
//         }

//         const token = signToken(user);
//         console.log(`JWT Token created: ${token}`);
        
//         // Respond with the generated token
//         return res.json({ token });
//     });
// });

//used
// app.post('/signup', (req, res) => {
//     const { username, email, UserHP, password } = req.body;
  
//     const checkUsernameSql = 'SELECT * FROM user WHERE Username = ?';
//     const checkEmailSql = 'SELECT * FROM user WHERE UserEmail = ?';
//     const checkUserHPSql = 'SELECT * FROM user WHERE UserHP = ?';
  
//     db.query(checkUsernameSql, [username], (err, results) => {
//       if (err) return res.status(500).json({ error: 'Database query error' });
//       if (results.length > 0) return res.status(400).json({ error: 'Username has been used' });
  
//       db.query(checkEmailSql, [email], (err, results) => {
//         if (err) return res.status(500).json({ error: 'Database query error' });
//         if (results.length > 0) return res.status(400).json({ error: 'Email has been used' });
  
//         db.query(checkUserHPSql, [UserHP], (err, results) => {
//           if (err) return res.status(500).json({ error: 'Database query error' });
//           if (results.length > 0) return res.status(400).json({ error: 'Phone number has been used' });
  
//           const insertUserSql = `INSERT INTO user (Username, UserEmail, UserHP, password) VALUES (?, ?, ?, ?)`;
//           db.query(insertUserSql, [username, email, UserHP, password], (err, result) => {
//             if (err) return res.status(500).json({ error: 'Failed to insert user' });
//             return res.status(201).json({ message: 'User registered successfully' });
//           });
//         });
//       });
//     });
// });

//signup
app.post('/signup', async (req, res) => {
    const { username, email, UserHP, password } = req.body;

    const checkUsernameSql = 'SELECT * FROM user WHERE Username = ?';
    const checkEmailSql = 'SELECT * FROM user WHERE UserEmail = ?';
    const checkUserHPSql = 'SELECT * FROM user WHERE UserHP = ?';

    try {
        // Check if the username already exists
        const usernameExists = await new Promise((resolve, reject) => {
            db.query(checkUsernameSql, [username], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (usernameExists.length > 0) return res.status(400).json({ error: 'Username has been used' });

        // Check if the email already exists
        const emailExists = await new Promise((resolve, reject) => {
            db.query(checkEmailSql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (emailExists.length > 0) return res.status(400).json({ error: 'Email has been used' });

        // Check if the phone number already exists
        const phoneExists = await new Promise((resolve, reject) => {
            db.query(checkUserHPSql, [UserHP], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (phoneExists.length > 0) return res.status(400).json({ error: 'Phone number has been used' });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserSql = `INSERT INTO user (Username, UserEmail, UserHP, password) VALUES (?, ?, ?, ?)`;
        
        await new Promise((resolve, reject) => {
            db.query(insertUserSql, [username, email, UserHP, hashedPassword], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Database error:', error); // Log the actual error for debugging
        return res.status(500).json({ error: 'Database query error' });
    }
});

//reset password
app.put('/resetPassword', verify, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Old and new password are required' });
    }

    // Fetch the current password from the database
    const getUserQuery = `SELECT password FROM user WHERE UserID = ?`;
    db.query(getUserQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ success: false, message: 'Error fetching user data' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const currentPassword = result[0].password;

        // Use bcrypt to compare the old password with the current password
        bcrypt.compare(oldPassword, currentPassword, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ success: false, message: 'Error verifying old password' });
            }

            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Old password is incorrect' });
            }

            // Hash the new password before saving
            bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
                if (err) {
                    console.error('Error hashing new password:', err);
                    return res.status(500).json({ success: false, message: 'Error hashing new password' });
                }

                // Update with the new password
                const updatePasswordQuery = `
                    UPDATE user
                    SET password = ?
                    WHERE UserID = ?
                `;
                db.query(updatePasswordQuery, [hashedNewPassword, userId], (err, result) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        return res.status(500).json({ success: false, message: 'Error updating password' });
                    }

                    return res.status(200).json({ success: true, message: 'Password updated successfully' });
                });
            });
        });
    });
});




app.get('/protected-route', (req, res) => {
    console.log("Accessing protected route");
    res.json({ message: 'This is a protected route' });
});





//used
app.get('/profile', verify, (req, res) => {
    console.log('Request User:', req.user); // Log req.user

    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'Invalid token data' });
    }

    // Fetch user data based on req.user.id
    const query = 'SELECT UserID, Username, UserEmail, UserHP, UserPP, Add_l1, Add_l2, Postcode, State FROM user WHERE UserID = ?';
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    });
    
});

//used to update user data
app.put('/profile', verify, (req, res) => {
    console.log(req.body); 
    const { username, email, phone, addressl1,addressl2, state, postcode } = req.body;
    const userId = req.user?.id;

    // Here, validate the token and get the userId from it (for security purposes)
    

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const query = `
        UPDATE user
        SET Username = ?, UserEmail = ?, UserHP = ?, Add_l1 = ?, Add_l2 = ?, State = ?, Postcode = ?
        WHERE UserID = ?
    `;

    db.query(query, [username, email, phone, addressl1,addressl2, state, postcode, userId], (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ success: false, message: 'Error updating profile' });
        }
        

        return res.status(200).json({ success: true, message: 'Profile updated successfully' });
    });
});
//get user profile pic only to show on home page




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploadProfilePicture', verify);
app.post('/uploadProfilePicture', verify, upload.single('profilePicture'), (req, res) => {
    console.log('Request User:', req.user); // Log req.user

    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'Invalid token data' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join('uploads', req.file.filename);
    const fileUrl = `http://localhost:8081/uploads/${req.file.filename}`;
    const query = 'UPDATE user SET UserPP = ? WHERE UserID = ?';
    db.query(query, [fileUrl, req.user.id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Profile picture updated successfully', file: req.file });
    });
});


// used in login page
app.post('/logins', (req, res) => {
    const { email, password } = req.body;

    const checkEmailSql = 'SELECT * FROM user WHERE UserEmail = ?';

    db.query(checkEmailSql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid email. Please sign up.' });
        }

        const user = results[0];
        const storedPassword = user.password;

        // Use bcrypt to compare the passwords
        bcrypt.compare(password, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Error comparing passwords' });

            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect password. Please try again.' });
            }

            // If the password matches, create a token and send the response
            const accesstoken = jwt.sign({ id: user.UserID }, SECRET_KEY);
            const response = {
                id: user.UserID,
                email: user.UserEmail,
                username: user.Username,
                accesstoken,
            };
            console.log('User Object:', user);
            console.log('Response Data:', response); // Log response data for debugging
            res.json(response);
        });
    });
});




app.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
    const userId = req.body.userId;
    const profilePic = req.file.buffer;
    const profilePicName = req.file.originalname;
    const profilePicType = req.file.mimetype;

    const query = `UPDATE user SET UserPP = ?, profile_pic_name = ?, profile_pic_type = ? WHERE user_id = ?`;

    connection.query(query, [profilePic, profilePicName, profilePicType, userId], (err, results) => {
        if (err) {
            console.error('Failed to upload profile picture:', err);
            res.status(500).send('Server Error');
        } else {
            res.send('Profile picture uploaded successfully!');
        }
    });
});

//get product to product page
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM product WHERE ProductStatus = "posted"';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        const processedResults = results.map(product => {
            let imgPaths = product.ProductImg.replace(/^"|"$/g, ''); // Remove extra quotes
            imgPaths = imgPaths.split(',').map(path => `http://localhost:8081/${path.trim()}`); // Convert to array of URLs
            return {
                ...product,
                ProductImg: imgPaths
            };
        });
        res.json(processedResults);
    });
});

const Productstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/products'); // Directory for product images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Ensure unique filenames
    }
});
const productUpload = multer({ storage: Productstorage });
//upload product
app.post('/products', productUpload.array('ProductImages', 5), (req, res) => {
    const { ProductName, ProductDes, ProductPrice, ProductStock, ProductCat, ProductDiscountPrice, ProductStatus } = req.body;
    console.log(req.body); // Debugging: Check if body data is received
    console.log(req.files); // Debugging: Check if files are being uploaded
    
    if (!ProductName || !ProductPrice || !ProductStock || !ProductCat || !ProductStatus) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const productImages = req.files.map(file => file.path).join(','); // Get paths of all uploaded images

    const query = `
        INSERT INTO product 
        (ProductName, ProductDes, ProductPrice, ProductStock, ProductCat, ProductImg, ProductDiscountPrice, ProductStatus, CreatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    console.log('Query:', query);
    console.log('Data:', [
        ProductName, ProductDes, ProductPrice, ProductStock, ProductCat, JSON.stringify(productImages), ProductDiscountPrice, ProductStatus
    ]);


    db.query(query, [
        ProductName, ProductDes, ProductPrice, ProductStock, ProductCat, JSON.stringify(productImages), ProductDiscountPrice, ProductStatus
    ], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Product uploaded successfully', productImages });
    });
});

//Search bar
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    const query = `
        SELECT * FROM product
        WHERE ProductName LIKE ? OR ProductDes LIKE ? OR ProductCat LIKE ?
    `;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    db.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

//Product IndividualPage
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM product WHERE ProductID = ?';

    db.query(query, [productId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (result.length > 0) {
            // Process image paths to convert them to array of URLs
            const product = result[0];
            let imgPaths = product.ProductImg.replace(/^"|"$/g, ''); // Remove extra quotes
            imgPaths = imgPaths.split(',').map(path => `http://localhost:8081/${path.trim()}`); // Convert to array of URLs

            product.ProductImg = imgPaths;

            res.json(product);
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    });
});

//Get category for productpage
app.get('/categories', (req, res) => {
    const sql = 'SELECT DISTINCT ProductCat FROM product';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching categories:', err); // Log the actual error
            return res.status(500).json({ error: 'Failed to fetch categories' });
        }

        const categories = result.map(row => row.ProductCat);
        console.log('Fetched Categories:', categories); // Log the categories being fetched
        res.json(categories);
    });
});



//get cart item into cart page
app.get('/cart/item', verify, (req, res) => {
    const userId = req.user.id;

    // Step 1: Get the user's cart_id
    const getCartQuery = 'SELECT cart_id FROM cart WHERE UserID = ?';

    db.query(getCartQuery, [userId], (err, cartResults) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (cartResults.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartId = cartResults[0].cart_id;

        // Step 2: Get the items from cart_item and join with product details
        const getCartItemsQuery = `
            SELECT ci.ProductID, ci.quantity, p.ProductName, p.ProductPrice, p.ProductImg
            FROM cart_item ci
            JOIN product p ON ci.ProductID = p.ProductID
            WHERE ci.cart_id = ?
        `;

        db.query(getCartItemsQuery, [cartId], (err, itemResults) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            // Return empty array if no items found
            if (itemResults.length === 0) {
                return res.json([]);
            }

            // Process items to get the first image URL
            const processedItems = itemResults.map(item => {
                // Extract the first image path
                let imgPaths = item.ProductImg.replace(/^"|"$/g, ''); // Remove extra quotes
                const imgArray = imgPaths.split(',').map(path => `http://localhost:8081/${path.trim()}`); // Convert to array of URLs

                // Use the first image only
                const firstImage = imgArray[0];

                // Return a new object with the first image URL
                return {
                    ...item,
                    ProductImg: firstImage
                };
            });

            // Send processed cart items along with product details
            res.json(processedItems);
        });
    });
});




//can get the cart_id with user_id
app.get('/cart', verify, async (req, res) => {
    const userId = req.user.id;

    // Query to check if the cart exists
    const checkCartQuery = 'SELECT cart_id FROM cart WHERE UserID = ?';
    
    db.query(checkCartQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        
        // If no cart is found, create a new cart for the user
        if (results.length === 0) {
            const insertCartQuery = 'INSERT INTO cart (UserID) VALUES (?)';

            // Insert the new cart
            db.query(insertCartQuery, [userId], (insertErr, insertResult) => {
                if (insertErr) {
                    return res.status(500).json({ message: 'Failed to create new cart' });
                }

                // Get the newly created cart's ID
                const newCartId = insertResult.insertId;

                // Respond with the new cart ID
                res.status(201).json({ cart_id: newCartId });
            });
        } else {
            // Cart exists, return the existing cart ID
            res.json(results[0]);
        }
    });
});

//can add product into cart_item
app.post('/cart/item', verify, async (req, res) => {
    const userId = req.user.id; // Get the user ID from the verified token
    const { ProductID, quantity } = req.body; // Get ProductID and quantity from request body

    if (!ProductID || !quantity) {
        return res.status(400).json({ message: 'ProductID and quantity are required' });
    }

    // Step 1: Get the user's cart_id
    const getCartQuery = 'SELECT cart_id FROM cart WHERE UserID = ?';

    db.query(getCartQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartId = results[0].cart_id;

        // Step 2: Insert the item into cart_item table
        const insertCartItemQuery = 'INSERT INTO cart_item (cart_id, ProductID, quantity) VALUES (?, ?, ?)';

        db.query(insertCartItemQuery, [cartId, ProductID, quantity], (insertErr, insertResult) => {
            if (insertErr) {
                return res.status(500).json({ message: 'Failed to add item to cart' });
            }

            res.status(201).json({ message: 'Item added to cart successfully', cartItemId: insertResult.insertId });
        });
    });
});

//can get product info by cart_item table
app.get('/order/:orderId', verify, (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    // Step 1: Get the order details and join with order items and product information
    const getOrderItemsQuery = `
        SELECT oi.ProductID, oi.quantity, p.ProductName, p.ProductPrice, p.ProductImg
        FROM order_item oi
        JOIN product p ON oi.ProductID = p.ProductID
        JOIN \`order\` o ON oi.order_id = o.order_id
        WHERE o.UserID = ? AND o.order_id = ?
    `;

    db.query(getOrderItemsQuery, [userId, orderId], (err, orderItems) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        // Return empty array if no order items found
        if (orderItems.length === 0) {
            return res.status(404).json({ message: 'Order not found or no items in this order' });
        }

        // Step 2: Process each order item to convert ProductImg to an array of URLs
        const processedItems = orderItems.map(item => {
            let imgPaths = item.ProductImg.replace(/^"|"$/g, ''); // Remove extra quotes if necessary
            imgPaths = imgPaths.split(',').map(path => `http://localhost:8081/${path.trim()}`); // Convert to array of URLs

            return {
                ...item,
                ProductImg: imgPaths,
            };
        });

        // Send processed order items along with product details
        res.json(processedItems);
    });
});


//delete product from cart
app.delete('/cart/item/:productId', verify, (req, res) => {
    const productId = req.params.productId;
    const userId = req.user.id; // User ID from the token

    console.log('Attempting to delete product with ID:', productId);
    console.log('User ID:', userId); // Log the user ID

    const deleteItemQuery = `
        DELETE FROM cart_item 
        WHERE ProductID = ? 
        AND cart_id = (SELECT cart_id FROM cart WHERE UserID = ?)
    `;

    db.query(deleteItemQuery, [productId, userId], (err, result) => {
        if (err) {
            console.error('Error deleting cart item:', err);
            return res.status(500).json({ message: 'Failed to remove item from cart' });
        }

        console.log('Delete result:', result); // Log the result

        // Check affected rows to see if deletion occurred
        if (result.affectedRows === 0) {
            console.log('No items affected; possibly item not found.');
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Item removed from cart' });
    });
});


//clear the cart after payment
app.delete('/cart/item', verify, (req, res) => {
    const userId = req.user.id;

    // Step 1: Get cart_id for the user
    const getCartQuery = 'SELECT cart_id FROM cart WHERE UserID = ?';

    db.query(getCartQuery, [userId], (err, cartResults) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (cartResults.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartId = cartResults[0].cart_id;

        // Step 2: Delete items from cart_item where cart_id matches
        const deleteCartItemsQuery = 'DELETE FROM cart_item WHERE cart_id = ?';

        db.query(deleteCartItemsQuery, [cartId], (err, deleteResults) => {
            if (err) {
                return res.status(500).json({ message: 'Error clearing cart items' });
            }

            res.status(200).json({ message: 'Cart cleared successfully' });
        });
    });
});

//create order after payment
app.post('/order', verify, (req, res) => {
    const userId = req.user.id;
    const subtotal = req.body.subtotal; // Subtotal before tax
    const tax = req.body.tax;           // Tax calculated on the frontend
    const totalPrice = req.body.total;  // Total price (subtotal + tax)
    const orderStatus = 'Pending';      // Default order status
    const orderDate = new Date();       // Current date

    // Insert a new order for the user
    const createOrderQuery = `
        INSERT INTO \`order\` (UserID, subtotal, tax, total_price, order_status, order_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(createOrderQuery, [userId, subtotal, tax, totalPrice, orderStatus, orderDate], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to create order' });
        }

        // Return the newly created order ID
        const orderId = results.insertId;
        res.status(201).json({ order_id: orderId });
    });
});

//add cart item into order_item
app.post('/order/item', verify, async (req, res) => {
    const userId = req.user.id; // Get UserID from token/session
    const orderId = req.body.order_Id; // Correct key name
    const { productId, quantity, price } = req.body;
    const subtotal =quantity*price;

    // Check if orderId is provided
    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
        // Check if the item already exists in the order_item table
        const existingItemQuery = `
            SELECT * FROM order_item 
            WHERE order_id = ? AND ProductID = ?
        `;
        const existingItems = await new Promise((resolve, reject) => {
            db.query(existingItemQuery, [orderId, productId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // If the item exists, update its quantity instead of inserting a new one
        if (existingItems.length > 0) {
            const newQuantity = existingItems[0].quantity + quantity; // Update quantity
            const updateItemQuery = `
                UPDATE order_item 
                SET quantity = ?, subtotal = ? 
                WHERE order_id = ? AND ProductID = ?
            `;
            await new Promise((resolve, reject) => {
                db.query(updateItemQuery, [newQuantity, newQuantity * price, orderId, productId], (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        } else {
            // Prepare insert query for order items if it does not exist
            const insertOrderItemQuery = `
                INSERT INTO order_item (order_id, ProductID, quantity, price, subtotal)
                VALUES (?, ?, ?, ?, ?)
            `;
            await new Promise((resolve, reject) => {
                db.query(insertOrderItemQuery, [orderId, productId, quantity, price, subtotal], (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        res.status(201).json({ message: 'Order item processed successfully' });
    } catch (error) {
        console.error('Error adding order item:', error);
        res.status(500).json({ message: 'Error adding order item' });
    }
});

//update productstock after payment
app.put('/products', verify, async (req, res) => {
    const userId = req.user.id; // Get UserID from token/session
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Query to get the current quantity of the product
    const getProductQuery = `SELECT ProductStock FROM product WHERE ProductID = ?`;
    
    try {
        const currentProduct = await new Promise((resolve, reject) => {
            db.query(getProductQuery, [productId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });

        if (!currentProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newQuantity = currentProduct.ProductStock - quantity;

        // Update the product quantity in the database
        const updateProductQuery = `UPDATE product SET ProductStock = ? WHERE ProductID = ?`;

        await new Promise((resolve, reject) => {
            db.query(updateProductQuery, [newQuantity, productId], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Error updating product quantity' });
    }
});

//get order history from user
app.get('/order', verify, async (req, res) => {
    const userId = req.user.id;
  
    try {
      // Query for non-completed orders
      const nonCompletedOrdersQuery = `
        SELECT * FROM \`order\` WHERE UserID = ? AND order_status IN ('Pending', 'Accepted', 'Delivered')
      `;
      const nonCompletedOrders = await new Promise((resolve, reject) => {
        db.query(nonCompletedOrdersQuery, [userId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
  
      // Query for completed orders
      const completedOrdersQuery = `
        SELECT * FROM \`order\` WHERE UserID = ? AND order_status = 'Completed'
      `;
      const completedOrders = await new Promise((resolve, reject) => {
        db.query(completedOrdersQuery, [userId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
  
      res.json({ nonCompletedOrders, completedOrders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  });
  
//order history 
app.get('/order/:orderId', verify, async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.params;
    
    try {
      // Query for order details with items
      const orderQuery = `
        SELECT o.order_id, o.order_status, o.subtotal, o.tax, o.total_price, o.order_date,
               oi.ProductID, oi.quantity, p.ProductName, p.ProductPrice
        FROM \`order\` o
        JOIN order_item oi ON o.order_id = oi.order_id
        JOIN product p ON oi.ProductID = p.ProductID
        WHERE o.UserID = ? AND o.order_id = ?
      `;
  
      const orderDetails = await new Promise((resolve, reject) => {
        db.query(orderQuery, [userId, orderId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
  
      // Check if the order exists
      if (orderDetails.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json({ orderDetails });
    } catch (error) {
        console.error("Error fetching orders:", error);
      res.status(500).json({ message: 'Error fetching order details' });
    }
  });
  
//get user review
app.get('/reviews', (req, res) => {
    const sql = `
      SELECT r.review_id, r.rating, r.review, r.created_at, u.Username, u.UserPP
      FROM review r
      JOIN user u ON r.UserID = u.UserID
      WHERE r.rating > 3
      ORDER BY RAND()
      LIMIT 5;
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  

app.post('/reviews', verify, (req, res) => {
    const { rating, review } = req.body;
    const userId = req.user.id; // Assuming the JWT contains the user ID
  
    if (!rating || !review) {
      return res.status(400).json({ message: 'Rating and review are required' });
    }
  
    const sql = 'INSERT INTO review (UserID, rating, review) VALUES (?, ?, ?)';
    db.query(sql, [userId, rating, review], (err, result) => {
      if (err) {
        console.error('Error inserting review:', err);
        return res.status(500).json({ message: 'Error submitting review' });
      }
      res.status(201).json({ message: 'Review submitted successfully' });
    });
  });



//news
const newsstorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/news/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    }
});
const newsupload = multer({ storage: newsstorage });
app.post('/news', newsupload.single('news_img'), (req, res) => {
    const { news_title, news_des, news_s_date, news_e_date } = req.body;
    const news_img = req.file ? `http://localhost:8081/uploads/news/${req.file.filename}` : null; // Create full URL for the image
  
    const sql = 'INSERT INTO news (news_title, news_des, news_img, news_s_date, news_e_date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [news_title, news_des, news_img, news_s_date, news_e_date], (err, result) => {
      if (err) {
        console.error('Error inserting news:', err);
        return res.status(500).json({ message: 'Failed to add news' });
      }
      res.status(200).json({ message: 'News added successfully!' });
    });
  });
app.use('/uploads/news', express.static('uploads/news'));

app.get('/news', (req, res) => {
    // Get the current date
    const currentDate = new Date();
  
    // Construct the SQL query
    const sql = 'SELECT * FROM news WHERE news_s_date <= ? AND news_e_date >= ?';
    db.query(sql, [currentDate, currentDate], (err, results) => {
      if (err) {
        console.error('Error fetching news:', err);
        return res.status(500).json({ message: 'Failed to fetch news.' });
      }
      res.status(200).json(results); // Send the results back to the client
    });
  });
  








  app.post('/your-endpoint', (req, res) => {
    console.log('Request body:', req.body); // Check what is being sent
    if (!req.body) {
        return res.status(400).json({ error: "Request body is required." });
    }
    // Continue processing...
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
