//Data
var data;
var xhr = new XMLHttpRequest();
xhr.open('get', 'js/openData.json', true);
xhr.send(null);
xhr.onload = function(){
    data = JSON.parse(xhr.responseText).result.records;
    initSelect();
    updateContent('--請選擇行政區--');
};

//Parameter
var zones = [];
var selectZones = document.getElementById('zones');
var popularZone = document.querySelector('.popularZone');

//Event
selectZones.addEventListener('change', zonesChange, false);
popularZone.addEventListener('click', popularZoneClick, false);
window.addEventListener('scroll', goTopBtnPosition, false);
window.addEventListener('resize', goTopBtnPosition, false);

//Function
function initSelect(){
    for (let i = 0; i < data.length; i++) {
        if(zones.find(x => x == data[i].Zone) === undefined)
        {
            zones.push(data[i].Zone);
        }
    }

    for (let i = 0; i < zones.length; i++) {
        selectZones.innerHTML += '<option value=' + zones[i] + '>' + zones[i] + '</option>';
    }
}

function zonesChange(e){
    updateContent(e.target.value);
}

function popularZoneClick(e){
    if(e.target.nodeName == 'INPUT')
    {
        for (let i = 0; i < selectZones.options.length; i++){  
            if (selectZones.options[i].value == e.target.value)
            {  
                selectZones.options[i].selected = true;
                updateContent(e.target.value);
                break;
            }
        }
    }
}

function updateContent(zone){
    let str = '';
    let list = document.querySelector('.list');
    let zoneName = document.getElementById('zoneName');

    for (let i = 0; i < data.length; i++) {
        if(zone == '--請選擇行政區--')
        {
            str += stringListItem(data[i].Name, data[i].Zone, data[i].Opentime, data[i].Add, data[i].Tel, data[i].Ticketinfo, data[i].Picture1);
        }
        else
        {
            if(zone == data[i].Zone)
            {
                str += stringListItem(data[i].Name, data[i].Zone, data[i].Opentime, data[i].Add, data[i].Tel, data[i].Ticketinfo, data[i].Picture1);
            }
        }
    }
    list.innerHTML = str;
    zoneName.textContent = zone;
}

function stringListItem(name, zone, openTime, add, tel, ticketInfo, picture1){
    let str = '';

    if(ticketInfo == '')
    {
        ticketInfo = "　　　　";
    }
    
    str = 
    `<li>
        <div class="photo" style="background: url(${picture1});background-size: cover;background-position: center;">
            <h3>${name}</h3>
            <p>${zone}</p>
        </div>
        <div class="description">
            <p><img src="images/icons_clock.png" alt="">${openTime}</p>
            <p><img src="images/icons_pin.png" alt="">${add}</p>
            <div class="side-by-side">
                <p><img src="images/icons_phone.png" alt="">${tel}</p>
                <p><img src="images/icons_tag.png" alt="">${ticketInfo}</p>
            </div>
        </div>
    </li>`;

    return str;
}

function goTopBtnPosition(){
    let container = document.querySelector('.container');
    let goTopBtn = document.querySelector('.go-top');

    goTopBtn.style.display = (document.documentElement.scrollTop > 0) ? 'block' : 'none';
    goTopBtn.style.top = window.innerHeight * 0.8 + 'px';
    goTopBtn.style.left = (container.offsetLeft + 980) + 'px';
}