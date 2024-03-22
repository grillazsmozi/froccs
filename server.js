const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = '3000';
const ip = '192.168.1.115';

// Dummy data for players
let players = [];

app.use(bodyParser.urlencoded({ extended: true }));

// Login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Admin page e
app.get('/admin', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fröccs KASSZA | by LevyProductions
        </title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
        <h1>Szia, admin</h1>
            <form action="/admin/add-player" method="post">
                <input type="text" name="username" placeholder="Új játékos neve" class="form-control">
                <button type="submit" class="btn btn-primary">Hozzáadás</button>
            </form>
            <table class="table table-sm">
                <tr>
                    <th scope="col">Játékosnév</th>
                    <th scope="col">Forint</th>
                    <th scope="col">Funkciók</th>
                </tr>
                ${players.map(player => `
                    <tr>
                        <td>${player.name}</td>
                        <td>${player.coins}</td>
                        <td>
                            <form action="/admin/modify-coins" method="post">
                                <input type="hidden" name="username" value="${player.name}">
                                <button type="submit" name="action" value="add10" class="btn btn-success">+10</button>
                                <button type="submit" name="action" value="subtract10" class="btn btn-danger">-10</button>
                                <button type="submit" name="action" value="add50" class="btn btn-success">+50</button>
                                <button type="submit" name="action" value="subtract50" class="btn btn-danger">-50</button>
                            </form>
                            <form action="/admin/delete-player" method="post">
                                <input type="hidden" name="username" value="${player.name}">
                                <button type="submit" class="btn btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                `).join('')}
            </table>
    
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
    </html>
    `);
});

// Player page
app.get('/player/:username', (req, res) => {
    const player = players.find(p => p.name === req.params.username);
    if (!player) {
        res.sendFile(__dirname + '/errorlogin.html')
    } else {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fröccs KASSZA | by LevyProductions
            </title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
            <h1>Szia, <span class="badge text-bg-warning">${player.name}</span></h1>
                    <div class="alert alert-light" role="alert">
                        <h3>Pénzed: <span id="badge text-bg-secondary">${player.coins}</span> forint</h3>
                      </div>
                      
                    <script>
                        setInterval(function() {
                            location.reload();
                        }, 1000);
                    </script>
        
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </body>
        </html>
        `);
    }
});


// Handle login
app.post('/login', (req, res) => {
    const username = req.body.username;
    if (username === 'admin') {
        res.redirect('/admin');
    } else {
        const playerExists = players.some(player => player.name === username);
        if (playerExists) {
            res.redirect(`/player/${username}`);
        } else {
            res.sendFile(__dirname + '/errorlogin.html')
        }
    }
});

// Modify coins
app.post('/admin/modify-coins', (req, res) => {
    const { username, action } = req.body;
    const player = players.find(p => p.name === username);
    if (player) {
        if (action === 'add10') {
            player.coins += 10;
        } else if (action === 'subtract10') {
            player.coins -= 10;
        } else if (action === 'add50') {
            player.coins += 50;
        } else if (action === 'subtract50') {
            player.coins -= 50;
        }
        res.redirect('/admin');
    } else {
        res.sendFile(__dirname + '/errorlogin.html')
    }
});

// Delete player
app.post('/admin/delete-player', (req, res) => {
    const username = req.body.username;
    players = players.filter(player => player.name !== username);
    res.redirect('/admin');
});

// Add player
app.post('/admin/add-player', (req, res) => {
    const newPlayerName = req.body.username;
    if (!players.some(player => player.name === newPlayerName)) {
        players.push({ name: newPlayerName, coins: 0 });
    }
    res.redirect('/admin');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
