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
		return {
      ingredients: [],
      showResults: false
    };
	},
	recipes(addIngredients){
		var ingredients2 = this.state.ingredients.slice();
		ingredients2.push(addIngredients);
		this.setState({ingredients: ingredients2});
	},
  switchShowResults: function(){
    this.setState({showResults: true});
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
			<div>
        <div className={this.state.showResults ? "hidden" : "" }>
          <ul>
    				<CreateRecipeForm onListSubmit={this.recipes} /> 
    				{showIngredients}
    			</ul>
        </div>
        <div>
          {this.state.ingredients.length > 0 ? 
            <SearchRecipesBtn 
              ingredients={this.state.ingredients} 
              showResults={this.state.showResults} 
              switchShowResults={this.switchShowResults} 
            /> : 
            null
          }
        </div>
      </div>
    );
	}
});

// ajax call using this.props.ingredients
// return results and pass into results array
var SearchRecipesBtn = React.createClass({
  getInitialState: function(){
    return({ results: [] });
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
    this.props.switchShowResults();
    this.setState({results: results2});
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
        <div className={this.props.showResults ? "hidden" : "" } >
          <button 
            onClick={this.getResults}
          >
            Search
          </button>
        </div>
        { this.state.showResults ? <RecipeList results={this.state.results} /> : null } 
      </div>
    );
  }
});

// render <SearchResults results={this.state.results}/>
// SearchResults also renders a button


ReactDOM.render(
  <div>
  <AppDisplayer />
  </div>,
  document.getElementById('container')
);
