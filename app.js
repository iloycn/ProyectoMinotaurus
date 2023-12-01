const maxFormularios = 4;

const PAREDES = [33, 35, 36, 37, 38, 39, 41, 47, 48, 56, 57, 77, 80, 81, 83, 84, 87, 92, 95, 99, 102, 107, 117, 122, 125, 129, 132, 137, 140, 141, 143, 144, 147, 167, 168, 176, 177, 183, 185, 186, 187, 188, 189, 191];

const INICIALrojo = [0];

const INICIALazul = [14];

const INICIALblanco = [210];

const INICIALamarillo = [224];

const INICIALmino = [112];

const INICIALES = INICIALmino.concat(INICIALrojo, INICIALazul, INICIALblanco, INICIALamarillo);

var contadorFormularios = 0;

var coloresUtilizados = [];

var muros = [230, 231];

var cantidadMuros = 8;

var jugadores = [
    [],
    []
];

var tiempoActual = 60;

var temporizador;

var turno;

var orden;

var dado = null;

var eliminados = [];

var fichaActual;

var movimientos;

var ganador;



function agregarFormularioHijo() {
    if (contadorFormularios < maxFormularios) {
        var formulariosHijos = document.getElementById('formulariosHijos');

        var formularioHijo = document.createElement('div');
        formularioHijo.className = 'formulario-hijo';
                
        formularioHijo.innerHTML = `
          <h3>Jugador ${contadorFormularios + 1}</h3>
          <label for="nombre${contadorFormularios}">Nombre:</label>
          <input type="text" id="nombre${contadorFormularios}" name="nombre${contadorFormularios}" required>

          <label for="color${contadorFormularios}">Color:</label>
          <select id="color${contadorFormularios}" name="color${contadorFormularios}" required>
            <option value="blanco">Blanco</option>
            <option value="amarillo" >Amarillo</option>
            <option value="rojo">Rojo</option>
            <option value="azul">Azul</option>
          </select>`;

        formulariosHijos.appendChild(formularioHijo);
        contadorFormularios++;

        if (contadorFormularios >= maxFormularios) {
            document.getElementById('agregarBtn').disabled = true;
        }
    }
}

function comprobarFormulario(){
    if (contadorFormularios < 2) {
        alert("Debes llenar al menos dos fichas de jugador para empezar el juego.")
    } else if(coloresRepetidos()) {
        alert("No puedes repetir colores.")
    } else if(nombresBlancos()) {
        alert("Cada jugador Tiene que tener un nombre.")
    } else {
        empezar();
    }
}

function coloresRepetidos(){
    for(var i = 0; i < contadorFormularios ; i++){
        var color = document.getElementById("color" + String(i)).value;
        for(var j = 0; j < contadorFormularios; j++){
            if(color = document.getElementById("color" + j).value == color && i != j){
                return true;
            }
        }

    }
    return false;
}

function nombresBlancos(){
    for(var i = 0; i < contadorFormularios ; i++){
       if(document.getElementById("nombre" + String(i)).value == ""){
        return true;
       }
    }
    return false;
}

function empezar() {
    guardarInformacion();
    generarMuros();
    generarTablero();
    aniadirJugadores();
    quitarFormulario();
    reproducirSonidoFondo();
    empezarTemporizador();
    comenzarPartida();
}

function guardarInformacion(){
    for(var i = 0; i < contadorFormularios; i++){
        jugadores[0].push(document.getElementById('nombre' + String(i)).value);
        jugadores[1].push(document.getElementById('color' + String(i)).value);
    }
    orden = jugadores[1];
    turno = orden[0];
}

function estaEn(buscado, array) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (buscado == element) {
            return true;
        }
    }
    return false;
}

function generarMuros() {
    for (let i = 0; i <= cantidadMuros; i++) {
        numero = Math.floor(Math.random() * 224);
        if (!estaEn(numero, PAREDES) && !estaEn(numero, muros) && !estaEn(numero, INICIALES)) {
            muros.push(numero);
        } else {
            i--;
        }
    }
}

