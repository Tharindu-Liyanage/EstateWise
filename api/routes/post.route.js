import express from 'express';

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("router works");
});

router.post("/test", (req, res) => {
    res.send("router works");
});

router.put("/test", (req, res) => {
    res.send("router works");
});

router.delete("/test", (req, res) => {
    res.send("router works");
});

export default router;
