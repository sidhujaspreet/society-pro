$(document).ready(function(){    
    $("#enterLocationBtn").click(function(){
        $("#pickLocationBtn").removeClass("btn-primary active");
        $("#pickLocationBtn").addClass("btn-default");
        $(this).removeClass("btn-default");
        $(this).addClass("btn-primary active");
        $("#enterLocationInput").css('display',"block");
        $("#pickLocationInput").css('display',"none");
        $("#pickLocationIntro").css('display',"none");
    });
    
    $("#pickLocationBtn").click(function(){    
        $("#enterLocationBtn").removeClass("btn-primary active");
        $("#enterLocationBtn").addClass("btn-default");
        $(this).removeClass("btn-default");
        $(this).addClass("btn-primary active");
        $("#enterLocationInput").css('display',"none");
        $("#pickLocationInput").css('display',"block");
        $("#pickLocationIntro").css('display',"block");
        //$(".angular-google-map-container").css('display',"block");
        //$("#mapBody").css('display',"none");
    });
});