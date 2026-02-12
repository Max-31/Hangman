const { default: mongoose } = require('mongoose');
const Contribution = require('../db/models/contribution.model');
const Genre= require('../db/models/genre.model');
const Word= require('../db/models/word.model');
const sendEmail = require('../utils/sendEmail');
const Player = require('../db/models/player.model');

// player functions
const addRequest= async(req, res)=>{
    try{
        const { userID, contributionType, newGenre, linkedGenre, word }= req.body;

        if(!userID || !contributionType || !word){
            return res.status(400).json({ message: "Missing required fields" });
        }

        // const cleanWord = word.trim().toLowerCase();

        if(contributionType === 'genre'){
            if(!newGenre){
                return res.status(400).json({ message: "New Game Name is required for Genre contributions." })
            }

            const existingGenre = await Genre.findOne({
                name: { $regex: new RegExp(`^${newGenre}$`, 'i') }
            })
            // ^ -> matches start of string
            // $ -> matches end of string 
            // without those -> "Art" matches "Artifact" or "Artificial" BUT we need it to match "Art" ONLY 
            // 'i' -> Case insensitive

            if(existingGenre){
                return res.status(409).json({ message: "Genre already exists" });
            }

            // const existingWord = await Word.findOne({
            //     word: word
            // }).populate('genre')

            // if(existingWord){
            //     return res.status(409).json({ message: `This Word already exists in ${existingWord.genre.name}.` });
            // }
        } 
        else if(contributionType === 'word'){
            if(!linkedGenre){
                res.status(400).json({ message: "Linked Genre ID is required for Word contributions." })
            }

            const genreExists = await Genre.findById(linkedGenre);
            if(!genreExists){
                return res.status(404).json({ message: "The target Genre No Longer Exists" });
            }

            const existingWord = await Word.findOne({
                word: word.trim().toLowerCase(),
                genre: linkedGenre
            })

            if(existingWord){
                return res.status(409).json({ message: "Word already exists in this genre." });
            }
        }
        else{
            return res.status(400).json({ message: "Invalid Contribution Type" });
        }

        const newContrib = new Contribution({
            userID,
            contributionType,
            newGenre: contributionType ==='genre' ? newGenre : undefined,
            linkedGenre: contributionType === 'word' ? linkedGenre : undefined,
            word: word.trim().toLowerCase()
        })

        await newContrib.save();

        let genreName = newGenre;
        if(contributionType === 'word'){
            const g = await Genre.findById(linkedGenre);
            genreName = g ? g.name : 'Unknown Genre';
        }

        const contributorData= await Player.findById(userID);

        const emailSubject = `New Contribution: ${word.toUpperCase()}`;
        const emailBody = `
            <div style="background-color: #020126; padding: 40px 20px; font-family: 'Arial', sans-serif; color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #0A0140; padding: 30px; border-radius: 12px; border: 1px solid #150259; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    
                    <h2 style="color: #6863F2; margin-top: 0; text-align: center; border-bottom: 2px solid #4630D9; padding-bottom: 20px;">
                        New Contribution Received
                    </h2>

                    <div style="margin: 30px 0;">
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #6863F2;">Contributor Name:</strong> 
                            <span style="color: #ffffff; font-size: 16px;">${contributorData?.userName || 'Unknown'}</span>
                        </p>
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #6863F2;">Contributor ID:</strong> 
                            <span style="color: #a0a0a0; font-size: 14px;">${userID}</span>
                        </p>
                        
                        <hr style="border: 0; border-top: 1px solid #150259; margin: 20px 0;">

                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #6863F2;">Type:</strong> 
                            <span style="background-color: #150259; color: #6863F2; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; letter-spacing: 1px;">${contributionType.toUpperCase()}</span>
                        </p>
                        <p style="margin: 12px 0; font-size: 18px;">
                            <strong style="color: #6863F2;">Word:</strong> 
                            <strong style="color: #ffffff; font-size: 20px; letter-spacing: 1px;">${word}</strong>
                        </p>
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #6863F2;">Genre:</strong> 
                            <span style="color: #ffffff;">${genreName}</span>
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                        <a href="${process.env.ADMIN_URL}" style="background-color: #4630D9; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(70, 48, 217, 0.4);">
                            Review in Admin Panel
                        </a>
                    </div>

                    <p style="text-align: center; color: #464660; font-size: 12px; margin-top: 30px;">
                        Hangman Game Automation System
                    </p>
                </div>
            </div>
        `;

        // sendEmail(emailSubject, emailBody);
        sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: emailSubject,
            htmlContent: emailBody
        });

        res.status(201).json({ message: "Contribution Submitted Successfully!", request: newContrib });

    }
    catch(err){
        console.log("Error in addRequest: ");
        console.log(err);

        res.status(500).json({ message: "Server Error" });
    }
}

