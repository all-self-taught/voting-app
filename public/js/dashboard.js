function deletePoll(user, poll){
	
	var r = confirm("Are you sure?");
	if (r){
		$.ajax({
			url: '/' + user + '/' + poll,
			type: 'DELETE',
		});
		window.location.reload(false);
	}
}