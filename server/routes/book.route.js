import express from "express"
import 
{addtoWatchlist,currentlyreading,reading,showingthebookcurrentlyreading,updatebookprogress,movingtocompleted,completedbook,setbookgoal,getUserStats,deletebookById,refreshToken} 
from "../controllers/book.controller.js"
import {getFictionBooks,searchBooks} from "../controllers/googleBooks.controller.js"
// import { protect } from "../Middlewear/auth.js"

const router=express.Router()
router.post("/watchlist",addtoWatchlist)
router.get("/currentlyreading/:id",currentlyreading)
router.patch("/reading",reading)
router.get("/currently-reading/:id",showingthebookcurrentlyreading)
router.patch("/updatebookprogress",updatebookprogress)
router.patch("/movingtocompleted",movingtocompleted)
router.get('/completedbook/:id',completedbook)
router.patch("/setbookgoal",setbookgoal)
router.get("/getUserStats/:userId",getUserStats)
router.delete("/deletebookById/:userId/:bookid",deletebookById)
router.post("/refresh-token", refreshToken);
router.get("/fiction", getFictionBooks);
router.get("/search", searchBooks);
export default router;