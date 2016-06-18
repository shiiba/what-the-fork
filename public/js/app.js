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
	


ReactDOM.render(
	<div>
	<AppDisplayer />
	</div>,
	document.getElementById('container')
);