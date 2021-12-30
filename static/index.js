window.onload = function() {
    console.log('window loaded');
    create_sortable_table();
    create_preference_bin();
    document.getElementById('college-select').onchange = choose_college_update_floor_buttons;
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

function create_sortable_table() {
    var preference_list_sortable = Sortable.create(document.getElementById('preference-table-body'), {
        group: 'preference-list-group',
        animation: 100,
        onEnd: async function(evt) {
            // if dragging within list
            if (evt.to == evt.from) {
                preference_list_sortable.option("disabled", true);
                document.getElementById("interactive-app-wrapper").style.backgroundColor = "#ff0000"; 
                await delete_request(evt.item);
                await insert_request(evt.item, evt.newIndex + 1);
                update_table('preference-table-body');
                preference_list_sortable.option("disabled", false);
                document.getElementById("interactive-app-wrapper").style.backgroundColor = "#00ff00"; 
            }
        }
    });
    return preference_list_sortable;
}

function create_preference_bin() {
    var preference_bin_sortable = Sortable.create(document.getElementById('preference-bin'), {
        group: 'preference-list-group',
        animation: 100,
        onAdd: async function(evt) {
            await delete_request(evt.item);
            evt.item.parentNode.removeChild(evt.item);
        }
    });
    return preference_bin_sortable;
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

async function choose_college_update_floor_buttons() {
    var college_and_floor_selector = document.getElementById('college-select');
    college_and_floor_selector.setAttribute('disabled', 'disabled');
    await fetch("/get_floors", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'college_name': this.value
        })
    })
    .then(response => response.json())
    .then(data => {
        var button_strip=document.getElementById('level-select-button-bar');
        if (!button_strip) {
            return;
        }
        button_strip.textContent='';
        data.floors_list.forEach((floor) => {
            var new_button = document.createElement("BUTTON");
            new_button.className+="btn btn-secondary";
            new_button.innerHTML=floor;
            button_strip.appendChild(new_button);
        });
    })
    college_and_floor_selector.removeAttribute('disabled');
}
