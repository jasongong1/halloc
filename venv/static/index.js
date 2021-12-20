window.onload = function() {
    console.log('window loaded');
    var preference_list_sortable = Sortable.create(document.getElementById('preference-list'), {
        group: 'preference-list-group',
        animation: 100,
        onEnd: function (evt) {
            if (true || evt.from == preference_list_sortable) {
                delete_request(evt.item);
            }
        }
    });
}

function delete_request(el) {
    fetch("/delete_preference", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'rank': el.cells[0].innerHTML,
            'room_name': el.cells[1].innerHTML
        })
    })
    // const xhttp = new XMLHttpRequest();
    // // console.log(el.cells[0].innerHTML);
    // // console.log(el.cells[1].innerHTML);
    // xhttp.open('DELETE', '/delete_preference');
    // xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhttp.send(JSON.stringify({
    //     rank: el.cells[0].innerHTML,
    //     room_name: el.cells[1].innerHTML
    // }));
}