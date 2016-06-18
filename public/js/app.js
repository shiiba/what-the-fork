$(document).ready(function() {

 
});


// ajax call using this.props.ingredients
// return results and pass into results array
var SearchRecipes = React.createClass({
  getInitialState: function(){
    return({
      results: [],
      showResults: false  // DO THIS HIGHER UP INSTEAD ^^
    });
  },
  handleResults: function(recipeData){
    var results2 = [];
    recipeData.forEach(function(recipe){
      var recipeItem = {
        label: recipe.recipe.label,
        image: recipe.recipe.image,
        uri: recipe.recipe.url,
        ingredients: recipe.recipe.ingredientLines
      }
      results2.push(recipeItem);
    });
    this.setState({
      results: results2,
      showResults: true
    });
  },
  getResults: function(){
    var ingredientQuery = this.props.ingredients.join().toLowerCase();
    $.ajax({
      url: 'https://api.edamam.com/search?q=' + ingredientQuery + "&app_id=" + process.env.EDAMAM_ID + "&app_key=" + process.env.EDAMAM_KEY,
      method: 'GET',
      success: function(data){
        console.log(data.hits);
        this.handleResults(data.hits);
      }.bind(this),   // ensuring that the object being returned is the object being fed into the application
      error: function(xhr, status, err){
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    return(
      <div>
        <div { this.state.showResults ? 'className="hidden"' : null }>
          <button 
            onClick={this.getResults}
          >
            Search
          </button>
        </div>
        { this.state.showResults ? <Results /> : null }
      </div>
    );
  }
});

// render <SearchResults results={this.state.results}/>
// SearchResults also renders a button
