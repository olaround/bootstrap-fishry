function validate(e){var t=$("#trackerid").val();if(t==""){alert("Please enter your Domino's Order ID\nHint: Click on your name above to view your order history and view the last order placed");$("#trackerid").focus();return false}}function showdetails(e){$("#menudetailbox").show();$("#menudetailboxwrap").show();name=$("#prodetailbox_"+e+" h3").html();description=$("#pizzaDes_"+e).val();$("#detailtext").html(description);$("#detailtitle").html(name);var t=$("#pizzaImgage_"+e).val();$("#menudetailboxwrap #menudetailbox").css("background-image","url("+t+")")}function hidedetails(){$("#menudetailbox").hide();$("#menudetailboxwrap").hide()}function closeformwrap(){$("#formwrap").fadeOut("slow")}function closefran(){$("#franchiseForm").hide()}function closereglog(){$("#reglogin").hide("slow")}function showareas(e){$("#areascoverdwrap ").show()}function hideareacoverd(){$("#brancheslist ul li").removeClass("shoarea")}function loginpres(){var e=$("#login_username").val();var t=$("#login_password").val();var n=$("#loginsubmitbtn").val();var r=$("#functionpath").val();var i="login_user="+e+"&login_pass="+t+"&loginprocess="+n;$.ajax({type:"POST",url:r+"/sitefuncs/functions.php",data:i,success:function(e){if(e==1){$("#regloginbox").removeAttr("onclick");$("#logout").attr("style","display:inline-block");$("#innerbox").fadeOut();$("#proceed").fadeIn("slow")}else{$("#errormesg").fadeIn("slow")}}})}function regpres(){var e=$("#full_name").val();var t=$("#reg_email").val();var n=$("#pass_word").val();var r=$("#con_pass_word").val();var i=$("#cell_no").val();var s=$("#ptcl_no").val();var o=$("#dob").val();var u=$("#home_address").val();var a=$("#home_city").val();var f=$("#home_instruction").val();var l=$("#bus_name").val();var c=$("#bus_address").val();var h=$("#bus_city").val();var p=$("#bus_instruction").val();var d=$("#other_address").val();var v=$("#other_city").val();var m=$("#other_instruction").val();var g=$("#functionpath").val();var y="register";if(e==""){alert("Please enter your full name");return false}if(t==""){alert("Please enter your email address");return false}var b=t;var w=b.indexOf("@");var E=b.lastIndexOf(".");var S=b.length-1;if(b.indexOf(" ")==-1&&0<b.indexOf("@")&&0<b.indexOf(".")&&b.indexOf("@")+1<b.length&&b.length>=5){}else{alert("Please provide a valid email address");$("#reg_email").focus();return false}if(n==""){alert("Please enter your password");return false}if(r==""){alert("Please enter your password again");$("#con_pass_word").focus();return false}if(n!=r){alert("Mismatch password");$("#con_pass_word").focus();return false}if(u==""&&l==""&&d==""){alert("Please Give us at-least one delivery address");return false}var x="fullname="+e+"&email="+t+"&pass="+n+"&cell="+i+"&ptcl="+s+"&dob="+o+"&home_address="+u+"&home_city="+a+"&home_instruction="+f+"&bus_name="+l+"&bus_address="+c+"&bus_city="+h+"&bus_instruction="+p+"&other_address="+d+"&other_city="+v+"&other_instruction="+m+"&regprocess=register";$.ajax({type:"POST",url:g+"/sitefuncs/functions.php",data:x,success:function(e){if(e=="true"){$("#reglogform").fadeOut("slow");$("#successsign").fadeIn("slow");window.location.href="http://dominos.com.pk/order/"}else{alert("Email address is allready registerd")}}})}function placeorder(){$("#reglogin").show("slow")}function regloginbox(){$("#reglogin").show("slow")}$(document).ready(function(){$("#karachi").hide();$("#islamabad").hide();$("#lahore").hide();$("#rawalpindi").hide();$("#karachi").addClass("active");$("#menudetailbox").hide();$("#areascoverdwrap ").hide();$(".isb_flag").click(function(){$("#karachi").removeClass("active");$("#lahore").removeClass("active");$("#rawalpindi").hide("active");$("#islamabad").addClass("active")});$(".lhr_flag").click(function(){$("#karachi").removeClass("active");$("#lahore").addClass("active");$("#islamabad").removeClass("active");$("#rawalpindi").hide("active")});$(".khi_flag").click(function(){$("#karachi").addClass("active");$("#lahore").removeClass("active");$("#islamabad").removeClass("active");$("#rawalpindi").hide("active")});$(".rwl_flag").click(function(){$("#rawalpindi").show();$("#karachi").removeClass("active");$("#lahore").removeClass("active");$("#islamabad").removeClass("active")});$("span.closebtn").click(function(){$("#reglogin").hide("slow")});$("#normalcontent .leftarea ul li").click(function(){$("#normalcontent .leftarea ul li").removeClass("active");$("#normalcontent .leftarea").removeClass("bogleftarea");$(this).addClass("active")});$("#normalcontent .leftarea ul li.biglongarea").click(function(){$("#normalcontent .leftarea").addClass("bogleftarea");$(this).addClass("active")});$("p.applynow").click(function(){$("#formwrap").fadeIn("slow")});$("div.closeapplywrap").click(function(){$("#formwrap").fadeOut("slow")});$("#brancheslist ul li a").click(function(){$("#brancheslist ul li").removeClass("shoarea");$(this).parent().addClass("shoarea")})});