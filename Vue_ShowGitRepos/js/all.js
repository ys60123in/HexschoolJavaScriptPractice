let app = new Vue({
    el:"#app",
    data:{
        userName: "ys60123in",
        repos: null
    },
    created: function(){
        this.fetchData();
    },
    methods:{
        fetchData: function(){
            let xhr = new XMLHttpRequest();
            let self = this;
            xhr.open('get', `https://api.github.com/users/${this.userName}/repos`);
            xhr.onload = function () {
                self.repos = JSON.parse(xhr.responseText);
                console.log(self.repos);
            }
            xhr.send();
        }
    }
});