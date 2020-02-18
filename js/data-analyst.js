'use strict'

var data;

onload = (function () {
    
    var myURL = '';
    // var str = 'To be, or not to be, that is the question.';
    // console.log(str.includes('To be'));       // true    

    if (document.title.includes('Senate')) {
        myURL = "https://api.propublica.org/congress/v1/113/senate/members.json";     
    } else {
        myURL = "https://api.propublica.org/congress/v1/113/house/members.json"; 
    }

    fetch(myURL, {method:"GET", headers: {'X-API-Key': 'LhqEr2wOQVg6gsLmo3WMIn7gY3MOlWSCiTUirP1t'}})

        //  a continuación THEN (función PROMESA) hasta que no llegan datos del FETCH, no continua
       .then(response => response.json())
        //  que es lo mismo que poner la funcion entera asi: 
                                                        //    .then(function (response) {
                                                        //        if (response.ok) {
                                                        //           return response.json();
                                                        //        }
                                                        //    }
        //  si response = OK, es dedir NO ha fallado conexión, seguimos aqui; sino iriamos al CATCH.
       .then((json) => { data = json;
        //  que es lo mismo que poner la funcion entera asi: 
                                                        //    .then(function (json) {
                                                        //       var data = json;
                                                        //    }
            //  y en este segundo THEN, ahora SI tenemos datos (variable data), pues cargamos la pagina
            rellenaPagina();
            //  y ocultamos la animacion gif de 'cargando...'
            ocultaCargando();             
       })
        //  en caso de fallar la conexion en el primer THEN, es decir response = NOK
       .catch(function(error){
            console.log("request failed");
       });
})

// oculta el GIF animado de espera mientras se cargan los datos de la API, una vez ya se hayan cargado.
function ocultaCargando(){
    var pagina = document.title;
    switch (pagina){
        case "TGIF Senate Attendance":
            loadingSenateAtt.style.display = "none"; 
            console.log('oculto gif de loadingSenateAtt');
            break;
        case "TGIF Senate Party Loyalty":
            loadingSenatePar.hidden = "true";
            // loadingSenatePar.style.display = "none"; 
            console.log('oculto gif de loadingSenatePar');
            break;
        case "TGIF House Attendance":
            loadingHouseAtt.style.display = "none"; 
            console.log('oculto gif de loadingHouseAtt');
            break;
        case "TGIF House Party Loyalty":
            loadingHousePar.style.display = "none"; 
            console.log('oculto gif de loadingHousePar');
            break;
        default :
            console.log('no puedo ocultar el gif de loading');
    }
}

