//This will check the users cookies and see if they are already set (aka, already looged in)
var AppDisplay = React.createClass({
	getInitialState: function(){
		var cookieCheck;
		if(document.cookie){
			cookieCheck = true;
		} else {
			cookieCheck = '';
		}
		return {
			authenticatedUser: cookieCheck
		};
	},
	changeLogin: function() {
		this.setState ({
			authenticatedUser: true
		})
	},
	render: function(){
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		console.log('==================================');
		console.log('cookie:', document.cookie);

		if(this.state.authenticatedUser === true) {
			return (
				<div>
					<Index />
				</div>
				) 
		} else {
			return (
				<div className="forms">
          <nav>
          Q
          </nav>
          <p className="whatDa2">
            WhatDa Fork Should I Eat?
          </p>
          <div className="signup"> 
            <SignupForm 
              initialCreate={this.state.authenticatedUser} 
              onChange={this.changeLogin}
              handleId={this.handleId}
            />
          </div>
          <div className="login">
    				<LoginForm 
              initalLoginCheck={this.state.authenticatedUser} 
              onChange={this.changeLogin}
              handleId={this.handleId}
            />
          </div>
				</div>
			)
		}
	}
});


var LoginForm = React.createClass({
	getInitialState: function() {
		return {
			username: this.props.initialLoginCheck,
			password: this.props.initialLoginCheck,
			loginStatus: this.props.initialLoginCheck
		};
	},
	handleLoginFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		console.log('username: ' + username);
		console.log('password: ' + password);
		this.loginAJAX(username, password);
	},
	loginAJAX: function(username, password) {
    console.log(username);
    console.log(password);
		$.ajax({
			url: "/auth",
			method: "POST",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				console.log('Cookie Monster');
				Cookies.set('jwt_token', data.token);
				console.log(data);
				this.props.onChange(data.token)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this),
		});
	},
	render: function() {
		return(
      <div className="login">
  			<div className="login-form" >
  				<h3>Please Login</h3>
  				<form onSubmit={this.handleSubmit}>
  					<label 
              htmlFor="username"
            >
              Username:
            </label>
            <br/>
  					<input 
              className="username-login-form" 
              type="text" 
              value={this.state.username} 
              onChange={this.handleLoginFormChange.bind(this, 'username')}
            /><br/>
  					<label 
              htmlFor="password"
            >
              Password:
            </label>
            <br/>
  					<input 
              className="password-login-form" 
              type="text" 
              value={this.state.password} 
              onChange={this.handleLoginFormChange.bind(this, 'password')}
            /><br/>
  					<input
              className="loginSubmit" 
              type="submit"
            />
  				</form>
  			</div>
      </div>  
		);
	}
})

