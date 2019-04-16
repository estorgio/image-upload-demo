const util = require('util');
const fs = require('fs');

const unlink = util.promisify(fs.unlink);

async function deleteFile(imageFile) {
  if (imageFile && fs.existsSync(imageFile)) {
    await unlink(imageFile);
  }
}

function cleanupFiles() {
  const cleanup = async (req) => {
    if (!req.file) return;
    await deleteFile(req.file.path);
    await deleteFile(req.file.minified);
  };
  return [
    async (req, res, next) => {
      await cleanup(req);
      next();
    },
    async (err, req, res, next) => {
      await cleanup(req);
      next(err);
    },
  ];
}

module.exports = cleanupFiles();
