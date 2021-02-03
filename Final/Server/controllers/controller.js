let mongoose = require('mongoose');
let account = require('../model/accountModel')
const bcrypt = require("bcrypt");
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

exports.root = (req, res) => {
    res.send("API is running!");
}

// Lists all the users
exports.list = (req, res) => {
    account.find({}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}

exports.handleSignIn = (req, res) => {
    let name = req.body.username;
    let password = req.body.password;

    account.findOne({ username: name }, (err, account) => {
        if (err) throw err;
        console.log(account.password);
        bcrypt.compare(password, account.password, (err, response) => {
            if (err) console.log(err);

            if (response) {
                res.json({
                    status: true,
                    account: account
                })
            } else {
                res.json({
                    status: false,
                    account: ""
                })
            }
        });
    });
}

exports.searchByGenre = (req, res) => {
    let genreId = req.body.genreId;
    let genre_search = `https://api.themoviedb.org/3/discover/movie?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${encodeURI(genreId)}&media_type=movie`;
    let request = new XMLHttpRequest();

    request.open('GET', genre_search, true);
    request.onload = () => {
        let result = JSON.parse(request.responseText).results;
        // console.log(result);
        res.json(result);
    }
    request.send();
}
exports.searchByQuery = (req, res) => {
    let query = req.body.query;
    let query_search = `https://api.themoviedb.org/3/search/multi?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US&query=${encodeURI(query)}&page=1&include_adult=false&media_type=movie`;
    let request = new XMLHttpRequest();

    // console.log(genre_search);

    request.open('GET', query_search, true);
    request.onload = () => {
        let result = JSON.parse(request.responseText).results;
        // console.log(result);
        res.json(result);
    }
    request.send();
}

exports.submitReview = (req, res) => {
    let rev = {
        review: req.body.review,
        rating: req.body.rating,
        movieId: req.body.movieId
    };
    let reviewedMovieBefore = false;

    account.find({ email: req.body.email }, (err, acc) => {
        if (err) throw err;
        console.log(acc)
        acc[0].reviews.forEach(review => {
            if (review.movieId == rev.movieId) {
                reviewedMovieBefore = true;
            }
        });
        if (reviewedMovieBefore) {
            let reviews = acc[0].reviews;
            reviews.forEach(review => {
                if (review.movieId == rev.movieId) {
                    review.rating = rev.rating;
                    review.review = rev.review;
                }
            });
            account.findOneAndUpdate(
                { email: req.body.email },
                { $set: { reviews: reviews } },
                (err, data) => {
                    if (err) res.send(err);
                    console.log(data);
                    res.json(
                        {
                            "username": acc[0].username,
                            "review": req.body.review,
                            "rating": req.body.rating,
                            "movieId": req.body.movieId
                        }
                    );
                }
            );
        }
        else {
            account.findOneAndUpdate(
                { email: req.body.email },
                { $push: { reviews: rev } },
                (err, data) => {
                    if (err) res.send(err);
                    console.log(data);
                    res.json(
                        {
                            "username": acc[0].username,
                            "review": req.body.review,
                            "rating": req.body.rating,
                            "movieId": req.body.movieId
                        }
                    );
                }
            );
        }
    });    
}