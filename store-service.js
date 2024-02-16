const fs = require('fs').promises;

// Global arrays
let items = [];
let categories = [];

// Function to initialize dat

// Function to get all items
const getAllItems = () => {
    return new Promise((resolve, reject) => {
        if (items.length > 0) {
            resolve(items);
        } else {
            reject('No results returned');
        }
    });
};

// Function to get published items
const getPublishedItems = () => {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length > 0) {
            resolve(publishedItems);
        } else {
            reject('No published items returned');
        }
    });
};

// Function to get items by category
const getItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category === parseInt(category));
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("No items found for the specified category.");
        }
    });
};

// Function to get items by minimum date
const getItemsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredItems = items.filter(item => new Date(item.postDate) >= minDate);
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("No items found for the specified minimum date.");
        }
    });
};


// Function to add a new item
const addItem = (itemData) => {
    return new Promise((resolve, reject) => {
        // Set published to false if undefined
        itemData.published = itemData.published || false;

        // Set id property
        itemData.id = items.length + 1;

        // Push the updated itemData onto the "items" array
        items.push(itemData);

        // Resolve the promise with the updated itemData
        resolve(itemData);
    });
};



// Function to get item by ID
const getItemById = (id) => {
    return new Promise((resolve, reject) => {
        const foundItem = items.find(item => item.id === id);
        if (foundItem) {
            resolve(foundItem);
        } else {
            reject("No item found with the specified ID.");
        }
    });
};

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
};
