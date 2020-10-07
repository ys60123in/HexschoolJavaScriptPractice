var app = new Vue({
    el:'#app',
    data:{
        NT: 0
    },
    computed:{
        JPY: function(){
            return (this.NT / 0.2768).toFixed(3)
        },
        USD: function(){
            return (this.NT / 29.2).toFixed(3)
        },
        CNY: function(){
            return (this.NT / 4.361).toFixed(3)
        },
        HKD: function(){
            return (this.NT / 3.78).toFixed(3)
        },
        AUD: function(){
            return (this.NT / 21.05).toFixed(3)
        }
    }
});