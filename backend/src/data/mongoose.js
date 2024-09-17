import mongoose from 'mongoose';
import 'dotenv/config';

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

export default mongoose;