function create_college_maps(colleges) {
    console.log(colleges);
    JSON.parse(colleges).forEach((college) => {
        console.log(college);
        if (college.college_name.toLowerCase() == 'hall') {
            create_hall_map(college);
        }
    })
}

function create_hall_map(college) {
    college.college_floors.forEach((floor, idx) => {
        var map_parent = document.getElementById(`map-floor-${floor.id}`);
        if (idx == 0) {
            draw_first_floor(map_parent, idx + 1, floor.floor_level);
        }
        else if (1 <= idx && idx <= 4) {
            draw_middle_floor(map_parent, idx + 1, floor.floor_level);
        }
        else {
            draw_upper_floor(map_parent, idx + 1, floor.floor_level);
        }
    });

    function draw_first_floor(parent, level, floor_name) {
        if (!level || level > 1) {
            return;
        }
        parent.className += " hall-1";

        var cluster_west = document.createElement('DIV');
        cluster_west.className = "floor-map-hall--cluster-west floor-map-hall--lv-1";
        
        var cluster_east = document.createElement('DIV');
        cluster_east.className = "floor-map-hall--cluster-east floor-map-hall--lv-1";

        var floor_lobby = document.createElement('DIV');
        floor_lobby.className = "floor-map-hall--floor-lobby floor-map-hall--lv-1";

        var elevator_stairwell_only = document.createElement('DIV');
        elevator_stairwell_only.className = "floor-map-hall--elevator-stairwell floor-map-hall--lv-1";
                
        draw_west_cluster(cluster_west, 403, floor_name);
        draw_east_cluster(cluster_east, 404, floor_name);
        draw_elevator_stairwell(elevator_stairwell_only);

        parent.appendChild(cluster_west);
        parent.appendChild(cluster_east);
        parent.appendChild(floor_lobby);
        parent.appendChild(elevator_stairwell_only);
    }

    function draw_middle_floor(parent, level, floor_name) {
        if (!level || !(1 <= level && level <= 5)) {
            return;
        }

        var cluster_num_west = 405 + ((level - 2) * 4);
        parent.className += " hall-mid";

        var cluster_west = document.createElement('DIV');
        cluster_west.className = "floor-map-hall--cluster-west floor-map-hall--lv-mid";
        
        var cluster_east = document.createElement('DIV');
        cluster_east.className = "floor-map-hall--cluster-east floor-map-hall--lv-mid";
        
        var cluster_north = document.createElement('DIV');
        cluster_north.className = "floor-map-hall--cluster-north floor-map-hall--lv-mid";

        var floor_lobby = document.createElement('DIV');
        floor_lobby.className = "floor-map-hall--floor-lobby floor-map-hall--lv-mid";

        var rf_room = document.createElement('DIV');
        rf_room.className = "floor-map-hall--rf-room floor-map-hall--lv-mid";

        draw_west_cluster(cluster_west, cluster_num_west, floor_name);
        draw_east_cluster(cluster_east, cluster_num_west + 2, floor_name);
        draw_north_cluster(cluster_north, cluster_num_west + 3, floor_name);

        parent.appendChild(cluster_west);
        parent.appendChild(cluster_east);
        parent.appendChild(cluster_north);
        parent.appendChild(floor_lobby);
        parent.appendChild(rf_room);
    }

    function draw_upper_floor(parent, level, floor_name) {
        if (!level || level <= 5) {
            return;
        }
        var cluster_num = (422 + ((level - 6) * 2)).toString();

        parent.className += " hall-upper";
        
        var cluster_north = document.createElement('DIV');
        cluster_north.className = "floor-map-hall--cluster-north floor-map-hall--lv-upper";

        var floor_lobby = document.createElement('DIV');
        floor_lobby.className = "floor-map-hall--floor-lobby floor-map-hall--lv-upper";

        var rf_room = document.createElement('DIV');
        rf_room.className = "floor-map-hall--rf-room floor-map-hall--lv-upper";

        draw_north_cluster(cluster_north, cluster_num, floor_name);

        parent.appendChild(cluster_north);
        parent.appendChild(floor_lobby);
        parent.appendChild(rf_room);
    }

    function draw_west_cluster(parent, cluster_num, floor_name) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-west large-room draggable-room";

        var large_room_north_balcony = document.createElement('DIV');
        large_room_north_balcony.className = "floor-map-hall--cluster-west large-room-north-balcony";

        var large_room_south_balcony = document.createElement('DIV');
        large_room_south_balcony.className = "floor-map-hall--cluster-west large-room-south-balcony";

        large_room.appendChild(large_room_north_balcony);
        large_room.appendChild(large_room_south_balcony);
        parent.appendChild(large_room);

        for (let i = 1; i <= 5; i++) {
            var room = document.createElement('DIV');
            room.className = `floor-map-hall--cluster-west ${i <= 2 ? "south-room" : "north-room"} west-cluster-${i} draggable-room`;
            room.dataset.roomName = cluster_num + `.${i}`;
            room.dataset.floorName = floor_name;
            room.dataset.collegeName = college.college_name;
            parent.appendChild(room);
        }

        var bathroom_left = document.createElement('DIV');
        bathroom_left.className = "floor-map-hall--cluster-west south-bathroom west-cluster-left-bathroom";

        var bathroom_right = document.createElement('DIV');
        bathroom_right.className = "floor-map-hall--cluster-west south-bathroom west-cluster-right-bathroom";

        parent.appendChild(bathroom_left);
        parent.appendChild(bathroom_right);

        create_sortable_on_cluster(parent);
    }

    function draw_east_cluster(parent, cluster_num, floor_name) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-east large-room draggable-room";

        var large_room_north_balcony = document.createElement('DIV');
        large_room_north_balcony.className = "floor-map-hall--cluster-east large-room-north-balcony";

        var large_room_south_balcony = document.createElement('DIV');
        large_room_south_balcony.className = "floor-map-hall--cluster-east large-room-south-balcony";

        var large_room_south_balcony_mask = document.createElement('DIV');
        large_room_south_balcony_mask.className = "floor-map-hall--cluster-east large-room-south-balcony mask";

        large_room.appendChild(large_room_north_balcony);
        large_room.appendChild(large_room_south_balcony);
        large_room.appendChild(large_room_south_balcony_mask);
        parent.appendChild(large_room);

        for (let i = 1; i <= 5; i++) {
            var room = document.createElement('DIV');
            room.className = `floor-map-hall--cluster-east ${i >= 4 ? "south-room" : "north-room"} east-cluster-${i} draggable-room`;
            room.dataset.roomName = cluster_num + `.${i}`;
            room.dataset.floorName = floor_name;
            room.dataset.collegeName = college.college_name;
            parent.appendChild(room);
        }

        var bathroom_left = document.createElement('DIV');
        bathroom_left.className = "floor-map-hall--cluster-east south-bathroom east-cluster-left-bathroom";

        var bathroom_right = document.createElement('DIV');
        bathroom_right.className = "floor-map-hall--cluster-east south-bathroom east-cluster-right-bathroom";

        parent.appendChild(bathroom_left);
        parent.appendChild(bathroom_right);

        create_sortable_on_cluster(parent);
    }

    function draw_north_cluster(parent, cluster_num, floor_name) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-north large-room draggable-room";
        large_room.dataset.roomName = cluster_num;

        var large_room_west_balcony = document.createElement('DIV');
        large_room_west_balcony.className = "floor-map-hall--cluster-north large-room-west-balcony";

        var large_room_east_balcony = document.createElement('DIV');
        large_room_east_balcony.className = "floor-map-hall--cluster-north large-room-east-balcony";

        var large_room_east_balcony_mask = document.createElement('DIV');
        large_room_east_balcony_mask.className = "floor-map-hall--cluster-north large-room-east-balcony mask";

        large_room.appendChild(large_room_west_balcony);
        large_room.appendChild(large_room_east_balcony);
        large_room.appendChild(large_room_east_balcony_mask);
        parent.appendChild(large_room);

        for (let i = 1; i <= 6; i++) {
            var room = document.createElement('DIV');
            room.className = `floor-map-hall--cluster-north ${i <= 2 ? "west-room" : "east-room"} west-room north-cluster-${i} draggable-room`;
            room.dataset.roomName = cluster_num + `.${i}`;
            room.dataset.floorName = floor_name;
            room.dataset.collegeName = college.college_name;
            parent.appendChild(room);
        }

        var bathroom_south = document.createElement('DIV');
        bathroom_south.className = "floor-map-hall--cluster-north north-cluster-south-bathroom";

        var bathroom_north = document.createElement('DIV');
        bathroom_north.className = "floor-map-hall--cluster-north north-cluster-north-bathroom";

        var stairwell = document.createElement('DIV');
        stairwell.className = "floor-map-hall--cluster-north east-room stairwell";

        var elevator = document.createElement('DIV');
        elevator.className = "floor-map-hall--cluster-north elevator";

        var breaker_box = document.createElement('DIV');
        breaker_box.className = "floor-map-hall--cluster-north breaker-box";

        parent.appendChild(bathroom_south);
        parent.appendChild(bathroom_north);
        parent.appendChild(stairwell);
        parent.appendChild(elevator);
        parent.appendChild(breaker_box);

        create_sortable_on_cluster(parent);
    }

    function draw_elevator_stairwell(parent) {
        var stairwell = document.createElement('DIV');
        stairwell.className = "floor-map-hall--lv-1 floor-map-hall--elevator-stairwell stairwell";

        var elevator = document.createElement('DIV');
        elevator.className = "floor-map-hall--lv-1 floor-map-hall--elevator-stairwell elevator";

        var breaker_box = document.createElement('DIV');
        breaker_box.className = "floor-map-hall--lv-1 floor-map-hall--elevator-stairwell breaker-box";

        parent.appendChild(stairwell);
        parent.appendChild(elevator);
        parent.appendChild(breaker_box);
    }
}

function create_sortable_on_cluster(el) {
    var preference_list_sortable = Sortable.create(el, {
        group: {
            name: 'cluster',
            pull: 'clone',
            put: false
        },
        animation: 100,
        sort: false,
        draggable: ".draggable-room"
    });
    return preference_list_sortable;
}