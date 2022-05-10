const app = require('express')();
const mongoose = require('mongoose');
const ngblade = require('./schemas/ngblade');
const get = require('node-fetch2');
require('dotenv').config();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to the Database")
}).catch((err) => {
    console.log(err);
});

app.listen(
    PORT,
    () => console.log(`Listening to http://localhost:${PORT}`)
)

app.get('/player/:id', async (req, res) => {
    let { id } = req.params;
    if (/[a-zA-Z]/.test(id)) {
        let p = await get(`https://api.ngmc.co/v1/players/${id}`);
        if (!p || p.status != 200) return res.status(404).send(await p.json());
        p = await p.json();
        id = p.xuid;
    }
    let player = await ngblade.findOne({ id: id });
    if (!player) res.status(404).send({
        player: id,
        code: 404,
        msg: "Player was not found in the database."
    })

    res.status(200).send({
        id: player.id,
        data: player.data
    });
})

app.get('/guild/:id', async (req, res) => {
    let { id } = req.params;
    let g = await get(`https://api.ngmc.co/v1/guilds/${id}`);
    if (!g || g.status != 200) return res.status(404).send(await g.json());
    g = await g.json();
    id = g.name;
    let guild = await ngblade.findOne({ id: id });
    if (!guild) res.status(404).send({
        guild: id,
        code: 404,
        msg: "Guild was not found in the database."
    })

    res.status(200).send({
        id: guild.id,
        data: guild.data
    })
})