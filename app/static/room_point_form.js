window.onload = function() {
    var question_wrappers = document.getElementsByClassName('single_question');
    [].forEach.call(question_wrappers, (question) => {
        question_elem = question.firstElementChild.nextElementSibling;
        type_str = question_elem.tagName.toLowerCase();
        if (['textarea', 'select', 'selectmulti'].includes(type_str)) {
            add_event_listener_on_change(question_elem);
        }
        else if (type_str == 'div' && question_elem.classList.contains('radio-wrapper')) {
            question_elem_children = Array.from(question_elem.children);
            question_elem_children.forEach((question_sub_elem) => {
                add_event_listener_on_change(question_sub_elem);
                console.log('evt list');
            })
        }
    });
};

function add_event_listener_on_change(elem) {
    elem.addEventListener('change', (evt) => {
        save_question_response(evt.target.dataset.idx, evt.target.value)
    })
}

async function save_question_response(question_idx, response_str) {
    await fetch("/room_point_form", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'question_idx': question_idx,
            'response_str': response_str
        })
    });
}