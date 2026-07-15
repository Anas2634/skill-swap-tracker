// Google Meet asal codes lowercase letters se bany hoty hain, pattern: xxx-xxxx-xxx
// Yahan hum bilkul wesa hi random-looking code generate kar k link bana rahy hain.
// NOTE: Ye asal Google Meet API se create nahi hota (koi OAuth setup nahi lagta),
// bas ek unique meeting-style link generate ho k dono matched users k beech store ho jata hai.

const CHARS = 'abcdefghijklmnopqrstuvwxyz';

const randomBlock = (length) => {
  let block = '';
  for (let i = 0; i < length; i++) {
    block += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return block;
};

const generateMeetLink = () => {
  const code = `${randomBlock(3)}-${randomBlock(4)}-${randomBlock(3)}`;
  return `https://meet.google.com/${code}`;
};

module.exports = generateMeetLink;
