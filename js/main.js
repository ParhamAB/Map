var MarkerArr = [];
var InfoArr = [];
var id = 0;

var map = L.map('map').setView([32.42074, 53.68302], 6);
map.doubleClickZoom.disable();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    minZoom: 2,
}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
    let marker = L.marker(e.latlng).addTo(map);
    marker.id = id;
    MarkerArr.push(marker);
    $(".leaflet-marker-pane>img:last-child").attr('id',`${id}-img`).attr('data-bs-toggle','modal').attr('data-bs-target','#Modal').click(GettingInfo);
    let obj = {
        objId:id,
        name: '',
        phoneNumber: '',
        Location: marker._latlng
    }
    addElement(id);
    InfoArr.push(obj);
    localStorage.setItem(`${id}-info`, JSON.stringify(obj));
    id++;
    localStorage.setItem(`max`, id);
    marker.bindPopup(`${obj.name}`).openPopup();
}

map.addEventListener("dblclick", onMapClick);

$('#save').click(function(){
    let temp = $('input[name="id"]').val();
    let obj = InfoArr.find(p=> p.objId == (Number)(temp));
    let marker = MarkerArr.find(p=> p.id == (Number)(temp));
    let indexObj = InfoArr.indexOf(obj)
    obj.name = $('input[name="name"]').val();
    obj.phoneNumber = $('input[name="Phone"]').val();
    $(`#${temp}-history-h1`).text(obj.name);
    marker.bindPopup(`${obj.name}`).openPopup();
    InfoArr.splice(indexObj,1,obj);
    localStorage.setItem(`${temp}-info`, JSON.stringify(obj));
    alert('Saved!');
})

$('#Delete').click(function(){
    let temp = $('input[name="id"]').val();
    let obj = InfoArr.find(p=> p.objId == (Number)(temp));
    let marker = MarkerArr.find(p=> p.id == (Number)(temp));
    let indexObj = InfoArr.indexOf(obj);
    let indexMarker = MarkerArr.indexOf(marker);
    localStorage.removeItem(`${temp}-info`);
    $(`#${temp}-history`).remove();
    marker.remove();
    InfoArr.splice(indexObj,1);
    MarkerArr.splice(indexMarker,1);
    alert('Deleted!');
})

function GettingInfo(){
    let temp = $(this).attr('id').replace(/[^0-9]/g, '');
    let marker = MarkerArr.find(p=> p.id == (Number)(temp));
    marker.openPopup();
    let obj = InfoArr.find(p=> p.objId == temp);
    $('input[name="id"]').val(obj.objId);
    $('input[name="name"]').val(obj.name);
    $('input[name="Phone"]').val(obj.phoneNumber);
    $('input[name="Loc"]').val(`${obj.Location.lat} , ${obj.Location.lng}`);
};


$('#search').click(function(){
    let tempSearch = $('#text-Search').val();
    if(tempSearch != ''){
        let objByName = InfoArr.find(p=> p.name == tempSearch);
        let objByPhone = InfoArr.find(p=> p.phoneNumber == tempSearch);
        if(objByName == null && objByPhone == null){
            alert('چنین چیزی وجود ندارد');
        }else{
            if(objByName != null){
                let marker = MarkerArr.find(p=> p.id == objByName.objId);
                marker.openPopup();
            }else{
                let marker = MarkerArr.find(p=> p.id == objByPhone.objId);
                marker.openPopup();
            }
        }
    }else{
        alert(`لطفا نام یا شماره را وارد کنید`)
    }
});


function addElement (tempid,name=''){
    let body = $(`
    <div class="btn-grad child-custom" id="${tempid}-history">
        <img src="https://unpkg.com/leaflet@1.8.0/dist/images/marker-icon.png" class="float-start h-100">
        <h1 class="float-end" id="${tempid}-history-h1">${name}</h1>
    </div>
    `).attr('data-bs-toggle','modal').attr('data-bs-target','#Modal').click(GettingInfo);
    $('.element-custom').append(body);
}


$(document).ready(function(){
    let max = +localStorage.getItem(`max`);
    for(let i = 0 ; i < max ; i++){
        let obj = JSON.parse(localStorage.getItem(`${i}-info`));
        if(obj){
            let marker = L.marker(obj.Location).addTo(map);
            marker.id = obj.objId;
            MarkerArr.push(marker);
            marker.bindPopup(`${obj.name}`).openPopup();
            $(".leaflet-marker-pane>img:last-child").attr('id',`${obj.objId}-img`).attr('data-bs-toggle','modal').attr('data-bs-target','#Modal').click(GettingInfo);
            addElement(obj.objId,obj.name);
            InfoArr.push(obj);
        }
    }
    id = max;
});