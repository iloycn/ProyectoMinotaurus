
const PAREDES = [33, 35, 36, 37, 38, 39, 41, 47, 48, 56, 57, 77, 80, 81, 83, 84, 87, 92, 95, 99, 102, 107, 117, 122, 125, 129, 132, 137, 140, 141, 143, 144, 147, 167, 168, 176, 177, 183, 185, 186, 187, 188, 189, 191];

const INICIALrojo = [0];

const INICIALazul = [14];

const INICIALblanco = [210];

const INICIALamarillo = [224];

var INICIALmino = [112];

const INICIALES = INICIALmino.concat(INICIALrojo, INICIALazul, INICIALblanco, INICIALamarillo);

var muros = [230, 231];

var cantidadMuros = 8;

var jugadores = [
    [],
    []
];

var turno;

var orden;

var dado;

var fichaActual;

var movimientos;

var contadorFormularios = 0;

var maxFormularios = 4;

var coloresUtilizados = [];


function empezar() {
    generarMuros();
    generarTablero();
    guardarInformacion();
    document.getElementById('mesa').style.opacity = "1";
    // Ocultar el formulario
    document.getElementById('formulario').style.display = 'none';
    orden = jugadores[1];
    aniadirJugadores();

    // Iniciar la reproducción del audio
    var audioElement = document.getElementById('audioElement');
    audioElement.play();

    turno = orden[0];

    do{
        document.getElementById('dado').addEventListener("click",tirarDado);
        actuar(turno);
        siguienteTurno();
    }while(!finDelJuego())
}

function guardarInformacion(){
    
    for(var i = 0; i < contadorFormularios; i++){
        jugadores[0].push(document.getElementById('nombre' + String(i)).value);
        jugadores[1].push(document.getElementById('color' + String(i)).value);
    }
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

function estaEn(numero, array) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (numero == element) {
            return true;
        }
    }
    return false;
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
    document.getElementById(color).innerHTML += '<img src="img/ficha' + color + '.jpg">';
    document.getElementById(color).innerHTML += '<img src="img/ficha' + color + '.jpg">';
}

function actuar(turno){
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
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " mueve un muro</p>";
    console.log(moverMuros);
}

function moverMino() {
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " mueve al minotauro</p>";
    fichaActual = document.getElementById('fichaminotauro');
    console.log(moverMino);
}


function mover() {
    document.getElementById('instruccion').innerHTML = "<p>Jugador " + turno + " mueve tu ficha" + dado + " casillas</p>";
    fichaActual = document.getElementById('ficha' + turno);
    window.addEventListener("keydown", teclado);

}

function tirarDado() {
    dado = Math.floor(Math.random() * 6 + 1);
    document.getElementById('cajaDado').innerText = dado;
    console.log(dado);
    actuar();
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
    console.log(turno);
}

function abrirAjustes() {
    if (document.getElementById('menuAjustes').style.display == 'none') {
        document.getElementById('menuAjustes').style.display = 'block';
        document.getElementById('mesa').style.opacity = '0.3';
    } else {
        document.getElementById('menuAjustes').style.display = 'none';
        document.getElementById('mesa').style.opacity = '1';
    }

}



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
            <option value="blanco" ${!coloresUtilizados.includes('blanco') ? '' : 'disabled'}>Blanco</option>
            <option value="amarillo" ${!coloresUtilizados.includes('amarillo') ? '' : 'disabled'}>Amarillo</option>
            <option value="rojo" ${!coloresUtilizados.includes('rojo') ? '' : 'disabled'}>Rojo</option>
            <option value="azul" ${!coloresUtilizados.includes('azul') ? '' : 'disabled'}>Azul</option>
          </select>
        `;

        formulariosHijos.appendChild(formularioHijo);
        contadorFormularios++;

        // Desactivar el botón después de alcanzar el límite de formularios hijos
        if (contadorFormularios >= maxFormularios) {
            document.getElementById('agregarBtn').disabled = true;
        }


    }
}


function cambiarVolumen() {
    var volumen = document.getElementById("volumen").value;
    document.getElementById("valorVolumen").textContent = volumen + "%";
    
}


function finDelJuego(){//acabar funcion de fin del juego
    return true;
}