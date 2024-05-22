import express from"express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000; 
const API_URL = "https://api.balldontlie.io/v1";
const ApiKey = "63c73d28-522d-4677-be0d-62f71e452c3f";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req, res)=>{
    res.render("index.ejs");
})

//14.05.24 新增 action = "/players" //21.05.24 ry to search player by names
app.post("/players", async (req, res) => {
    const playerFirstName = req.body.fname;
    const UrlToPlayerByName = `${API_URL}/players/?search=${playerFirstName}`;
    
    try {
        const result = await axios.get(UrlToPlayerByName, {
            headers: {
                Authorization: ApiKey,
            }
        });
        const players = result.data.data;
        if (players.length > 0) {
            res.render("result.ejs", { players: players });
        } else {
            res.render("result.ejs", { error: "No players found with this name." });
        }
    } catch (error) {
        console.error(error);
        res.render("result.ejs", { error: "Failed to fetch player data" });
    }
});
        
//height conveter
function convertHeightToCm(height) {
    const [feet,inches] = height.split(`-`).map(Number);   //用height.split 分開原有的資料.map(Number) 設定為數字
    const cm = (feet*30.48)+(inches*2.54) 
    return cm.toFixed(0); 
}
// weight converter 
function convertWeightToKg(pounds) {
    const kg = pounds * 0.453592; 
        return kg.toFixed(0); 
    } 


      
//player details with id from API
app.post("/playerdetails", async (req, res) => {
    const player_ids = req.body.playerId;
    const playerDetailsRoute = `${API_URL}/players`;
    
    try {
        const result = await axios.get(playerDetailsRoute, {
            headers: {
                Authorization: ApiKey,
            },
            params: {
                "player_ids[]": player_ids,
            }
        });
        const details = result.data.data[0];
        if (details) {
            // 21.05.24 conver height and weight NOT Working yet!!!
            // moreDetails.height_cm = convertHeightToCm(details.height);
            // moreDetails.weight_kg = convertHeightToCm(details.weight);
            
            res.render("playerDetails.ejs", { moreDetails: details });
        } else {
            res.render("playerDetails.ejs", { error: "Player details not found" });
        }
    } catch (error) {
        console.error(error);
        res.render("playerDetails.ejs", { error: "Failed to fetch player details" });
    }
});

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})