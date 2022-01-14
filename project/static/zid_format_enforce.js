window.onload = function() {
    if (!!document.getElementById("form-signin")) {
        document.getElementById("form-signin").onsubmit = format_zid;
    }
    document.getElementById('zid').addEventListener('input', enforce_zid_format);
}


function enforce_zid_format(el) {
    let in_input_field = el.target.value;
    let initial_re = /^[0-9]{1,}$/;
    if (initial_re.test(in_input_field)) {
        in_input_field='z'+in_input_field;
    }
    let zid_re = /^z[0-9]{0,7}/;
    let matches_arr = zid_re.exec(in_input_field);
    console.log(matches_arr);
    document.getElementsByName('zid')[0].value = matches_arr ? matches_arr[0] : "";
}

function format_zid() {
    let my_zid = document.getElementsByName('zid')[0].value;
    if (/^z/.test(my_zid)) {
        document.getElementsByName('zid')[0].value = my_zid.substring(1);
    }
    console.log(document.getElementsByName('zid')[0].value);
}
