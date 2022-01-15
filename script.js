function onLoad() {
    $("#item-add").click(function() {
        addItem();
    });
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            addItem();
        }
    });
    $(document).on('click','.log-items-row',function(){
        $(this).toggleClass("log-items-row-selected");
    });
    getParams();
    $("#item-name").focus();
}

function getParams() {
    let params= decodeURIComponent(location.search);
    params = params.slice(1);

    let items;
    for(param of params.split("&")) {
        if(param.split("=")[0] == "items") {
            items = param.split("=")[1];
        }
    }

    for(item of items.split(";")) {
        let name;
        let dur;
        for(itemParam of item.split(",")) {
            if(itemParam.split(":")[0] == "name") {
                name = itemParam.split(":")[1];
            }
            else if(itemParam.split(":")[0] == "dur") {
                dur = itemParam.split(":")[1];
            }
        }
        if(name && dur) {
            addItem(name,dur);
        }
    }
}

function updateParams() {
    let params = "?items=";
    for(row of $(".log-items-row")){
        let name = $($(row).children(".l-name")[0]).text();
        let dur = $($(row).children(".l-time")[0]).text();
        params += `name:${name},dur:${dur};`;
    }
    params = params.slice(0,-1);

    history.pushState({},null,params);
}

function errorMsg(msg) {
    $("#log-error-msg").text(msg);
    $("#log-error-msg").show();
    $("#item-name").focus();
}

function addItem(itemName=null, itemDur=null) {
    $("#log-error-msg").hide();
    if(!itemName) {
        if (!$("#item-name").val()) {
            errorMsg("Please specify an item name.");
            return;
        }
        itemName = $("#item-name").val();
    }
    if(!itemDur) {
        if (!$("#item-dur").val()) {
            errorMsg("Please specify an item duration.");
            return;
        }
        itemDur = $("#item-dur").val();
    }
    let dur = new moment(itemDur,"mm:ss");
    if(!dur.isValid()) {
        errorMsg("Invalid duration entered.");
        return;
    }
    let m2951 = new moment("29:51","mm:ss");
    let m5651 = new moment("56:51","mm:ss");
    let m5951 = new moment("59:51","mm:ss");

    let m2951_diff = moment.utc(m2951.diff(dur)).format("mm:ss");
    let m5651_diff = moment.utc(m5651.diff(dur)).format("mm:ss");
    let m5951_diff = moment.utc(m5951.diff(dur)).format("mm:ss");

    let html = `
        <div class="log-items-row">
                <div class="l-name">${itemName}</div>
                <div class="l-time">${dur.format("mm:ss")}</div>
                <div class="l-time">${m2951_diff}</div>
                <div class="l-time">${m5651_diff}</div>
                <div class="l-time">${m5951_diff}</div>
        </div>
    `;

    $("#log-items").append(html);
    $("#item-name").val("");
    $("#item-dur").val("");
    $("#item-name").focus();
    $('#log-header').css('display', 'flex');
    updateParams();
}