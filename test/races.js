var supertest = require('supertest');
var should = require('should');

describe('Races RESTful API', function(){
    var url = 'http://localhost:3000';
    var api = '/api/races/';
    var raceBody = {
        name: 'New Race #1',
        city: 'City #1',
        distance: '1'
    };
    var raceId;

    it('posts a race', function(done){
        supertest(url)
        .post(api)
        .send(raceBody)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            res.body.should.have.property('_id');
            res.body.name.should.equal(raceBody.name);
            res.body.city.should.equal(raceBody.city);
            res.body.distance.should.equal(parseInt(raceBody.distance));
            raceId = res.body._id;
            done();
        });
    });

    it('gets a race by id', function(done){
         supertest(url)
        .get(api + raceId)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            res.body._id.should.equal(raceId);
            res.body.name.should.equal(raceBody.name);
            res.body.city.should.equal(raceBody.city);
            res.body.distance.should.equal(parseInt(raceBody.distance));
            done();
        });
    });

    it('tries to get an unexisting race', function(done){
         supertest(url)
        .get(api + 'UNKNOWN_ID')
        .expect(500)
        .end(function(err, res) {
            if (err)
                throw err;
            done();
        });
    });

    it('updates a race by id', function(done){
        raceBody.name = "NEW New Race #1";
        supertest(url)
        .put(api + raceId)
        .send(raceBody)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            res.body.name.should.equal(raceBody.name);
            res.body.city.should.equal(raceBody.city);
            res.body.distance.should.equal(parseInt(raceBody.distance));
            done();
        });
    });

    it('makes sure race is updated', function(done){
         supertest(url)
        .get(api + raceId)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            res.body._id.should.equal(raceId);
            res.body.name.should.equal(raceBody.name);
            res.body.city.should.equal(raceBody.city);
            res.body.distance.should.equal(parseInt(raceBody.distance));
            done();
        });
    });

    it('checks that new race is get with all races', function(done){
        Array.prototype.raceIdExist = function(raceId) {
            for(var i = 0; i < this.length; i++) {
                if(this[i]._id === raceId)
                    return true;
            }
            return false;
        };
        supertest(url)
        .get(api)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            (res.body.length >= 1).should.equal(true);
            (res.body.raceIdExist(raceId)).should.equal(true);
            done();
        });
    });

    it('deletes the race', function(done){
        supertest(url)
        .delete(api + raceId)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            done();
        });
    });

    it('tries to delete an unexisting race', function(done){
        supertest(url)
        .delete(api + 'UNKNOWN_ID')
        .expect(500)
        .end(function(err, res) {
            if (err)
                throw err;
            done();
        });
    });

    it('checks that the race does not exist anymore', function(done){
        Array.prototype.raceIdExist = function(raceId) {
            for(var i = 0; i < this.length; i++) {
                if(this[i]._id === raceId)
                    return true;
            }
            return false;
        };
        supertest(url)
        .get(api)
        .expect(200)
        .end(function(err, res) {
            if (err)
                throw err;
            (!res.body.raceIdExist(raceId)).should.equal(true);
            done();
        });
    });
});
