function enforce_zid_format() {
    let in_input_field = document.getElementsByName('zid')[0].value;
    let initial_re = /^[0-9]{1,}$/;
    if (initial_re.test(in_input_field)) {
        in_input_field='z'+in_input_field;
    }
    let zid_re = /^z[0-9]{0,7}/;
    let matches_arr = zid_re.exec(in_input_field);
    console.log(matches_arr);
    document.getElementsByName('zid')[0].value = matches_arr ? matches_arr[0] : "";
}

document.addEventListener('keyup', event => {
    enforce_zid_format();
});

function format_zid() {
    let my_zid = document.getElementsByName('zid')[0].value;
    if (/^z/.test(my_zid)) {
        document.getElementsByName('zid')[0].value = my_zid.substring(1);
    }
    console.log(document.getElementsByName('zid')[0].value);
}

window.onload = function() {
    if (!!document.getElementById("form-signin")) {
        document.getElementById("form-signin").onsubmit = format_zid;
    }
}
