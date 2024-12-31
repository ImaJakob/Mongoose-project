// Import mongoose
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connect to the MongoDB Atlas database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Log connection status
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

// Define a Person schema
const personSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name is required
    age: Number, // Age is optional
    favoriteFoods: [String] // Array of strings for favorite foods
});

// Create a Person model
const Person = mongoose.model('Person', personSchema);

// Create and Save a Record of a Model
const createAndSavePerson = (done) => {
    const person = new Person({
        name: 'John Doe',
        age: 30,
        favoriteFoods: ['Pizza', 'Burger']
    });

    person.save((err, data) => {
        if (err) return console.error(err);
        console.log('Person saved:', data);
        done(null, data);
    });
};

// Create Many Records with Model.create()
const createManyPeople = (arrayOfPeople, done) => {
    Person.create(arrayOfPeople, (err, data) => {
        if (err) return console.error(err);
        console.log('People created:', data);
        done(null, data);
    });
};

// Use model.find() to Search Your Database
const findPeopleByName = (personName, done) => {
    Person.find({ name: personName }, (err, data) => {
        if (err) return console.error(err);
        console.log('People found:', data);
        done(null, data);
    });
};

// Use model.findOne() to Return a Single Matching Document
const findOneByFood = (food, done) => {
    Person.findOne({ favoriteFoods: food }, (err, data) => {
        if (err) return console.error(err);
        console.log('Person found:', data);
        done(null, data);
    });
};

// Use model.findById() to Search Your Database By _id
const findPersonById = (personId, done) => {
    Person.findById(personId, (err, data) => {
        if (err) return console.error(err);
        console.log('Person found by ID:', data);
        done(null, data);
    });
};

// Perform Classic Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
    Person.findById(personId, (err, person) => {
        if (err) return console.error(err);

        person.favoriteFoods.push('Hamburger');
        person.save((saveErr, updatedPerson) => {
            if (saveErr) return console.error(saveErr);
            console.log('Person updated:', updatedPerson);
            done(null, updatedPerson);
        });
    });
};

// Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
    Person.findOneAndUpdate(
        { name: personName },
        { age: 20 },
        { new: true },
        (err, updatedPerson) => {
            if (err) return console.error(err);
            console.log('Person updated with new age:', updatedPerson);
            done(null, updatedPerson);
        }
    );
};

// Delete One Document Using model.findByIdAndRemove
const removeById = (personId, done) => {
    Person.findByIdAndRemove(personId, (err, removedPerson) => {
        if (err) return console.error(err);
        console.log('Person removed:', removedPerson);
        done(null, removedPerson);
    });
};

// Delete Many Documents with model.remove()
const removeManyPeople = (done) => {
    Person.remove({ name: 'Mary' }, (err, result) => {
        if (err) return console.error(err);
        console.log('People removed:', result);
        done(null, result);
    });
};

// Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
    Person.find({ favoriteFoods: 'burritos' })
        .sort({ name: 1 }) // Sort by name (ascending)
        .limit(2) // Limit to 2 results
        .select('-age') // Exclude age field
        .exec((err, data) => {
            if (err) return console.error(err);
            console.log('Query result:', data);
            done(null, data);
        });
};

// Export functions for testing
module.exports = {
    createAndSavePerson,
    createManyPeople,
    findPeopleByName,
    findOneByFood,
    findPersonById,
    findEditThenSave,
    findAndUpdate,
    removeById,
    removeManyPeople,
    queryChain
};
