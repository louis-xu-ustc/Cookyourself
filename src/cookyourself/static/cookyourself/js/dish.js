function addIngredient(id) {
    var csrftoken = getCookie('csrftoken');
    $.post("/cookyourself/add_ingredient/" + id, {csrfmiddlewaretoken: csrftoken})
        .done(function (data) {
            //updateComment(id);
            //hide the + button or make it grey?
            console.log("ingredient added:" + id);
        });
}

function eventsHandle() {
    $("#ingre-list").on("click", ".glyphicon", function (event) {
        var id = $(this).attr("id");
        // console.log(id);
        //addAllIngredient();
        addIngredient(id);
    });
}

$(document).ready(function () {
    eventsHandle();

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
});

// CSRF set-up copied from Django docs
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}