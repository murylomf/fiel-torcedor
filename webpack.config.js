const path = require('path');

module.exports = {
    entry: './index.js', // Replace with your script filename
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    target: 'node',
    mode: 'production'
};
