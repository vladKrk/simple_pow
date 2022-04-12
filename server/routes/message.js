const express = require('express')
const {sha256} = require("js-sha256");

const router = express.Router();

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Check message correct hashed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nonce:
 *                 type: integer
 *               message:
 *                  type: string
 *               difficulty:
 *                  type: integer
 *     responses:
 *       200:
 *         description: success if message correct hashed.
 *       500:
 *         description: error if message incorrect hashed.
 */
router.post('/message', (req, res) => {
    const { message, nonce, difficulty } = req.body
    if (sha256.hex(nonce + message).slice(0, difficulty).split('').some(e => e !== '0')) {
        return res.status(500).json({ status: 'error'})
    } else {
        return res.status(200).json({ status: 'success'})
    }
});

module.exports = router;