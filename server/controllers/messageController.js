
import Chat from "../models/Chat.js"; 
import User from "../models/User.js";
import imageKit from "../configs/imageKit.js";
import { GoogleGenAI } from "@google/genai";
import axios from 'axios'; 

//Text-based AI Chat Message Controller 
export const textMessageController = async (req,res) => { 
  try {
    const userId = req.user._id; 

    //Check credits 
    if(req.user.credits < 1){
      return res.json({success : false , message : "You don't have to engough credits to use this feature"}); 
    }

    const {chatId, prompt} = req.body; 

    const chat = await Chat.findOne({userId , _id : chatId}); 
    chat.messages.push({role : "user", content : prompt , timestamp : Date.now(), isImage : false});

    
    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

    const systemPrompt = `You are CryptoBaba — a witty, sharp, and highly knowledgeable cryptocurrency expert AI assistant.

YOUR RULES (follow strictly, no exceptions):
1. You ONLY answer questions related to: cryptocurrency, Bitcoin, Ethereum, altcoins, blockchain technology, DeFi, NFTs, Web3, crypto trading, tokenomics, wallets, crypto exchanges, market analysis, and anything crypto/blockchain related.
2. If the user asks about ANYTHING else (food, movies, sports, relationships, coding, general knowledge, etc.) — you MUST refuse in a funny, dramatic, witty way in HINDI (Hinglish is fine). Be creative, humorous, and exaggerated. Use emojis. Never be rude — just funny.
3. Keep your Hindi refusal responses SHORT (2-4 lines max), punchy, and hilarious.
4. For crypto questions, respond helpfully, accurately, and in the same language the user used.

EXAMPLE Hindi refusal responses for off-topic questions (use variety, don't repeat):
- "Bhai, main CryptoBaba hoon, Bollywood ka critic nahi! 😂 Mujhse Bitcoin ke baare mein poocho, film reviews ke liye Google baba hai! 🙏"
- "Arre yaar, yeh sawaal crypto se kitna door hai jitna Dogecoin ka future bright nahi! 😅 Seedha poocho — BTC, ETH, DeFi?"
- "Main sirf crypto ki baat karta hoon bhai! Yeh sawaal sun ke mera wallet aur bhi khaali ho gaya! 😭💸"
- "Bhai, crypto chhod ke yeh pooch raha hai? Lagta hai tera portfolio bhi aise hi off-track hai! 😂 Seedha reh, crypto pe focus kar!"

Now respond to this user message: ${prompt}`;

    const {text} = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemPrompt,
    });
  

    const reply = {
      role : "assistant" ,
      content : text,
      timestamp : Date.now(),
       isImage : false
      }

    chat.messages.push(reply); 
    await chat.save(); 
    await User.updateOne({_id : userId} , {$inc : {credits : -1}});
    res.json({success : true, reply}); 

  } catch (error) {
    
    res.json({success : false, message : error.message}); 
  }
}

//Image generation message controller 
export const imageMessageController = async (req,res)=> { 
  try {
    const userId = req.user._id; 
    //check credits
    if(req.user.credits < 2){
      return res.json({success : false , message : "You don't have to engough credits to use this feature"}); 
    }

    const {prompt, chatId, isPublished} = req.body; 
    //find chat 
    const chat = await Chat.findOne({userId, _id : chatId}); 
    //push user message 

    chat.messages.push({
      role : 'user', 
      content : prompt , 
      timestamp : Date.now(), 
      isImage : false
    }); 

    //Encode the prompt
    const encodedPrompt = encodeURIComponent(prompt); 

    //Construct Imagekit AI generation URL
    const generatedImageUrl =  `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/mindgpt/${Date.now()}.png?tr=w-800,h-800`; 

    //Trigger generation by fetching from imagekit
    const aiImageResponse = await axios.get(generatedImageUrl , {responseType : 'arraybuffer'})

    //Convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"Buffer").toString('base64')}`


    // console.log(imageKit);
    //Upload to ImageKit Media Libarary 
    const uploadResponse = await imageKit.upload({
      file : base64Image, 
      fileName : `${Date.now()}.png`, 
      folder : 'mindgpt'
    })

    const reply = { 
        role : 'assistant', 
        content : uploadResponse.url, 
        timestamp : Date.now(), 
        isImage : true, 
        isPublished
    }

    res.json({success : true, reply}); 

    chat.messages.push(reply); 
    await chat.save(); 

    await User.updateOne({_id : userId}, {$inc : {credits : -2}}); 

  } catch (error) {
    res.json({success : false, message : error.message}); 
  }
}

//API  to get published images 
export const getPublishedImages = async (req,res)=> { 
  try {
   const publishedImageMessages = await Chat.aggregate([
        {$unwind : "$messages"},
        {
          $match : {
            "messages.isImage" : true, 
            "messages.isPublished" : true
          }
        }, 
        {
          $project : {
            _id : 0, 
            imageUrl : "$messages.content", 
            userName : "$userName"
          }
        }
   ])

   res.json({success : true, images:  publishedImageMessages.reverse()}); 
  }catch (error) {
    res.json({success : false, message : error.message}); 
  }
}