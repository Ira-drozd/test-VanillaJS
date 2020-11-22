const express = require('express')

const app = express()

app.use(express.json({extended: true}))

app.use(express.static(__dirname + '/client'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});

app.use('/api', require('./routes/form.routes'))

const PORT = 3000

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))
