window.onload = function() {
    console.log('window loaded');
    var preference_list_sortable = Sortable.create(document.getElementById('preference-table-body'), {
        group: 'preference-list-group',
        animation: 100,
        onEnd: async function (evt) {
            preference_list_sortable.option("disabled", true)
            document.getElementById("interactive-app-wrapper").style.backgroundColor = "#ff0000"; 
            if (true || evt.from == preference_list_sortable) {
                await delete_request(evt.item);
            }
            await insert_request(evt.item, evt.newIndex + 1);
            update_table('preference-table-body');
            preference_list_sortable.option("disabled", false)
            document.getElementById("interactive-app-wrapper").style.backgroundColor = "#00ff00"; 
        }
    });
}

async function delete_request(el) {
    await fetch("/delete_preference", {
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

async function update_table(table_id) {
    await fetch("/get_updated_table", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        var table=document.getElementById(table_id);
        if (!table) {
            return;
        }
        table.textContent='';
        // console.log(data.preference_list);
        data.preference_list.forEach((preference) => {
            var curr_row = table.insertRow(-1);
            var header_cell_rank = document.createElement("TH");
            header_cell_rank.innerHTML = preference.rank;
            header_cell_rank.scope = "row";
            curr_row.appendChild(header_cell_rank);

            var room_name_cell = curr_row.insertCell(-1);
            room_name_cell.innerHTML = preference.room_name;
            var floor_cell = curr_row.insertCell(-1);
            floor_cell.innerHTML = preference.floor_level;
            var college_cell = curr_row.insertCell(-1);
            college_cell.innerHTML = preference.college_name;
        });
    })
}
