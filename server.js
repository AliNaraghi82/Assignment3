/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Ali Naraghi Student ID: 123747222 Date: ______________
*
*  Published URL: 
*
********************************************************************************/



const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const storeService = require('./store-service');
const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Create an upload variable without disk storage
const upload = multer();


// Add the "Item" route
app.post('/items/add', upload.single('featureImage'), (req, res) => {
    // Check if a file was uploaded
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };


        upload(req).then((uploaded) => {
            processItem(res, uploaded.url, req.body);
        });
    } else {
        processItem(res, "", req.body);
    }
});

function processItem(res, imageUrl, itemData) {
    // Combine imageUrl with other item data
    itemData.featureImage = imageUrl;

    // Add the itemData as a new item using the addItem function
    storeService.addItem(itemData)
        .then(() => {
            // Redirect to the /items route after adding the item
            res.redirect('/items');
        })
        .catch((error) => {
            console.error(`Error adding item: ${error}`);
            res.status(500).send('Internal Server Error');
        });
}

// Home route redirecting to about page
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route to serve the about page
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});


// Items route to fetch items with optional filters
app.get('/items', (req, res) => {
    // Extract category and minDate from query parameters
    const category = req.query.category;
    const minDate = req.query.minDate;

    // Check if both category and minDate are present
    if (category && minDate) {
        // Respond with an error message or appropriate status code
        res.status(400).send('Both category and minDate queries cannot be present simultaneously.');
    } else if (category) {
        // Filter items by category
        storeService.getItemsByCategory(category)
            .then((items) => {
                res.json(items);
            })
            .catch((error) => {
                console.error(`Error fetching items by category: ${error}`);
                res.status(500).send('Internal Server Error');
            });
    } else if (minDate) {
        // Filter items by minimum date
        storeService.getItemsByMinDate(minDate)
            .then((items) => {
                res.json(items);
            })
            .catch((error) => {
                console.error(`Error fetching items by minDate: ${error}`);
                res.status(500).send('Internal Server Error');
            });
    } else {
        // Return all items if no filters are provided
        storeService.getAllItems()
            .then((items) => {
                res.json(items);
            })
            .catch((error) => {
                console.error(`Error fetching items: ${error}`);
                res.status(500).send('Internal Server Error');
            });
    }
});



// Route to fetch a single item by id
app.get('/item/:value', (req, res) => {
    const itemId = req.params.value;

    // Fetch item by id
    storeService.getItemById(itemId)
        .then((item) => {
            res.json(item);
        })
        .catch((error) => {
            console.error(`Error fetching item by id: ${error}`);
            res.status(500).send('Internal Server Error');
        });
});

// Route to serve the "/items/add" view
app.get('/items/add', (req, res) => {
    res.sendFile(__dirname + '/views/addItem.html');
});

// Generic 404 route
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Initialize store service before starting the server
storeService.initialize()
    .then(() => {
        // Start the server
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`Initialization failed: ${error}`);
    });
