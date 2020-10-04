//Parameter
var resultBtn = document.getElementById('btnResult');
var refreshBtn = document.querySelector('.refresh');
var historyArray = JSON.parse(localStorage.getItem('historyArray')) || [];

updateHistory();

//Event
resultBtn.addEventListener('click', calculateBMI, false);
refreshBtn.addEventListener('click', refresh, false);

//Function
function calculateBMI(){
    let textHeight = document.getElementById('height');
    let textWeight = document.getElementById('weight');
    let height, weight, BMI, level, levelStyle;

    if(textHeight.value == '' || isNaN(textHeight.value))
    {
        alert("身高(cm)未輸入或輸入值並非數字!!");
        return;
    }
    if(textWeight.value == '' || isNaN(textWeight.value))
    {
        alert("體重(kg)未輸入或輸入值並非數字!!");
        return;
    }
    height = parseFloat(textHeight.value);
    if(height <= 0)
    {
        alert("身高(cm)必須大於0");
        return;
    }
    weight = parseFloat(textWeight.value);
    if(weight <= 0)
    {
        alert("體重(kg)必須大於0");
        return;
    }
    BMI = (weight / ((height / 100) ^ 2)).toFixed(2);
    console.log(BMI);

    if(BMI < 18.5)
    {
        level = '過輕';
        levelStyle = 'under-weight';
    }
    else if(BMI >= 18.5 && BMI < 25)
    {
        level = '理想';
        levelStyle = 'healthy-weight';
    }
    else if(BMI >= 25 && BMI < 30)
    {
        level = '過重';
        levelStyle = 'over-weight';
    }
    else if(BMI >= 30 && BMI < 35)
    {
        level = '輕度肥胖';
        levelStyle = 'obese-class1';
    }
    else if(BMI >= 35 && BMI < 40)
    {
        level = '中度肥胖';
        levelStyle = 'obese-class2';
    }
    else if(BMI >= 40)
    {
        level = '重度肥胖';
        levelStyle = 'obese-class3';
    }

    showResult(BMI, level, levelStyle);
    saveLocalStorage(height, weight, BMI, level, levelStyle);
}

function showResult(BMI, level, levelStyle){
    let labelBMI = document.querySelector('.label-BMI');
    let resultLevel = document.querySelector('.result-level');
    let color = '';

    switch(levelStyle)
    {
        case 'under-weight':
            color = '#31BAF9';
            break;
        
        case 'healthy-weight':
            color = '#86D73F';
            break;

        case 'over-weight':
            color = '#FF982D';
            break;

        case 'obese-class1':
            color = '#FF6C03';
            break;

        case 'obese-class2':
            color = '#FF6C03';
            break;
        
        case 'obese-class3':
            color = '#FF1200';
            break;
        
        default:
            color = '#ffffff';
            break;
    }

    labelBMI.setAttribute('style', 'display: block;color: ' + color);
    resultLevel.setAttribute('style', 'display: block;color: ' + color);
    resultLevel.textContent = level;
    refreshBtn.setAttribute('style', 'display: block;background-color: ' + color);
    resultBtn.setAttribute('style', 'cursor: default;pointer-events: none;background: transparent;font-size: 32px;color: ' + color + ';border: 6px solid ' + color);
    resultBtn.value = BMI;
}

function refresh(){
    window.location.reload();
}

function saveLocalStorage(height, weight, BMI, level, levelStyle){
    let today = new Date();
    let date = paddingLeft(String(today.getMonth() + 1), 2) + '-' + paddingLeft(String(today.getDate()), 2) + '-' + today.getFullYear();
    let data = {
        Height: height,
        Weight: weight,
        BMI: BMI,
        Level: level,
        LevelStyle: levelStyle,
        Date: date
    };
    //只保留10筆歷史紀錄
    if(historyArray.length == 10)
    {
        historyArray.splice(0, 1);
    }
    console.log(historyArray);
    historyArray.push(data);
    localStorage.setItem('historyArray', JSON.stringify(historyArray));
    updateHistory();
}

function updateHistory(){
    let list = document.querySelector('.list');
    let str = '';
    for (let i = 0; i < historyArray.length; i++) {
        str += 
        `<li class="${historyArray[i].LevelStyle}">
            <p class="item-level">${historyArray[i].Level}</p>
            <p class="item-BMI"><span class="desc">BMI</span>${historyArray[i].BMI}</p>
            <p class="item-weight"><span class="desc">weight</span>${historyArray[i].Weight}kg</p>
            <p class="item-height"><span class="desc">height</span>${historyArray[i].Height}cm</p>
            <p class="item-date desc">${historyArray[i].Date}</p>
        </li>`;
    }
    list.innerHTML = str;
}

function paddingLeft(str, length){
    if(str.length >= length)
    {
        return str;
    }
    else
    {
        return paddingLeft('0' + str, length);
    }
}