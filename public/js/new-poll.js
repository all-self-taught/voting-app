
var i = 3;

function addOption(){
	$('#option-group').append('<input class="form-control" type="text" name="options[' + i + ']"/>')
	i++;
}