const getMyRequests = async(req, res)=>{
    try{
        const {userID} = req.params;

        const requests = await Contribution.find({userID}) 
            .populate('linkedGenre', 'name')
            .sort({ updatedAt: -1 });

        // if(!requests || requests.length===0){
        //     return res.status(200).json({ message: "No Request is Found!", requests: [] });
        // }
        
        res.status(200).json(requests);
    }
    catch(err){
        console.log("Error get my requests: ");
        console.log(err);
        res.status(500).json({ message: "Error fetching requests" });
    }
}

const getGenres = async(req, res)=>{
    try{
        const genres = await Genre.find({}, { name: 1, _id: 1 }).sort({ name: 1 });
        
        // if(!genres || genres.length===0){
        //     return res.status(200).json({ message: "No Request is Found!", genres: [] });
        // }
        
        res.status(200).json(genres);
    }
    catch(err){
        console.log("Error getting genre: ");
        console.log(err);
        
        res.status(500).json({ message: "Error in fetching genres" });
    }
}

// admin functions -> middleware : isAdmin 
const getAllRequests = async(req, res)=>{
    try{
        const {status} = req.query;
        
        let query = {};
        
        if(status) query.status = status;
        
        const requests = await Contribution.find(query)
        .populate('userID', 'userName')
        .populate('linkedGenre', 'name')
        .sort({ updatedAt: -1 });
        
        // if(!requests || requests.length===0){
        //     return res.status(200).json({ message: "No Request is Found!", requests: [] });
        // }

        res.status(200).json(requests);
    }
    catch(err){
        console.log("Error getting admin requests: ");
        console.log(err);

        res.status(500).json({ message: "Error in fetching contribution requests for admin" })
    }
}

const generateWordData = (wordStr) => {
    const wordMap= {};
    const wordPos= {};
    for(let i=0; i<wordStr.length; i++){
        const char= wordStr[i];

        if(!wordPos[char]){
            wordPos[char]= [];
        }

        wordPos[char].push(i);

        wordMap[char]= (wordMap[char] || 0 ) + 1;
    }

    return {wordMap, wordPos};
}

