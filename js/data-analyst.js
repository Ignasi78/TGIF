'use strict'

//alert("attendance-s JavaScript");
// var link = "<a href='" + member.url + "'>" + member.first_name + " " + member.last_name + "</a>";

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

function ocultaCargando(){
    // debugger;
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
    let statistics = {
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
    
    // var repA = [];
    // var demA = [];
    // var indA = [];

    // === LLAMADAS A FUNCIONES (aunque seguimos dentro la funcion rellenaPagina) =====

    // calcula la Tabla Glance, la del cuadrante 1-2:
    acumuladorSegunPartido();  // suma X candidatos Democratas, Y Republicanos, Z indepes
    average_VotedWithParty();  // calcula la media AVG del campo "% votos" de cada partido
    // glanceTable();  ya no hace falta una funcion pq ya queda llenada la tabla

    // calcula 2 Tablas Engaged segun pasemos "least" (orden menos a mas) o "most" (inverso)
    engagedAtt("least");
    engagedAtt("most");
    
    // calcula 2 Tablas lessTen
    engagedParLessTen();  // lessTenPctLoy();
    engagedParMostTen();  // mostTenPctLoy();

    //lessTen();
    //
    //mostTen();
    console.log(statistics);
    putElements();
    buildSmallTable(statistics.doVote, document.getElementById("mostLoyTable"));
    buildSmallTable(statistics.doNotVote, document.getElementById("leastLoyTable"));

    // === DECLARACION DE FUNCIONES (aunque seguimos dentro la funcion rellenaPagina) =====

    function acumuladorSegunPartido() {
        for (var i = 0; i < members.length; i++) {

            let everyMember = data.results[0].members[i];

            switch (everyMember.party) {
                case "R":
                    statistics.numberR++;
                    break;
                case "D":
                    statistics.numberD++;
                    break;
                case "I":
                    statistics.numberI++;
                    break;
            }
        }
    }

    function putElements() {

        var titles = document.getElementsByClassName('cabeceras');
        titles.className="capa_tabla cabecera";

        var repRow = document.getElementById('id-Repub');
        repRow.insertCell().innerHTML = statistics.numberR;
        repRow.insertCell().innerHTML = statistics.republicanPartyPercentage;
        repRow.className="pares";
        
        var demRow = document.getElementById('id-Democ');
        demRow.insertCell().innerHTML = statistics.numberD;
        demRow.insertCell().innerHTML = statistics.democratsPartyPercentage;
        demRow.className="impares";

        var indRow = document.getElementById('id-Indep');
        indRow.insertCell().innerHTML = statistics.numberI;
        indRow.insertCell().innerHTML = statistics.independentPartyPercentage;
        indRow.className="pares";

        var total = document.getElementById('id-total');
        total.insertCell().innerHTML = statistics.numberD + statistics.numberR + statistics.numberI;
        total.insertCell().innerHTML = statistics.totalPartyPercentage;
        total.className="impares";
        total.className="ultima_impar";
        
        var leastTable = document.getElementById('leastTable');
        buildSmallTable(statistics.leastEngaged, leastTable);
        
        var mostTable = document.getElementById('mostTable');
        buildSmallTable(statistics.mostEngaged, mostTable);
    }

    function average_VotedWithParty() {
        var arrayWithDem = [];
        var arrayWithRep = [];
        var arrayWithInd = [];

        for (var j = 0; j < members.length; j++) {

            let everyMember = data.results[0].members[j];

            if (everyMember.party == "D") {
                arrayWithDem.push(everyMember);
            }
            if (everyMember.party == "R") {
                arrayWithRep.push(everyMember);
            }
            if (everyMember.party == "I") {
                arrayWithInd.push(everyMember);
            }

            statistics.democratsPartyPercentage = giveMeAvg(arrayWithDem).toFixed(2);
            statistics.republicanPartyPercentage = giveMeAvg(arrayWithRep).toFixed(2);
            statistics.independentPartyPercentage = giveMeAvg(arrayWithInd).toFixed(2);       statistics.totalPartyPercentage = giveMeAvg(members).toFixed(2);
        }
    }

    function giveMeAvg(recievedArray) {

        var sum = 0;
        for (var k = 0; k < recievedArray.length; k++) {
            sum = sum + recievedArray[k].votes_with_party_pct;
        }

        var avg = sum / recievedArray.length
        return avg;
    }

    //LESS ENGAGED ATENDANCE" TABLE
    function engagedAtt(direction) {
        
        if(direction == "least"){ 
            var sortedArray = members.sort(function (a, b) {
                return b.missed_votes - a.missed_votes
            });
        } else {
            var sortedArray = members.sort(function (a, b) {
                return a.missed_votes - b.missed_votes
            });
        }
        
        // take only 10% from sortedArray
        var checkedPrecent = sortedArray.length / 10;
        checkedPrecent = checkedPrecent.toFixed(0);
        // save in statistics this 10%
        
        var tenPrcArray = [];
        for (var i = 0; i<checkedPrecent; i++){
            tenPrcArray.push(members[i]) ;
        }
        
        if(direction == "least"){
            statistics.leastEngaged = tenPrcArray;
        } else {
            statistics.mostEngaged = tenPrcArray;
        }
    }

    function buildSmallTable(smallArray, whereToPut){
        
        if(whereToPut){
            for(var fila=0; fila < smallArray.length -1; fila++){
                var link = "<a href='" + smallArray[fila].url + "' target='_blank'>" + smallArray[fila].first_name + " " + smallArray[fila].last_name + "</a>";
                var newRow = document.createElement("tr");
                newRow.insertCell().innerHTML = link;
                newRow.insertCell().innerHTML = smallArray[fila].missed_votes;
                newRow.insertCell().innerHTML = smallArray[fila].missed_votes_pct;
                whereToPut.append(newRow);

                if (fila % 2==0)
                {
                    newRow.className="pares";
                    if (fila == smallArray.length -2)
                    {
                        newRow.className="ultima_par";
                    }
                }
                else
                {
                    newRow.className="impares";
                    if (fila == smallArray.length -2)
                    {
                        newRow.className="ultima_impar";
                    }
                }
            }
        }
    }


    function engagedParLessTen() {
        
        var mySortedArray = members.sort(function (a,b) {
            return a.votes_with_party_pct - b.votes_with_party_pct;
        });
        
        var pctNumber = (mySortedArray.length * 0.10).toFixed(0);
                    //(353*0.1).toFixed(0)
        
        for (var i = 0; i < pctNumber ; i++) {
            statistics.doNotVote.push(mySortedArray[i])
        }
        
        console.log(statistics.doNotVote);
    }

    function engagedParMostTen() {
        
        var myNewSortedArray = members.sort(function (a,b) {
            return b.votes_with_party_pct - a.votes_with_party_pct;
        });
        
        var pctNewNumber = (myNewSortedArray.length * 0.10).toFixed(0);
        
        for (var i = 0; i < pctNewNumber; i++){
            statistics.doVote.push(members[i])
        }
    }
 
}   // aqui cerramos la funcion 'rellenaPagina' invocada en el segundo THEN del FETCH
