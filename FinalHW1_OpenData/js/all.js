//Data
let data;
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
xhr.onload = function(){
    data = JSON.parse(xhr.responseText).result.records;
    initSelect();
    updateContent('--請選擇行政區--', 1);
};

//Parameter
let zones = [];
const selectZones = document.getElementById('zones');
const popularZone = document.querySelector('.popularZone');
const pages = document.querySelector('.pages');

//Event
selectZones.addEventListener('change', zonesChange, false);
popularZone.addEventListener('click', popularZoneClick, false);
window.addEventListener('scroll', goTopBtnPosition, false);
window.addEventListener('resize', goTopBtnPosition, false);
pages.addEventListener('click', switchPage, false);

//Function
function initSelect(){
    for (let i = 0; i < data.length; i++) {
        if(zones.find(x => x === data[i].Zone) === undefined)
        {
            zones.push(data[i].Zone);
        }
    }

    for (let i = 0; i < zones.length; i++) {
        selectZones.innerHTML += `<option value=${zones[i]}>${zones[i]}</option>`;
    }
}

function zonesChange(e){
    updateContent(e.target.value, 1);
}

function popularZoneClick(e){
    if(e.target.nodeName === 'INPUT')
    {
        for (let i = 0; i < selectZones.options.length; i++){  
            if (selectZones.options[i].value === e.target.value)
            {  
                selectZones.options[i].selected = true;
                updateContent(e.target.value, 1);
                break;
            }
        }
    }
}

function updateContent(zone, page){
    const defaultZone_Option = document.getElementById('defaultZone');
    const zoneName = document.getElementById('zoneName');

    if(zone !== '--請選擇行政區--' && defaultZone_Option.getAttribute('disabled') !== 'disabled')
    {
        defaultZone_Option.setAttribute('disabled', 'disabled');
    }

    zoneName.textContent = zone;

    if(zone === '--請選擇行政區--')
    {
        pagination(data, page);
    }
    else
    {
        pagination(data.filter(e => e.Zone === zone), page);
    }
}

function goTopBtnPosition(e){
    const container = document.querySelector('.container');
    const goTopBtn = document.querySelector('.go-top');

    goTopBtn.style.display = (document.documentElement.scrollTop > 0) ? 'block' : 'none';
    goTopBtn.style.top = window.innerHeight * 0.8 + 'px';
    goTopBtn.style.left = (container.offsetLeft + 980) + 'px';
}

function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    updateContent(selectZones.value, page);
}

function pagination(filterData, nowPage) {
    console.log(nowPage);
    // 取得全部資料長度
    const dataTotal = filterData.length;
    
    // 設定要顯示在畫面上的資料數量
    // 預設每一頁只顯示 6 筆資料。
    const perpage = 6;
    
    // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
    // 這邊要注意，因為有可能會出現餘數，所以要無條件進位。
    const pageTotal = Math.ceil(dataTotal / perpage);
    
    // 當前頁數，對應現在當前頁數
    let currentPage = nowPage;
    
    // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
    // 所以要在寫入一個判斷避免這種狀況。
    // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
    // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage，所以才會寫這一個判斷式，但主要是預防一些無法預期的狀況，例如：nowPage 突然發神經？！
    if (currentPage > pageTotal) 
    {
      currentPage = pageTotal;
    }
    
    // 由前面可知 最小數字為 6 ，所以用答案來回推公式。
    const minData = (currentPage * perpage) - perpage + 1 ;
    const maxData = (currentPage * perpage) ;
    
    // 先建立新陣列
    const data = [];
    // 這邊將會使用 ES6 forEach 做資料處理
    // 首先必須使用索引來判斷資料位子，所以要使用 index
    filterData.forEach((item, index) => {
      // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
      const num = index + 1;
      // 這邊判斷式會稍微複雜一點
      // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
      if ( num >= minData && num <= maxData) {
        data.push(item);
      }
    });
    // 用物件方式來傳遞資料
    const page = {
      pageTotal,
      currentPage,
      hasPage: currentPage > 1,
      hasNext: currentPage < pageTotal,
    }
    displayData(data);
    pageBtn(page);
}

function displayData(data) {
    const list = document.querySelector('.list');
    let str = '';
    data.forEach((item) => {
        str += 
        `<li>
            <div class="photo" style="background: url(${item.Picture1});background-size: cover;background-position: center;">
                <h3>${item.Name}</h3>
                <p>${item.Zone}</p>
            </div>
            <div class="description">
                <p><img src="images/icons_clock.png" alt="">${item.Opentime}</p>
                <p><img src="images/icons_pin.png" alt="">${item.Add}</p>
                <div class="side-by-side">
                    <p><img src="images/icons_phone.png" alt="">${item.Tel}</p>
                    <p><img src="images/icons_tag.png" alt="">${item.Ticketinfo}</p>
                </div>
            </div>
        </li>`;
    });
    list.innerHTML = str;
}

function pageBtn (page){
    let str = '';
    const total = page.pageTotal;

    if(page.hasPage) 
    {
        str += `<li><a href="#" data-page="${Number(page.currentPage) - 1}">&lt; prev</a></li>`;
    } 
    else 
    {
        str += `<li><a class="page-disabled" href="#">&lt; prev</a></li>`;
    }

    for(let i = 1; i <= total; i++){
        if(Number(page.currentPage) === i) 
        {
            str +=`<li><a class="page-selected" href="#" data-page="${i}">${i}</a></li>`;
        } 
        else 
        {
            str +=`<li><a href="#" data-page="${i}">${i}</a></li>`;
        }
    }

    if(page.hasNext) 
    {
        str += `<li><a href="#" data-page="${Number(page.currentPage) + 1}">next &gt;</a></li>`;
    } 
    else 
    {
        str += `<li><a class="page-disabled" href="#">next &gt;</a></li>`;
    }

    pages.innerHTML = str;
}