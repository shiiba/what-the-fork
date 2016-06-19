// $(document).ready(function() {

 
// });

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
			authenticatedUser: cookieCheck,
      userId: null
		};
	},
	changeLogin: function() {
		this.setState ({
			authenticatedUser: true
		})
	},
  handleId: function(userId){
    console.log(userId);
    this.setState({userId: userId});
  }, 
	render: function(){
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		console.log('==================================');
		console.log('cookie:', document.cookie);

		if(this.state.authenticatedUser === true) {
			return (
				<div>
					<Index userId={this.state.userId}/>
				</div>
				) 
		} else {
			return (
				<div>
  				<LoginForm 
            initalLoginCheck={this.state.authenticatedUser} 
            onChange={this.changeLogin}
            handleId={this.handleId}
          />
  				<SignupForm 
            initialCreate={this.state.authenticatedUser} 
            onChange={this.changeLogin}
            handleId={this.handleId}
          />
				</div>
			)
		}
	}
});


var LoginForm = React.createClass({
	getInitialState: function() {
		// I chose to have the loginform maintain it's own state as it does meaningful things with data
		// For the form purposes: keep track of username, password
		// For invoking the callback prop, set a state for loginStatus. This is the original parent state for this.state.authenticatedUser
		return {
			username: this.props.initialLoginCheck,
			password: this.props.initialLoginCheck,
			loginStatus: this.props.initialLoginCheck
		};
	},

	// This is a cool helper function. On the form, it will update the input values that user's type into the form
	handleLoginFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},

	// So form gets submitted, prevent default, trim, and send the ajaxcall!
	handleSubmit: function(e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		console.log('username: ' + username);
		console.log('password: ' + password);
		this.loginAJAX(username, password);
	},
	// },
	// AJAX call. straight up jQuery baby!
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
        this.props.handleId(data.userId);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this),
		});
	},

	// Here's my sexy form
	render: function() {
		// console.log(this);
		return (
			<div className="login-form" >
				<h3>Please Login</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="username">username</label>
					<input className="username-login-form" type="text" value={this.state.username} onChange={this.handleLoginFormChange.bind(this, 'username')}/>
					<br/>
					<label htmlFor="password">Password</label>
					<input className="password-login-form" type="text" value={this.state.password} onChange={this.handleLoginFormChange.bind(this, 'password')}/>
					<br/>
					<input type="submit"/>
				</form>
			</div>
		)
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
        this.props.handleId(data.userId);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	render: function(){
		return(
			<div className="signup-form">
			<h3> Create An Account </h3>
			<form onSubmit={this.handleSubmit}>
			<label htmlFor="firstName"> First Name </label>
			<input className="first-name-create" type="text" value={this.state.firstName} onChange={this.handleSignupFormChange.bind(this,'firstName')}/>
			<br/>
			<label htmlFor="lastName"> Last Name </label>
			<input className="last-name-create" type="text" value={this.state.lastName} onChange={this.handleSignupFormChange.bind(this,'lastName')}/>
			<br/>
			<label htmlFor="username"> username </label>
			<input className="username-create" type="text" value={this.state.username} onChange={this.handleSignupFormChange.bind(this,'username')}/>
			<br/>
			<label htmlFor="password"> Password </label>
			<input className="password-create" type="text" value={this.state.password} onChange={this.handleSignupFormChange.bind(this,'password')}/>
			<br/>
			<input type="submit"/>
			</form>
			</div>
			)
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
      showProfile: true
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
              <li>{addIngredients.ingredient}</li>
          </div>
        );
      });
      return(
        <div>
          <nav>
            <button className="srch-btn" onClick={this.handleReset}>
            New Search
            </button>
          </nav>
          <br/>
          <div className={this.state.showProfile ? "hidden" : ""}>
            <UserProfileLink 
              handleHistory={this.handleHistory}
              userId={this.props.userId}
            />
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
                  userId={this.props.userId}
                /> : 
                null
              }
            </div>
          </div>
          <div className={this.state.showProfile ? "" : "hidden"}>
            <UserProfile 
              userId={this.props.userId} 
              firstName={this.state.firstName}
              recipeHistory={this.state.recipeHistory}
            />
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
      <div>
        <div className={this.props.showResults ? "hidden" : "" } >
          <button 
            onClick={this.getResults}
          >
            Search
          </button>
        </div>
        { this.props.showResults ? <RecipeList results={this.state.results} userId={this.props.userId} /> : null } 
      </div>
    );
  }
});

// { this.state.showResults ? <Results /> : null } 
// render <SearchResults results={this.state.results}/>
// SearchResults also renders a button

var RecipeList = React.createClass({
  addRecipe: function(data){
    console.log('clicked da button');
    $.ajax({
        url: '/users/' + this.props.userId + '/recipes',
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
    var list = this.props.results.map(function(data){
      var callback = function(){
        self.addRecipe(data);
      };
      return(
        <div>
          <hr/>
          <h3>{data.label}</h3>
          <img src={data.image}/>
          <button
            onClick={callback}
            className="add-btn"
          >
            I'll Forking Cook This
          </button>
        </div>
      );
    });
    return(
      <div className="recipeList">
      {list}
      </div>
    );
  }
});

var UserProfileLink = React.createClass({
  getHistoryAJAX: function(){
    console.log('getting history via AJAX');
    $.ajax({
      url: '/users/' + this.props.userId + '/recipes/',
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
          <li>{ingredient}</li>
        );
      });
      return(
        <div>
          <h4>{recipe.label}</h4><br/>
          <img src={recipe.image}/><br/>
          <a href={recipe.uri}>View Recipe</a><br/>
          <ul>{ingredients}</ul>
          <hr/>
        </div>
      );
    });
    return(
			<div className="saved-user-history">
        <h2>{this.props.firstName}</h2>
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

