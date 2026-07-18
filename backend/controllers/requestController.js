// const Skill = require('../models/Skill');
// const SwapRequest = require('../models/SwapRequest');
// const User = require('../models/User');
// const generateMeetLink = require('../utils/generateMeetLink');

// // @desc GET /api/matches -> Perfect matches nikalna
// const getMatches = async (req, res) => {
//   try {
//     const mySkill = await Skill.findOne({ userId: req.user._id });

//     if (!mySkill) {
//       return res.status(400).json({ message: 'Pehle apni skills add karo' });
//     }

//     const allSkills = await Skill.find({ userId: { $ne: req.user._id } }).populate(
//       'userId',
//       'name email city bio profileImage'
//     );

//     const matches = [];

//     for (const otherSkill of allSkills) {
//       const theyTeachWhatIWantToLearn = mySkill.learnSkill.some((skill) =>
//         otherSkill.teachSkill.includes(skill)
//       );

//       const iTeachWhatTheyWantToLearn = otherSkill.learnSkill.some((skill) =>
//         mySkill.teachSkill.includes(skill)
//       );

//       if (theyTeachWhatIWantToLearn && iTeachWhatTheyWantToLearn) {
//         const commonTeachFromThem = mySkill.learnSkill.filter((s) =>
//           otherSkill.teachSkill.includes(s)
//         );
//         const commonTeachFromMe = otherSkill.learnSkill.filter((s) =>
//           mySkill.teachSkill.includes(s)
//         );

//         matches.push({
//           user: otherSkill.userId,
//           theyCanTeachYou: commonTeachFromThem,
//           youCanTeachThem: commonTeachFromMe,
//           experience: otherSkill.experience,
//           availability: otherSkill.availability,
//         });
//       }
//     }

//     res.json(matches);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc POST /api/request -> Swap request bhejna
// const sendRequest = async (req, res) => {
//   try {
//     const { receiverId } = req.body;

//     if (receiverId === req.user._id.toString()) {
//       return res.status(400).json({ message: 'Khud ko request nahi bhej sakte' });
//     }

//     const receiverExists = await User.findById(receiverId);
//     if (!receiverExists) {
//       return res.status(404).json({ message: 'Receiver user not found' });
//     }

//     const alreadyExists = await SwapRequest.findOne({
//       senderId: req.user._id,
//       receiverId,
//       status: 'pending',
//     });

//     if (alreadyExists) {
//       return res.status(400).json({ message: 'Request already sent' });
//     }

//     const request = await SwapRequest.create({
//       senderId: req.user._id,
//       receiverId,
//     });

//     res.status(201).json(request);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc GET /api/requests -> Sent + Received requests
// const getRequests = async (req, res) => {
//   try {
//     const sent = await SwapRequest.find({ senderId: req.user._id }).populate(
//       'receiverId',
//       'name email city profileImage'
//     );

//     const received = await SwapRequest.find({ receiverId: req.user._id }).populate(
//       'senderId',
//       'name email city profileImage'
//     );

//     res.json({ sent, received });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc PUT /api/accept -> Request accept karna
// const acceptRequest = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const request = await SwapRequest.findById(requestId);

//     if (!request) return res.status(404).json({ message: 'Request not found' });

//     if (request.receiverId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     request.status = 'accepted';

//     if (!request.meetLink) {
//       request.meetLink = generateMeetLink();
//     }

//     await request.save();

//     const populated = await request.populate([
//       { path: 'senderId', select: 'name email city profileImage' },
//       { path: 'receiverId', select: 'name email city profileImage' },
//     ]);

//     res.json(populated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc PUT /api/reject -> Request reject karna
// const rejectRequest = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const request = await SwapRequest.findById(requestId);

//     if (!request) return res.status(404).json({ message: 'Request not found' });

//     if (request.receiverId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     request.status = 'rejected';
//     await request.save();

//     res.json(request);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getMatches,
//   sendRequest,
//   getRequests,
//   acceptRequest,
//   rejectRequest,
// };




const Skill = require('../models/Skill');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const generateMeetLink = require('../utils/generateMeetLink');

