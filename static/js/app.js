var app = {};

$(document).ready(function(){

	app.Todo = Backbone.Model.extend({
		default: {
			title: '',
			completed: false
		},

		toggle: function() {
			this.save({completed: !this.get("completed")});
		}
	});

	//collection of todoitems
	app.TodoList = Backbone.Collection.extend({
		model: app.Todo,

		completed: function () {
			return this.where({completed: true});
		},

		notCompleted: function () {
			return this.where({completed: false});
		}
	});

	//dummy data
	var todoListItems = new app.TodoList([
	  new app.Todo({
	    title: 'Item 1',
		completed: false
	  }),
	  new app.Todo({
	    title: 'Item 2',
		completed: false
	  }),
	  new app.Todo({
	    title: 'Item 3',
		completed: false
	  })
	]);

	app.TodoItem = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#item-template').html()),

		events: {
			"click ._complete" : "complete"
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		complete: function() {
			this.model.destroy();
		}
	});

	app.TodoList = Backbone.View.extend({
		el: '#todo-list',

		events: {
			"click ._list-add" : "listAdd",
		},

		initialize: function() {
			this.render();
		},

		render: function(){
			var self = this;
			
			this.collection.each(function(model) {
        		self.$el.append(new app.TodoItem({model: model}).render().el);
      		});

			console.log(this.collection);
      		console.log(this.collection.notCompleted());

      		return this;
		},

		listAdd: function() {
			var user_input = $('._input').val();

			if (user_input.length > 0) {

				var newTodo = new app.Todo({
					title: user_input,
					completed: false
				});

				this.collection.add(newTodo);
				this.$el.append(new app.TodoItem({model: newTodo}).render().el);
				console.log(this.collection);
			}
		},
	});

	console.log(todoListItems);
	new app.TodoList({collection: todoListItems});
});



