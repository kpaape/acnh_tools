var tools = [];
var clickAction = "default";

window.onload = function() {
    loadTools();

    $("#toggle, .option").on("click", function() {
        $("#cancel").removeClass("open");
        $("#tool_options").removeClass("open");
        $(".tool-wrapper").removeClass("hoverable remove");
        $("#options").toggleClass("open");
        clickAction = "default";
    });
    $("#btn_add_tool").on("click", function() {
        $("#tool_options").toggleClass("open");
    });
    $("#btn_remove_tool").on("click", function() {
        clickAction = "remove";
        $(".tool-wrapper").toggleClass("hoverable remove");
    });
    $(".tool-option").on("click", function() {
        $("#cancel").removeClass("open");
        $("#tool_options, #options").removeClass("open");

        addTool($(this));
    });
    $(".option").on("click", function() {
        $("#cancel").addClass("open");
    });
    $("#cancel").on("click", function() {
        $("#tool_options").removeClass("open");
        $(".tool-wrapper").removeClass("hoverable remove");
        $("#cancel").removeClass("open");
        clickAction = "default";
    });
    $("#btn_repair_tool").on("click", function() {
        clickAction = "repair";
        $(".tool-wrapper").toggleClass("hoverable");
    });
}

function loadTools() {
    if(!localStorage.tools) {
        saveTools();
    }
    tools = JSON.parse(localStorage.tools);
    renderTools();
}

function saveTools() {
    localStorage.tools = JSON.stringify(tools);
}

function attatchToolListener() {
    $(".tool-wrapper").on("click", function() {
        var toolIndex = Number($(this).attr("data-tool-index"));
        $("#tool_options, #options").removeClass("open");
        $("#cancel").removeClass("open");
        switch (clickAction) {
            case "remove":
                tools.splice(toolIndex, 1);
                break;
        
            case "repair":
                tools[toolIndex].durability = tools[toolIndex].maxDurability;
                break;
            
            default:
                tools[toolIndex].durability -= 1;
                break;
        }
        renderTools();
        clickAction = "default";
    });
}

function renderTools() {
    saveTools();
    var renderHTML = "";
    for(var i = 0; i < tools.length; i++) {
        var meter = tools[i].durability / tools[i].maxDurability * 100;
        meter = Math.max(meter, 0);
        renderHTML += '<div class="tool-wrapper" data-tool-index="' + i + '"><div class="tool"><img src="' + tools[i].img + '"></div>';
        renderHTML += '<div class="durability">' + tools[i].name + '<div class="meter-bg">';
        renderHTML += '<div class="meter" style="width: ' + meter + '%;"></div></div></div></div>';
    }
    $("#tool_container").html(renderHTML);
    attatchToolListener();
}

function addTool(option, html=true) {
    var toolName = html ? option.text() : option.name;
    var toolDurability = html ? Number(option.attr("data-durability")) : option.durability;
    var toolMaxDurability = html ? Number(option.attr("data-durability")) : option.maxDurability;
    var toolImg = html ? option.find("img").attr("src") : option.img;
    var tool = new Tool(toolName, toolDurability, toolMaxDurability, toolImg);
    tools.push(tool);
    renderTools();
}

function Tool(name, durability, maxDurability, img) {
    this.name = name;
    this.durability = durability;
    this.maxDurability = maxDurability;
    this.img = img;
}