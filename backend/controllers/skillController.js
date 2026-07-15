const Skill = require('../models/Skill');

// @desc Add skill
const addSkill = async (req, res) => {
  try {
    const { teachSkill, learnSkill, experience, availability } = req.body;

    if (!teachSkill?.length || !learnSkill?.length) {
      return res.status(400).json({ message: 'Teach aur Learn skills required hain' });
    }

    // Ek user ka ek hi skill-set record rakhte hain (agar exist karta hai to update kardo)
    let skill = await Skill.findOne({ userId: req.user._id });

    if (skill) {
      skill.teachSkill = teachSkill;
      skill.learnSkill = learnSkill;
      skill.experience = experience || skill.experience;
      skill.availability = availability || skill.availability;
      await skill.save();
    } else {
      skill = await Skill.create({
        userId: req.user._id,
        teachSkill,
        learnSkill,
        experience,
        availability,
      });
    }

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my skills
const getMySkills = async (req, res) => {
  try {
    const skill = await Skill.findOne({ userId: req.user._id });
    res.json(skill || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update skill by id
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    skill.teachSkill = req.body.teachSkill || skill.teachSkill;
    skill.learnSkill = req.body.learnSkill || skill.learnSkill;
    skill.experience = req.body.experience || skill.experience;
    skill.availability = req.body.availability || skill.availability;

    const updated = await skill.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addSkill, getMySkills, updateSkill, deleteSkill };