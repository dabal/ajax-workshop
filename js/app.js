const ADDRESS = "http://localhost:8080"
document.addEventListener('DOMContentLoaded', function() {

    let bookList = $("#book-list > tbody");
    $.get({
        url: ADDRESS + '/books/',
        contentType: "application/json",
    }).done(function(result) {
        result.forEach(book => {
            bookList.append(creatBookRow(book));
        });
    })

    let addNew = $("#create-new-submit");
    addNew.on('click', function(event) {
        event.preventDefault();
        var formDataJSON = JSON.stringify(buildObjectFromForm($("#create-new")));
        $.ajax({
            type: "POST",
            url: ADDRESS + '/books/',
            contentType: "application/json",
            data: formDataJSON,
        }).done(function(book) {
            bookList.append(creatBookRow(book));
        });
    })
});



function creatBookRow(book) {
    let row = $(`<tr><td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.publisher}</td>
            <td><button class="btn btn-danger button-delete" data-id="${book.id}">Usuń</button>
            </td></tr>`);
    row.find(".button-delete").first().on("click", event => {
        event.preventDefault();
        $.ajax({
            type: "DELETE",
            url: ADDRESS + `/books/${book.id}`,
            contentType: "application/json",
        }).done(function(book) {
            row.remove();
        });


    });
    return row;
}

function buildObjectFromForm(form) {
    var formObject = {};
    $.each(form.serializeArray(),
        function(i, v) {
            formObject[v.name] = v.value;
            //console.log(`${v.name} ${v.value}`)
        });
    return formObject;
}