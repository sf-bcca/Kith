
const fetch = require('node-fetch'); // Assuming node-fetch availability, or using native in Node 18+
// polyfill if needed
if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');
}

const API_URL = 'http://localhost:8081';
const fs = require('fs');
const path = require('path');

const logFile = path.resolve(__dirname, 'fix_log.txt');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

async function fixBryson() {
    log('Starting Fix...');
    try {
        // 1. Login as Bryson
        const loginBody = {
            first_name: 'Bryson',
            last_name: 'Flowers',
            birth_date: '2006-11-17', // YYYY-MM-DD
            password: '' // key assumption: no password set
        };
        log(`Logging in as: ${JSON.stringify(loginBody)}`);

        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginBody)
        });

        const loginData = await loginRes.json();
        
        if (!loginRes.ok) {
            log(`Login Failed: ${loginRes.status} ${JSON.stringify(loginData)}`);
            return;
        }

        const token = loginData.token;
        const member = loginData.member;
        log(`Login Success! ID: ${member.id}`);

        // 2. Update Visibility
        log('Updating visibility...');
        const updateRes = await fetch(`${API_URL}/api/members/${member.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                visibility: 'family-only'
            })
        });

        const updateData = await updateRes.json();
        if (!updateRes.ok) {
             log(`Update Failed: ${updateRes.status} ${JSON.stringify(updateData)}`);
        } else {
             log(`Update Success! New Visibility: ${updateData.visibility}`);
        }

    } catch (e) {
        log(`Error: ${e.message}`);
    }
}

fixBryson();
