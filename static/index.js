window.onload = function() {
    create_sortable_table();
    create_preference_bin();
    create_map_swapper();
    enforce_map_aspect_ratio();
}
window.addEventListener("resize", enforce_map_aspect_ratio);

async function delete_request(el) {
    await fetch("/delete_preference", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            'rank': el.dataset.preferenceRank,
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
    var table_elem = document.getElementById('preference-table-body');
    var preference_list_sortable = Sortable.create(table_elem, {
        group: {
            name: 'preference-list-group',
            put: ['cluster']
        },
        animation: 100,
        onUpdate: async function(evt) {
            // if dragging within list
            if (evt.to == evt.from) {
                preference_list_sortable.option("disabled", true);
                document.getElementById("interactive-app-wrapper").style.backgroundColor = "#ff0000"; 
                if (evt.oldIndex != evt.newIndex) {
                    await delete_request(evt.item);
                    await insert_request(evt.item, evt.newIndex + 1);
                    await update_table('preference-table-body');
                }
                preference_list_sortable.option("disabled", false);
                document.getElementById("interactive-app-wrapper").style.backgroundColor = "#00ff00"; 
            }
        },
        onAdd: async function(evt) {
            console.log('printed new row');
            var new_row = document.createElement("TR");
            new_row.className += " preference-list-row";
            var header_cell_rank = document.createElement("TH");
            header_cell_rank.scope = "row";
            header_cell_rank.innerHTML = evt.newIndex + 1;
            new_row.appendChild(header_cell_rank);
            var room_name_cell = new_row.insertCell(-1);
            room_name_cell.innerHTML = evt.item.dataset.roomName;
            var floor_name_cell = new_row.insertCell(-1);
            floor_name_cell.innerHTML = evt.item.dataset.floorName;
            var college_name_cell = new_row.insertCell(-1);
            college_name_cell.innerHTML = evt.item.dataset.collegeName;
            evt.item.replaceWith(new_row);
            await insert_request(new_row, evt.newIndex + 1);
            await update_table('preference-table-body');
        }
    });
    return preference_list_sortable;
}

function create_preference_bin() {
    var bin_elem = document.getElementById('preference-bin');
    var preference_bin_sortable = Sortable.create(bin_elem, {
        group: {
            name: 'preference-bin',
            put: ['preference-list-group']
        },
        animation: 100,
        onAdd: async function(evt) {
            await delete_request(evt.item);
            evt.item.parentNode.removeChild(evt.item);
            await update_table('preference-table-body');
        }
    });
    return preference_bin_sortable;
}

async function delete_all_preferences() {
    if (confirm("Are you sure you want to delete all your preferences?")) {
        await fetch("/delete_all_preferences", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        await update_table('preference-table-body');
    }
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
        data.preference_list.forEach((preference) => {
            var curr_row = table.insertRow(-1);
            curr_row.dataset.preferenceRank = preference.rank;
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

var current_college_selected = (function() {
    var curr_selected_college_id = "college-id-2";

    var ret_mod = {};

    ret_mod.get_curr_college = function() {
        return curr_selected_college_id;
    };

    ret_mod.set_curr_college = function(elem_str) {
        curr_selected_college_id = elem_str;
    };

    ret_mod.change_displayed_college = function(id_str) {
        var new_displayed_college_button_bar = document.getElementById(`button-bar-${id_str}`);
        if (!new_displayed_college_button_bar) {
            return;
        }
        document.getElementById(`button-bar-${curr_selected_college_id}`).style.display='none';
        new_displayed_college_button_bar.style.display='flex';
        curr_selected_college_id=id_str;
        var floor_id = new_displayed_college_button_bar.children[0].id.split("btn-floor-")[1];
        current_map_displayed.change_displayed_level(`map-floor-${floor_id}`)
    };

    return ret_mod;
})();

var current_map_displayed = (function() {
    var curr_displayed_id = '';
    var temp_displayed_id = '';

    var ret_mod = {};

    ret_mod.get_curr_level = function() {
        return curr_displayed_id;
    };

    ret_mod.get_temp_level = function() {
        return temp_displayed_id;
    };

    ret_mod.set_curr_level = function(elem_str) {
        curr_displayed_id = elem_str;
        temp_displayed_id = elem_str;
    };

    ret_mod.change_displayed_level = function(id_str) {
        document.getElementById(curr_displayed_id).style.display='none';
        document.getElementById(id_str).style.display='grid';
        curr_displayed_id=id_str;
        reset_enforce_map_aspect_ratio();
    };

    ret_mod.temp_change_level = function(id_str) {
        temp_displayed_id=id_str;
        if (id_str == curr_displayed_id) {
            return;
        }
        document.getElementById(curr_displayed_id).style.display='none';
        document.getElementById(id_str).style.display='grid';
        reset_enforce_map_aspect_ratio();
    }

    ret_mod.undo_temp_change_level = function() {
        if (temp_displayed_id == curr_displayed_id) {
            return;
        }
        document.getElementById(temp_displayed_id).style.display='none';
        document.getElementById(curr_displayed_id).style.display='grid';
        reset_enforce_map_aspect_ratio();
    }

    return ret_mod;
})();

function create_map_swapper() {
    var all_maps = document.querySelectorAll('*[id^="map-floor-"]');
    var floor_init = false;
    all_maps.forEach((map) => {
        floor_id = map.id.split("map-floor-")[1];
        if (!floor_init) {
            current_map_displayed.set_curr_level(`map-floor-${floor_id}`);
            floor_init = true;
        }
        document.getElementById(`btn-floor-${floor_id}`).addEventListener("mouseover", function() {
            current_map_displayed.temp_change_level(map.id);
        })
        document.getElementById(`btn-floor-${floor_id}`).addEventListener("mouseleave", function() {
            current_map_displayed.undo_temp_change_level();
        })
    });
}

function enforce_map_aspect_ratio() {
    console.log("enforcing map aspect ratio");
    var displayed_map_el = document.getElementById(current_map_displayed.get_curr_level());
    var temp_displayed_map_el = document.getElementById(current_map_displayed.get_temp_level());
    displayed_map_el = displayed_map_el == temp_displayed_map_el ? displayed_map_el : temp_displayed_map_el;
    var aspect_ratio_str = displayed_map_el.dataset.aspectRatio;
    var aspect_ratio_split = aspect_ratio_str.split('/');
    var aspect_ratio = aspect_ratio_split.length > 1 ? parseInt(aspect_ratio_split[0], 10) / parseInt(aspect_ratio_split[1], 10) : parseInt(aspect_ratio_split[0], 10);
    console.log(`aspect ratio: ${aspect_ratio}`);


    var parent_height = displayed_map_el.parentElement.clientHeight;
    var parent_width = displayed_map_el.parentElement.clientWidth;

    if (parent_width > aspect_ratio * parent_height) {
        displayed_map_el.style.width = `${aspect_ratio * parent_height}px`;
        displayed_map_el.style.height = `${parent_height}px`;
    } else {
        displayed_map_el.style.width = `${parent_width}px`;
        displayed_map_el.style.height = `${(1 / aspect_ratio) * parent_width}px`;
    }

    console.log(displayed_map_el.parentElement.clientHeight);
    console.log(displayed_map_el.parentElement.clientWidth);
}

function reset_enforce_map_aspect_ratio() {
    window.addEventListener("resize", enforce_map_aspect_ratio);
    enforce_map_aspect_ratio();
}