function generarTablero() {
    var tablero = document.getElementById('tablero');

    for (let i = 0; i < 225; i++) {
        var casilla = document.createElement("div");

        if (estaEn(i, PAREDES)) {
            casilla.setAttribute("class", "pared");
        } else if (estaEn(i, muros)) {
            casilla.setAttribute("class", "muro");
        } else {
            casilla.setAttribute("class", "suelo");
        }
        if (i == 112) {
            casilla.innerHTML += '<img src="img/m3.jpg" id="fichaminotauro">'
        }
        casilla.setAttribute("id", "casilla" + String(i));
        tablero.appendChild(casilla);
    }
}

function aniadirJugadores() {
    for (var i = 0; i < jugadores[1].length; i++) {
        generarTargeta(jugadores[0][i], jugadores[1][i]);
        generarFichas(jugadores[1][i]);
    }
}

function generarTargeta(nombre, color) {
    document.getElementById('nombre' + color).innerText = nombre;
    document.getElementById(color).innerHTML += '<p id="salvadas' + color + '">Fichas salvadas:0</p>';
    document.getElementById(color).innerHTML += '<p id="comidas' + color + '">Fichas comidas:0</p>';
    document.getElementById(color).innerHTML += '<img src="img/ficha' + color + '.jpg">';
    document.getElementById(color).innerHTML += '<img src="img/ficha' + color + '.jpg">';
}

function generarFichas(color) {
    var casilla;
    switch (color) {
        case 'rojo':
            casilla = 0;
            break;
        case 'azul':
            casilla = 14;
            break;
        case 'amarillo':
            casilla = 224;
            break;
        case 'blanco':
            casilla = 210;
            break;
        default:
            break;
    }
    document.getElementById('casilla' + casilla).innerHTML = '<img src="img/ficha' + color + '.jpg" id="ficha' + color + '">';
}

function quitarFormulario(){
    document.getElementById('mesa').style.opacity = "1";
    document.getElementById('formulario').style.display = 'none';
}


function empezarTemporizador(){
    document.getElementById("temporizador").style.display = "block";
    temporizador = setInterval(reducirTiempo, 1000);
    tiempoActual = 60; 
    actualizarTiempo();
}


function actualizarTiempo() {
    document.getElementById('datotiempo').innerText = tiempoActual;
}

function reducirTiempo() {
    tiempoActual--;
    actualizarTiempo();
    if (tiempoActual <= 0) {
        siguienteTurno()
    }
}

function comenzarPartida(){
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " tira el dado</p>"; 
    document.getElementById('cajaDado').addEventListener("click", tirarDado);
    document.getElementById("pasoTurno").addEventListener("click",siguienteTurno);
    actuar();
}

//acciones de movimiento

function actuar(){
    switch (dado) {
        case 1:
        case 2:
        case 3:
        case 4:
            mover();
            break;
        case 5:
            moverMuros();
            break;
        case 6:
            moverMino();
            break;
        default:
            document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " tira el dado</p>"; 
            break;
    }
}

function moverMuros() {
    document.getElementById('cajaDado').style.backgroundColor = "grey";
    document.getElementById('cajaDado').innerText = "";
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " mueve un muro</p>"; 
   var elementosMuro = document.getElementsByClassName('muro');
   for (var i = 0; i < elementosMuro.length; i++) {
        elementosMuro[i].addEventListener('click', quitarmuro); {

    }  
}

function quitarmuro(e){
    quitarevent('muro',quitarmuro);
    reproducirSonidoMuro();
    e.target.setAttribute('class','suelo');
    var elementossuelo = document.getElementsByClassName('suelo');
    for (var i = 0; i < elementossuelo.length; i++) {
        if (elementossuelo[i].childElementCount == 0){
             elementossuelo[i].addEventListener('click', aniadirmuro); }
    }
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " haz click en un suelo para poner el muro</p>";
}

function aniadirmuro(e){
    quitarevent('suelo', aniadirmuro);
    reproducirSonidoMuro();
    e.target.setAttribute('class','muro');
    siguienteTurno()
}

}
function quitarevent(classe,funtion){
    var elementosMuro = document.getElementsByClassName(classe);
    for (var i = 0; i < elementosMuro.length; i++) {
        elementosMuro[i].removeEventListener('click',funtion); 
    }
}