function rellenaPagina (){
    // var data = data_senate;   ... ahora ya no, ahora var 'data' contiene resultado del FETCH
    // creamos un objeto tipo JSON (a medida, solo valores que queremos (evitamos Array-Matriz temporal))
    // usamos LET en vez de VAR para reutilizar mismas variables para 4 paginas
    let analisis = {
        "numberR": 0,
        "numberD": 0,
        "numberI": 0,
        "republicanPartyPercentage": 0,
        "democratsPartyPercentage": 0,
        "independentPartyPercentage": 0,
        "totalPartyPercentage": 0,
        "doNotVote": [],
        "doVote": [],
        "missedMostVote": [],
        "missedLeastVote": [],
        "leastEngaged": [],
        "mostEngaged": [],
    }
    
    let members = data.results[0].members;

    // === LLAMADAS A FUNCIONES (aunque seguimos dentro la funcion rellenaPagina) ===========================

    // calcula la Tabla Glance, la del cuadrante 1-2:
    acumuladorSegunPartido();  // suma X candidatos Democratas, Y Republicanos, Z indepes
    mediaVotosPorPartido();  // calcula la media AVG del campo "% votos" de cada partido
    // calcula 2 Tablas Engaged, de cuadrantes 2-1 y 2-2 del HTML, segun le pasemos "least" (orden menos a mas) o "most" (inverso)
    engagedAtt("least");
    engagedAtt("most");
    // calcula 2 Tablas lessTen
    engagedParLessTen();  
    engagedParMostTen();  
    escribeHtml();

    if (document.title.includes('Senate')) {
        if (document.title.includes('Party')) {
            var tablaLeast = document.getElementById('leastTablePartySen');
            var tablaMost  = document.getElementById('mostTablePartySen');
        }else{
            var tablaLeast = document.getElementById('leastTableAttSen');
            var tablaMost  = document.getElementById('mostTableAttSen');
        }
    }else{
        if (document.title.includes('Party')) {
            var tablaLeast = document.getElementById('leastTablePartyHou');
            var tablaMost  = document.getElementById('mostTablePartyHou');
        }else{
            var tablaLeast = document.getElementById('leastTableAttHou');
            var tablaMost  = document.getElementById('mostTableAttHou');
        }
    }

    cargarTablaAnalisis(analisis.doVote, document.getElementById(tablaMost));
    cargarTablaAnalisis(analisis.doNotVote, document.getElementById(tablaLeast));

    //cargarTablaAnalisis(analisis.doVote, document.getElementById("mostLoyTable"));
    //cargarTablaAnalisis(analisis.doNotVote, document.getElementById("leastLoyTable"));

    // === DECLARACION DE FUNCIONES (aunque seguimos dentro la funcion rellenaPagina) =======================

    function acumuladorSegunPartido() {
        for (var puntero = 0; puntero < members.length; puntero++) {

            let everyMember = data.results[0].members[puntero];

            switch (everyMember.party) {
                case "R":
                    analisis.numberR++;
                    break;
                case "D":
                    analisis.numberD++;
                    break;
                case "I":
                    analisis.numberI++;
                    break;
            }
        }
    }

    function escribeHtml() {
        var titles = document.getElementsByClassName('cabeceras');
        var repRow = document.getElementById('id-Repub');
        var demRow = document.getElementById('id-Democ');
        var indRow = document.getElementById('id-Indep');
        var total = document.getElementById('id-total');

        if (document.title.includes('Senate')) {
            if (document.title.includes('Party')) {
                var tablaLeast = document.getElementById('leastTablePartySen');
                var tablaMost  = document.getElementById('mostTablePartySen');
            }else{
                var tablaLeast = document.getElementById('leastTableAttSen');
                var tablaMost  = document.getElementById('mostTableAttSen');
            }
        }else{
            if (document.title.includes('Party')) {
                var tablaLeast = document.getElementById('leastTablePartyHou');
                var tablaMost  = document.getElementById('mostTablePartyHou');
            }else{
                var tablaLeast = document.getElementById('leastTableAttHou');
                var tablaMost  = document.getElementById('mostTableAttHou');
            }
        }
        titles.className="capa_tabla cabecera";
        repRow.insertCell().innerHTML = analisis.numberR;
        repRow.insertCell().innerHTML = analisis.republicanPartyPercentage;
        repRow.className="pares";        
        demRow.insertCell().innerHTML = analisis.numberD;
        demRow.insertCell().innerHTML = analisis.democratsPartyPercentage;
        demRow.className="impares";
        indRow.insertCell().innerHTML = analisis.numberI;
        indRow.insertCell().innerHTML = analisis.independentPartyPercentage;
        indRow.className="pares";
        total.insertCell().innerHTML = analisis.numberD + analisis.numberR + analisis.numberI;
        total.insertCell().innerHTML = analisis.totalPartyPercentage;
        total.className="impares";
        total.className="ultima_impar";
        
        cargarTablaAnalisis(analisis.leastEngaged, tablaLeast);        
        cargarTablaAnalisis(analisis.mostEngaged, tablaMost);
    }

    function mediaVotosPorPartido() {
        var arrayWithDem = [];
        var arrayWithRep = [];
        var arrayWithInd = [];
        for (var punteroA = 0; punteroA < members.length; punteroA++) {
            let everyMember = data.results[0].members[punteroA];
            if (everyMember.party == "D") {
                arrayWithDem.push(everyMember);
            }
            if (everyMember.party == "R") {
                arrayWithRep.push(everyMember);
            }
            if (everyMember.party == "I") {
                arrayWithInd.push(everyMember);
            }
            analisis.democratsPartyPercentage = calculaMedia(arrayWithDem).toFixed(2);
            analisis.republicanPartyPercentage = calculaMedia(arrayWithRep).toFixed(2);
            analisis.independentPartyPercentage = calculaMedia(arrayWithInd).toFixed(2);       
            analisis.totalPartyPercentage = calculaMedia(members).toFixed(2);
        }
    }

    function calculaMedia(arrTemporal) {
        var acumula = 0;
        for (var puntero = 0; puntero < arrTemporal.length; puntero++) {
            acumula = acumula + arrTemporal[puntero].votes_with_party_pct;
        }
        var media = acumula;
        acumula = acumula / arrTemporal.length;
        return media;
    }

    // funcion para sacar los Menos Seguidos (tabla Less) o Mas Seguidos (tabla Most) segun sea Ascendente o Descendente
    function engagedAtt(LeastOrMost) {        
        if(LeastOrMost == "least"){ 
            var arrMiembrosOrdenadosAtt = members.sort(function (a, b) {
                return b.missed_votes - a.missed_votes
            });
        } else {
            var arrMiembrosOrdenadosAtt = members.sort(function (a, b) {
                return a.missed_votes - b.missed_votes
            });
        }        
        // recogemos solamente los Top Ten ya sea Menos o Mas seguidos
        var arrTopMiembros = [];
        var arrDiezPorCientoMiembros = arrMiembrosOrdenadosAtt.length / 10;
        arrDiezPorCientoMiembros = arrDiezPorCientoMiembros.toFixed(0);                
        for (var puntero = 0; puntero<arrDiezPorCientoMiembros; puntero++){
            arrTopMiembros.push(members[puntero]) ;
        }        
        if(LeastOrMost == "least"){
            analisis.leastEngaged = arrTopMiembros;
        } else {
            analisis.mostEngaged = arrTopMiembros;
        }
    }

    // 2 funciones para calculos especificos para sacar el 10% de los Miembros mas seguidos, o menos seguidos
    function engagedParLessTen() {        
        var arrMiembrosOrdenadosLoyalty = members.sort(function (a,b) {
            return a.votes_with_party_pct - b.votes_with_party_pct;
        });
        var porcentaje = (arrMiembrosOrdenadosLoyalty.length * 0.10).toFixed(0);        
        for (var puntero = 0; puntero < porcentaje ; puntero++) {
            analisis.doNotVote.push(arrMiembrosOrdenadosLoyalty[puntero])
        }
        console.log(analisis.doNotVote);
    }

    function engagedParMostTen() {        
        var arrMiembrosOrdenadosLoyalty = members.sort(function (a,b) {
            return b.votes_with_party_pct - a.votes_with_party_pct;
        });        
        var porcentaje = (arrMiembrosOrdenadosLoyalty.length * 0.10).toFixed(0);        
        for (var puntero = 0; puntero < porcentaje; puntero++){
            analisis.doVote.push(members[puntero])
        }
    }

    // funcion para cargar la tabla a partir de los calculos especificos de las 2 funciones de aqui arriba
    function cargarTablaAnalisis(arrTemporal, sitio){             
        if(sitio){
            for(var fila=0; fila < arrTemporal.length -1; fila++){
                var webMember = "<a href='" + arrTemporal[fila].url + "' target='_blank'>" + arrTemporal[fila].first_name + " " + arrTemporal[fila].last_name + "</a>";
                var hilera = document.createElement("tr");
                hilera.insertCell().innerHTML = webMember;
                hilera.insertCell().innerHTML = arrTemporal[fila].missed_votes;
                hilera.insertCell().innerHTML = arrTemporal[fila].missed_votes_pct;
                sitio.append(hilera);
                if (fila % 2==0)
                {
                    hilera.className="pares";
                    if (fila == arrTemporal.length -2)
                    {
                        hilera.className="ultima_par";
                    }
                }
                else
                {
                    hilera.className="impares";
                    if (fila == arrTemporal.length -2)
                    {
                        hilera.className="ultima_impar";                        
                    }
                }
            }
            var pieTabla = document.createElement("tr");
            pieTabla.insertCell().innerHTML = "TOTAL members listed: " + (arrTemporal.length -1);
            sitio.append(pieTabla);
            pieTabla.className="pieTabla";
        }
    }
 
}   // aqui cerramos la funcion 'rellenaPagina' invocada en el segundo THEN del FETCH
