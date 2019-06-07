const path = require('path');
const http = require('http');
const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const sha1 = require('sha1');
const cors = require('cors');
const SocketIO = require('socket.io');
const fetch = require("node-fetch");
const FormData = require('form-data');
const request = require('request');
const fs = require('fs');

const url = "http://example.com";

app.use(fileUpload())
app.use(bodyParser.json());
app.use(cors());
const router = express.Router();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(function(req, res, next) {
    app.locals.test = 0;  
    next();
});

app.use(session({secret: 'example'}));

app.post('/users', function(req, res, next) {
    var emailform = '', emailformsimple = '', passwordform = '', passwordformsimple = '', expresion_correo = '', sql = '', contrasesha = '';
    if(req.body.email){
        if(req.body.password){
            emailform = req.body.email;
            emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
            passwordform = req.body.password;
            passwordformsimple = passwordform.replace(/(<([^>]+)>)/ig, '');
        }
    }
    
    expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if(emailformsimple != ' ' && emailformsimple !== ''){
        if(passwordformsimple != ' ' && passwordformsimple !== ''){
            if(expresion_correo.test(emailformsimple)){
                contrasesha = sha1(passwordformsimple);
                var formData = new FormData();
                formData.append('user', emailformsimple);
                formData.append('password', contrasesha);

                fetch(url + "/example/users", {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                   if(response.ok) {
                       return response.text()
                   } else {
                       throw "Error en la llamada Ajax";
                   }

                })
                .then(function(texto) {
                    res.send(texto);
                })
                .catch(function(err) {
                   res.send('{"name":"", "perfil":"", "unique": "", "code": "false", "tokens": ""}');
                });
            }else{
                res.send('{"name":"", "perfil":"", "unique": "", "code": "false", "tokens": ""}');
            }
        }else{
            res.send('{"name":"", "perfil":"", "unique": "", "code": "false", "tokens": ""}');
        }
    }else{
        res.send('{"name":"", "perfil":"", "unique": "", "code": "false", "tokens": ""}');
    }
});

app.post('/registered', function(req, res, next){
    var namefrom = '', namefromsimple = '', emailform = '', emailformsimple = '', passwordform = ''. passwordformsimple = '', palabra = '', palabrasimple = '', expresion_correo = '', sql = '', sql2 = '', codeunique = '', contrasesha = '';
    expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if(req.body.name){
        if(req.body.email){
            if(req.body.password){
                if(req.body.unicopost)
                namefrom = req.body.name;
                namefromsimple = namefrom.replace(/(<([^>]+)>)/ig, '');
                emailform = req.body.email;
                emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
                passwordform = req.body.password;
                passwordformsimple = passwordform.replace(/(<([^>]+)>)/ig, '');
                palabra = req.body.unicopost;
                palabrasimple = palabra.replace(/(<([^>]+)>)/ig, '');
            }
        }
    }

    if(namefromsimple != ' ' && namefromsimple != ''){
        if(emailformsimple != ' ' && emailformsimple != ''){
            if(passwordformsimple != ' ' && passwordformsimple != ''){
                if(expresion_correo.test(emailformsimple)){
                    codeunique = sha1(namefromsimple + "_" + emailformsimple);
                    contrasesha = sha1(passwordformsimple);
                    var formData = new FormData();
                    formData.append('name', namefromsimple);
                    formData.append('email', emailformsimple);
                    formData.append('pass', contrasesha);
                    formData.append('unique', codeunique);
                    formData.append('perfil', 'https://example.herokuapp.com/image/example.png');
                    formData.append('unicopost', palabrasimple);

                    fetch(url + "/example/registered", {
                        method: 'POST',
                        body: formData
                    })
                    .then(function(response) {
                       if(response.ok) {
                           return response.text()
                       } else {
                           throw "Error en la llamada Ajax";
                       }

                    })
                    .then(function(texto) {
                        res.send(texto);
                    })
                    .catch(function(err) {
                       res.send('{"name":"", "perfil":"", "unique": "", "code": "false", "mensajess": "", "tokens": ""}');
                    });
                }else{
                    res.send({"name":"", "perfil":"", "unique": "", "code": "false", "mensajess": "", "tokens": ""});
                }
            }else{
                res.send({"name":"", "perfil":"", "unique": "", "code": "false", "mensajess": "", "tokens": ""});
            }
        }else{
            res.send({"name":"", "perfil":"", "unique": "", "code": "false", "mensajess": "", "tokens": ""});
        }
    }else{
        res.send({"name":"", "perfil":"", "unique": "", "code": "false", "mensajess": "", "tokens": ""});
    }
});

app.post('/select', function(req, res, next) {
    var unicosform = '', unicosformsimple = '', passwordform = '', passwordformsimple = '', sql = '', ufsplit = '';
    if(req.body.token){
        ufsplit = req.body.token.split("_");
        unicosform = ufsplit[0];
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
        passwordform = ufsplit[1];
        passwordformsimple = passwordform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != ' ' && unicosformsimple !== ''){
        if(passwordformsimple != ' ' && passwordformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('password', passwordformsimple);

            fetch(url + "/example/select", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }
            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send('{"name":"", "perfil":"", "code":"", "email": ""}');
            });
        }else{
            res.send('{"name":"", "perfil":"", "code":"", "email": ""}');
        }
    }else{
        res.send('{"name":"", "perfil":"", "code":"", "email": ""}');
    }
});

