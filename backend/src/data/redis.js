import { createClient } from 'redis';
import 'dotenv/config';

const client = createClient({
    url: process.env.REDIS_URI
});


async function main() {
    await client.connect();
    client.on('error', err => console.log('Redis Client Error', err));
}

main();

export default client;