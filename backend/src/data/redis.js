import { createClient } from 'redis';

const client = createClient();


async function main() {
    await client.connect();
    client.on('error', err => console.log('Redis Client Error', err));
}

main();

export default client;