app.post('/upload',(req,ress, next) => {
    var unicosform = '', unicosformsimple = '';
    if(req.body.unique){
        unicosform = req.body.unique;
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple !== ' ' && unicosformsimple != ''){
        if(req.files !== null){
            let File = req.files.image;
            if(File.size < 3000000){
                if(File.mimetype === 'image/jpeg' || File.mimetype === 'image/png'){
                    File.mv(`./public/image/${unicosformsimple}.jpg`,err => {
                        if(err) return ress.status(500).send({ message : err })

                        const coolPath = path.join(__dirname, 'public/image/' + unicosformsimple + '.jpg');
                        const readableStream = fs.createReadStream(coolPath);

                        const options = {
                            method: "POST",
                            url: "https://example.com/example/documento/xumita",
                            port: 443,
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                            formData : {
                                "my_file": fs.createReadStream(coolPath),
                                "unique": unicosformsimple
                            }
                        };

                        request(options, function (errs, res, body) {
                            if(errs) console.log(errs);

                            var formData = new FormData();
                            formData.append('unique', unicosformsimple);
                            formData.append('urlimg', "https://example.com/example/image/" + unicosformsimple + ".jpg");

                            fetch(url + "/example/upload", {
                                method: 'POST',
                                body: formData
                            })
                            .then(function(response) {
                                if(response.ok) {
                                    return response.text()
                                } else {
                                    throw "Error en la llamada Ajax";
                                }

                            })
                            .then(function(texto) {
                                ress.send(texto);
                            })
                            .catch(function(err) {
                                ress.status(200).send({ message: "true", texto: "¡Lo sentimos, intentalo más tarde!" });
                            });
                        });
                    });
                }else{
                    ress.status(200).send({ message: "false", texto: "¡Lo sentimos, intentalo más tarde!" });
                }
            }else{
                ress.status(200).send({ message: "false", texto: "¡Lo sentimos, intentalo más tarde!" });
            }
        }else{
            ress.status(200).send({ message: "false", texto: "¡Lo sentimos, intentalo más tarde!" });
        }
    }else{
        ress.status(200).send({ message: "false", texto: "¡Lo sentimos, intentalo más tarde!" });
    }
});

app.post('/update', function(req, res, next){
    var nameform = '', nameformsimple = '', emailform = '', emailformsimple = '', unicosform = '', unicosformsimple = '', expresion_correo = '', sql = '';
    if(req.body.msnname){
        if(req.body.msnemail){
            if(req.body.unique){
                nameform = req.body.msnname;
                nameformsimple = nameform.replace(/(<([^>]+)>)/ig, '');
                emailform = req.body.msnemail;
                emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
                unicosform = req.body.unique;
                unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
            }
        }
    }
    expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if(unicosformsimple !== ' ' && unicosformsimple !== ''){
        if(emailformsimple !== ' ' && emailformsimple !== ''){
            if(nameformsimple !== ' ' && nameformsimple !== ''){
                if(expresion_correo.test(emailformsimple)){
                    var formData = new FormData();
                    formData.append('name', nameformsimple);
                    formData.append('email', emailformsimple);
                    formData.append('unique', unicosformsimple);

                    fetch(url + "/example/update", {
                        method: 'POST',
                        body: formData
                    })
                    .then(function(response) {
                        if(response.ok) {
                            return response.text()
                        } else {
                            throw "Error en la llamada Ajax";
                        }

                    })
                    .then(function(texto) {
                        res.send(texto);
                    })
                    .catch(function(err) {
                        res.send('{"mensaje":"¡Lo sentimos, intentalo más tarde!", "valido":"true", "entregado": "true"}');
                    });
                }else{
                    res.send('{"mensaje":"¡Lo sentimos, intentalo más tarde!", "valido":"true", "entregado": "true"}');
                }
            }else{
                res.send('{"mensaje":"¡Lo sentimos, intentalo más tarde!", "valido":"true", "entregado": "true"}');
            }
        }else{
            res.send('{"mensaje":"¡Lo sentimos, intentalo más tarde!", "valido":"true", "entregado": "true"}');
        }
    }else{
        res.send('{"mensaje":"¡Lo sentimos, intentalo más tarde!", "valido":"false", "entregado": "true"}');
    }
});

