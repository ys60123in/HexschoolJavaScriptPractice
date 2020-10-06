var toDoList = [];
var inputToDO = document.querySelector('.text');
var btnSend = document.querySelector('.send');
var list = document.querySelector('.list');

//更新待辦事項
function updateToDoList(){
    var jsonToDoList = localStorage.getItem('toDoList');
    if(jsonToDoList == null) return;
    toDoList = JSON.parse(jsonToDoList);
    var str = '';
    for (var i = 0; i < toDoList.length; i++) {
        str += '<li><a href="#" id="delete" data-num="'+ i +'">刪除</a> ' + toDoList[i].listItem + '</li>';
    }
    list.innerHTML = str;
}
updateToDoList();

//加入待辦
btnSend.addEventListener('click', function(){
    var toDoText = inputToDO.value;
    if(toDoText == '')
    {
        alert('請先輸入代辦事項!');
        return;
    }
    var item = { listItem: toDoText };
    var jsonToDoList = localStorage.getItem('toDoList');

    if(jsonToDoList !== null)
    {
        toDoList = JSON.parse(jsonToDoList);
    }
    toDoList.push(item);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    updateToDoList();
    inputToDO.value = '';
});

//刪除
function deleteItem(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A') return;
    var num = e.target.dataset.num;
    toDoList.splice(num, 1);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    updateToDoList();
}
list.addEventListener('click', deleteItem);