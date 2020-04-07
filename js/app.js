const ADDRESS = "http://localhost:8080"
document.addEventListener('DOMContentLoaded', function() {

    let mainDiv = $("#book-list");
    let form_ = generateForm(null, "create-new", "utwórz");
    $(form_).insertBefore($(mainDiv));

    let bookList = $("#book-list > tbody");
    showBookList();

    function showBookList() {
        $.get({
            url: ADDRESS + '/books/',
            contentType: "application/json",
        }).done(function(result) {
            result.forEach(book => {
                bookList.append(creatBookRow(book));
            });
        })
    }

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
            row.after(detailsDiv);
        });

        row.find(".button-update").first().on("click", event => {
            event.preventDefault();
            $(".form-group > .update").each(function(index, element) {
                $(element).parent().remove()
            });
            $(".details").each(function(index, element) { $(element).remove() });
            let form_ = generateForm(book, "update", "zapisz");
            updateDiv = $(form_).wrap(`<tr class="details"><td colspan="3"></td></tr>`);
            row.after(updateDiv);
        });

        return row;
    }

    function buildObjectFromForm(form) {
        var formObject = {};
        $.each(form.serializeArray(),
            function(i, v) {
                formObject[v.name] = v.value;
            });
        return formObject;
    }

    function generateForm(book, formClass, buttonText) {

        let form_ = $(`<div class="form-group">
                <form class="${formClass}">
                    <label>Tytuł</label>
                    <input type="text" class="form-control" name="title" />
                    <label>Autor</label>
                    <input type="text" class="form-control" name="author" />
                    <label>Isbn</label>
                    <input type="text" class="form-control" name="isbn" />
                    <label>Wydawca</label>
                    <input type="text" class="form-control" name="publisher" />
                    <input type="hidden" name="id" value="0" />
                    <input type="submit" value="${buttonText}" id="${formClass}-submit">
                </form>
            </div>`);
        if (book != null) {
            $(form_).find("[name=\"title\"]").first().val(book.title);
            $(form_).find("[name=\"author\"]").first().val(book.author);
            $(form_).find("[name=\"isbn\"]").first().val(book.isbn);
            $(form_).find("[name=\"publisher\"]").first().val(book.publisher);
            $(form_).find("[name=\"id\"]").first().val(book.id);
            $(form_).find(`#${formClass}-submit`).first().on("click", function(event) {
                event.preventDefault();
                var formDataJSON = JSON.stringify(buildObjectFromForm($(".update")));
                $.ajax({
                    type: "PUT",
                    url: ADDRESS + `/books/${book.id}`,
                    contentType: "application/json",
                    data: formDataJSON,
                }).done(function(book) {
                    $(bookList).html("");
                    showBookList();

                });
            });
        } else {
            $(form_).find(`#${formClass}-submit`).first().on('click', function(event) {
                event.preventDefault();
                var formDataJSON = JSON.stringify(buildObjectFromForm($(".create-new")));
                $.ajax({
                    type: "POST",
                    url: ADDRESS + '/books/',
                    contentType: "application/json",
                    data: formDataJSON,
                }).done(function(book) {
                    bookList.append(creatBookRow(book));
                    showBookList();
                });
            });
        }
        return form_;
    }
});