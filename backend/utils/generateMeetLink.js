

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

const randomBlock = (length) => {
  let block = '';
  for (let i = 0; i < length; i++) {
    block += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return block;
};

const generateMeetLink = () => {
  const roomName = `SkillSwap-${randomBlock(10)}`;
  return `https://meet.jit.si/${roomName}`;
};

module.exports = generateMeetLink;
