const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
chai.use(chaiHttp);

describe('Recipes', function(){

  before(function() {
    return runServer();
  });

  after(function() {
  return closeServer();
  });

  it('should list recipes from GET request', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.should.have.length.of.at.least(1);

      res.body.forEach(function(item){
        item.should.be.a('object');
        item.should.include.keys('id','ingredients','name');
      });
    });
  });

  it('should add new recipes on POST request', function(){
    const newRecipe = {
      name: 'ice water', ingredients: ['ice', 'cup', 'water']};
      return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.name.should.equal(newRecipe.name);
        res.body.ingredients.should.be.a('array');
        res.body.ingredients.should.include.members(newRecipe.ingredients);
    });
  });

  it('should update recipes on PUT request', function(){
    const updateRecipes = {
      name: 'cold water',
      ingredients: ['ice', 'cup', 'water']
    };
  return chai.request(app)
  .get('/recipes')
  .then(function(res){
    updateRecipes.id = res.body[0].id;
    return chai.request(app)
      .put(`/recipes/${updateRecipes.id}`)
      .send(updateRecipes);
  })
    .then(function(res){
      // console.log(res, "FIND THIS MESSAGE");
      res.should.have.status(204)
    });
  });

  it('should delete recipes on DELETE request', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`)
      })
    .then(function(res) {
      res.should.have.status(204);
    });
  });
});