app.post('/share', function(req, resss, next){
    var contenidoform = '', contenidoformsimple = '', unicosform = '', unicosformsimple = '', privacidadform= '', privacidadformsimple = '', nombrearchivo = '', name = '', namesimple = '', perfil = '', perfilsimple = '';
    var hoy = '', dd = '', mm = '', yyyy = '', hh = '', mmm = '', ss = '';
    if(req.body.contens){
        if(req.body.privacity){
            if(req.body.unique){
                if(req.body.name){
                    if(req.body.perfil){
                        contenidoform = req.body.contens;
                        contenidoformsimple = contenidoform.replace(/(<([^>]+)>)/ig, '');
                        unicosform = req.body.unique;
                        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
                        privacidadform = req.body.privacity;
                        privacidadformsimple = privacidadform.replace(/(<([^>]+)>)/ig, '');
                        name = req.body.name;
                        namesimple = name.replace(/(<([^>]+)>)/ig, '');
                        perfil = req.body.perfil;
                        perfilsimple = perfil.replace(/(<([^>]+)>)/ig, '');
                    }
                }
            }
        }
    }

    hoy = new Date();
    dd = hoy.getDate();
    mm = hoy.getMonth()+1;
    yyyy = hoy.getFullYear();
    hh = hoy.getHours();
    mmm = hoy.getMinutes();
    ss = hoy.getSeconds();

    if(unicosformsimple !== ' ' && unicosformsimple !== ''){
        if(contenidoform !== ' ' && contenidoformsimple !== ''){
            if(privacidadformsimple !== ' ' && privacidadformsimple !== ''){
                if(namesimple != ' ' && namesimple != ''){
                    if(perfilsimple != ' ' && perfilsimple != ''){
                        if(req.files !== null){
                            let File = req.files.imagecompart;
                            let dia = yyyy + '-' + fecha(mm) + '-' + fecha(dd);
                            let hora = hh + ':' + mmm + ':' + ss;
                            nombrearchivo = sha1(unicosformsimple + "_" + yyyy + "_" + mm + "_" + dd + "_" + hh + "_" + mmm + "_" + ss);
                            if(File.size < 3000000){
                                if(File.mimetype === 'image/jpeg' || File.mimetype === 'image/png'){
                                    File.mv(`./public/sharepu/${nombrearchivo}.jpg`,err => {
                                        if(err) return resss.status(500).send({ message : err })

                                        const coolPath = path.join(__dirname, 'public/sharepu/' + nombrearchivo + '.jpg');
                                        const readableStream = fs.createReadStream(coolPath);

                                        const options = {
                                            method: "POST",
                                            url: "https://example.com/example/documento/xumita2",
                                            port: 443,
                                            headers: {
                                                "Content-Type": "multipart/form-data"
                                            },
                                            formData : {
                                                "my_files": fs.createReadStream(coolPath),
                                                "codeunique": nombrearchivo
                                            }
                                        };

                                        request(options, function (errs, res, body) {
                                            if(errs) console.log(errs);

                                            var formData = new FormData();
                                            formData.append('unique', unicosformsimple);
                                            formData.append('content', contenidoformsimple);
                                            formData.append('imagen', "https://example.com/example/sharepu/" + nombrearchivo + ".jpg");
                                            formData.append('codeunique', nombrearchivo);
                                            formData.append('name', namesimple);
                                            formData.append('perfil', perfilsimple);
                                            formData.append('privacity', privacidadformsimple);

                                            fetch(url + "/example/shares", {
                                                method: 'POST',
                                                body: formData
                                            })
                                            .then(function(response) {
                                                if(response.ok) {
                                                    return response.text()
                                                } else {
                                                    throw "Error en la llamada Ajax";
                                                }

                                            })
                                            .then(function(texto) {
                                                resss.send(texto);
                                            })
                                            .catch(function(err) {
                                                return resss.status(200).send({ alerta : '11', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
                                            });
                                        });
                                    });
                                }else{
                                    return resss.status(200).send({ alerta : '11', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
                                }
                            }else{
                                return resss.status(200).send({ alerta : '22', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
                            }
                        }else{
                            return resss.status(200).send({ alerta : '33', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
                        }
                    }else{
                        return resss.status(200).send({ alerta : '44', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
                    }
                }else{
                    return resss.status(200).send({ alerta : '44', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
                }
            }else{
                return resss.status(200).send({ alerta : '44', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
            }
        }else{
            return resss.status(200).send({ alerta : '55', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
        }
    }else{
        return resss.status(200).send({ alerta : 'false', state: '', valido: 'false', publication: { msncodeunique: '', msnimage: '', "entregado": "true"} })
    }
});

app.post('/postales', function(req, res, next){
    var unicosform = '', unicosformsimple = '', split = '';
    if(req.body.unique){
        split = req.body.unique.split("_");
        unicosform = split[0];
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != ' ' && unicosformsimple !== ''){
        var formData = new FormData();
        formData.append('unique', unicosformsimple);

        fetch(url + "/example/postales", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
        });
    }else{
        res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
    }
});

app.post('/postales2', function(req, res, next){
    var unicosform = '', unicosformsimple = '', sqltotal = '', sql = '', ufsplit = '';
    if(req.body.estado){
        ufsplit = req.body.estado.split("_");
        unicosform = ufsplit[0];
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != ' ' && unicosformsimple !== ''){
        var formData = new FormData();
        formData.append('unique', unicosformsimple);

        fetch(url + "/example/postales", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
        });
    }else{
        res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
    }
});

app.post('/postal', function(req, res, next){
    var unicopostform = '', unicopostformsimple = '', unicoforms = '', unicoformssimples = '', ufsplit = '';
    
    if(req.body.unicopost){
        unicopostform = req.body.unicopost;
        unicopostformsimple = unicopostform.replace(/(<([^>]+)>)/ig, '');
    }

    if(req.body.unique){
        ufsplit = req.body.unique.split("_");
        unicoforms = ufsplit[0];
        unicoformssimples = unicoforms.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicopostformsimple != ' ' && unicopostformsimple != ''){
        var formData = new FormData();
        formData.append('unique', unicoformssimples);
        formData.append('codeunique', unicopostformsimple);

        fetch(url + "/example/postal", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "sharep": [{ "msnunique": "vacio", "msnconten": "vacio", "msnimage": "vacio", "msnname": "vacio", "msnperfil": "vacio", "msnprivacity": "vacio", "msnday": "vacio", "msntime": "vacio"}], "favoritos": { "cantidad": "vacio", "usuario": "vacio" } });
        });
    }else{
        res.send({ "sharep": [{ "msnunique": "vacio", "msnconten": "vacio", "msnimage": "vacio", "msnname": "vacio", "msnperfil": "vacio", "msnprivacity": "vacio", "msnday": "vacio", "msntime": "vacio"}], "favoritos": { "cantidad": "vacio", "usuario": "vacio" } });
    }
});

app.post('/addfavorito', function(req, res, next){
    var unicopostform = '', unicopostformsimple = '', unicoforms = '', unicoformssimples = '', ufsplit = '';

    if(req.body.unicopost){
        if(req.body.unique){
            unicopostform = req.body.unicopost;
            unicopostformsimple = unicopostform.replace(/(<([^>]+)>)/ig, '');
            ufsplit = req.body.unique.split("_");
            unicoforms = ufsplit[0];
            unicoformssimples = unicoforms.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicoformssimples != ' ' && unicoformssimples != ''){
        if(unicopostformsimple != ' ' && unicopostformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicoformssimples);
            formData.append('codeunique', unicopostformsimple);

            fetch(url + "/example/addfavorito", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "nuevo": { "existe": "false", "sesion": "true" }});
            });
        }else{
            res.send({ "nuevo": { "existe": "false", "sesion": "true" }});
        }
    }else{
        res.send({ "nuevo": { "existe": "false", "sesion": "false" }});
    }
});

app.post('/deletefavorito', function(req, res, next){
    var unicopostform = '', unicopostformsimple = '', unicoforms = '', unicoformssimples = '', ufsplit = '';

    if(req.body.unicopost){
        if(req.body.unique){
            unicopostform = req.body.unicopost;
            unicopostformsimple = unicopostform.replace(/(<([^>]+)>)/ig, '');
            ufsplit = req.body.unique.split("_");
            unicoforms = ufsplit[0];
            unicoformssimples = unicoforms.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicoformssimples != ' ' && unicoformssimples != ''){
        if(unicopostformsimple != ' ' && unicopostformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicoformssimples);
            formData.append('codeunique', unicopostformsimple);

            fetch(url + "/example/deletefavorito", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "nuevo": { "existe": "false", "sesion": "true" }});
            });
        }else{
            res.send({ "nuevo": { "existe": "false", "sesion": "true" }});
        }
    }else{
        res.send({ "nuevo": { "existe": "false", "sesion": "false" }});
    }
});

app.post('/twenty', function(req, res, next){
    var idpublicsform = '', idpublicsformsimple = '', unicosform = '', unicosformsimple = '', sql = '';
    if(req.body.idpublics){
        if(req.body.unique){
            idpublicsform = req.body.idpublics;
            idpublicsformsimple = idpublicsform.replace(/(<([^>]+)>)/ig, '');
            unicosform = req.body.unique;
            unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
        }
    }

    
    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(idpublicsformsimple != ' ' && idpublicsformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('idpublics', idpublicsformsimple);

            fetch(url + "/example/twenty", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "" }] });
            });
        }else{
            res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "" }] });
        }
    }else{
        res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "vacio" }] });
    }
});

