const mongoosedb = require('mongoose'); // Ensure mongoose is imported
// app handler
const mainHandler = async (req, res) => {
    try{
        res.status(200).json({ message: 'Server is running' });
    } catch(err) {
        res.status(500).json({ message: 'Error in server route', error: err.message });
    }
}
// All Data Handler
const allDataHandler = async (req, res) => {
    try {
        const collections = await mongoosedb.connection.db.listCollections().toArray();
        const allData = {};

        // Iterate through each collection and fetch all documents
        for (const collection of collections) {
            const collectionName = collection.name;
            const documents = await mongoosedb.connection.db.collection(collectionName).find().toArray();
            allData[collectionName] = documents; // Store documents by collection name
        }

        res.status(200).json(allData); // Send the aggregated data
    } catch (err) {
        res.status(500).json({ message: "Error fetching data from collections", error: err.message });
    }
}
// All Todo Cards Handler
const todoCardsHandler = async (req, res) => {
    try {
        // Fetch all documents from the 'todoCardList' collection
        const todoList = await mongoosedb.connection.db.collection('todoCardList').find().toArray();
        res.status(200).json(todoList); // Send the todoList data as JSON response
    } catch (err) {
        res.status(500).json({ message: "Error fetching todoCardList data", error: err.message });
    }
}
// Delete Todo Card Handler
const todoCardDeleteHandler = async (req, res) => {
    try {
        const cardId = req.params.id; // Get the card ID from the request parameters
        const result = await mongoosedb.connection.db.collection('todoCardList').deleteOne({ 
            _id: new mongoosedb.Types.ObjectId(cardId) 
        }); // Delete the card with the specified ID

        res.status(200).json({ 
            message: "Card deleted successfully", 
        }); // Send success response with result

    } catch (err) { 
        res.status(500).json({ message: "Error deleting card", error: err.message });
    }
}
// Delete Item Handler
const itemDeleteHandler = async (req, res) => {
    try {
        const cardId = req.params.id;
        const itemId = req.params.itemId;
        const result = await mongoosedb.connection.db.collection('todoCardList').updateOne(
            { _id: new mongoosedb.Types.ObjectId(cardId) }, // Find the card by its ObjectId
            { $pull: { listItems: { id: itemId } } } // Remove the item with the specified ID
        );
        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            res.status(200).json({ 
                message: "item deleted successfully", 
                result: result 
            });
            return alert("Item deleted successfully");
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting item from items-list", error: err.message });   
    }
}
// Add Todo Card Handler
const addCardHandler = async (req, res) => {
    try {
        const { title, date, listItems } = req.body; // Extract data from the request body

        // Ensure all listItems have proper IDs
        const processedListItems = listItems.map(item => ({
            ...item,
            id: item.id || new mongoosedb.Types.ObjectId().toString()
        }));

        // Create a new document structure
        const newTodoCard = {
            title,
            date,
            listItems: processedListItems
        };

        // Insert the new document into the 'todoCardList' collection
        const result = await mongoosedb.connection.db
        .collection('todoCardList')
        .insertOne(newTodoCard);

        // Respond with the newly created document
        res.status(201).json({
            message: "Card added successfully",
            card: {
                _id: result.insertedId, // Return the generated ObjectId
                ...newTodoCard
            }
        });
        
    } catch (err) {
        res.status(500).json({ message: "Error adding card", error: err.message });
    }
}
// Update Card Title Handler
const updateCardHandler = async (req, res) => {
    try {
        const cardId = req.params.id;
        const cardTitle = req.body.cardTitle;
        const cardDate = req.body.cardDate;
        const result = await mongoosedb.connection.db.collection('todoCardList').updateOne(
            { _id: new mongoosedb.Types.ObjectId(cardId) },
            { $set: { title: cardTitle, date: cardDate } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "title not added" });
        }
        res.status(200).json({message: "Title updated successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating title", error: err.message });
    }
}
// Update Card Data Handler
const updateCardDataHandler = async (req, res) => {
    try {
        const cardId = req.params.id; 
        const cardTitle = req.body.title;
        const cardDate = req.body.date;
        const listItems = req.body.listItems; 
        const result = await mongoosedb.connection.db.collection('todoCardList').findOneAndUpdate(
            { _id: new mongoosedb.Types.ObjectId(cardId) },
            { $set: {
                title: cardTitle,
                date: cardDate,
                listItems: listItems
            } 
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "title not added" });
        }
        console.log({
            message: "Card data updated successfully",
            cardId: cardId,
            title: cardTitle,
            date: cardDate,
            listItems: listItems
        })
        res.status(200).json({message: "Card data updated successfully"})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating card data", error: err.message });
    }
}
// Update Item Title Handler
const updateItemTitleHandler = async (req, res) => {
    try {
        const cardId = req.params.id;
        const itemId = req.params.itemId;
        const itemTitle = req.body.itemTitle;

        console.log('PATCH update item title:', { cardId, itemId, itemTitle });

        // Try ObjectId match first
        let result = await mongoosedb.connection.db.collection('todoCardList').updateOne(
            { 
                _id: new mongoosedb.Types.ObjectId(cardId), 
                "listItems.id": new mongoosedb.Types.ObjectId(itemId) 
            },
            { $set: { "listItems.$.title": itemTitle } }
        );
        // If not found, try string match
        if (result.modifiedCount === 0) {
            result = await mongoosedb.connection.db.collection('todoCardList').updateOne(
                { 
                    _id: new mongoosedb.Types.ObjectId(cardId), 
                    "listItems.id": itemId 
                },
                { $set: { "listItems.$.title": itemTitle } }
            );
        }
        console.log('Mongo update result:', result);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "item title not added" });
        }
        res.status(200).json({message: "Item Title updated successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating title", error: err.message });
    }
}
// Up Items List Handler
const updateItemsListHandler = async (req, res) => {
    try {
        const cardId = req.params.id; // Get the card ID from the request parameters
        const itemName = req.body.itemName; // Get the item name from the request body
        // Validate that the item name is provided
        if (!itemName) {
            return res.status(400).json({ message: "itemName is required" });
        }
        // Create the new item to be added to the listItems array
        const newItem = {
            id: new mongoosedb.Types.ObjectId().toString(), // Generate a new ID for the item
            title: itemName, // Use 'title' instead of 'name'
            checked: false // Default value for checked
        };
        // Ensure the document exists and has a listItems array
        const card = await mongoosedb.connection.db.collection('todoCardList').findOne({
            _id: new mongoosedb.Types.ObjectId(cardId)
        });

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        if (!Array.isArray(card.listItems)) {
            // Initialize listItems as an empty array if it doesn't exist
            await mongoosedb.connection.db.collection('todoCardList').updateOne(
                { _id: new mongoosedb.Types.ObjectId(cardId) },
                { $set: { listItems: [] } }
            );
        }
        // Update the document in the MongoDB collection
        const result = await mongoosedb.connection.db.collection('todoCardList').updateOne(
            { _id: new mongoosedb.Types.ObjectId(cardId) },
            { $push: { listItems: newItem } }
        );
        // Check if the document was found and modified
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Item not added" });
        }
        // Respond with the newly added item and the card ID
        res.status(200).json({
            message: "Item added successfully",
            item: newItem
        });
        
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error adding item", error: err.message });
    }
}

module.exports = {
    mainHandler,
    allDataHandler,
    todoCardsHandler,
    todoCardDeleteHandler,
    itemDeleteHandler,
    addCardHandler,
    updateCardHandler,
    updateCardDataHandler,
    updateItemTitleHandler,
    updateItemsListHandler
}