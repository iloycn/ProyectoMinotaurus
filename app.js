window.addEventListener("load",generarTablero());

    function generarTablero(){
        var tablero = document.getElementById('tablero');
        let paredes = [3,5,7,9,11];
        let muros = [2,6,10];

        for (let i = 0; i < 100; i++) {
            var casilla = document.createElement("div");

            if(i in paredes){
                casilla.setAttribute("class","pared");
            }else if(casilla in muros){
                casilla.setAttribute("class","muro");
            }else{
                casilla.setAttribute("class","suelo");
            }

            document.getElementById('tablero').appendChild(casilla);
        }
    }