const reviewRequest = async(req, res) => {
    let session = null;

    try{
        const {requestID, action, adminComment} = req.body;

        if(!requestID || !['APPROVED', 'DENIED'].includes(action)){
            return res.status(400).json({ message: "Invalid Request ID or Action" });
        }

        const contribution = await Contribution.findById(requestID);

        if(!contribution){
            return res.status(404).json({ message: "Contribution request NOT Found" });
        }

        if(contribution.status !== 'PENDING'){
            return res.status(400).json({ message: "This request has already been processed" });
        }

        // DENIAL
        if(action === 'DENIED'){
            if(!adminComment){
                return res.status(400).json({ message: "A comment is required when denying a request" });
            }

            contribution.status = 'DENIED';
            contribution.adminComment = adminComment;
            contribution.isReadByPlayer= false;
            await contribution.save();

            return res.status(200).json({ message: "This contribution request has been Denied by Admin.", contribution});
        }

        // APPROVAL
        if(action === 'APPROVED'){

            session = await mongoose.startSession();
            session.startTransaction();

            // word to existing genre
            if(contribution.contributionType === 'word'){

                // I'm sending { session } to queries ensuring it's part of transaction
                const genreExists = await Genre.findById(contribution.linkedGenre).session(session);
                if(!genreExists){
                    return res.status(404).json({ message: "The target Genre No Longer Exists" });
                }

                const existingWord = await Word.findOne({
                    word: contribution.word.trim().toLowerCase(),
                    genre: contribution.linkedGenre
                }).session(session)

                if(existingWord){
                    contribution.status = 'DENIED';
                    contribution.adminComment = 'System: Auto-Denied because Your Suggested Word already exists.';
                    contribution.isReadByPlayer= false;
                    await contribution.save({ session });

                    await session.commitTransaction(); // here I'm actually saving the denial data
                    session.endSession();
                    return res.status(409).json({ message: "Word already exists in this genre." });
                }

                const { wordMap, wordPos } = generateWordData(contribution.word.trim().toLowerCase());

                const newWordEntry = new Word({
                    word: contribution.word.trim().toLowerCase(),
                    genre: contribution.linkedGenre,
                    contributor: contribution.userID,
                    wordMap,
                    wordPos
                })
                await newWordEntry.save({session})
            }

            // NEW genre + word
            else if(contribution.contributionType === 'genre'){
                
                const existingGenre = await Genre.findOne({
                    name: { $regex: new RegExp(`^${contribution.newGenre.trim().toUpperCase()}$`, 'i') }
                }).session(session)
                // ^ -> matches start of string
                // $ -> matches end of string 
                // without those -> "Art" matches "Artifact" or "Artificial" BUT we need it to match "Art" ONLY 
                // 'i' -> Case insensitive

                if(existingGenre){
                    contribution.status = 'DENIED';
                    contribution.adminComment = 'System: Genre already exists. You may try to \'Add Word\' instead of \'Add Genre\'';
                    contribution.isReadByPlayer= false;
                    await contribution.save({session});

                    await session.commitTransaction(); // similary here I'm actually committing the save 'denial' thingy
                    session.endSession();
                    return res.status(409).json({ message: "Genre already exists" });
                }

                const newGenreEntry = new Genre({
                    name: contribution.newGenre.trim().toUpperCase()
                })
                const savedGenre = await newGenreEntry.save({session});

                const { wordMap, wordPos } = generateWordData(contribution.word.trim().toLowerCase());

                const newWordEntry = new Word({
                    word: contribution.word.trim().toLowerCase(),
                    genre: savedGenre._id,
                    contributor: contribution.userID,
                    wordMap,
                    wordPos
                })

                await newWordEntry.save({session});
            }

            contribution.status = 'APPROVED';
            contribution.adminComment = adminComment || "Approved!";
            contribution.isReadByPlayer= false;
            await contribution.save({session});

            await session.commitTransaction(); // similarly here also I'm doing Save Everything at Once
            session.endSession();
            return res.status(201).json({ message: "Contribution Approved & Added to Game!", contribution })
        }
    }
    catch(err){
        console.log("Error reviewing request:");
        console.log(err);

        // This is My Roll back logic
        if(session){
            await session.abortTransaction();
            session.endSession();
        }

        res.status(500).json({ message: "Server Error during review." });
    }
}

const getNotificationCount = async(req, res)=>{
    try{
        const { userID }= req.params;

        const count = await Contribution.countDocuments({
            userID: userID,
            status: {$ne: 'PENDING'},
            isReadByPlayer: false
        })

        res.status(200).json({ count });

    }
    catch(err){
        console.log("Error in getNotificationCount function");
        console.log(err);
        res.status(500).json({ message: "Error fetching notifications" });
    }
}

const markAsRead = async(req, res)=>{
    try{
        const { userID }= req.body;
        await Contribution.updateMany(
            {
                userID: userID,
                isReadByPlayer: false
            },
            {
                $set: {
                    isReadByPlayer: true
                }
            }
        );

        res.status(200).json({ message: "Notifications clearedd" });
    }
    catch(err){
        console.log("Error in markAsRead function");
        console.log(err);
        res.status(500).json({ message: "Error clearing notifications" });
    }
};

module.exports = {
    addRequest,
    getMyRequests,
    getGenres, 
    getAllRequests,
    reviewRequest,
    getNotificationCount,
    markAsRead
}