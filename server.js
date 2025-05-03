const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
    },
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Endpoint to handle image uploads
app.post('/upload_images', upload.array('images[]'), (req, res) => {
    res.json({ success: true, message: 'Images uploaded successfully' });
});



// Endpoint to get the last 5 uploaded images
app.get('/get_last_five_images', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        const lastFiveImages = files
            .sort((a, b) => fs.statSync(path.join('./uploads', b)).mtimeMs - fs.statSync(path.join('./uploads', a)).mtimeMs)
            .slice(0, 5)
            .map(file => path.join('/uploads', file));

        res.json({ images: lastFiveImages });
    });
});



// Endpoint to get all images
app.get('/get_all_images', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        // Return URLs for all images
        const allImages = files.map(file => '/uploads/' + file);
        res.json({ images: allImages });
    });
});


// Endpoint to delete all images from the server
app.delete('/clear_images', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        files.forEach(file => {
            fs.unlinkSync(path.join('./uploads', file));  // Delete the file
        });

        res.json({ success: true, message: 'All images cleared' });
    });
});






app.use('/anomalies', express.static('anomalies'));
// Endpoint to get all images from the "anomaly-folder"
app.get('/get_anomaly_images', (req, res) => {
    fs.readdir('./anomalies', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        const lastFiveImages = files
            .sort((a, b) => fs.statSync(path.join('./anomalies', b)).mtimeMs - fs.statSync(path.join('./anomalies', a)).mtimeMs)
            .slice(0, 5)
            .map(file => path.join('/anomalies', file));

        res.json({ images: lastFiveImages });
    });
});



// Endpoint to check if the uploads folder is empty
app.get('/check_if_empty', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        const isEmpty = files.length === 0;
        res.json({ isEmpty: isEmpty });
    });
});



app.use('/unsure', express.static('unsure'));
// Endpoint to get all images from the "anomaly-folder"
app.get('/get_unsure_images', (req, res) => {
    fs.readdir('./unsure', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        const lastFiveImages = files
            .sort((a, b) => fs.statSync(path.join('./unsure', b)).mtimeMs - fs.statSync(path.join('./unsure', a)).mtimeMs)
            .slice(0, 5)
            .map(file => path.join('/unsure', file));

        res.json({ images: lastFiveImages });
    });
});



app.use('/normal', express.static('normal'));
// Endpoint to get all images from the "anomaly-folder"
app.get('/get_normal_images', (req, res) => {
    fs.readdir('./normal', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        const lastFiveImages = files
            .sort((a, b) => fs.statSync(path.join('./normal', b)).mtimeMs - fs.statSync(path.join('./normal', a)).mtimeMs)
            .slice(0, 5)
            .map(file => path.join('/normal', file));

        res.json({ images: lastFiveImages });
    });
});


app.delete('/clear_images_anomal', (req, res) => {
    fs.readdir('./anomalies', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        files.forEach(file => {
            fs.unlinkSync(path.join('./anomalies', file));  // Delete the file
        });

        res.json({ success: true, message: 'All images cleared' });
    });
});



app.delete('/clear_images_unsure', (req, res) => {
    fs.readdir('./unsure', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        files.forEach(file => {
            fs.unlinkSync(path.join('./unsure', file));  // Delete the file
        });

        res.json({ success: true, message: 'All images cleared' });
    });
});

app.delete('/clear_images_normal', (req, res) => {
    fs.readdir('./normal', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        files.forEach(file => {
            fs.unlinkSync(path.join('./normal', file));  // Delete the file
        });

        res.json({ success: true, message: 'All images cleared' });
    });
});



// Endpoint to get all images
app.get('/get_all_anomal', (req, res) => {
    fs.readdir('./anomalies', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        // Return URLs for all images
        const allImages = files.map(file => '/anomalies/' + file);
        res.json({ images: allImages });
    });
});


// Endpoint to get all images
app.get('/get_all_unsure', (req, res) => {
    fs.readdir('./unsure', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        // Return URLs for all images
        const allImages = files.map(file => '/unsure/' + file);
        res.json({ images: allImages });
    });
});


// Endpoint to get all images
app.get('/get_all_normal', (req, res) => {
    fs.readdir('./normal', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading files' });
        }

        // Return URLs for all images
        const allImages = files.map(file => '/normal/' + file);
        res.json({ images: allImages });
    });
});




// Serve the frontend (make sure the HTML file is in the public folder)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
