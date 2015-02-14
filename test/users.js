var supertest = require('supertest');
var should = require('should');

describe('Users RESTful API', function(){
    var noauth_url = 'https://localhost:8443';
    var url = 'https://admin:test@localhost:8443';
    var api = '/api/users/';
    var userBody = {
        username: 'newuser',
        password: 'newuserpassword',
        name: 'New User #1',
        role: 'user',
        locked: true
    };
    var userId;

    it('posts an user', function(done){
        supertest(url)
        .post(api)
        .send(userBody)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            res.body.should.have.property('_id');
            res.body.name.should.equal(userBody.name);
            res.body.username.should.equal(userBody.username);
            res.body.password.should.not.equal(userBody.password);
            res.body.role.should.equal(userBody.role);
            res.body.locked.should.equal(userBody.locked);
            userId = res.body._id;
            done();
        });
    });

    it('gets an user by id', function(done){
         supertest(url)
        .get(api + userId)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            res.body._id.should.equal(userId);
            res.body.name.should.equal(userBody.name);
            res.body.username.should.equal(userBody.username);
            res.body.password.should.not.equal(userBody.password);
            res.body.role.should.equal(userBody.role);
            res.body.locked.should.equal(true);
            done();
        });
    });

    it('tries to get an unexisting user', function(done){
         supertest(url)
        .get(api + 'UNKNOWN_ID')
        .expect(500)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('updates an user by id', function(done){
        userBody.name = "NEW New User #1";
        supertest(url)
        .put(api + userId)
        .send(userBody)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            res.body.name.should.equal(userBody.name);
            res.body.username.should.equal(userBody.username);
            res.body.password.should.not.equal(userBody.password);
            res.body.role.should.equal(userBody.role);
            res.body.locked.should.equal(true);
            done();
        });
    });

    it('makes sure user is updated', function(done){
         supertest(url)
        .get(api + userId)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            res.body._id.should.equal(userId);
            res.body.name.should.equal(userBody.name);
            res.body.username.should.equal(userBody.username);
            res.body.password.should.not.equal(userBody.password);
            res.body.role.should.equal(userBody.role);
            res.body.locked.should.equal(true);
            done();
        });
    });

    it('checks that new user is get with all users', function(done){
        Array.prototype.userIdExist = function(userId) {
            for (var i = 0; i < this.length; i++) {
                if (this[i]._id === userId) {
                    return true;
                }
            }

            return false;
        };
        supertest(url)
        .get(api)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            (res.body.length >= 1).should.equal(true);
            (res.body.userIdExist(userId)).should.equal(true);
            done();
        });
    });

    it('deletes the user', function(done){
        supertest(url)
        .delete(api + userId)
        .expect(204)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('tries to delete an unexisting user', function(done){
        supertest(url)
        .delete(api + 'UNKNOWN_ID')
        .expect(500)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('checks that the user does not exist anymore', function(done){
        Array.prototype.userIdExist = function(userId) {
            for (var i = 0; i < this.length; i++) {
                if (this[i]._id === userId) {
                    return true;
                }
            }

            return false;
        };
        supertest(url)
        .get(api)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            (!res.body.userIdExist(userId)).should.equal(true);
            done();
        });
    });

    it('posts an user without auth', function(done){
        supertest(noauth_url)
        .post(api)
        .send(userBody)
        .expect(401)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('updates an user by id without auth', function(done){
        userBody.name = "NEW New Race #1";
        supertest(noauth_url)
        .put(api + userId)
        .send(userBody)
        .expect(401)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('deletes the user without auth', function(done){
        supertest(noauth_url)
        .delete(api + userId)
        .expect(401)
        .end(function(err, res) {
            if (err) {
                throw err;
            }

            done();
        });
    });
});
