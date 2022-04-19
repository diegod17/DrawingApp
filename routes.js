let path = require("path");
let express = require("express");
let router = express.Router();

router.get("/",function(req,res) {
  res.sendFile(path.resolve(__dirname,"index.html"));
});

router.get("/gallery",function(req,res) {
  res.sendFile(path.resolve(__dirname,"gallery.html"));
});
router.get("/d",function(req,res) {
  res.sendFile(path.resolve(__dirname,"deleteStuff.html"));
});

module.exports = router;