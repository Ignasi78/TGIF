// ====================================================================================================================================
// si ya existe en variable localName de nuestro LocalStorage, sino llamamos a FETCH
// no hace falta llamar al Fetch, recogemos el valor y ejecutamos nuestra funcion init
//     creamos un objeto tipo JSON (a medida, solo valores que queremos (evitamos Array-Matriz temporal))
// calcula la Tabla Glance, la del cuadrante 1-2 (no escribe, solo calcula y almacena resultados en array analisis[] var global):
//     interactua con HTML mediante DOM para escribir Tabla Glance (comun a varias HTML) y luego dependiendo de la pagina HTML 
//     en que se encuentre, realizará llamada a funcion cargarTablaAnalisis pasando (arrTemporal y sitio donde escribirla)
// calcula 2 Tablas Engaged de las 2 paginas Attendance (tanto Senate como House), de cuadrantes 2-1 y 2-2 del HTML, 
//    segun pasemos "least" (orden menos a mas) o "most" 
//    es decir en total 4 tablas (Att-Sen-Least, Att-Sen-Most, Att-Hou-Least, Att-Hou-Most) campos Name, Num.Missed Votes, %Missed votes
// calcula 2 Tablas Loyal de las 2 paginas PartyLoyalty (tanto Senate como House), de cuadrantes 2-1 y 2-2 del HTML, 
//    segun pasemos "least" o "most"
//    es decir en total 4 tablas (Par-Sen-Least, Par-Sen-Most, Par-Hou-Least, Par-Hou-Most) campos Name, Num.Party Votes, %Party votes
// ====================================================================================================================================
'use strict'
var data;

onload = (function () {
    
    var myURL = '';
    // var str = 'To be, or not to be, that is the question.';
    // console.log(str.includes('To be'));       // true    

    if (document.title.includes('Senate')) {
        myURL = "https://api.propublica.org/congress/v1/113/senate/members.json";     
        var localName = "dataSenate";
    } else {
        myURL = "https://api.propublica.org/congress/v1/113/house/members.json"; 
        var localName = "dataHouse";
    }
    checkLocalStorage();  // vaciar si mas de 15 dias sin vaciarlo
    if (!this.localStorage[localName]){
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
                // ... en version con LocalStorage, lo almacenamos en memoria
                this.localStorage.setItem(localName, JSON.stringify(data.results[0].members));
                var FetchMembers = JSON.parse(localStorage.getItem(localName));

                initialize(FetchMembers);  // initialize(data);
                //rellenaPagina();

                //  y ocultamos la animacion gif de 'cargando...'
                ocultaCargando();             

        })
            //  en caso de fallar la conexion en el primer THEN, es decir response = NOK
        .catch(function(error){
                console.log("request failed");
        });
    }else{
        // si ya existe en variable localName de nuestro LocalStorage,
        // no hace falta llamar al Fetch, recogemos el valor y ejecutamos nuestra funcion init
        init(JSON.parse(localStorage.getItem(localName)));  
        // ocultar todos los Gif de Loading
        ocultaCargando();             
        // loader.forEach(l => l.style.display = 'none');      
    }
})

function checkLocalStorage() {
    var lastClear = localStorage.getItem('lastclear'),
      timeNow = (new Date()).getTime();
    // .getTime() returns milliseconds so 1000 * 60 * 60 * 24 = 15 days
    if ((timeNow - lastClear) > 1000 * 60 * 60 * 15) {
      localStorage.clear();
      localStorage.setItem('lastClear', timeNow);
    }
  }

// oculta el GIF animado de espera mientras se cargan los datos de la API, una vez ya se hayan cargado.
function ocultaCargando(){
    var pagina = document.title;
    switch (pagina){
        case "TGIF Senate Attendance": loadingSenateAtt.style.display = "none"; break;
        case "TGIF Senate Party Loyalty": loadingSenatePar.hidden = "true"; break;
        case "TGIF House Attendance": loadingHouseAtt.style.display = "none"; break;
        case "TGIF House Party Loyalty": loadingHousePar.style.display = "none"; break;
        default : console.log('no puedo ocultar el gif de loading');
    }
}

