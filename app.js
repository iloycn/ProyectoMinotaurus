
const PAREDES = [33,35,36,37,38,39,41,47,48,56,57,77,80,81,83,84,87,92,95,99,102,107,117,122,125,129,132,137,140,141,143,144,147,167,168,176,177,183,185,186,187,188,189,191];

const INICIALrojo = [0];

const INICIALazul = [14];

const INICIALblanco = [210];

const INICIALamarillo = [224];

var INICIALmino =[112];

const INICIALES = INICIALmino.concat(INICIALrojo,INICIALazul,INICIALblanco,INICIALamarillo);

var muros = [230,231];

var cantidadMuros = 8;

var jugadores;

var turno;

const ORDEN = ["rojo","azul","amarillo","blanco"];

var dado;

function empezar(){
    generarMuros();
    generarTablero();
    jugadores = [
        ["Pepe","Josefa"],
        ["amarillo","blanco"]
    ];
    aniadirJugadores();
    turno = ORDEN[0];
    mover(turno);
}    

function generarMuros(){
    for (let i = 0; i < cantidadMuros; i++) {
        numero = Math.floor(Math.random() * 224);
        if(!estaEn(numero,PAREDES) && !estaEn(numero,muros) && !estaEn(numero,INICIALES)){
            muros.push(numero);
        }
    }
}

function estaEn(numero,array){
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if(numero == element){
            return true;
        }
    }
    return false;
}

function generarTablero(){
    var tablero = document.getElementById('tablero');
    
    for (let i = 0; i < 225; i++) {
        var casilla = document.createElement("div");

        if(estaEn(i,PAREDES)){
            casilla.setAttribute("class","pared");
        }else if(estaEn(i,muros)){
            casilla.setAttribute("class","muro");
        }else{
            casilla.setAttribute("class","suelo");
        }
        if(i==112){
            casilla.innerHTML += '<img src="img/m3.jpg">'
        }
        casilla.setAttribute("id","casilla" + String(i));
        tablero.appendChild(casilla);
    }
}

function aniadirJugadores(){
    for(var i = 0; i < jugadores[1].length; i++){
        generarTargeta(jugadores[0][i],jugadores[1][i]);
        generarFichas(jugadores[1][i]);
    }
}

function generarTargeta(nombre,color){
    document.getElementById('nombre' + color).innerText = nombre;
}

function generarFichas(color){
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
    ficha = '<img src="img/ficha' + color + '.jpg">';
    document.getElementById('casilla' + casilla).innerHTML = ficha;
    document.getElementById(color).innerHTML += ficha;
    document.getElementById(color).innerHTML += ficha;
}


function mover(jugador){
    if(dado!=""){

    } else{
        document.getElementById('instruccion').innerHTML = "<p>Jugador " + jugador + " tira el dado</p>";
    }

}

function abrirAjustes(){
    if(document.getElementById('menuAjustes').style.display == 'none'){
        document.getElementById('menuAjustes').style.display = 'block';
        document.getElementById('mesa').style.opacity = '0.3';
    }else{
        document.getElementById('menuAjustes').style.display = 'none';
        document.getElementById('mesa').style.opacity = '1';
    }
    
}