app.post('/contacts', function(req, res, next){
    var unicosform = '', unicosformsimple = '', sql = '';
    if(req.body.unique){
        unicosform = req.body.unique;
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != '' && unicosformsimple != ''){
        var formData = new FormData();
        formData.append('unique', unicosformsimple);

        fetch(url + "/example/contacts", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "contacts": [], "activo": {"usuario": "true"} });
        });
    }else{
        res.send({ "contacts": [], "activo": {"usuario": "false"} });
    }
});

app.post('/mnew', function(req, res, next){
    var unicosform = '', unicosformsimple = '', contactform = '', contactformsimple = '';
    if(req.body.unique){
        if(req.body.secretcontact){
            unicosform = req.body.unique;
            unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
            contactform = req.body.secretcontact;
            contactformsimple = contactform.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(contactformsimple != ' ' && contactformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('contacto', contactformsimple);

            fetch(url + "/example/mnew", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "message": [], conexion: 'true' });
            });
        }else{
            res.send({ "message": [], conexion: 'true' });
        }
    }else{
        res.send({ "message": [], conexion: 'false' });
    }
});

app.post('/user', function(req, res, next){
    var unicosform = '', unicosformsimple = '', unicosform2 = '', unicosformsimple2 = '', split = '';
    if(req.body.estado){
        unicosform = "" + req.body.estado + "";
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(req.body.unique){
        split = req.body.unique.split("_");
        unicosform2 = split[0];
        unicosformsimple2 = unicosform2.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != ' ' && unicosformsimple != ''){
        var formData = new FormData();
        formData.append('unique', unicosformsimple2);
        formData.append('estados', unicosformsimple);

        fetch(url + "/example/user", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send('{"name":"false", "perfil":"", "existe": "", "session": "false", "msnunique": "false"}');
        });
    }else{
        res.send('{"name":"false", "perfil":"", "existe": "", "session": "false", "msnunique": "false"}');
    }
});

