// The root URL for the RESTful services
var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.evento";

var currentEvent;

// Retrieve wine list when application starts 
findAll();

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#btnSearch').click(function () {
    search($('#searchKey').val());
    return false;
});

// Trigger search when pressing 'Return' on search key input field
$('#searchKey').keypress(function (e) {
    if (e.which == 13) {
        search($('#searchKey').val());
        e.preventDefault();
        return false;
    }
});

$('#btnAdd').click(function () {
    newEvent();
    return false;
});

$('#btnSave').click(function () {
    if ($('#wineId').val() == '')
        addWine();
    else
        updateWine();
    return false;
});

$('#btnDelete').click(function () {
    deleteWine();
    return false;
});

$('#wineList a').live('click', function () {
    findById($(this).data('identity'));
});

// Replace broken images with generic wine bottle
$("img").error(function () {
    $(this).attr("src", "pics/generic.jpg");

});


$("#datepicker").datepicker();


function search(searchKey) {
    if (searchKey == '')
        findAll();
    else
        findByName(searchKey);
}

function newEvent() {
    window.location="crearEvento.html";
   
}

function findAll() {
    console.log('findAll');
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: "json", // data type of response
        success: renderList
    });
}

function findByName(searchKey) {
    console.log('findByName: ' + searchKey);
    $.ajax({
        type: 'GET',
        url: rootURL + '/search/' + searchKey,
        dataType: "json",
        success: renderList
    });
}

function findById(id) {
    console.log('findById: ' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log('findById success: ' + data.name);
            currentWine = data;
            renderDetails(currentWine);
        }
    });
}

function addWine() {
    console.log('addWine');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Wine created successfully');
            $('#btnDelete').show();
            $('#wineId').val(data.id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('addWine error: ' + textStatus);
        }
    });
}

function updateWine() {
    console.log('updateWine');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + '/' + $('#wineId').val(),
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Wine updated successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('updateWine error: ' + textStatus);
        }
    });
}

function deleteEvent(id) {
    console.log('deleteEvent');
    $.ajax({
        type: 'DELETE',
        url: rootURL + '/' + id.toString(),
        success: function (data, textStatus, jqXHR) {
            alert('Event deleted successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('deleteWine error');
        }
    });
}

function renderList(data) {
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $('#table tr').remove();
    var cabecera = $('<tr></tr>');

    cabecera.append('<th> Nombre </th>');
    cabecera.append('<th> Descripcion  </th>');
    cabecera.append('<th> Fecha de inicio </th>');
    cabecera.append('<th> Fecha de fin </th>');
    cabecera.append('<th> Ubicacion </th>');
    cabecera.append('<th></th>');

    $('#table').append(cabecera);


    $.each(list, function (index, event) {
        var row = $('<tr></tr>');
        var cell = $('<td></td>');
        
        var botonVer = $('<button/>', {
            text: 'Ver',
            class: 'btn btn-success',
                    // id: 'btn_refresh'
                    // click: ClickRefresh
            
        });var botonModificar = $('<button/>', {
            text: 'Modificar',
            class: 'btn btn-warning'
                    // id: 'btn_refresh'
                    // click: ClickRefresh
        });
        var botonEliminar = $('<button/>', {
            text: 'Eliminar',
            class: 'btn btn-danger'
                    // id: 'btn_refresh'
           // click: deleteEvent(event.id)
            
        });
        row.append('<td>' + event.nombre + '</td>');
        row.append('<td>' + event.descripcion + '</td>');
        row.append('<td>' + event.fechainicio + '</td>');
        row.append('<td>' + event.fechafin + '</td>');
        row.append('<td>' + event.direccion + '</td>');
        
        cell.append(botonVer);
        cell.append(botonModificar);
        cell.append(botonEliminar);

        row.append(cell);
        $('#table').append(row);

        //$('#table').append('</tr>');
        //$('#table').append('<li><a href="#" data-identity="' +
        //   wine.id + '">'+wine.name+'</a></li>');
    });
}

function renderDetails(wine) {
    $('#wineId').val(wine.id);
    $('#name').val(wine.name);
    $('#grapes').val(wine.grapes);
    $('#country').val(wine.country);
    $('#region').val(wine.region);
    $('#year').val(wine.year);
    $('#pic').attr('src', 'pics/' + wine.picture);
    $('#description').val(wine.description);
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
    var wineId = $('#wineId').val();
    return JSON.stringify({
        "id": wineId == "" ? null : wineId,
        "name": $('#name').val(),
        "grapes": $('#grapes').val(),
        "country": $('#country').val(),
        "region": $('#region').val(),
        "year": $('#year').val(),
        "picture": currentWine.picture,
        "description": $('#description').val()
    });
}