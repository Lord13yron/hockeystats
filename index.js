import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://records.nhl.com/site/api"

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", async (req,res) =>{
    try {
        const result = await axios.get(API_URL + "/franchise/");
        res.render("index.ejs", { teams: result.data.data });
        return
      
    } catch (error) {
        res.status(404).send(error.response.data);
    }
})

app.post("/submit", async (req, res) =>{
    let teamId = req.body.teamId
    try {
        const result = await axios.get(API_URL + "/franchise-team-totals/");
        let regSeason;
        let playoffs;
        result.data.data.forEach(function(stat) {
            if (stat.franchiseId == teamId && stat.gameTypeId == 2 && stat.activeTeam == true){
                 regSeason = stat;
            } else if (stat.franchiseId == teamId && stat.gameTypeId == 3 && stat.activeTeam == true){
                 playoffs = stat
            }
        });
        res.render("team.ejs", {
            team: teamId, 
            regStats: regSeason, 
            poStats: playoffs,
        });
        return
      
    } catch (error) {
        res.status(404).send(error.response.data);
    }
    
    res.render("team.ejs", {team: teamId})
})

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})