app.post('/postals', function(req, res, next){
    var unicosform = '', unicosformsimple = '', sqltotal = '', sql = '';
    if(req.body.estado){
        unicosform = "" + req.body.estado + "";
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != ' ' && unicosformsimple !== ''){
        var formData = new FormData();
        formData.append('estados', unicosformsimple);

        fetch(url + "/example/postals", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "sharep": [{ "idpublics": "vacio", "msnconten": "vacio", "msnimage": "vacio", "msncodeunique": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
        });
    }else{
        res.send({ "sharep": [{ "idpublics": "", "msnconten": "vacio", "msnimage": "vacio", "msncodeunique": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
    }
});

app.post('/veinte', function(req, res, next){
    var idpublicsform = '', idpublicsformsimple = '', unicosform = '', unicosformsimple = '', sql = '';
    if(req.body.idpublics){
        if(req.body.contactsecret){
            idpublicsform = req.body.idpublics;
            idpublicsformsimple = idpublicsform.replace(/(<([^>]+)>)/ig, '');
            unicosform = "" + req.body.contactsecret + "";
            unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
        }
    }
    
    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(idpublicsformsimple != ' ' && idpublicsformsimple != ''){
            var formData = new FormData();
            formData.append('contactsecret', unicosformsimple);
            formData.append('idpublics', idpublicsformsimple);

            fetch(url + "/example/veinte", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "", "total": "vacio" }] });
            });
        }else{
            res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "", "total": "vacio" }] });
        }
    }else{
        res.send({ "sharep": [{ "idpublics": "vacio", "msncodeunique": "vacio", "msnimage": "vacio"}], "registered": [{ "ultimateid": "vacio", "total": "vacio" }] });
    }
});

app.post('/invitados', function(req, res, next){
    var unicosform = '', unicosformsimple = '', passwordform = '', passwordformsimple = '', sql = '', ufsplit = '';
    if(req.body.token){
        ufsplit = req.body.token.split("_");
        unicosform = ufsplit[0];
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
        passwordform = ufsplit[1];
        passwordformsimple = passwordform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != ' ' && unicosformsimple !== ''){
        if(passwordformsimple != ' ' && passwordformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('password', passwordformsimple);

            fetch(url + "/example/select", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }
            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send('{"name":"", "perfil":"", "code":"", "email": ""}');
            });
        }else{
            res.send('{"name":"", "perfil":"", "code":"", "email": ""}');
        }
    }else{
        res.send('{"name":"", "perfil":"", "code":"", "email": ""}');
    }
});

app.post('/invitados2', function(req, res, next){
    var unicosform = '', unicosformsimple = '', split = '';
    if(req.body.unique){
        split = req.body.unique.split("_");
        unicosform = split[0];
        unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
    }

    if(unicosformsimple != '' && unicosformsimple != ''){
        var formData = new FormData();
        formData.append('unique', unicosformsimple);

        fetch(url + "/example/invitados", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "contacts": [], "information": { "existe": "true" } });
        });
    }else{
        res.send({ "contacts": [], "information": { "existe": "false" } });
    }
});

app.post('/messages', function(req, res, next){
    var unicosform = '', unicosformsimple = '', contactform = '', contactformsimple = '', split = '';
    if(req.body.unique){
        if(req.body.secretcontact){
            split = req.body.unique.split("_");
            unicosform = split[0];
            unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
            contactform = req.body.secretcontact;
            contactformsimple = contactform.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(contactformsimple != ' ' && contactformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('contactsecret', contactformsimple);

            fetch(url + "/example/messages", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "message": [], conexion: 'true' });
            });
        }else{
            res.send({ "message": [], conexion: 'true' });
        }
    }else{
        res.send({ "message": [], conexion: 'false' });
    }
});

/*Eliminar contacto*/

