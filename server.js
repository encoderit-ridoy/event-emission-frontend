const express = require('express')

const path = require('path')

const app = express()
// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')))
// Start the server
const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
