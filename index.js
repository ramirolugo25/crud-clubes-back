const fs = require('fs');
const express = require('express');
// const exphbs = require('express-handlebars');
// const multer = require('multer');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/images')
//     },
//     filename: function (req, file, cb) {

//         if (file) {
//             const extension = file.originalname.split('.')[1];
//             const nameFile = req.body.name.split(' ').join('-');
//             cb(null, `${nameFile}-${Date.now()}.${extension}`);
//         }

//     }
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         const tla = req.body.tla.toUpperCase();
//         const dataTeams = JSON.parse(fs.readFileSync('data/teams.db.json'));
//         if (dataTeams.find(dataTeam => dataTeam.tla === tla)) {
//             cb(null, false);
//         } else {
//             cb(null, true);
//         }

//     }
// });

// const editImageUpload = multer({ storage: storage });

const PORT = 8080;
const app = express();
// const hbs = exphbs.create();


app.use(express.static(`${__dirname}/uploads`));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

app.get('/', (req, res) => {

    const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
    const teamsAmount = teams.length;
    const teamsNew = teams.map(team => {
        return {...team, infoUrl: `/team/watch/${team.tla}`};
    })

    const dataTeams = {
        count : teamsAmount,
        teamsNew,
    }
    res.send(dataTeams);
});

// app.post('/', (req, res) => {

//     const resetTeams = JSON.parse(fs.readFileSync('./data/teams.json'));
//     fs.writeFileSync('./data/teams.db.json', JSON.stringify(resetTeams));

//     const folderPath = './uploads/images';
//     const fileNames = fs.readdirSync(folderPath);
//     for (const file of fileNames) {
//         fs.unlinkSync(`${folderPath}/${file}`);
//     };

//     res.redirect('/');
// });

app.get('/team/watch/:tla', (req, res) => {

    const tlaTeam = req.params.tla;
    const dataTeams = JSON.parse(fs.readFileSync(`data/teams.db.json`));
    const dataTeam = dataTeams.find((dataTeam) => dataTeam.tla === tlaTeam);
    
    res.send(dataTeam);

    // res.render('team', {
    //     layout: 'home',
    //     data: {
    //         country: area.name,
    //         name,
    //         image: crestUrl,
    //         address,
    //         website,
    //         founded,
    //         venue,
    //         tla: tlaTeam
    //     },
    // });
});

// app.get('/team/new', (req, res) => {

//     res.render('newTeam', {
//         layout: 'home',
//     });

// });

// app.post('/team/new', upload.single('image'), (req, res) => {
//     const { name, country, address, website, founded, venue } = req.body;
//     const tla = req.body.tla.toUpperCase();

//     const dataTeams = JSON.parse(fs.readFileSync('data/teams.db.json'));
//     if (dataTeams.find(dataTeam => dataTeam.tla === tla)) {
//         res.render('newTeam', {
//             layout: 'home',
//             data: {
//                 error: 'Could not load the team because the tla already exists',
//             }
//         });

//     } else {
//         const newTeam = {
//             name,
//             tla,
//             area: {
//                 name: country
//             },
//             address,
//             website,
//             founded,
//             venue,
//             crestUrl: `/images/${req.file.filename}`,
//         }
//         dataTeams.push(newTeam);
//         fs.writeFileSync('data/teams.db.json', JSON.stringify(dataTeams));
//         res.render('newTeam', {
//             layout: 'home',
//             data: {
//                 message: 'Success, the team has been loaded successfully',
//             }
//         });
//     }


// });

// app.get('/team/:tla/edit', (req, res) => {
//     const tlaTeam = req.params.tla;
//     const dataTeams = JSON.parse(fs.readFileSync(`data/teams.db.json`));
//     const dataTeam = dataTeams.find((dataTeam) => dataTeam.tla === tlaTeam);
//     const { area, name, crestUrl, address, website, founded, venue, tla } = dataTeam;

//     res.render('editTeam', {
//         layout: 'home',
//         data: {
//             country: area.name,
//             name,
//             image: crestUrl,
//             address,
//             website,
//             founded,
//             venue,
//             tla,
//         },
//     });
// });

// app.post('/team/:tla/edit', editImageUpload.single('image'), (req, res) => {
//     const { name, country, address, website, founded, venue } = req.body;
//     const tlaTeam = req.params.tla;

//     const dataTeams = JSON.parse(fs.readFileSync('data/teams.db.json'));
//     const dataTeam = dataTeams.find((d) => d.tla === tlaTeam);
//     const newDataTeams = dataTeams.filter((data) => data.tla !== tlaTeam);

//     const currentTeamData = {
//         ...dataTeam,
//         name,
//         area: {
//             name: country,
//         },
//         address,
//         website,
//         founded,
//         venue,
//     };

//     if (req.file) {
//         currentTeamData.crestUrl = `/images/${req.file.filename}`;

//         if (fs.existsSync(`uploads${dataTeam.crestUrl}`)) {
//             fs.unlinkSync(`uploads${dataTeam.crestUrl}`);
//         }
//     }

//     newDataTeams.push(currentTeamData);

//     fs.writeFileSync('data/teams.db.json', JSON.stringify(newDataTeams));

//     res.render('editTeam', {
//         layout: 'home',
//         data: {
//             message: 'Success, the team has been loaded successfully',
//             name,
//             country: currentTeamData.area.name,
//             address,
//             website,
//             founded,
//             venue,
//             image: currentTeamData.crestUrl,
//         }
//     });

// });

// app.get('/team/:tla/delete', (req, res) => {
//     const tlaTeam = req.params.tla;
//     const dataTeams = JSON.parse(fs.readFileSync(`data/teams.db.json`));
//     const dataTeam = dataTeams.find((dataTeam) => dataTeam.tla === tlaTeam);
//     const { area, name, crestUrl, address, website, founded, venue } = dataTeam;

//     res.render('deleteTeam', {
//         layout: 'home',
//         data: {
//             country: area.name,
//             name,
//             image: crestUrl,
//             address,
//             website,
//             founded,
//             venue,
//             tla: tlaTeam,
//         },
//     });
// });

// app.post('/team/:tla/delete', (req, res) => {
//     const tlaTeam = req.params.tla;
//     const dataTeams = JSON.parse(fs.readFileSync(`data/teams.db.json`));
//     const dataTeam = dataTeams.find((d) => d.tla === tlaTeam);
//     const newDataTeams = dataTeams.filter((team) => team.tla !== tlaTeam);

//     if (fs.existsSync(`uploads${dataTeam.crestUrl}`)) {
//         fs.unlinkSync(`uploads${dataTeam.crestUrl}`);
//     }

//     fs.writeFileSync('data/teams.db.json', JSON.stringify(newDataTeams));

//     res.redirect('/');
// });

app.listen(PORT)
console.log(`Listening in http://localhost:${PORT}`);