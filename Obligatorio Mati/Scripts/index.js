document.addEventListener("DOMContentLoaded", documentOnLoad);

let MASCOTAS = [];
let OBSERVACIONES = [];


function storageGuardarMascotas() {
    localStorage.setItem("mascotas", JSON.stringify(MASCOTAS));
}

function storageLeerMascotas() {
    return JSON.parse(localStorage.getItem("mascotas")) || [];
}

function storageGuardarObservaciones() {
    localStorage.setItem("observaciones", JSON.stringify(OBSERVACIONES));
}

function storageLeerObservaciones() {
    return JSON.parse(localStorage.getItem("observaciones")) || [];
}

function cargarMascotas(mascotas) {
    for (let mascota of mascotas) {
        agregarMascota(mascota);
    }
}

function agregarMascota(mascota) {
    mascota.id = ultimoIdMascota() + 1;
    MASCOTAS.push(mascota);
    storageGuardarMascotas();
    actualizarSelectMascotas();
}

function eliminarMascota(id) {
    MASCOTAS = MASCOTAS.filter(mascota => mascota.id !== id);
    OBSERVACIONES = OBSERVACIONES.filter(observacion => observacion.idMascota !== id);
    storageGuardarMascotas();
    storageGuardarObservaciones();
    renderizarMascotas();
    renderizarObservaciones();
    renderizarResumenObservaciones();
    actualizarSelectMascotas();
}

function ultimoIdMascota() {
    let ultimoId = -1;
    for (let mascota of MASCOTAS) {
        if (mascota.id > ultimoId) {
            ultimoId = mascota.id;
        }
    }
    return ultimoId;
}

function renderizarMascota(mascota) {
    let fila = document.createElement("tr");
    fila.dataset.idmascota = mascota.id;

    let celdaNombre = document.createElement("td");
    celdaNombre.innerText = mascota.nombre;
    fila.appendChild(celdaNombre);

    let celdaEspecie = document.createElement("td");
    celdaEspecie.innerText = mascota.especie;
    fila.appendChild(celdaEspecie);

    let celdaRaza = document.createElement("td");
    celdaRaza.innerText = mascota.raza;
    fila.appendChild(celdaRaza);

    let celdaFechaNacimiento = document.createElement("td");
    celdaFechaNacimiento.innerText = mascota.fechaNacimiento;
    fila.appendChild(celdaFechaNacimiento);

    let celdaEliminar = document.createElement("td");
    let botonEliminar = document.createElement("button");
    botonEliminar.innerText = "Eliminar";
    botonEliminar.classList.add("btn", "btn-danger");
    botonEliminar.addEventListener("click", function() {
        eliminarMascota(mascota.id);
    });
    celdaEliminar.appendChild(botonEliminar);
    fila.appendChild(celdaEliminar);

    document.getElementById("tablaMascotas").appendChild(fila);
}

function renderizarMascotas() {
    let tabla = document.getElementById("tablaMascotas");
    tabla.innerHTML = "";
    for (let mascota of MASCOTAS) {
        renderizarMascota(mascota);
    }
}

function actualizarSelectMascotas() {
    let filtroMascotaObservacion = document.getElementById("filtroMascotaObservacion");
    let filtroMascotaListado = document.getElementById("filtroMascotaListado");
    filtroMascotaObservacion.innerHTML = "<option value=''>Seleccionar Mascota</option>"; // esto es el coso para seleccionar mascotas, vi como hacerlo en chatgpt
    filtroMascotaListado.innerHTML = "<option value=''>Todas</option>";

    for (let mascota of MASCOTAS) {
        let optionObservacion = document.createElement("option");
        optionObservacion.value = mascota.id;
        optionObservacion.innerText = mascota.nombre;
        filtroMascotaObservacion.appendChild(optionObservacion);

        let optionListado = document.createElement("option");
        optionListado.value = mascota.id;
        optionListado.innerText = mascota.nombre;
        filtroMascotaListado.appendChild(optionListado);
    }
}

function agregarObservacion(observacion) {
    observacion.id = ultimoIdObservacion() + 1;
    OBSERVACIONES.push(observacion);
    storageGuardarObservaciones();
    renderizarObservaciones();
    renderizarResumenObservaciones();
}

function ultimoIdObservacion() {
    let ultimoId = -1;
    for (let observacion of OBSERVACIONES) {
        if (observacion.id > ultimoId) {
            ultimoId = observacion.id;
        }
    }
    return ultimoId;
}

