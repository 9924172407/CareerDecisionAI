const express = require("express");
const router = express.Router();
const accountService = require("../../services/alpacaService");

router.post("/", accountService.createAccount);
router.get("/all", accountService.getAllAccounts);
router.get("/position/:accountId", accountService.getUserPositions);
router.get("/:accountId", accountService.getAccount);
router.put("/:accountId", accountService.updateAccount);

module.exports = router;
