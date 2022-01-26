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
            })
        }
    });

    var page_select_radio = document.getElementsByName('select-page-radio');
    [].forEach.call(page_select_radio, (radio_elem) => {
        radio_elem.addEventListener('change', (evt) => {
            current_page.change_page_idx(evt.target.value);
        })
    });
    current_page.change_page_idx(0);
};

async function add_event_listener_on_change(elem) {
    elem.addEventListener('change', (evt) => {
        var save_indicator = document.querySelector(`.save-indicator[data-question-idx='${evt.target.dataset.questionIdx}'][data-page-idx='${evt.target.dataset.pageIdx}']`);
        console.log(save_indicator);
        save_indicator.textContent = ' - Saving...';
        setTimeout(() => {
            if (save_indicator.textContent != '') {
                save_indicator.textContent = ' - Save failed.';
                setTimeout(() => {save_indicator.textContent = ''}, 900);
            }
        }, 600);
        save_question_response(evt.target.dataset.pageIdx, evt.target.dataset.questionIdx, evt.target.value).then(() => {
            setTimeout(() => {save_indicator.textContent = ' - Saved!'}, 150);
            setTimeout(() => {save_indicator.textContent = ''}, 500);
        }).catch(() => {
            return;
        })
    });
}

async function save_question_response(page_idx, question_idx, response_str) {
    await fetch("/room_point_form", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'page_idx': page_idx,
            'question_idx': question_idx,
            'response_str': response_str
        })
    });
}

var current_page = (function() {
    var curr_displayed_page_idx = 0;

    var ret_obj = {};

    ret_obj.get_curr_page_idx = function() {
        return curr_displayed_page_idx;
    };

    ret_obj.change_page_idx = function(new_idx) {
        document.getElementById(`form-wrapper-page-${curr_displayed_page_idx}`).style.visibility='hidden';
        document.getElementById(`form-wrapper-page-${new_idx}`).style.visibility='visible';
        curr_displayed_page_idx = new_idx;
    };

    return ret_obj;
})();