app.post('/delete', function(req, res, next){
    var unicosform = '', unicosformsimple = '', contactform = '', contactformsimple = '', sql = '', sql2 = '';
    if(req.body.secret){
        if(req.body.secretcontact){
            unicosform = req.body.secret;
            unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
            contactform = req.body.secretcontact;
            contactformsimple = contactform.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(contactformsimple != ' ' && contactformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('contactsecret', contactformsimple);

            fetch(url + "/example/delete", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "message": { conexion: 'false' } });
            });
        }else{
            res.send({ "message": { conexion: 'false' } });
        }
    }else{
        res.send({ "message": { conexion: 'false' } });
    }
});

app.post('/add', function(req, res, next){
    var unicosform = '', unicosformsimple = '', contactform = '', contactformsimple = '', sql = '', sql2 = '', sql3 = '';
    if(req.body.secret){
        if(req.body.secretcontact){
            unicosform = req.body.secret;
            unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
            contactform = req.body.secretcontact;
            contactformsimple = contactform.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(contactformsimple != ' ' && contactformsimple != ''){
            var formData = new FormData();
            formData.append('unique', unicosformsimple);
            formData.append('contactsecret', contactformsimple);

            fetch(url + "/example/add", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "message": { conexion: 'false' } });
            });
        }else{
            res.send({ "message": { conexion: 'false' } });
        }
    }else{
        res.send({ "message": { conexion: 'false' } });
    }
});

/*Inicio buscador*/

app.post('/buscadores', function(req, res, next){
    var palabra = '', palabrasimple = '', sql = '';

    if(req.body.usuarios){
        palabra = req.body.usuarios;
        palabrasimple = palabra.replace(/(<([^>]+)>)/ig, '');
    }

    if(palabrasimple != ' ' && palabrasimple != ''){
        var formData = new FormData();
        formData.append('palabra', palabrasimple);

        fetch(url + "/example/buscadores", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({"resultado":[{"msnunique":"","msnname":"","msnperfil":""}]});
        });
    }else{
        res.send({"resultado":[{"msnunique":"","msnname":"","msnperfil":""}]});
    }
});

app.post('/invitation', function(req, res, next){
    var palabra = '', palabrasimple = '';

    if(req.body.unicopost){
        palabra = req.body.unicopost;
        palabrasimple = palabra.replace(/(<([^>]+)>)/ig, '');
    }

    if(palabrasimple != ' ' && palabrasimple != ''){
        var formData = new FormData();
        formData.append('palabra', palabrasimple);

        fetch(url + "/example/invitation", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({"resultado": "false", "validarse": "false"});
        });
    }else{
        res.send({"resultado": "false", "validarse": "false"});
    }
});

app.post('/sendinvitations', function(req, res, next){
    var unicosform = '', unicosformsimple = '', email = '', nombrearchivo = '', unicoemail = '', unicoemailsimple = '', emailsimple = '', name = '', namesimple = '';

    if(req.body.unique){
        if(req.body.name){
            if(req.body.emailunico){
                if(req.body.msnemail){
                    unicosform = req.body.unique;
                    unicosformsimple = unicosform.replace(/(<([^>]+)>)/ig, '');
                    name = req.body.name;
                    namesimple = name.replace(/(<([^>]+)>)/ig, '');
                    unicoemail = req.body.emailunico;
                    unicoemailsimple = unicoemail.replace(/(<([^>]+)>)/ig, '');
                    email = req.body.msnemail;
                    emailsimple = email.replace(/(<([^>]+)>)/ig, '');
                }
            }
        }
    }

    if(unicosformsimple != ' ' && unicosformsimple != ''){
        if(namesimple != ' ' && namesimple != ''){
            if(unicoemailsimple != ' ' && unicoemailsimple != ''){
                if(emailsimple != ' ' && emailsimple != ''){
                    hoy = new Date();
                    dd = hoy.getDate();
                    mm = hoy.getMonth()+1;
                    yyyy = hoy.getFullYear();
                    hh = hoy.getHours();
                    mmm = hoy.getMinutes();
                    ss = hoy.getSeconds();

                    nombrearchivo = sha1(emailsimple + unicosformsimple + "_" + yyyy + "_" + mm + "_" + dd + "_" + hh + "_" + mmm + "_" + ss);

                    var formData = new FormData();
                    formData.append('emailunique', unicoemailsimple);
                    formData.append('email', emailsimple);
                    formData.append('name', namesimple);
                    formData.append('uniqueinvitacion', nombrearchivo);

                    fetch(url + "/example/sendinvitation", {
                        method: 'POST',
                        body: formData
                    })
                    .then(function(response) {
                        if(response.ok) {
                            return response.text()
                        } else {
                            throw "Error en la llamada Ajax";
                        }

                    })
                    .then(function(texto) {
                        res.send(texto);
                    })
                    .catch(function(err) {
                        res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
                    });
                }else{
                    res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
                }
            }else{
                res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
            }
        }else{
            res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
        }
    }else{
        res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "false", "entregado": "true" });
    }
});

