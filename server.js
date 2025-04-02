const express=require(`express`);
const { default: mongoose } = require("mongoose");
const shortUrl = require(`./models/shortUrl`)
mongoose.connect('mongodb://localhost/urlShortner')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Connection error:', err));


const app=express();
app.use(express.urlencoded({extended:false}))

app.set(`view engine`,`ejs`)
app.get(`/`,async (req,res)=>{
    const shortUrls=await shortUrl.find();
    res.render(`index`,{shortUrls: shortUrls})
})

app.post(`/shortUrls`,async(req,res)=>{
    await shortUrl.create({full: req.body.fullUrl})
    res.redirect(`/`)
})


app.get('/:shortUrl', async (req, res) => {
    const shorturl = await shortUrl.findOne({ short: req.params.shortUrl })
    if (shorturl == null) return res.sendStatus(404)
  
        shorturl.clicks++
        shorturl.save()
  
    res.redirect(shorturl.full)
  })
  
app.listen(process.env.PORT || 5000);
