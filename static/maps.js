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
            draw_first_floor(map_parent);
        }
        else if (1 <= idx && idx <= 4) {
            draw_middle_floor(map_parent);
        }
        else {
            draw_upper_floor(map_parent);
        }
    });

    function draw_first_floor(parent) {
        parent.className += " hall-1";

        var cluster_west = document.createElement('DIV');
        cluster_west.className = "floor-map-hall--cluster-west floor-map-hall--lv-1";
        
        var cluster_east = document.createElement('DIV');
        cluster_east.className = "floor-map-hall--cluster-east floor-map-hall--lv-1";

        var floor_lobby = document.createElement('DIV');
        floor_lobby.className = "floor-map-hall--floor-lobby floor-map-hall--lv-1";

        var elevator_stairwell_only = document.createElement('DIV');
        elevator_stairwell_only.className = "floor-map-hall--elevator-stairwell floor-map-hall--lv-1";
                
        draw_west_cluster(cluster_west);
        draw_east_cluster(cluster_east);
        draw_elevator_stairwell(elevator_stairwell_only);

        parent.appendChild(cluster_west);
        parent.appendChild(cluster_east);
        parent.appendChild(floor_lobby);
        parent.appendChild(elevator_stairwell_only);
    }

    function draw_middle_floor(parent) {
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

                
        draw_west_cluster(cluster_west);
        draw_east_cluster(cluster_east);
        draw_north_cluster(cluster_north);

        parent.appendChild(cluster_west);
        parent.appendChild(cluster_east);
        parent.appendChild(cluster_north);
        parent.appendChild(floor_lobby);
        parent.appendChild(rf_room);
    }

    function draw_upper_floor(parent) {
        parent.className += " hall-upper";
        
        var cluster_north = document.createElement('DIV');
        cluster_north.className = "floor-map-hall--cluster-north floor-map-hall--lv-upper";

        var floor_lobby = document.createElement('DIV');
        floor_lobby.className = "floor-map-hall--floor-lobby floor-map-hall--lv-upper";

        var rf_room = document.createElement('DIV');
        rf_room.className = "floor-map-hall--rf-room floor-map-hall--lv-upper";

        draw_north_cluster(cluster_north);

        parent.appendChild(cluster_north);
        parent.appendChild(floor_lobby);
        parent.appendChild(rf_room);
    }

    function draw_west_cluster(parent, level) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-west large-room";

        var large_room_north_balcony = document.createElement('DIV');
        large_room_north_balcony.className = "floor-map-hall--cluster-west large-room-north-balcony";

        var large_room_south_balcony = document.createElement('DIV');
        large_room_south_balcony.className = "floor-map-hall--cluster-west large-room-south-balcony";

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
        bathroom_left.className = "floor-map-hall--cluster-west south-bathroom west-cluster-left-bathroom";

        var bathroom_right = document.createElement('DIV');
        bathroom_right.className = "floor-map-hall--cluster-west south-bathroom west-cluster-right-bathroom";

        large_room.appendChild(large_room_north_balcony);
        large_room.appendChild(large_room_south_balcony);
        parent.appendChild(large_room);

        parent.appendChild(room_1);
        parent.appendChild(room_2);
        parent.appendChild(room_3);
        parent.appendChild(room_4);
        parent.appendChild(room_5);
        parent.appendChild(bathroom_left);
        parent.appendChild(bathroom_right);
    }

    function draw_east_cluster(parent, level) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-east large-room";

        var large_room_north_balcony = document.createElement('DIV');
        large_room_north_balcony.className = "floor-map-hall--cluster-east large-room-north-balcony";

        var large_room_south_balcony = document.createElement('DIV');
        large_room_south_balcony.className = "floor-map-hall--cluster-east large-room-south-balcony";

        var large_room_south_balcony_mask = document.createElement('DIV');
        large_room_south_balcony_mask.className = "floor-map-hall--cluster-east large-room-south-balcony mask";

        var room_4 = document.createElement('DIV');
        room_4.className = "floor-map-hall--cluster-east south-room east-cluster-right-third";

        var room_5 = document.createElement('DIV');
        room_5.className = "floor-map-hall--cluster-east south-room east-cluster-left-third";

        var room_1 = document.createElement('DIV');
        room_1.className = "floor-map-hall--cluster-east north-room east-cluster-left-third";

        var room_2 = document.createElement('DIV');
        room_2.className = "floor-map-hall--cluster-east north-room east-cluster-center-third";
        
        var room_3 = document.createElement('DIV');
        room_3.className = "floor-map-hall--cluster-east north-room east-cluster-right-third";

        var bathroom_left = document.createElement('DIV');
        bathroom_left.className = "floor-map-hall--cluster-east south-bathroom east-cluster-left-bathroom";

        var bathroom_right = document.createElement('DIV');
        bathroom_right.className = "floor-map-hall--cluster-east south-bathroom east-cluster-right-bathroom";

        large_room.appendChild(large_room_north_balcony);
        large_room.appendChild(large_room_south_balcony);
        large_room.appendChild(large_room_south_balcony_mask);
        parent.appendChild(large_room);

        parent.appendChild(room_1);
        parent.appendChild(room_2);
        parent.appendChild(room_3);
        parent.appendChild(room_4);
        parent.appendChild(room_5);
        parent.appendChild(bathroom_left);
        parent.appendChild(bathroom_right);
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

    function draw_north_cluster(parent, level) {
        var large_room = document.createElement('DIV');
        large_room.className = "floor-map-hall--cluster-north large-room";

        var large_room_west_balcony = document.createElement('DIV');
        large_room_west_balcony.className = "floor-map-hall--cluster-north large-room-west-balcony";

        var large_room_east_balcony = document.createElement('DIV');
        large_room_east_balcony.className = "floor-map-hall--cluster-north large-room-east-balcony";

        var large_room_east_balcony_mask = document.createElement('DIV');
        large_room_east_balcony_mask.className = "floor-map-hall--cluster-north large-room-east-balcony mask";

        var room_1 = document.createElement('DIV');
        room_1.className = "floor-map-hall--cluster-north west-room north-cluster-1";

        var room_2 = document.createElement('DIV');
        room_2.className = "floor-map-hall--cluster-north west-room north-cluster-2";

        var room_3 = document.createElement('DIV');
        room_3.className = "floor-map-hall--cluster-north east-room north-cluster-3";

        var room_4 = document.createElement('DIV');
        room_4.className = "floor-map-hall--cluster-north east-room north-cluster-4";
        
        var room_5 = document.createElement('DIV');
        room_5.className = "floor-map-hall--cluster-north east-room north-cluster-5";

        var room_6 = document.createElement('DIV');
        room_6.className = "floor-map-hall--cluster-north east-room north-cluster-6";

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

        large_room.appendChild(large_room_west_balcony);
        large_room.appendChild(large_room_east_balcony);
        large_room.appendChild(large_room_east_balcony_mask);

        parent.appendChild(large_room);
        parent.appendChild(room_1);
        parent.appendChild(room_2);
        parent.appendChild(room_3);
        parent.appendChild(room_4);
        parent.appendChild(room_5);
        parent.appendChild(room_6);
        parent.appendChild(bathroom_south);
        parent.appendChild(bathroom_north);
        parent.appendChild(stairwell);
        parent.appendChild(elevator);
        parent.appendChild(breaker_box);
    }
}