window.onload = function() {
    console.log('window loaded');
    Sortable.create(document.getElementById('preference-list'), {
        group: 'preference-list-group',
        animation: 100,
        onStart: function (evt) {
            delete_request(evt.item);
        }
    });
}

function delete_request(el) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', '/delete_preference');
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify({
        room_name: el.innerHTML,
        rank: 
    }));
}