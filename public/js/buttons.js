$(document).ready(function(){
	$(".led").click(function(){
		var p = $(this).attr('id'); // get id value (i.e. pin13, pin12, or pin11)
			// send HTTP GET request to the IP address with the parameter "pin" and value "p", then execute the function
				$.get("http://10.34.139.144:80/", {pin:p}); // execute get request
	});
});
