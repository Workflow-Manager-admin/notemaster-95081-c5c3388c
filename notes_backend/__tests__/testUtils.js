const fs = require('fs');
const path = require('path');

const notesFile = path.join(__dirname, '../notes_data.json');
const usersFile = path.join(__dirname, '../user_data.json');

// PUBLIC_INTERFACE
function resetDataFiles() {
  if (fs.existsSync(notesFile)) fs.unlinkSync(notesFile);
  if (fs.existsSync(usersFile)) fs.unlinkSync(usersFile);
}

module.exports = {
  notesFile,
  usersFile,
  resetDataFiles,
};