app.post('/changepass', function(req, res, next){
    var unicoform = '', unicoformsimple = '', antiguos = '', antiguosimple = '', nuevosx = '', nuevosimple = '', paencriptado = '', pnencriptad = '';

    if(req.body.unique){
        if(req.body.antiguo){
            if(req.body.nuevos){
                unicoform = req.body.unique;
                unicoformsimple = unicoform.replace(/(<([^>]+)>)/ig, '');
                antiguos = req.body.antiguo;
                antiguosimple = antiguos.replace(/(<([^>]+)>)/ig, '');
                nuevosx = req.body.nuevos;
                nuevosimple = nuevosx.replace(/(<([^>]+)>)/ig, '');
            }
        }
    }

    if(unicoformsimple != ' ' && unicoformsimple != ''){
        if(antiguosimple != ' ' && antiguosimple != ''){
            if(nuevosimple != ' ' && nuevosimple != ''){
                paencriptado = sha1(antiguosimple);
                pnencriptad = sha1(nuevosimple);
                var formData = new FormData();
                formData.append('unique', unicoformsimple);
                formData.append('antiguo', paencriptado);
                formData.append('nuevo', pnencriptad);

                fetch(url + "/example/changepass", {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                    if(response.ok) {
                        return response.text()
                    } else {
                        throw "Error en la llamada Ajax";
                    }

                })
                .then(function(texto) {
                    res.send(texto);
                })
                .catch(function(err) {
                    res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
                });
            }else{
                res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
            }
        }else{
            res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
        }
    }else{
        res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "false", "entregado": "true" });
    }
});

app.post('/restablecer', function(req, res, next){
    var emailform = '', emailformsimple = '', codigorestablecer = '';

    if(req.body.email){
        emailform = req.body.email;
        emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
    }

    if(emailformsimple != ' ' && emailformsimple != ''){
        hoy = new Date();
        dd = hoy.getDate();
        mm = hoy.getMonth()+1;
        yyyy = hoy.getFullYear();
        hh = hoy.getHours();
        mmm = hoy.getMinutes();
        ss = hoy.getSeconds();

        codigorestablecer = sha1(emailformsimple + "_" + yyyy + "_" + mm + "_" + dd + "_" + hh + "_" + mmm + "_" + ss);

        var formData = new FormData();
        formData.append('email', emailformsimple);
        formData.append('code', codigorestablecer);

        fetch(url + "/example/restablecer", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
        });
    }else{
        res.send({ "estado": "¡Lo sentimos, intentalo más tarde!", "sesion": "true", "entregado": "true" });
    }
});

app.post('/invitation2', function(req, res, next){
    var palabra = '', palabrasimple = '';

    if(req.body.unicopost){
        palabra = req.body.unicopost;
        palabrasimple = palabra.replace(/(<([^>]+)>)/ig, '');
    }

    if(palabrasimple != ' ' && palabrasimple != ''){
        var formData = new FormData();
        formData.append('palabra', palabrasimple);

        fetch(url + "/example/invitation2", {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function(texto) {
            res.send(texto);
        })
        .catch(function(err) {
            res.send({"resultado": "false", "validarse": "false"});
        });
    }else{
        res.send({"resultado": "false", "validarse": "false"});
    }
});

app.post('/changepasss', function(req, res, next){
    var unicoform = '', unicoformsimple = '', passform = '', passformsimple = '', codigorestablecer = '', paencriptado = '';

    if(req.body.unicopost){
        if(req.body.password){
            unicoform = req.body.unicopost;
            unicoformsimple = unicoform.replace(/(<([^>]+)>)/ig, '');
            passform = req.body.password;
            passformsimple = passform.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicoformsimple != ' ' && unicoformsimple != ''){
        if(passformsimple != ' ' && passformsimple != ''){
            paencriptado = sha1(passformsimple);
            var formData = new FormData();
            formData.append('unique', unicoformsimple);
            formData.append('password', paencriptado);

            fetch(url + "/example/changepasss", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({ "estado": "¡Lo sentimos, intentalo más tarde!" });
            });
        }else{
            res.send({ "estado": "¡Lo sentimos, intentalo más tarde!" });
        }
    }else{
        res.send({ "estado": "¡Lo sentimos, intentalo más tarde!" });
    }
});

app.post('/deletepost', function(req, res, next){
    var unicoform = '', unicoformsimple = '', palabra = '', palabrasimple = '';

    if(req.body.unique){
        if(req.body.unicopost){
            unicoform = req.body.unique;
            unicoformsimple = unicoform.replace(/(<([^>]+)>)/ig, '');
            palabra = req.body.unicopost;
            palabrasimple = palabra.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicoformsimple != ' ' && unicoformsimple != ''){
        if(palabrasimple != ' ' && palabrasimple != ''){
            var formData = new FormData();
            formData.append('unique', unicoformsimple);
            formData.append('palabra', palabrasimple);

            fetch(url + "/example/deletepost", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                var formData = new FormData();
                formData.append('unique', palabrasimple);

                fetch("https://example.com/example/documento/borrarshare", {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                    if(response.ok) {
                        return response.text()
                    } else {
                        throw "Error en la llamada Ajax";
                    }

                })
                .then(function(texto) {
                    res.send(texto);
                })
                .catch(function(err) {
                    res.send({"resultado": "false", "validarse": "true"});
                });
            })
            .catch(function(err) {
                res.send({"resultado": "false", "validarse": "true"});
            });
        }else{
            res.send({"resultado": "false", "validarse": "false"});
        }
    }else{
        res.send({"resultado": "false", "validarse": "false"});
    }
});

app.post('/addcodigo', function(req, res, next){
    var unicoform = '', unicoformsimple = '', palabra = '', palabrasimple = '';

    if(req.body.unique){
        if(req.body.unicopost){
            unicoform = req.body.unique;
            unicoformsimple = unicoform.replace(/(<([^>]+)>)/ig, '');
            palabra = req.body.unicopost;
            palabrasimple = palabra.replace(/(<([^>]+)>)/ig, '');
        }
    }

    if(unicoformsimple != ' ' && unicoformsimple != ''){
        if(palabrasimple != ' ' && palabrasimple != ''){
            var formData = new FormData();
            formData.append('unique', unicoformsimple);
            formData.append('palabra', palabrasimple);

            fetch(url + "/example/addcodigo", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                res.send(texto);
            })
            .catch(function(err) {
                res.send({"resultado": "false", "validarse": "true"});
            });
        }else{
            res.send({"resultado": "false", "validarse": "false"});
        }
    }else{
        res.send({"resultado": "false", "validarse": "false"});
    }
});

