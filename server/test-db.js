const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:');
        console.error('Error Code:', err.code);
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
        process.exit(1);
    });
