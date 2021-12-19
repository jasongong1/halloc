window.onload = function() {
    console.log('huh?');
    Sortable.create(document.getElementById('preference-list'), {
        group: 'preference-list-group',
        animation: 100
    });
}