function moverMino() {
    document.getElementById('cajaDado').style.backgroundColor = "black";
    document.getElementById('cajaDado').innerText = "";
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " mueve al minotauro</p>"; 
    fichaActual = document.getElementById('fichaminotauro');
    movimientos = 5;//movimientos minotauro
    window.addEventListener("keydown", teclado);
}

function mover() {
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " mueve tu ficha " + dado + " casillas</p>";
    fichaActual = document.getElementById('ficha' + turno);
    window.addEventListener("keydown", teclado);
}

function teclado(e) {
    if(movimientos > 0){
        switch (e.key) {
            case "ArrowUp":
                moveUp()
                break;
            case "ArrowLeft":
                moveLeft()
                break;
            case "ArrowDown":
                moveDown()
                break;
            case "ArrowRight":
                moveRight()
                break;
        }
    }
}

function moveUp() {
    var casillaActual = fichaActual.parentElement.getAttribute("id");
    var numero = Number(casillaActual.slice(7));
    if(numero>14){
        var numeroNuevo = numero - 15;
        var casillaNueva = "casilla" + String(numeroNuevo);
        if(document.getElementById(casillaNueva).getAttribute("class") == "suelo" && !casillaOcupada(document.getElementById(casillaNueva))){
            document.getElementById(casillaNueva).appendChild(fichaActual);
            reproducirSonidoMovimiento();
            moverFichaConAnimacion();
            movimientos--;
            if(document.getElementById(casillaNueva).getAttribute("id") == "casilla112"){
                fichaFinal(document.getElementById(casillaNueva));
            }
            if(movimientos == 0){
                siguienteTurno()
            }
        }
    } 
}

function moveDown() {
    var casillaActual = fichaActual.parentElement.getAttribute("id");
    var numero = Number(casillaActual.slice(7));
    if(numero<210){
        var numeroNuevo = numero + 15;
        var casillaNueva = "casilla" + String(numeroNuevo);
        if(document.getElementById(casillaNueva).getAttribute("class") == "suelo" && !casillaOcupada(document.getElementById(casillaNueva))){
            document.getElementById(casillaNueva).appendChild(fichaActual);
            reproducirSonidoMovimiento();
            moverFichaConAnimacion();
            movimientos--;
            if(document.getElementById(casillaNueva).getAttribute("id") == "casilla112"){
                fichaFinal(document.getElementById(casillaNueva));
            }
            if(movimientos == 0){
                siguienteTurno()
            }
        }
    }
}

function moveLeft() {
    var casillaActual = fichaActual.parentElement.getAttribute("id");
    var numero = Number(casillaActual.slice(7));
    if((numero) % 15 != 0){
        var numeroNuevo = numero - 1;
        var casillaNueva = "casilla" + String(numeroNuevo);
        if(document.getElementById(casillaNueva).getAttribute("class") == "suelo" && !casillaOcupada(document.getElementById(casillaNueva))){
            document.getElementById(casillaNueva).appendChild(fichaActual);
            reproducirSonidoMovimiento();
            moverFichaConAnimacion();
            movimientos--;
            if(document.getElementById(casillaNueva).getAttribute("id") == "casilla112"){
                fichaFinal(document.getElementById(casillaNueva));
            }
            if(movimientos == 0){
                siguienteTurno()
            }
        }
    }
}

