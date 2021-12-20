window.onload = function() {
    console.log('window loaded');
    var preference_list_sortable = Sortable.create(document.getElementById('preference-list'), {
        group: 'preference-list-group',
        animation: 100,
        onEnd: async function (evt) {
            preference_list_sortable.option("disabled", true)
            document.getElementById("interactive-app-wrapper").style.backgroundColor = "#ff0000"; 
            if (true || evt.from == preference_list_sortable) {
                await delete_request(evt.item);
            }
            await insert_request(evt.item, evt.newIndex + 1);
            // TODO: refresh table
            preference_list_sortable.option("disabled", false)
            document.getElementById("interactive-app-wrapper").style.backgroundColor = "#00ff00"; 
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
