<<<<<<< HEAD
import { faker } from '@faker-js/faker/locale/id_ID';
import { request } from 'http'; // Use 'https' if your URL is HTTPS
=======
const { faker } = require('@faker-js/faker/locale/id_ID');
const { request } = require('http'); // Use 'https' if your URL is HTTPS
>>>>>>> 7e5e88e (web only)

const encodeFormData = (data) => {
    const formBody = [];
    for (const [key, value] of Object.entries(data)) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value);
        formBody.push(`${encodedKey}=${encodedValue}`);
    }
    return formBody.join('&');
};

const sendPostRequest = (formData, callback) => {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/auth/customers',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(formData),
        },
    };

    const req = request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                callback(null, responseBody);
            } else {
                callback(new Error(`HTTP error! status: ${res.statusCode}`));
            }
        });
    });

    req.on('error', (e) => {
        callback(e);
    });

    req.write(formData);
    req.end();
};

const seedCustomers = async () => {
    try {
        for (let i = 0; i < 10; i++) {
            const generate = {
                name: faker.person.firstName(),
                no_telp: faker.phone.number(),
            };
            console.log('Generating customer:', generate);

            const formData = encodeFormData(generate);

            try {
                await new Promise((resolve, reject) => {
                    sendPostRequest(formData, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Customer added:', JSON.parse(result));
                            resolve();
                        }
                    });
                });
            } catch (fetchError) {
                console.error('Error adding customer:', fetchError);
            }
        }
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding customers:', error);
    }
};

seedCustomers().then(() => {
    console.log('Seeding process finished');
    process.exit(0);
}).catch((error) => {
    console.error('Seeding process failed:', error);
    process.exit(1);
});