function moveRight() {
    var casillaActual = fichaActual.parentElement.getAttribute("id");
    var numero = Number(casillaActual.slice(7));
    if((numero + 1) % 15 != 0){
        var numeroNuevo = numero + 1;
        var casillaNueva = "casilla" + String(numeroNuevo);
        if(document.getElementById(casillaNueva).getAttribute("class") == "suelo" && !casillaOcupada(document.getElementById(casillaNueva))){
            document.getElementById(casillaNueva).appendChild(fichaActual);
            reproducirSonidoMovimiento();
            moverFichaConAnimacion();
            movimientos--;
            if(document.getElementById(casillaNueva).getAttribute("id") == "casilla112"){
                fichaFinal(document.getElementById(casillaNueva));
            }
            if(movimientos == 0){
                siguienteTurno()
            }
        }
    }
}

function casillaOcupada(casilla){
    if(fichaActual.getAttribute("id") =="fichaminotauro"){
        if(estaEn(casilla.getAttribute("id").slice(7),INICIALES)){
            return true;
        }
        if(casilla.childElementCount > 0){
            reproducirSonidoMinotauro();
            eliminarFicha(casilla);
        }
        return false;
    } else if(casilla.childElementCount > 0){
        return true;
    }
    return false;
}

function eliminarFicha(casilla){
    sacarFicha(casilla.firstChild.getAttribute("id"));
    moverFichaConAnimacion();
    comprobarEliminado(casilla.firstChild.getAttribute("id").slice(5));
    casilla.firstChild.remove();
    comidas = document.getElementById("comidas" + turno).innerText[15];
    document.getElementById("comidas" + turno ).innerText="Fichas comidas:" + String(Number(comidas)+1);
}

function comprobarEliminado(color){
    if(document.getElementById(color).lastElementChild.innerText == "No quedan refuerzos!"){
        eliminados.push(color);
        if(eliminados.length == contadorFormularios){
            finEmpate();
        }
    }
}

function sacarFicha(id){
    var jugador = id.slice(5);
    if(document.getElementById(jugador).childElementCount > 4){
        document.getElementById(jugador).lastChild.remove();
        generarFichas(jugador);
        if(fichaActual == null){
            fichaActual = document.getElementById('ficha' + turno);
        }
    }else{
        document.getElementById(jugador).innerHTML += "<p>No quedan refuerzos!</p>"
    }
}

function tirarDado() {
    if(dado == null){
        if(estaEn(turno,eliminados)){
            dado = Math.floor(Math.random() * 2) + 5;
         }else{
            dado = Math.floor(Math.random() * 6 + 1);
        }
        girarDadoConAnimacion();
        document.getElementById('cajaDado').style.backgroundColor = "white";
        document.getElementById('cajaDado').innerText = dado;
        movimientos = dado;
        actuar();
    }
}

function siguienteTurno() {
    var turnoactual = turno;
    var siguiente;
    for (var i = 0; i < orden.length; i++) {
        if (orden[i] == turnoactual) {
            if (i + 1 < orden.length) {
                siguiente = orden[i + 1];
            } else {
                siguiente = orden[0];
            }
        }
    }
    turno = siguiente;
    dado = null;
    movimientos = dado;
    tiempoActual = 60;
    actualizarTiempo();
    window.removeEventListener("keydown", teclado);
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " tira el dado</p>";
    document.getElementById('cajaDado').addEventListener("click",tirarDado);
}


//ajustes 

function abrirAjustes() {
    if (document.getElementById('menuAjustes').style.display == 'none') {
        document.getElementById('menuAjustes').style.display = 'block';
        document.getElementById('mesa').style.opacity = '0.3';
    } else {
        document.getElementById('menuAjustes').style.display = 'none';
        document.getElementById('mesa').style.opacity = '1';
    }
    cargarDatos();
}

function cargarDatos(){
    
}

function cambiarVolumen() {
    var volumen = document.getElementById("volumen").value;
    document.getElementById("valorVolumen").textContent = volumen + "%";
    
}

//finalizacion de partida
function fichaFinal(casilla){
    salvadas = document.getElementById("salvadas" + turno).innerText[16];
    document.getElementById("salvadas" + turno ).innerText="Fichas salvadas:" + String(Number(salvadas)+1);
    if(Number(document.getElementById("salvadas" + turno).innerText[16]) != 2){//numero de fichas para ganar
        casilla.firstChild.remove();
        sacarFicha(fichaActual.getAttribute("id"));
        siguienteTurno();
    }else{
        casilla.firstChild.remove();
        finDelJuego();
    }
    
}