var SignupForm = React.createClass({
	getInitialState: function(){
		return {
			firstName: this.props.initialCreate,
			lastName: this.props.initialCreate,	
			username: this.props.initialCreate,
			password: this.props.initialCreate
		};
	},
	handleSignupFormChange: function(setName, e){
		var change = {};
		change[setName] = e.target.value
		this.setState(change);
	},
	handleSubmit: function(e){
		e.preventDefault();
		var firstName = this.state.firstName.trim();
		var lastName = this.state.lastName.trim();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.signupAJAX(firstName, lastName, username, password);
	},
	signupAJAX: function(firstName, lastName, username, password){
		console.log('sending post request');
		$.ajax({
			url:'/users',
			method: 'POST',
			data: {
				firstName: firstName,
				lastName: lastName,
				username: username,
				password: password
			},
			success: function(data){
				console.log("A new user signing up!!");
				Cookies.set('jwt_token', data.token);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	render: function(){
		return(
      <div className="signup">
  			<div className="signup-form">
    			<h3> Create An Account </h3>
    			<form 
            onSubmit={this.handleSubmit}
          >
    			<label 
            htmlFor="firstName"
          > 
            First Name: 
          </label>
          <br/>
    			<input
            className="first-name-create" 
            type="text" 
            value={this.state.firstName} 
            onChange={this.handleSignupFormChange.bind(this,'firstName')}
          /><br/>
    			<label 
            htmlFor="lastName"
          > 
            Last Name: 
          </label>
          <br/>
    			<input 
            className="last-name-create" 
            type="text" 
            value={this.state.lastName} 
            onChange={this.handleSignupFormChange.bind(this,'lastName')}
          /><br/>
    			<label 
            htmlFor="username"
          > 
            Username: 
          </label>
          <br/>
    			<input 
            className="username-create" 
            type="text" 
            value={this.state.username} 
            onChange={this.handleSignupFormChange.bind(this,'username')}
          /><br/>
    			<label 
            htmlFor="password"
          >
              Password: 
          </label>
          <br/>
    			<input 
            className="password-create" 
            type="text" 
            value={this.state.password} 
            onChange={this.handleSignupFormChange.bind(this,'password')}
          /><br/>
    			<input
            className="signupSubmit" 
            type="submit"
          />
    			</form>
  			</div>
      </div>  
		);
	}
});

var Index = React.createClass({
  getInitialState: function(){
    return {
      ingredients: [],
      showResults: false,
      showProfile: false,
      firstName: '',
      recipeHistory: []
    };
  },
  recipes(addIngredients){
      var ingredients2 = this.state.ingredients.slice();
      ingredients2.push(addIngredients);
      this.setState({ingredients: ingredients2});
  },
  switchShowResults: function(){
    this.setState({showResults: !this.state.showResults});
  },
  handleHistory: function(data){
    console.log('firstName: ' + data.firstName);
    console.log('recipeHistory: ' + data.recipeHistory);
    this.setState({
      firstName: data.firstName,
      recipeHistory: data.recipeHistory,
      showProfile: true,
      showResults: false,
      ingredients: []
    });
  },
  handleReset: function(){
    this.setState({
      ingredients: [],
      showResults: false,
      showProfile: false,
      firstName: '',
      recipeHistory: []
    })
  },
  render: function(){
    var showIngredients = this.state.ingredients.map(function(addIngredients){
      return(
        <div className="ingredientList">
            <li>• {addIngredients.ingredient}</li>
        </div>
      );
    });
    return(
      <div>
        <div className="indexPage">
          <nav> Q
            <button className="new-btn" onClick={this.handleReset}>
            New Search
            </button>
            <div className={this.state.showProfile ? "hidden" : "userProf"}>
              <UserProfileLink 
                handleHistory={this.handleHistory}
              />
            </div>
          </nav>
          <br/>
          <div className={this.state.showResults == true || this.state.showProfile == true ? "hidden" : "" }>
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
          <div className={this.state.showProfile ? "" : "hidden"}>
            <UserProfile 
              firstName={this.state.firstName}
              recipeHistory={this.state.recipeHistory}
            />
          </div>
        </div>
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
        <div>
          <p className="whatDa">
            WhatDa Fork Should I Eat?
          </p>
          <form 
            className="createRecipeForm"
            onSubmit={this.handleSubmit}
          >
            <input 
              className="adding"
              type="text"
              placeholder="Add an ingredient"
              value={this.state.ingredient}
              onChange={this.handleIngredientChange} 
            />
            <input
              className="plusSubmit"  
              type="submit" 
              value="+" 
            />
          </form>
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
        key: recipe.recipe.label,
        label: recipe.recipe.label,
        image: recipe.recipe.image,
        uri: recipe.recipe.url,
        ingredients: recipe.recipe.ingredientLines
      }
      results2.push(recipeItem);
    });
    console.log('==========');
    console.log(results2);
    this.props.switchShowResults();
    this.replaceState({results: results2});
  },
  getResults: function(){
    var temp = [];
    this.props.ingredients.forEach(function(ingredient){
      temp.push(ingredient.ingredient);
    });
    var ingredientQuery = temp.join().toLowerCase();
    console.log('ingredient query1:' + ingredientQuery);
    $.ajax({
      url: '/users/search',
      method: 'POST',
      data: {ingredients: ingredientQuery},
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
      <div className="searchResults">
        <div className={this.props.showResults ? "hidden" : "" } >
          <button
            className="searchButton" 
            onClick={this.getResults}
          >
            Search
          </button>
        </div>
        { this.props.showResults ? <RecipeList results={this.state.results} /> : null } 
      </div>
    );
  }
});

var RecipeList = React.createClass({
  addRecipe: function(data){
    console.log('clicked da button');
    $.ajax({
        url: '/users/recipes',
        method: 'PUT',
        data: {
            label: data.label,
            image: data.image,
            uri: data.uri,
            ingredients: data.ingredients
        },
        success: function(data){
          console.log('we in da club');
          console.log(data);
        }.bind(this),
        error: function(xhr, status, err){
            console.log(status, err.toString());
        }.bind(this)
    })
  },
  render: function(){
    // console.log(this.props.results);
    var self = this;
    var max = 0;
    var recipes = this.props.results.map(function(recipe){
      max += 1;
      var id = "a" + max;
      var target = "#" + id;
      console.log('target: ' + target);
      var callback = function(){
        self.addRecipe(recipe);
      };
      var ingredients = recipe.ingredients.map(function(ingredient){
        return(
          <li> {ingredient}</li>
        );
      });
      return(
        <div>
          <div 
            className="recipeList"
            data-toggle="modal"
            data-target={target}
          >
            <div>
              <h3>{recipe.label}</h3>
              <img src={recipe.image}/>
              <hr/>
            </div>
          </div>
          <div className="modal fade" id={id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h5 className="modal-title" id="myModalLabel">{recipe.label}</h5>
                </div>
                <div className="modal-body">
                  <img src={recipe.image}/><br/>
                  <a href={recipe.uri} target="_blank">View Recipe</a><br/>
                  <p className="listOutIngredients">Ingredients</p>
                  <p className="specificRecipe">{ingredients}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  <button type="button" onClick={callback} className="btn btn-primary add-btn" data-dismiss="modal">I'll Forking Cook This</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return(
      <div className="recipe-container">
        <div>
          {recipes}
        </div>
      </div>
    );
  }
});

var UserProfileLink = React.createClass({
  getHistoryAJAX: function(){
    console.log('getting history via AJAX');
    $.ajax({
      url: '/users/recipes/',
      method: 'GET',
      success: function(data){
        console.log('ajax return data: ' + data);
        this.props.handleHistory(data);
        console.log('history called');
      }.bind(this),
      error: function(xhr, status, err){
        console.error(status, err.toString());
      }.bind(this)
    })
  },
  render: function(){
    return(
      <button
        onClick={this.getHistoryAJAX}
        className="srch-btn"
      >
        User Profile
      </button>
    );
  }
});

var UserProfile = React.createClass({
	render: function(){
    var recipes = this.props.recipeHistory.map(function(recipe){
      var ingredients = recipe.ingredients.map(function(ingredient){
        return(
          <li> {ingredient}</li>
        );
      });
      return(
        <div className="historyList">
          <h5>{recipe.label}</h5><br/>
          <img src={recipe.image}/><br/>
          <a href={recipe.uri}>View Recipe</a><br/>
          <ul>{ingredients}</ul>
        </div>
      );
    });
    return(
			<div className="saved-user-history">
        <h2>{this.props.firstName}'s Saved Recipes</h2>
        {recipes}
			</div>
		);
	}
});

ReactDOM.render(
	<div>
	<AppDisplay/>
	</div>,
	 document.getElementById('container')
);

