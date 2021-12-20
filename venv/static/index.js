window.onload = function() {
    console.log('window loaded');
    var preference_list_sortable = Sortable.create(document.getElementById('preference-list'), {
        group: 'preference-list-group',
        animation: 100,
        onEnd: function (evt) {
            if (true || evt.from == preference_list_sortable) {
                delete_request(evt.item);
            }
            insert_request(evt.item, evt.newIndex + 1);
        }
    });
}

async function delete_request(el) {
    let response = await fetch("/delete_preference", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'rank': el.cells[0].innerHTML,
            'room_name': el.cells[1].innerHTML
        })
    });
    // return await response.json();
}

async function insert_request(el, rank) {
    await fetch("/insert_preference", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'rank': rank,
            'room_name': el.cells[1].innerHTML
        })
    });
}