function finDelJuego(){
    document.getElementById('instruccion').innerHTML = "ha ganado el jugador " + turno; 
    removeEventListener("keydown",teclado);
    document.getElementById("cajaDado").removeEventListener("click",tirarDado);
    document.getElementById("temporizador").style.display = "none";
    document.getElementById("cajaFinal").style.display = "block";
    document.getElementById("tituloVictoria").innerText += " JUGADOR " + turno.toUpperCase();
    guardarPartida();
}

function finEmpate(){
    document.getElementById('instruccion').innerHTML = "EMPATE"; 
    removeEventListener("keydown",teclado);
    document.getElementById("cajaDado").removeEventListener("click",tirarDado);
    document.getElementById("temporizador").style.display = "none";
    document.getElementById("cajaFinal").style.display = "block";
    document.getElementById("tituloVictoria").innerText = "EMPATE";
    guardarPartida();
}

function guardarPartida(){
    if (typeof(Storage) !== "undefined") {
        var fecha = new Date();
        var datosJugadores = [];
        for (var i = 0; i < jugadores[0].length; i++){
            var jugadorguardando = [];
            jugadorguardando.push(jugadores[0][i]);
            jugadorguardando.push(jugadores[1][i]);
            jugadorguardando.push(document.getElementById(String(jugadores[1][i])).children[2]);
            jugadorguardando.push(document.getElementById(String(jugadores[1][i])).children[3]);
            datosJugadores.push(jugadorguardando);
        }
        var fechaString = String(fecha.getDate()) + "/" + String(fecha.getMonth()+1) + "/" + String(fecha.getFullYear()) + "/" 
            + String(fecha.getHours()) + ":" + String(fecha.getMinutes()) + ":" + String(fecha.getSeconds());
        localStorage.setItem(fechaString, JSON.stringify(datosJugadores));
    }
    document.getElementById("restart").addEventListener("click",reiniciarPartida);
}

function reiniciarPartida(){
    contadorFormularios = 0;
    coloresUtilizados = [];
    muros = [230, 231];
    cantidadMuros = 8;
    jugadores = [
        [],
        []
    ];
    tiempoActual = 60;
    temporizador = null;
    turno =null;
    orden = [];
    dado = null;
    eliminados = [];
    fichaActual = null;
    movimientos = null;

    document.getElementById('cajaFinal').style.opacity = "0";
    document.getElementById('formulariosHijos').innerHTML = "";
    document.getElementById('mesa').style.opacity = "0";
    document.getElementById('formulario').style.display = 'block';
    for(var i = 0; i < coloresUtilizados.length; i++){
        document.getElementById(String(coloresUtilizados[i])).innerHTML = '<img src="img/img' + coloresUtilizados[i] + '.jpg"><p id="nombre' + coloresUtilizados[i] + '"></p>';
    }
    document.getElementById('tablero').innerHTML = '';
}

//sonidos
function reproducirSonidoFondo() {
    var sonidoBoton = document.getElementById('fondo');
    sonidoBoton.play();
}

function reproducirSonidoMovimiento() {
    var sonidoMovimiento = document.getElementById('sonidoMover');
    sonidoMovimiento.play();
}

function reproducirSonidoMuro() {
    var sonidoQuitarMuro = document.getElementById('sonidoQuitarMuro');
    sonidoQuitarMuro.play();
}

function reproducirSonidoMinotauro() {
    var sonidoMinotauro = document.getElementById('sonidoMinotauro');
    sonidoMinotauro.play();
}

//animaciones 
function moverFichaConAnimacion() {
    fichaActual.classList.add('movimientoficha');
}

function girarDadoConAnimacion() {
    const cajaDado = document.getElementById('cajaDado');
    cajaDado.classList.add('girarDado');
    setTimeout(() => {
        cajaDado.classList.remove('girarDado');
    }, 500);
}
