const fs = require('fs');
const express = require('express');
const cors = require('cors')
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {

        if (file) {
            const extension = file.originalname.split('.')[1];
            const nameFile = req.body.name.split(' ').join('-');
            cb(null, `${nameFile}-${Date.now()}.${extension}`);
        }

    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const tla = req.body.tla.toUpperCase();
        const dataTeams = JSON.parse(fs.readFileSync('data/teams.db.json'));
        if (dataTeams.find(dataTeam => dataTeam.tla === tla)) {
            cb(null, false);
        } else {
            cb(null, true);
        }

    }
});

const editImageUpload = multer({ storage: storage });

const PORT = 8080;
const BASEURL = 'https://crud-clubes-back.onrender.com/';
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/uploads`));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));

    const teamsNew = teams.map(team => {
        return { ...team, infoUrl: `/team/watch/${team.tla}` };
    })

    res.send(teamsNew);
});

app.put('/', (req, res) => {
    const resetTeams = JSON.parse(fs.readFileSync('./data/teams.json'));
    fs.writeFileSync('./data/teams.db.json', JSON.stringify(resetTeams));

    const folderPath = 'crud-clubes-back/uploads/images';
    const fileNames = fs.readdirSync(folderPath);
    for (const file of fileNames) {
        fs.unlinkSync(`${folderPath}/${file}`);
    };

    res.status(200).send('The teams have been successfully reset');
});

app.get('/team/watch/:tla', (req, res) => {

    const tlaTeam = req.params.tla;
    const dataTeams = JSON.parse(fs.readFileSync(`data/teams.db.json`));
    const dataTeam = dataTeams.find((dataTeam) => dataTeam.tla === tlaTeam);

    res.send(dataTeam);
});

app.post('/team/add', upload.single('image'), (req, res) => {
    const { name, country, address, website, founded, venue } = req.body;
    const tla = req.body.tla.toUpperCase();

    const dataTeams = JSON.parse(fs.readFileSync('data/teams.db.json'));

    if (dataTeams.find(dataTeam => dataTeam.tla === tla)) {

        res.status(400).send('Could not load the team because the tla already exists');

    } else {
        const newTeam = {
            name,
            tla,
            area: {
                name: country
            },
            address,
            website,
            founded,
            venue,
            crestUrl: `${BASEURL}${req.file.filename}`,
        }
        dataTeams.push(newTeam);
        fs.writeFileSync('data/teams.db.json', JSON.stringify(dataTeams));
        res.status(200).send('Success, the team has been loaded successfully');
    }
});


app.put('/team/edit/:tla', editImageUpload.single('image'), (req, res) => {
    const { name, country, address, website, founded, venue } = req.body;
    const tlaTeam = req.params.tla;

    const dataTeams = JSON.parse(fs.readFileSync('data/teams.db.json'));
    const dataTeam = dataTeams.find((d) => d.tla === tlaTeam);
    const newDataTeams = dataTeams.filter((data) => data.tla !== tlaTeam);

    const currentTeamData = {
        ...dataTeam,
        name,
        area: {
            name: country,
        },
        address,
        website,
        founded,
        venue,
    };

    if (req.file) {
        currentTeamData.crestUrl = `${BASEURL}images/${req.file.filename}`;

        const urlPath = dataTeam.crestUrl.split('/images/')[1];
        if (fs.existsSync(`uploads/images/${urlPath}`)) {
            fs.unlinkSync(`uploads/images/${urlPath}`);
        }
    }

    newDataTeams.push(currentTeamData);
    fs.writeFileSync('data/teams.db.json', JSON.stringify(newDataTeams));

    res.status(200).send('Success, the team has been loaded successfully');

});


app.delete('/team/delete/:tla', (req, res) => {
    const tlaTeam = req.params.tla;
    const dataTeams = JSON.parse(fs.readFileSync(`data/teams.db.json`));
    const dataTeam = dataTeams.find((d) => d.tla === tlaTeam);
    const newDataTeams = dataTeams.filter((team) => team.tla !== tlaTeam);
    const urlPath = dataTeam.crestUrl.split('/images/')[1];
    if (fs.existsSync(`uploads/images/${urlPath}`)) {
        fs.unlinkSync(`uploads/images/${urlPath}`);
    }

    fs.writeFileSync('data/teams.db.json', JSON.stringify(newDataTeams));
    res.status(200).send('the team has been delete successfully');
});

app.listen(PORT)
console.log(`Listening in http://localhost:${PORT}`);