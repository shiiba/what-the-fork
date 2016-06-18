$(document).ready(function() {

 
});

var AppDisplayer = React.createClass({
	render: function(){
		return (
			<div className='appDisplayer'>
			What da fork should i eat?
			<Index />
			</div>
			);
	}
});

var CreateRecipeForm = React.createClass(
	{getInitialState: function(){
		return {ingredient: ""}
	},
	handleIngredientChange: function(e){
		this.setState({ingredient: e.target.value});
	},
	handleSubmit: function(e){
		e.preventDefault();
		this.props.onListSubmit(
			{ingredient: this.state.ingredient.trim()}
			);
		this.setState({ingredient: ""});
	},
	render: function(){
		return(
			<form className="createRecipeForm"
						onSubmit={this.handleSubmit}>
				<input type="text"
							 placeholder="Add an ingredient"
							 value={this.state.ingredient}
							 onChange={this.handleIngredientChange} />
				<input type="submit" value="+" />
			</form>);
	}
});

var Index = React.createClass(
	{getInitialState: function(){
		return {ingredients: []};
	},
	recipes(addIngredients){
		var ingredients2 = this.state.ingredients.slice();
		ingredients2.push(addIngredients);
		this.setState({ingredients: ingredients2});
	},
	render: function(){
		var showIngredients = this.state.ingredients.map(function(addIngredients){
			return(
				<div className="ingredientList">
					<li>{addIngredients.ingredient}</li>
				</div>
				);
		});
		return(
			<ul>
				<CreateRecipeForm onListSubmit={this.recipes} /> 
				{showIngredients}
				{this.state.ingredients.length > 0 ? <SearchRecipesBtn ingredients={this.state.ingredients} /> : null }
			</ul>);;
	}
});

// ajax call using this.props.ingredients
// return results and pass into results array
var SearchRecipesBtn = React.createClass({
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
    console.log(results2);
    this.setState({
      results: results2,
      showResults: true
    });
  },
  getResults: function(){
    var ingredientQuery = this.props.ingredients.join().toLowerCase();
    $.ajax({
      url: '/users/search',
      method: 'POST',
      data: ingredientQuery,
      success: function(data){
        // console.log(data.hits);
        this.handleResults(data.hits);
      }.bind(this),   // ensuring that the object being returned is the object being fed into the application
      error: function(xhr, status, err){
        console.error(status, err.toString());
      }.bind(this)
    })
  },
  render: function(){
    return(
      <div>
        <div> 
          <button 
            onClick={this.getResults}
          >
            Search
          </button>
        </div>
        
      </div>
    );
  }
});
// { this.state.showResults ? 'className="hidden"' : null }
// { this.state.showResults ? <Results /> : null } 
// render <SearchResults results={this.state.results}/>
// SearchResults also renders a button


ReactDOM.render(
  <div>
  <AppDisplayer />
  </div>,
  document.getElementById('container')
);
