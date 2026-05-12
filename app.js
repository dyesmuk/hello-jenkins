const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log("Hello 12345");
    res.send('Hello from Jenkins CI/CD!');
});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => console.log('Server running on port 3000'));
}