const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');
const multer = require('multer');
const upload = multer({ memory: true });

const storage = new Storage();
const pubsub = new PubSub();

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
const topic = pubsub.topic('document-processing');

router.post('/upload', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { userId } = req.body;
  const filename = `${userId}_${req.file.originalname}`;
  const file = bucket.file(filename);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {
    console.error(err);
    res.status(500).send('Error uploading file');
  });

  stream.on('finish', async () => {
    try {
      await topic.publish(Buffer.from(JSON.stringify({ userId, filename })));
      res.status(200).json({ message: 'File uploaded and processing initiated', filename });
    } catch (error) {
      console.error('Error publishing message:', error);
      res.status(500).send('Error initiating processing');
    }
  });

  stream.end(req.file.buffer);
});

router.get('/check-results/:userId/:filename', async (req, res) => {
  const { userId, filename } = req.params;
  const outputFilename = `${userId}_processed_${filename}`;

  try {
    const [exists] = await bucket.file(outputFilename).exists();
    if (exists) {
      const [metadata] = await bucket.file(outputFilename).getMetadata();
      const [url] = await bucket.file(outputFilename).getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      });

      res.json({
        status: 'completed',
        downloadUrl: url,
        metadata,
      });
    } else {
      res.json({ status: 'processing' });
    }
  } catch (error) {
    console.error('Error checking file:', error);
    res.status(500).json({ status: 'error', message: 'Error checking file status' });
  }
});

module.exports = router;