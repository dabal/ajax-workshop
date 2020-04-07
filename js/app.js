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
            <td>
            <button class="btn btn-info button-details" data-id="${book.id}">Szczegóły</button>
            <button class="btn btn-warning button-update" data-id="${book.id}">Edytuj</button>
            <button class="btn btn-danger button-delete" data-id="${book.id}">Usuń</button>

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
    row.find(".button-details").first().on("click", event => {
        event.preventDefault();
        $(".details").each(function(index, element) { $(element).remove() });
        let detailsDiv = $(`<tr class="details"><td colspan="3">
        <ol class="list-group">
        <li class="list-group-item">${book.isbn}</li>
        <li class="list-group-item">${book.publisher}</li>
        <ol>
        </td></tr>`);
        console.log(book);
        row.after(detailsDiv);
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