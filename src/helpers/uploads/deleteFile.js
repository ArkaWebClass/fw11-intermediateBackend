const fs = require("fs");

const deleteFile = (filePath) => {
  console.log("PROSES DELETE", filePath);
  // fs.exsistSync // untuk mengecek keberadaan si file
  // fs.unlink // MENGHAPUS FILE
};

module.exports = deleteFile;
