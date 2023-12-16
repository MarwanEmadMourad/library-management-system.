const express = require("express");
const Borrower = require("../../models/borrower");


const router = new express.Router();

// adding new borrower
router.post("/Borrower", async (req, res) => {
    const newBorrower = req.body;
    try {
        const borrowerExist = await Borrower.findOne({ where:{ email: newBorrower.email } })
        if (borrowerExist) {
            throw new Error("Borrower is already registered.");
        } else {
            const record = await Borrower.create(newBorrower);
            res.status(200).send({
                message:"Borrower registered successfuly"
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// updating a borrower
router.patch("/Borrower", async (req, res) => {
    const borrowerId = req.body.id;
    try {
        const updated = await Borrower.update(req.body , { where: { id: borrowerId } })
            if(updated[0] === 1){
                res.status(200).send({
                    message:"Borrower updated successfuly"
                });
            } else {
                res.status(404).send({
                    message:"No Borrowers found to update."
                });
            }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// deleting a borrower
router.delete("/Borrower", async (req, res) => {
    const borrowerId = req.body.id;
    try {
        const deleted = await Borrower.destroy({ where: { id: borrowerId } })
        if(deleted){
            res.status(200).send({
                message:"Borrower deleted successfuly"
            });
        } else {
            res.status(404).send({
                message:"No borrowers found to delete."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// getting all borrowers
router.get("/Borrowers", async (req, res) => {
    try {
        const borrowers = await Borrower.findAll({attributes: ['id', 'name','email']});
        if(borrowers.length) {
            res.status(200).send({
                borrowers:borrowers
            });
        } else {
            res.status(404).send({
                "message":"No borrowers found."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});


module.exports = router;
