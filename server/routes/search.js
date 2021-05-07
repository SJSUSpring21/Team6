const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/search", (req, res) => {
    const {input } = req.body;
    const base = "https://data.diversitydatakids.org/api/search/dataset";
    let myUrl = new URL(base);
    myUrl.searchParams.append("fq", "");
    myUrl.searchParams.append("q", input);
    myUrl.searchParams.append("fl", "title,notes,id");
    myUrl.searchParams.append("rows","1000")
    const result = fetch(
    myUrl
  )
    .then((result) => {
      return result.json();
    })
    .then((json) => {
        res.status(200).send(json);
    }).catch((err)=>{
        res.status(404).send({success:false});
    });
});



module.exports = router;
