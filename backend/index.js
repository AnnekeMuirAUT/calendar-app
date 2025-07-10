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

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const {tokens} = await oAuth2Client.getToken(code); // exchange code for tokens
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens acquired:', tokens);
        res.send('Authentication successful! Check terminal for tokens.');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Error retrieving access token');
    }
})

app.get('/create-event', async (req, res) => {
    try {
        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN // use the refresh token to set credentials
        });

        const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

        const event = {
            summary: 'Test Event',
            description: 'Created with Google Calendar API :D',
            start: {
                dateTime: '2025-07-10T10:00:00',
                timeZone: 'Pacific/Auckland',
            },
            end: {
                dateTime: '2025-07-10T16:00:00',
                timeZone: 'Pacific/Auckland',
            },
            colorId: '11' // Tomato colour as default because I like it
        };

        const response = await calendar.events.insert({
            calendarId: process.env.CALENDAR_ID || 'primary', // use specific calendar ID otherwise use primary
            resource: event,
        })

        res.send(`Event created: <a href="${response.data.htmlLink}">${response.data.htmlLink}</a>`);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Error creating event');
    }
})

app.listen(5000, () => console.log('Backend running on http://localhost:5000')); 