app.use("/users/:userId", express.static(path.join(__dirname, 'public')));
app.use("/posts/:postId", express.static(path.join(__dirname, 'public')));
app.use("/share/:postId", express.static(path.join(__dirname, 'public')));
app.use("/email/:emailId", express.static(path.join(__dirname, 'public')));
app.use("/resetear/:restablecerId", express.static(path.join(__dirname, 'public')));
app.use("/posts", express.static(path.join(__dirname, 'public')));
app.use("/users", express.static(path.join(__dirname, 'public')));

router.use(function(req, res, next) {
    if (!req.route)
        return next (new Error("<script> window.location = '/'; </script>"));  
    next();
});

router.use(function(err, req, res, next){
    res.send(err.message);
});

router.use(function(req, res){
    res.send(app.locals.test + '');
});

app.post("/exit", function(req, res, next){
    req.session.destroy(function(err) {});
    res.send({ "session": "true" });
});

function fecha(params){
    if (params < 10) {
        params = '0' + params;
    }
    return params;
}

app.set('port', process.env.PORT || 3030);

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    //console.log('Server on port', app.get('port'));
});

const io = SocketIO(server);

io.on('connection', (socket) => {
    //console.log('new connection', socket.id);
    socket.on('chat:message', (data) => {
        var messageform = data.message;
        var emailformsimple = messageform.replace(/(<([^>]+)>)/ig, '');

        if(messageform != ' ' && emailformsimple != ''){
            io.sockets.emit('chat:' + data.secretcontact, { "messagelists": [{ "msnunique": data.secret, "msnmessage": data.message, "msnday": data.fechas, "msntime": data.horas }], "idcontacto": [{ "secretcontact": data.secret }] });

            socket.broadcast.emit('chat:' + data.secret, { "messagelists": [{ "msnunique": data.secret, "msnmessage": data.message, "msnday": data.fechas, "msntime": data.horas }], "idcontacto": [{ "secretcontact": data.secretcontact }] });

            var formData = new FormData();
            formData.append('unique', data.secret);
            formData.append('secretcontact', data.secretcontact);
            formData.append('message', data.message);

            fetch(url + "/example/socketiobase", {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                var json = JSON.parse(texto);
                var task_names = [];
                for (var i = 0, max = json.length; i < max; i += 1) {
                    task_names.push(json[i].msncodenotifi);
                }

                var datasnuyyui = 
                {   
                    "registration_ids": task_names,
                    "data": {
                        "title": data.name, 
                        "body": data.message, 
                        "icon": data.perfil, 
                        "badge": "/img/icons/apple-touch-icon-144x144.png" 
                    } 
                }

                var options = 
                    { 
                        method: 'POST',
                        url: 'https://fcm.googleapis.com/fcm/send',
                        headers: 
                        { 
                            'Authorization': '',
                            'Content-Type': 'Application/json',
                            'Content-Length': datasnuyyui.length
                        },
                        body: JSON.stringify(datasnuyyui)
                    };

                request(options, function (error, response, body) {
                  if (error) throw new Error(error);
                });
                res.send(texto);
            })
            .then(response => response)
            .catch(error => error);
        }
    });

    socket.on('chat:activo', (data) => {
        io.sockets.emit('chat:activo', { "estado": [{ "inicio": data.inicio, "msnunique": data.secret }] });
    });

    socket.on('chat:typing', (data) => {
        io.sockets.emit('typing:' + data.secretcontact, data);
    });
});

app.use(router);