// initialize es la que realiza la preparacion-filtro de datos, rellena pagina y oculta gif de Loading
function initialize(members){
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
    // calcula la Tabla Glance, la del cuadrante 1-2 (no escribe, solo calcula y almacena resultados en array analisis[] var global):
    acumuladorSegunPartido(members);  // suma X candidatos Democratas, Y Republicanos, Z indepes
    mediaVotosPorPartido();  // calcula la media AVG del campo "% votos" de cada partido

    // interactua con HTML mediante DOM para escribir Tabla Glance (comun a varias HTML) y luego dependiendo de la pagina HTML 
    //     en que se encuentre, realizará llamada a funcion cargarTablaAnalisis pasando (arrTemporal y sitio donde escribirla)
    escribeHtml("glance");
    // calcula las Tablas inferiores segun pagina html
    if (document.title.includes('Senate')) {   // 2 paginas Senate
        if (document.title.includes('Party')) {    // PartyLoyalty
            analisis.leastEngaged = preparando(members,"least","votes_with_party_pct");
            var tablaLeast = document.getElementById('leastTablePartySen');
            cargarTablaAnalisis(analisis.leastEngaged,tablaLeast);
            analisis.mostEngaged = preparando(members,"most","votes_with_party_pct");            
            var tablaMost = document.getElementById('mostTablePartySen');
            cargarTablaAnalisis(analisis.mostEngaged,tablaMost);
        }else{                                     // Attendance
            analisis.missedLeastVote = preparando(members,"least","missed_votes_pct");
            var tablaLeast = document.getElementById('leastTableAttSen');
            cargarTablaAnalisis(analisis.missedLeastVote,tablaLeast);
            analisis.missedMostVote  = preparando(members,"most","missed_votes_pct");     
            var tablaMost = document.getElementById('mostTableAttSen');
            cargarTablaAnalisis(analisis.missedMostVote,tablaMost);       
        }
    }else{                     // 2 paginas House
        if (document.title.includes('Party')) {    // PartyLoyalty
            analisis.leastEngaged = preparando(members,"least","votes_with_party_pct");
            var tablaLeast = document.getElementById('leastTablePartyHou');            
            cargarTablaAnalisis(analisis.leastEngaged,tablaLeast);       
            analisis.mostEngaged = preparando(members,"most","votes_with_party_pct");
            var tablaMost = document.getElementById('mostTablePartyHou');            
            cargarTablaAnalisis(analisis.mostEngaged,tablaMost);       
        }else{                                     // Attendance
            analisis.missedLeastVote = preparando(members,"least","missed_votes_pct");
            var tablaLeast = document.getElementById('leastTableAttHou');
            cargarTablaAnalisis(analisis.missedLeastVote,tablaLeast);       
            analisis.missedMostVote = preparando(members,"most","missed_votes_pct");
            var tablaMost = document.getElementById('mostTableAttHou');
            cargarTablaAnalisis(analisis.missedMostVote,tablaMost);       
        }
    }

//  loyalParty("least");
//  loyalParty("most");
    
    // === DECLARACION DE FUNCIONES (aunque seguimos dentro la funcion rellenaPagina) =======================

    function acumuladorSegunPartido(arrMiembros) {
        for (var puntero = 0; puntero < arrMiembros.length; puntero++) {
            let everyMember = data.results[0].members[puntero];
            switch (everyMember.party) {
                case "R": analisis.numberR++; break;
                case "D": analisis.numberD++; break;
                case "I": analisis.numberI++; break; 
            }
        }
    }

    function escribeHtml(tipoTabla) {

        if (tipoTabla == "glance"){
            // tabla de At a Glance
            var titles = document.getElementsByClassName('cabeceras');
            var repRow = document.getElementById('id-Repub');
            var demRow = document.getElementById('id-Democ');
            var indRow = document.getElementById('id-Indep');
            var total  = document.getElementById('id-total');
            titles.className="capa_tabla cabecera";
            repRow.insertCell().innerHTML = analisis.numberR;
            repRow.insertCell().innerHTML = analisis.republicanPartyPercentage+"%";
            repRow.className="pares";        
            demRow.insertCell().innerHTML = analisis.numberD;
            demRow.insertCell().innerHTML = analisis.democratsPartyPercentage+"%";
            demRow.className="impares";
            indRow.insertCell().innerHTML = (analisis.numberI==0)?"n.a.":analisis.numberI+"%";
            indRow.insertCell().innerHTML = (isNaN(analisis.independentPartyPercentage))? "n.a.":analisis.independentPartyPercentage+"%";
            indRow.className="pares";
            total.insertCell().innerHTML = analisis.numberD + analisis.numberR + analisis.numberI;
            total.insertCell().innerHTML = analisis.totalPartyPercentage+"%";
            total.className="impares";
            total.className="ultima_impar";
        }else{   // if (tipoTabla == "analyst"){
            if (document.title.includes('Senate')) {              // tablas estadisticas Data Analyst (cuadrantes inferiores)
                if (document.title.includes('Party')) {
                    var tablaLeast = document.getElementById('leastTablePartySen');
                    cargarTablaAnalisis(analisis.doVote, tablaLeast);   // Loyalty - Senate or House - Least Loyal - list of the bottom 10% members of total members (order by % party votes)  ....
                    var tablaMost  = document.getElementById('mostTablePartySen');
                    cargarTablaAnalisis(analisis.doNotVote, tablaMost);	  // Loyalty - Senate or House - Most Loyal - list of the top 10% members of total members (order by % party votes)
                }else{
                    var tablaLeast = document.getElementById('leastTableAttSen');
                    cargarTablaAnalisis(analisis.leastEngaged, tablaLeast);   // Attendance - Senate or House - Least Engaged - list the bottom 10% members of total members (order by % missed votes)  ... menos seguidos
                    var tablaMost  = document.getElementById('mostTableAttSen');
                    cargarTablaAnalisis(analisis.mostEngaged, tablaMost);     // Attendance - Senate or House - Most Engaged - list the top 10% members of total members (order by % missed votes)  ... mas seguidos            
                }
            }else{
                if (document.title.includes('Party')) {
                    var tablaLeast = document.getElementById('leastTablePartyHou');
                    cargarTablaAnalisis(analisis.doNotVote, tablaLeast);   // Loyalty - Senate or House - Least Loyal - list of the bottom 10% members of total members (order by % party votes)  ....
                    var tablaMost  = document.getElementById('mostTablePartyHou');
                    cargarTablaAnalisis(analisis.doVote, tablaMost);	  // Loyalty - Senate or House - Most Loyal - list of the top 10% members of total members (order by % party votes)
                }else{
                    var tablaLeast = document.getElementById('leastTableAttHou');
                    cargarTablaAnalisis(analisis.leastEngaged, tablaLeast);   // Attendance - Senate or House - Least Engaged - list the bottom 10% members of total members (order by % missed votes)  ... menos seguidos
                    var tablaMost  = document.getElementById('mostTableAttHou');
                    cargarTablaAnalisis(analisis.mostEngaged, tablaMost);     // Attendance - Senate or House - Most Engaged - list the top 10% members of total members (order by % missed votes)  ... mas seguidos            
                }
            }           
        }  // end If tipoTabla
    }   // end function escribeHtml()

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
        var media = acumula / arrTemporal.length;
        return media;
    }

    function preparando(people,LeastOrMost,OrderField){
        var arrOrdered = [];
        var arrTenPerc = [];
        (LeastOrMost == "most")? (arrOrdered=sortPeople(people,"asc",OrderField)):(arrOrdered=sortPeople(people,"desc",OrderField));
        for (var i=0; i < people.length; i++){
            if (arrTenPerc.length < Math.round(people.length * 0.1)){
                arrTenPerc.push(arrOrdered[i]);
            }
        }
        arrTenPerc.forEach(person => {
            person.votes_with_party_abs = Math.round((person.total_votes - person.missed_votes * person.votes_with_party_pct / 100))
        });
        return arrTenPerc;
    }

    function sortPeople(lista, orden, campo){
        var listaOrdenada = new Array;
        if (orden == "asc") {
            listaOrdenada = lista.sort((a,b) => {
                return a[campo] - b[campo];
            })
        }
        else if (orden == "desc") {
            listaOrdenada = lista.sort((a,b) => {
                return b[campo] - a[campo];
            })
        }
        return listaOrdenada;
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
}   // aqui cerramos la funcion 'initialize(members)' invocada en el segundo THEN del FETCH
