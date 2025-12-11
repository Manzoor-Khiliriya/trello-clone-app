const port = process.env.PORT || 5000;
const app = require('./src/app');

const server = app.listen(port, () => {
    console.log(`Trello Clone Backend API running on port : ${port}`);
});
