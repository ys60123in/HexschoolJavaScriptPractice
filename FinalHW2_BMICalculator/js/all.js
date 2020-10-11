const BMILevel = {
    'under-weight':{
        desc: '過輕',
        color: '#31BAF9'
    },
    'healthy-weight':{
        desc: '理想',
        color: '#86D73F'
    },
    'over-weight':{
        desc: '過重',
        color: '#FF982D'
    },
    'obese-class1':{
        desc: '輕度肥胖',
        color: '#FF6C03'
    },
    'obese-class2':{
        desc: '中度肥胖',
        color: '#FF6C03'
    },
    'obese-class3':{
        desc: '重度肥胖',
        color: '#FF1200'
    }
};

//Parameter
const resultBtn = document.getElementById('btnResult');
const refreshBtn = document.querySelector('.refresh');
let historyArray = JSON.parse(localStorage.getItem('historyArray')) || [];
const list = document.querySelector('.list');
const promptHeight = document.getElementById('promptHeight');
const promptWeight = document.getElementById('promptWeight');
const textHeight = document.getElementById('height');
const textWeight = document.getElementById('weight');

//Main
updateHistory();

//Event
resultBtn.addEventListener('click', calculateBMI, false);
refreshBtn.addEventListener('click', refresh, false);
list.addEventListener('click', removeBMIHistory, false);
textHeight.addEventListener('blur', showPrompt, false);
textWeight.addEventListener('blur', showPrompt, false);

//Function
function calculateBMI(){
    let height, weight, BMI, level;

    if(textHeight.value === '' || isNaN(textHeight.value))
    {
        promptHeight.textContent = "身高(cm)未輸入或輸入值並非數字!!";
        return;
    }
    if(textWeight.value === '' || isNaN(textWeight.value))
    {
        promptWeight.textContent = "體重(kg)未輸入或輸入值並非數字!!";
        return;
    }
    height = parseFloat(textHeight.value);
    if(height <= 0)
    {
        promptHeight.textContent = "身高(cm)必須大於0";
        return;
    }
    weight = parseFloat(textWeight.value);
    if(weight <= 0)
    {
        promptWeight.textContent = "體重(kg)必須大於0";
        return;
    }
    promptHeight.textContent = "";
    promptWeight.textContent = "";
    BMI = (weight / ((height / 100) * (height / 100))).toFixed(2);
    console.log(BMI);

    if(BMI < 18.5)
    {
        level = 'under-weight';
    }
    else if(BMI >= 18.5 && BMI < 25)
    {
        level = 'healthy-weight';
    }
    else if(BMI >= 25 && BMI < 30)
    {
        level = 'over-weight';
    }
    else if(BMI >= 30 && BMI < 35)
    {
        level = 'obese-class1';
    }
    else if(BMI >= 35 && BMI < 40)
    {
        level = 'obese-class2';
    }
    else if(BMI >= 40)
    {
        level = 'obese-class3';
    }

    showResult(BMI, level);
    saveLocalStorage(height, weight, BMI, level);
}

function showResult(BMI, level){
    const labelBMI = document.querySelector('.label-BMI');
    const resultLevel = document.querySelector('.result-level');

    labelBMI.setAttribute('style', `display: block;color:${BMILevel[level].color}`);
    resultLevel.setAttribute('style', `display: block;color:${BMILevel[level].color}`);
    resultLevel.textContent = BMILevel[level].desc;
    refreshBtn.setAttribute('style', `display: block;background-color:${BMILevel[level].color}`);
    resultBtn.setAttribute('style', `cursor: default;pointer-events: none;background: transparent;font-size: 32px;color:${BMILevel[level].color};border: 6px solid ${BMILevel[level].color}`);
    resultBtn.value = BMI;
}

function refresh(){
    const labelBMI = document.querySelector('.label-BMI');
    const resultLevel = document.querySelector('.result-level');

    labelBMI.setAttribute('style', 'display: none;');
    resultLevel.setAttribute('style', 'display: none;');
    refreshBtn.setAttribute('style', 'display: none;');
    resultBtn.setAttribute('style', 'cursor: pointer;pointer-events: auto;background: #FFD366;font-size: 24px;color: #424242;border: 6px solid transparent');
    resultBtn.value = "看結果";
    textHeight.value = "";
    textWeight.value = "";
}

function saveLocalStorage(height, weight, BMI, level){
    let today = new Date();
    let date = paddingLeft(String(today.getMonth() + 1), 2) + '-' + paddingLeft(String(today.getDate()), 2) + '-' + today.getFullYear();
    let data = {
        Id: Math.floor(Date.now()),
        Height: height,
        Weight: weight,
        BMI: BMI,
        Level: BMILevel[level].desc,
        LevelStyle: level,
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
    const list = document.querySelector('.list');
    let str = '';
    for (let i = 0; i < historyArray.length; i++) {
        str += 
        `<li class="${historyArray[i].LevelStyle}">
            <p class="item-level">${historyArray[i].Level}</p>
            <p class="item-BMI"><span class="desc">BMI</span>${historyArray[i].BMI}</p>
            <p class="item-weight"><span class="desc">weight</span>${historyArray[i].Weight}kg</p>
            <p class="item-height"><span class="desc">height</span>${historyArray[i].Height}cm</p>
            <p class="item-date desc">${historyArray[i].Date}</p>
            <a class="item-remove" href="#"><img class="btn-remove" key="${historyArray[i].Id}" src="https://image.flaticon.com/icons/png/512/484/484662.png" alt=""></a>
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

function removeBMIHistory(e){
    e.preventDefault();
    if(e.target.nodeName !== 'IMG') return;
    let index = historyArray.findIndex(i => i.Id === Number(e.target.getAttribute('key')));
    // console.log(index);
    if(index >= 0)
    {
        historyArray.splice(index, 1);
        localStorage.setItem('historyArray', JSON.stringify(historyArray));
        updateHistory();
    }
}

function showPrompt(e){
    let height, weight;
    //提示身高輸入是否正確
    if(e.target.getAttribute('name') === 'height')
    {
        if(e.target.value === '' || isNaN(e.target.value))
        {
            promptHeight.textContent = "身高(cm)未輸入或輸入值並非數字!!";
            return;
        }

        height = parseFloat(e.target.value);
        if(height <= 0)
        {
            promptHeight.textContent = "身高(cm)必須大於0";
            return;
        }

        promptHeight.textContent = "";
    }
    //提示體重輸入是否正確
    if(e.target.getAttribute('name') === 'weight')
    {
        if(e.target.value === '' || isNaN(e.target.value))
        {
            promptWeight.textContent = "體重(kg)未輸入或輸入值並非數字!!";
            return;
        }
        
        weight = parseFloat(e.target.value);
        if(weight <= 0)
        {
            promptWeight.textContent = "體重(kg)必須大於0";
            return;
        }

        promptWeight.textContent = "";
    }
}