function renderizarObservaciones() {
    let tabla = document.getElementById("tablaObservaciones").querySelector("tbody");
    tabla.innerHTML = "";
    let idMascota = document.getElementById("filtroMascotaListado").value;
    let observacionesFiltradas = OBSERVACIONES.filter(observacion => !idMascota || observacion.idMascota === parseInt(idMascota));

    for (let observacion of observacionesFiltradas) {
        let fila = document.createElement("tr");

        let celdaNombreMascota = document.createElement("td");
        let mascota = MASCOTAS.find(mascota => mascota.id === observacion.idMascota);
        celdaNombreMascota.innerText = mascota ? mascota.nombre : "Desconocido"; // esto lo saque de stackoverflow
        fila.appendChild(celdaNombreMascota);

        let celdaTitulo = document.createElement("td");
        celdaTitulo.innerText = observacion.titulo;
        fila.appendChild(celdaTitulo);

        let celdaDetalle = document.createElement("td");
        celdaDetalle.innerText = observacion.detalle;
        fila.appendChild(celdaDetalle);

        let celdaPeso = document.createElement("td");
        celdaPeso.innerText = observacion.peso;
        fila.appendChild(celdaPeso);

        let celdaFechaObservacion = document.createElement("td");
        celdaFechaObservacion.innerText = observacion.fechaObservacion;
        fila.appendChild(celdaFechaObservacion);

        tabla.appendChild(fila);
    }
}

function renderizarResumenObservaciones() {
    let tabla = document.getElementById("tablaResumen").querySelector("tbody");
    tabla.innerHTML = "";

    let resumen = MASCOTAS.map(mascota => {
        let observacionesMascota = OBSERVACIONES.filter(observacion => observacion.idMascota === mascota.id);
        return {
            nombre: mascota.nombre,
            total: observacionesMascota.length,
            ultimaMedicion: observacionesMascota.length > 0 ? observacionesMascota[observacionesMascota.length - 1].peso : "N/A"
        };                                                        // esto lo saque de internet tambien
    });

    for (let item of resumen) {
        let fila = document.createElement("tr");

        let celdaNombre = document.createElement("td");
        celdaNombre.innerText = item.nombre;
        fila.appendChild(celdaNombre);

        let celdaTotal = document.createElement("td");
        celdaTotal.innerText = item.total;
        fila.appendChild(celdaTotal);

        let celdaUltimaMedicion = document.createElement("td");
        celdaUltimaMedicion.innerText = item.ultimaMedicion;
        fila.appendChild(celdaUltimaMedicion);

        tabla.appendChild(fila);
    }

    document.getElementById("totalObservaciones").innerText = `Total de observaciones: ${OBSERVACIONES.length}`;
}

function documentOnLoad() {
    MASCOTAS = storageLeerMascotas();
    OBSERVACIONES = storageLeerObservaciones();

    document.getElementById("botonAgregar").addEventListener("click", function() { 
        let nombre = document.getElementById("nombre").value;
        let especie = document.getElementById("especie").value;
        let raza = document.getElementById("raza").value;
        let fechaNacimiento = document.getElementById("fechaNacimiento").value;

        if (nombre && especie && raza && fechaNacimiento) {
            let nuevaMascota = {
                nombre: nombre,
                especie: especie,
                raza: raza,
                fechaNacimiento: fechaNacimiento
            };
            agregarMascota(nuevaMascota);
            renderizarMascotas();
            actualizarSelectMascotas();
            document.getElementById("nombre").value = "";
            document.getElementById("especie").value = "";
            document.getElementById("raza").value = "";
            document.getElementById("fechaNacimiento").value = "";
        } else {
            alert("Por favor, complete todos los campos.");
        }
    });

    document.getElementById("observacionForm").addEventListener("submit", function(event) {
        event.preventDefault();
        onSubmitObservacionForm();      // en estos dos document use function(event) que lo saque de stackoverflow
    });

    document.getElementById("filtroMascotaListado").addEventListener("change", function() {
        renderizarObservaciones();
    });

    renderizarMascotas();
    renderizarObservaciones();
    renderizarResumenObservaciones();
    actualizarSelectMascotas();
}

function onSubmitObservacionForm() {
    let idMascota = parseInt(document.getElementById("filtroMascotaObservacion").value);
    let titulo = document.getElementById("titulo").value;
    let detalle = document.getElementById("detalle").value;
    let peso = parseFloat(document.getElementById("peso").value);
    let fechaObservacion = document.getElementById("fechaObservacion").value;

    if (idMascota && titulo && detalle && !isNaN(peso) && fechaObservacion) {
        let nuevaObservacion = {
            idMascota: idMascota,
            titulo: titulo,
            detalle: detalle,
            peso: peso,
            fechaObservacion: fechaObservacion
        };
        agregarObservacion(nuevaObservacion);
        document.getElementById("titulo").value = "";
        document.getElementById("detalle").value = "";
        document.getElementById("peso").value = "";
        document.getElementById("fechaObservacion").value = "";
    } else {
        alert("Por favor, complete todos los campos correctamente.");  // esto lo puse para comprobar y lo deje
    }
}