// @desc GET /api/matches -> Perfect matches nikalna
const getMatches = async (req, res) => {
  try {
    const mySkill = await Skill.findOne({ userId: req.user._id });

    if (!mySkill) {
      return res.status(400).json({ message: 'Pehle apni skills add karo' });
    }

    // Sab dusre users ki skills nikalo (khud ko chor kar)
    const allSkills = await Skill.find({ userId: { $ne: req.user._id } }).populate(
      'userId',
      'name email city bio profileImage'
    );

    const matches = [];

    for (const otherSkill of allSkills) {
      // Condition 1: Mera "learn" unke "teach" mein exist karta ho
      const theyTeachWhatIWantToLearn = mySkill.learnSkill.some((skill) =>
        otherSkill.teachSkill.includes(skill)
      );

      // Condition 2: Unka "learn" mere "teach" mein exist karta ho
      const iTeachWhatTheyWantToLearn = otherSkill.learnSkill.some((skill) =>
        mySkill.teachSkill.includes(skill)
      );

      // Dono conditions true -> Perfect Match ✔
      if (theyTeachWhatIWantToLearn && iTeachWhatTheyWantToLearn) {
        // Common skills bhi nikal dete hain (UI mein dikhane ke liye)
        const commonTeachFromThem = mySkill.learnSkill.filter((s) =>
          otherSkill.teachSkill.includes(s)
        );
        const commonTeachFromMe = otherSkill.learnSkill.filter((s) =>
          mySkill.teachSkill.includes(s)
        );

        matches.push({
          user: otherSkill.userId,
          theyCanTeachYou: commonTeachFromThem,
          youCanTeachThem: commonTeachFromMe,
          experience: otherSkill.experience,
          availability: otherSkill.availability,
        });
      }
    }

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc POST /api/request -> Swap request bhejna
const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Khud ko request nahi bhej sakte' });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver user not found' });
    }

    const alreadyExists = await SwapRequest.findOne({
      senderId: req.user._id,
      receiverId,
      status: 'pending',
    });

    if (alreadyExists) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = await SwapRequest.create({
      senderId: req.user._id,
      receiverId,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc GET /api/requests -> Sent + Received requests
const getRequests = async (req, res) => {
  try {
    const sent = await SwapRequest.find({ senderId: req.user._id }).populate(
      'receiverId',
      'name email city profileImage whatsapp'
    );

    const received = await SwapRequest.find({ receiverId: req.user._id }).populate(
      'senderId',
      'name email city profileImage whatsapp'
    );

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc PUT /api/accept -> Request accept karna
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await SwapRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'accepted';

    // Agar dono users ne ek dusre ko alag alag request bhej rakhi ho (do SwapRequest
    // documents), to koi bhi ek accept hote hi opposite-direction wali request bhi
    // dhoond lete hain — taake naya link generate karne ke bajaye wahi shared link
    // dono taraf use ho (do alag Meet links kabhi na banein).
    const reverseRequest = await SwapRequest.findOne({
      senderId: request.receiverId,
      receiverId: request.senderId,
    });

    if (reverseRequest && reverseRequest.meetLink) {
      // Reverse request pehle se accept ho chuki thi aur uska link ban chuka hai — wahi le lo.
      request.meetLink = reverseRequest.meetLink;
    } else if (!request.meetLink) {
      // Koi shared link mojood nahi — pehli baar generate karo.
      request.meetLink = generateMeetLink();
    }

    await request.save();

    // Reverse request ko bhi wahi link de do (agar wo baad mein accept ho ya
    // already accepted ho lekin link mismatch/khali ho) taake dono cards par
    // hamesha ek hi Meet link dikhe.
    if (reverseRequest && reverseRequest.meetLink !== request.meetLink) {
      reverseRequest.meetLink = request.meetLink;
      await reverseRequest.save();
    }

    const populated = await request.populate([
      { path: 'senderId', select: 'name email city profileImage whatsapp' },
      { path: 'receiverId', select: 'name email city profileImage whatsapp' },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc PUT /api/reject -> Request reject karna
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await SwapRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'rejected';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMatches,
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
};