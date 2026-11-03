const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

function initGridFS() {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs"
  });
}

function getGridFSBucket() {
  if (!bucket) initGridFS();
  return bucket;
}

module.exports = { getGridFSBucket };
