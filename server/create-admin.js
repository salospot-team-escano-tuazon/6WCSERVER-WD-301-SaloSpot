// Usage: npm run create-admin
// Creates an admin account, or resets the password if the username already exists.
require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
    rl._writeToOutput = (text) => {
      if (hidden && rl.muted) rl.output.write(text.replace(/[^\r\n]/g, '*'));
      else rl.output.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
    rl.muted = true;
  });
}

async function main() {
  try {
    const username = (await ask('Admin username: ')).trim().toLowerCase();
    const password = await ask('Admin password (min 8 characters): ', true);
    const confirm = await ask('Confirm password: ', true);

    if (username.length < 3) throw new Error('Username must be at least 3 characters.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (password !== confirm) throw new Error('Passwords do not match.');

    await mongoose.connect(process.env.MONGODB_URI);
    const passwordHash = await bcrypt.hash(password, 12);

    const existing = await User.findOne({ username });
    if (existing) {
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log(`Password updated for admin "${username}".`);
    } else {
      await User.create({ username, passwordHash, role: 'admin' });
      console.log(`Admin "${username}" created.`);
    }
  } catch (err) {
    console.error('Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();