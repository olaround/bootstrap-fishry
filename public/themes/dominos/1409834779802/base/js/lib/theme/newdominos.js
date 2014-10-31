$(document).ready(function () {
    $("#karachi").hide();
    $("#islamabad").hide();
    $("#lahore").hide();
	$("#rawalpindi").hide();
    $("#karachi").addClass("active");
    $("#menudetailbox").hide();
    $("#areascoverdwrap ").hide();
    

    $(".isb_flag").click(function () {
        $("#karachi").removeClass("active");
        $("#lahore").removeClass("active");
		$("#rawalpindi").hide("active");
        $("#islamabad").addClass("active");
		
    });
    $(".lhr_flag").click(function () {
        $("#karachi").removeClass("active");
        $("#lahore").addClass("active");
        $("#islamabad").removeClass("active");
		$("#rawalpindi").hide("active");
    });
    $(".khi_flag").click(function () {
        $("#karachi").addClass("active");
        $("#lahore").removeClass("active");
        $("#islamabad").removeClass("active");
		$("#rawalpindi").hide("active");
    });
	 $(".rwl_flag").click(function () {
		$("#rawalpindi").show();
        $("#karachi").removeClass("active");
        $("#lahore").removeClass("active");
        $("#islamabad").removeClass("active");
		
    });
	

    $("span.closebtn").click(function closereglog() {
        $("#reglogin").hide("slow");
        //window.location = 'http://teamants.com/clients/dominos_live/order/';
    });
    $("#normalcontent .leftarea ul li").click(function (){
         $("#normalcontent .leftarea ul li").removeClass('active');
         $("#normalcontent .leftarea").removeClass('bogleftarea');
         $(this).addClass('active');
         
    });
    $("#normalcontent .leftarea ul li.biglongarea").click(function (){
         $("#normalcontent .leftarea").addClass('bogleftarea');
         $(this).addClass('active');
         
    });
    $('p.applynow').click (function () {
       $('#formwrap').fadeIn('slow'); 
    });    
    $('div.closeapplywrap').click (function () {
       $('#formwrap').fadeOut('slow'); 
    });
    $('#brancheslist ul li a').click(function () {
        $('#brancheslist ul li').removeClass('shoarea');
        $(this).parent().addClass('shoarea');
    });  
});
function validate(theform) {
    
        var tracker = $('#trackerid').val();
        if(tracker == "")
        {
            alert("Please enter your Domino's Order ID\nHint: Click on your name above to view your order history and view the last order placed");
            $('#trackerid').focus();
            return false;
        }        
}
function showdetails(id) {
         $("#menudetailbox").show();
         $('#menudetailboxwrap').show();
    name = $("#prodetailbox_"+id+" h3").html();
    description = $("#pizzaDes_"+id).val();
    $("#detailtext").html(description);
    $("#detailtitle").html(name);
    var url = $("#pizzaImgage_"+id).val();
    $("#menudetailboxwrap #menudetailbox").css('background-image','url('+url+')');
    
}
function hidedetails() {
    $("#menudetailbox").hide();
    $("#menudetailboxwrap").hide();
}
function closeformwrap() {
   $('#formwrap').fadeOut('slow'); 
}

function closefran() {
   $('#franchiseForm').hide(); 
}
function closereglog() {
        $("#reglogin").hide("slow");
        //window.location = 'http://teamants.com/clients/dominos_live/order/';
    }
function showareas(id) {
    $("#areascoverdwrap ").show();
}
function hideareacoverd() {
    $('#brancheslist ul li').removeClass('shoarea');
}

//Start Login Function ================================ //    
    function loginpres() {
    var username =$("#login_username").val();
    var password =$("#login_password").val();
    var loginprocess = $("#loginsubmitbtn").val();
    var submiturl = $("#functionpath").val();
    var loginpress = 'login_user='+ username+'&login_pass='+password+'&loginprocess='+loginprocess;
        $.ajax({  
          type: "POST",  
          url: submiturl+"/sitefuncs/functions.php",  
          data: loginpress,  
          success: function(html) {  
                if(html==1) {
                    //window.location.href= 'http://teamants.com/clients/dominos_live/order/';
                    $('#regloginbox').removeAttr("onclick");
                    $('#logout').attr("style", "display:inline-block");
                    $('#innerbox').fadeOut(); 
                     $('#proceed').fadeIn('slow');
                
                } else {
                    $('#errormesg').fadeIn("slow");
                }
          }  
        });  
    };
//End Login Function   ---  Start Register Function================================ //    
    function regpres() {
    var name =$("#full_name").val();
    var email =$("#reg_email").val();
    var pass = $("#pass_word").val();
    var cpass = $("#con_pass_word").val();
    var cell = $("#cell_no").val();
    var ptcl = $("#ptcl_no").val();
    var dob = $("#dob").val();

    var home_address = $("#home_address").val();
    var home_city = $("#home_city").val();
    var home_instruction = $("#home_instruction").val();

    var bus_name = $("#bus_name").val();
    var bus_address = $("#bus_address").val();
    var bus_city = $("#bus_city").val();
    var bus_instruction = $("#bus_instruction").val();

    var other_address = $("#other_address").val();
    var other_city = $("#other_city").val();
    var other_instruction = $("#other_instruction").val();

    var submiturl = $("#functionpath").val(); 
    var regprocess = "register";    
    
    if(name=="") {
       alert('Please enter your full name'); 
       return false;
    }
    if(email=="") {
       alert('Please enter your email address'); 
       return false;
    }
                var mailId = email;
                var apos=mailId.indexOf("@");
                var dotpos=mailId.lastIndexOf(".");
                var lastpos=mailId.length-1;

            if (mailId.indexOf(' ')==-1 && 0 < mailId.indexOf('@') && 0 < mailId.indexOf('.') && mailId.indexOf('@')+1 < mailId.length && mailId.length >= 5)
            {
               }
               else
            {
                  alert("Please provide a valid email address");
                  $("#reg_email").focus();
                  return false;
            }
      if(pass=="") {
        alert('Please enter your password'); 
        return false;
      }
      if(cpass=="") {
        alert('Please enter your password again');
        $("#con_pass_word").focus(); 
        return false;
      }       
    if(pass!=cpass) {
        alert('Mismatch password');
        $("#con_pass_word").focus(); 
        return false; 
    }
        
    
    if(home_address=="" && bus_name=="" && other_address=="") {
        alert('Please Give us at-least one delivery address');
        return false;
    }
    
    var regpress = 'fullname='+ name+'&email='+email+'&pass='+pass+'&cell='+cell+'&ptcl='+ptcl+'&dob='+dob+'&home_address='+home_address+'&home_city='+home_city+'&home_instruction='+home_instruction+'&bus_name='+bus_name+'&bus_address='+bus_address+'&bus_city='+bus_city+'&bus_instruction='+bus_instruction+'&other_address='+other_address+'&other_city='+other_city+'&other_instruction='+other_instruction+'&regprocess=register';
        $.ajax({  
          type: "POST",  
          url: submiturl+"/sitefuncs/functions.php",  
          data: regpress,  
          success: function(reg) {  
                if(reg=="true") {
                    $('#reglogform').fadeOut("slow");
                    $('#successsign').fadeIn("slow");
                    window.location.href = "http://dominos.com.pk/order/";
                    //window.location.href = "http://teamants.com/clients/dominos_live/order/";
                } else {
                    alert('Email address is allready registerd');
                }  
          }  
        });  
    };
    // Place Order function.. --------------------------------------- //
function placeorder() {
    $("#reglogin").show("slow");
}
function regloginbox() {
    $("#reglogin").show("slow");
};