// dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const User = require("./model/User");
const Money = require("./model/Money");
const Admin = require("./model/Admin");
const Comment = require("./model/Comment");

const app = express()


const bodyParser = require('body-parser');
const { default: mongoose } = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public/img"));
app.use(express.static("public/css"));
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require('./utils/users');

const server = http.createServer(app);
const io = socketIo(server);


app.get('/first1', function(req, res) {
    res.render("first1.ejs")
});


app.get('/signup', function(req, res) {
    res.render("signup.ejs")
});
app.get('/signin', function(req, res) {
    res.render("signin.ejs")
});
app.get('/accout', function(req, res) {
    res.render("accout.ejs")
});

app.get('/choose', function(req, res) {
    res.render("m.ejs")
});

app.get('/firstcours', function(req, res) {
    res.render("firstcours.ejs")
});
app.get('/mm', function(req, res) {
    res.render("mm.ejs")
});
app.get('/tra', function(req, res) {
    res.render("tra.ejs")
});
app.get('/tra2', function(req, res) {
    res.render("tra2.ejs")
});
app.get('/second', function(req, res) {
    res.render("secondcours.ejs")
});
app.get('/fourth', function(req, res) {
    res.render("fourth.ejs")
});
app.get('/money', function(req, res) {
    res.render("money.ejs")
});
app.get('/third', function(req, res) {
    res.render("third.ejs")
});

app.get('/signUPadmin', function(req, res) {
    res.render("signUPadmin.ejs")
});
app.get('/signINadmin', function(req, res) {
    res.render("signINadmin.ejs")
});
app.get('/Userexist', function(req, res) {
    res.render("Userexist.ejs")
});

app.get('/UserexistAdmin', function(req, res) {
    res.render("UserexistAdmin.ejs")
});

app.get('/comment', function(req, res) {
    res.render("comment.ejs")
});
app.get('/commentvalid', function(req, res) {
    res.render("commentvalid.ejs")
});
app.get('/list', function(req, res) {
    res.render("list.ejs")
});
app.get('/listAdmin', function(req, res) {
    res.render("listAdmin.ejs")
});
app.get('/users', async(req, res) => {
    const data = await User.find()
    res.render('users.ejs', { data: data })
})
app.get('/showcomment', async(req, res) => {
    const data = await Comment.find()
    res.render('showcomment.ejs', { data: data })
})


app.post('/comment', function(req, res) {
    const { comment } = req.body

    const ccomment = new Comment({ comment })
    ccomment.save(err => {
        if (err) {
            res.send(err.message)
        } else {
            res.render("commentvalid.ejs")
        }
    })

});


app.post("/signup", (req, res) => {
    const { name, email, Prenom, Tele, adressselect, Matricule, password, Adress } = req.body
    const re = /^[a-zA-Z0-9+_.-]+@+gmail.com+$/;
    if (re.test(email)) {
        User.findOne({ email: email }, (err, user) => {
            if (user) {
                res.render("Userexist.ejs")
            } else {
                const user = new User({ name, email, password, Tele, Prenom, adressselect, Matricule, Adress })
                user.save(err => {
                    if (err) {
                        res.send(err.message)
                    } else {
                        res.render("biensignuP.ejs")
                    }
                })
            }
        })
    } else {
        res.render("invalidgmail.ejs")

    }

})
app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.render("list.ejs")
            } else {
                res.render("error.ejs")
            }
        } else {
            res.render("error.ejs")
        }
    })
});
// set static file
app.use(express.static(path.join(__dirname, 'public')));

const botName = ' Cloud benchmarking';

// run when client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to  Cloud benchmarking        !'));

        // broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat!`)
            );

        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // runs when clients disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat!`)
            );

            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

app.post("/money", (req, res) => {
    const { number, date, password } = req.body
    const re = /^[a-zA-Z0-9+_.-]/;
    if (re.test(number)) {
        Money.findOne({ number: number }, (err, money) => {
            if (money) {
                res.render("accout.ejs")
            } else {
                const money = new Money({ number, date, password })
                money.save(err => {
                    if (err) {
                        res.send(err.message)
                    } else {
                        res.redirect("/")
                    }
                })
            }
        })
    } else {
        res.render("invalidgmail.ejs")

    }

})




app.post("/signUPadmin", (req, res) => {
    const { name, email, Prenom, Tele, password } = req.body;
    const re = /^[a-zA-Z0-9+_.-]+@+admin.com+$/;
    if (re.test(email)) {
        Admin.findOne({ email: email }, (err, admin) => {
            if (admin) {
                res.redirect("/accout")
            } else {
                const admin = new Admin({ name, email, password, Tele, Prenom })
                admin.save(err => {
                    if (err) {
                        res.send(err.message)
                    } else {
                        res.render("biensignuPadmin.ejs")
                    }
                })
            }
        })
    } else {
        res.render("invalidadmin.ejs")


    }
})
app.post("/signINadmin", (req, res) => {
    const { email, password } = req.body;
    Admin.findOne({ email: email }, (err, admin) => {
        if (admin) {
            if (password === admin.password) {
                res.redirect("/listAdmin")
            } else {
                res.render("errorAdmin.ejs")
            }
        } else {
            res.render("errorAdmin.ejs")
        }
    })
});
app.get('/editUser/User/:id', function(req, res) {
    User.findOne({ _id: req.params.id }, (err, items) => {
        res.render('editUser.ejs', { id: items._id, Matricule: items.Matricule, Prenom: items.Prenom, name: items.name, Tele: items.Tele, email: items.email, password: items.password, Adress: items.Adress })
    })
})

app.get('/edit/User/:id', (req, res, next) => {

    User.findOne({ _id: req.params.id }, req.body, { new: true }, (err, data) => {
        if (err) {
            consol.log('df')
            next(err);

        } else {
            res.redirect("/editUser/User/" + req.params.id)
        }
    });
});
app.post('/edit/User/:id', (req, res, next) => {

    User.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, docs) => {
        if (err) {
            consol.log('df')
            next(err);

        } else {

            res.redirect('/users')
        }
    });
});
app.get('/delete/User/:id', function(req, res) {
    User.remove({ _id: req.params.id }, function(err, delData) {
        res.redirect('/users')
    });

})
app.get('/delete/comment/:id', function(req, res) {
    Comment.remove({ _id: req.params.id }, function(err, delData) {
        res.redirect('/showcomment')
    });

})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🎯 Server is running on PORT: ${PORT}`);
});
