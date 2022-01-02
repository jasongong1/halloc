window.onload = function() {
    console.log('window loaded');
    create_sortable_table();
    create_preference_bin();
    create_map_swapper();
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
        removeOnSpill: true,
        onEnd: async function(evt) {
            // if dragging within list
            if (evt.to == evt.from) {
                preference_list_sortable.option("disabled", true);
                document.getElementById("interactive-app-wrapper").style.backgroundColor = "#ff0000"; 
                await delete_request(evt.item);
                await insert_request(evt.item, evt.newIndex + 1);
                await update_table('preference-table-body');
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
    var curr_selected_college_id = "college-id-1";

    var ret_mod = {};

    ret_mod.get_curr_college = function() {
        return curr_selected_college_id;
    };

    ret_mod.change_displayed_college = function(id_str) {
        var new_displayed_college_button_bar = document.getElementById(`button-bar-${id_str}`);
        document.getElementById(`button-bar-${curr_selected_college_id}`).style.display='none';
        new_displayed_college_button_bar.style.display='flex';
        curr_selected_college_id=id_str;
        var floor_id = new_displayed_college_button_bar.children[0].id.split("btn-floor-")[1];
        current_map_displayed.change_displayed_level(`map-floor-${floor_id}`)
    };

    return ret_mod;
})();

var current_map_displayed = (function() {
    var curr_displayed_id = 'map-floor-1';
    var curr_displayed
    var temp_displayed_id = '';

    var ret_mod = {};

    ret_mod.get_curr_level = function() {
        return curr_displayed_id;
    };

    ret_mod.change_displayed_level = function(id_str) {
        document.getElementById(curr_displayed_id).style.display='none';
        document.getElementById(id_str).style.display='grid';
        curr_displayed_id=id_str;
    };

    ret_mod.temp_change_level = function(id_str) {
        temp_displayed_id=id_str;
        if (id_str == curr_displayed_id) {
            return;
        }
        document.getElementById(curr_displayed_id).style.display='none';
        document.getElementById(id_str).style.display='grid';
    }

    ret_mod.undo_temp_change_level = function() {
        if (temp_displayed_id == curr_displayed_id) {
            return;
        }
        document.getElementById(temp_displayed_id).style.display='none';
        document.getElementById(curr_displayed_id).style.display='grid';
    }

    return ret_mod;
})();

function create_map_swapper() {
    var all_maps = document.querySelectorAll('*[id^="map-floor-"]');
    all_maps.forEach((map) => {
        floor_id = map.id.split("map-floor-")[1];
        document.getElementById(`btn-floor-${floor_id}`).addEventListener("mouseover", function() {
            current_map_displayed.temp_change_level(map.id);
        })
        document.getElementById(`btn-floor-${floor_id}`).addEventListener("mouseleave", function() {
            current_map_displayed.undo_temp_change_level();
        })
    });
}

function create_college_maps(colleges) {
    console.log(colleges);
    JSON.parse(colleges).forEach((college) => {
        console.log(college);
        var college_id = college.college_id;
        if (college.college_name.toLowerCase() == 'hall') {
            create_hall_map(college.college_floors);
        }
    })
}

function create_hall_map(floor_list) {
    floor_list.forEach((floor, idx) => {
        var map_parent = document.getElementById(`map-floor-${floor.id}`);
        if (idx == 0) {
            draw_ground_floor(map_parent);
        }
    });

    function draw_ground_floor(parent) {
        parent.className += " hall-1";

        var cluster_west = document.createElement('DIV');
        cluster_west.className = "floor-map-hall--cluster-west";
        
        var cluster_east = document.createElement('DIV');
        cluster_east.className = "floor-map-hall--cluster-east";

        var floor_lobby_lv_1 = document.createElement('DIV');
        floor_lobby_lv_1.className = "floor-map-hall--floor-lobby-lv-1";
                
        draw_west_cluster(cluster_west);
        draw_east_cluster(cluster_east);

        parent.appendChild(cluster_west);
        parent.appendChild(cluster_east);
        parent.appendChild(floor_lobby_lv_1);
    }

    function draw_west_cluster(parent) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-west large-room";

        var room_1 = document.createElement('DIV');
        room_1.className = "floor-map-hall--cluster-west south-room west-cluster-right-third";

        var room_2 = document.createElement('DIV');
        room_2.className = "floor-map-hall--cluster-west south-room west-cluster-left-third";

        var room_3 = document.createElement('DIV');
        room_3.className = "floor-map-hall--cluster-west north-room west-cluster-left-third";

        var room_4 = document.createElement('DIV');
        room_4.className = "floor-map-hall--cluster-west north-room west-cluster-center-third";
        
        var room_5 = document.createElement('DIV');
        room_5.className = "floor-map-hall--cluster-west north-room west-cluster-right-third";

        var bathroom_left = document.createElement('DIV');
        bathroom_left.className = "floor-map-hall--cluster-west south-room west-cluster-left-bathroom";

        var bathroom_right = document.createElement('DIV');
        bathroom_right.className = "floor-map-hall--cluster-west south-room west-cluster-right-bathroom";

        parent.appendChild(large_room);
        parent.appendChild(room_1);
        parent.appendChild(room_2);
        parent.appendChild(room_3);
        parent.appendChild(room_4);
        parent.appendChild(room_5);
        parent.appendChild(bathroom_left);
        parent.appendChild(bathroom_right);
    }

    function draw_east_cluster(parent) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-east large-room";

        var room_1 = document.createElement('DIV');
        room_1.className = "floor-map-hall--cluster-east south-room east-cluster-right-third";

        var room_2 = document.createElement('DIV');
        room_2.className = "floor-map-hall--cluster-east south-room east-cluster-left-third";

        var room_3 = document.createElement('DIV');
        room_3.className = "floor-map-hall--cluster-east north-room east-cluster-left-third";

        var room_4 = document.createElement('DIV');
        room_4.className = "floor-map-hall--cluster-east north-room east-cluster-center-third";
        
        var room_5 = document.createElement('DIV');
        room_5.className = "floor-map-hall--cluster-east north-room east-cluster-right-third";

        var bathroom_left = document.createElement('DIV');
        bathroom_left.className = "floor-map-hall--cluster-east south-room east-cluster-left-bathroom";

        var bathroom_right = document.createElement('DIV');
        bathroom_right.className = "floor-map-hall--cluster-east south-room east-cluster-right-bathroom";

        parent.appendChild(large_room);
        parent.appendChild(room_1);
        parent.appendChild(room_2);
        parent.appendChild(room_3);
        parent.appendChild(room_4);
        parent.appendChild(room_5);
        parent.appendChild(bathroom_left);
        parent.appendChild(bathroom_right);
    }
}
