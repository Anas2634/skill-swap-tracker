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
      'name email city profileImage'
    );

    const received = await SwapRequest.find({ receiverId: req.user._id }).populate(
      'senderId',
      'name email city profileImage'
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

    // Match confirm hote hi ek Google Meet-style link generate kar k save kar do,
    // taake dono users isi request k against apni class/session le sakein.
    if (!request.meetLink) {
      request.meetLink = generateMeetLink();
    }

    await request.save();

    const populated = await request.populate([
      { path: 'senderId', select: 'name email city profileImage' },
      { path: 'receiverId', select: 'name email city profileImage' },
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