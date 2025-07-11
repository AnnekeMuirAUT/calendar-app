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

app.post('/create-events', async (req, res) => {
    const { events } = req.body;
    if (!events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ error: 'No events provided' });
    }

    try {
        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN // use the refresh token to set credentials
        });

        const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

        const createdLinks = [];

        for (const event of events) {
            const { date, start, end, eventName } = event;

            if (!date || !start || !end || !eventName) {
                return res.status(400).json({ error: 'Missing fields' });
            }

            if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
                return res.status(400).json({ error: 'Invalid date or time format' });
            }

            const calendarEvent = createEventObject(date, start, end, eventName);
            const response = await calendar.events.insert({
                calendarId: process.env.CALENDAR_ID || 'primary', // use specific calendar ID otherwise use primary
                resource: calendarEvent,
            });

            createdLinks.push(`<a href="${response.data.htmlLink}">${response.data.htmlLink}</a>`);
        }

        res.send(`Events created:<br>${createdLinks.join('<br>')}`);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Error creating event');
    }
})

function createEventObject(date, start, end, eventName) {
    return {
        summary: eventName,
        description: 'Created with Google Calendar API :D',
        start: {
            dateTime: `${date}T${start}:00`,
            timeZone: 'Pacific/Auckland',
        },
        end: {
            dateTime: `${date}T${end}:00`,
            timeZone: 'Pacific/Auckland',
        },
        colorId: '11' // Tomato colour as default because I like it
    };
}

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