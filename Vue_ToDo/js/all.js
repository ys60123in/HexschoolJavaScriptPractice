var filters = {
    all: function(toDoList) {
      return toDoList;
    },
    active: function(toDoList) {
      return toDoList.filter(function(todo) {
        return !todo.completed;
      });
    },
    completed: function(toDoList) {
      return toDoList.filter(function(todo) {
        return todo.completed;
      });
    }
};

var app = new Vue({
    el: '#app',
    data:{
        toDoList: JSON.parse(localStorage.getItem('toDoList')) || [],
        toDoText: '',
        visibility: 'all'
    },
    methods:{
        send: function(todo){
            if(todo == '')
            {
                alert('請先輸入代辦事項!');
                return;
            }
            this.toDoList.push({listItem: todo, id: Math.floor(Date.now()), completed: false });
            localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
            this.toDoText = '';
        },
        removeTodo: function(todo){
            this.toDoList.splice(this.toDoList.indexOf(todo), 1);
            localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
        },
        completeAll: function(){
            this.toDoList.forEach(element => {
                element.completed = true;
            });
        },
        removeCompleted: function(){
            this.toDoList = filters['active'](this.toDoList);
            localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
        },
        showMode: function(mode){
            this.visibility = mode;
        }
    },
    computed:{
        filteredToDoList: function() {
            return filters[this.visibility](this.toDoList);
        }
    }
});