import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.get('/auth', (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/calendar'];

    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    })

    res.redirect(url);
})

app.listen(5000, () => console.log('Backend running on http://localhost:5000')); 