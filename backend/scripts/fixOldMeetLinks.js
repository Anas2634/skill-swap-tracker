

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const SwapRequest = require('../models/SwapRequest');
const generateMeetLink = require('../utils/generateMeetLink');

const run = async () => {
  await connectDB();

  const oldLinkRequests = await SwapRequest.find({
    status: 'accepted',
    meetLink: { $regex: 'meet\\.google\\.com' },
  });

  console.log(`${oldLinkRequests.length} met old link`);

  let updatedCount = 0;
  const handledPairs = new Set();

  for (const request of oldLinkRequests) {
    const pairKey = [request.senderId.toString(), request.receiverId.toString()].sort().join('_');

    if (handledPairs.has(pairKey)) continue; // is pair ka link already handle ho chuka
    handledPairs.add(pairKey);

    const newLink = generateMeetLink();

    // Isi pair ki dono directions wali requests (agar dono taraf request thi) update karo
    const result = await SwapRequest.updateMany(
      {
        status: 'accepted',
        $or: [
          { senderId: request.senderId, receiverId: request.receiverId },
          { senderId: request.receiverId, receiverId: request.senderId },
        ],
      },
      { $set: { meetLink: newLink } }
    );

    updatedCount += result.modifiedCount;
    console.log(`  Pair ${pairKey} -> ${newLink} (${result.modifiedCount} docs updated)`);
  }

  console.log(`Done. Total ${updatedCount} documents update hue.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});