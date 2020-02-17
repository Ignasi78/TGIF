'use strict'

// NOTA:  esta practica se ha hecho una parte con Arrays Multidimensionales para aprender a trabajar con Matrices, esto conlleva a multitud de variables globales, no sería el mejor ejemplo de codigo mvp

// GLOBAL VARIABLES DECLARATION ========================================================================
    var teclaPulsada        = "";
    var nombreTecleado      = "";
    var FiltraEsteNombre    = "";
    var conEstosDatos       = new Array();
    var pagina              = document.title;
    var enEsteLugarDelHtml  = "";
    var enEsteDesplegable   = "stateSelect";
    var data_to_show        = [];
    var myURL               = "";
    var arrNews             = ["We have the results of the % votes for congress 113."];
    var noticia_index       = 0;
    var noticia_texto       = "";

    // BASE DE DATOS: definimos un Array Bidimensional, a modo BD Fichero temporal.
    var index               = 0;
    var arrNames            = ["Name"];
    var arrParty            = ["Party"];
    var arrState            = ["State"];
    var arrSeniority        = ["Years in Office"];
    var arrVotes            = ["% votes"];
    var arrTmpSenadores     = [arrNames,arrParty,arrState,arrSeniority,arrVotes];

    // FILTROS: definimos los chkbox de filtro de informacion.
    var chkRep              = document.getElementById("chk_MostrarRep");
    var chkDem              = document.getElementById("chk_MostrarDem");
    var chkInd              = document.getElementById("chk_MostrarInd");
    var selSta              = document.getElementById("stateSelect");
    var NoMatch             = document.getElementById("NoMatch");
    var myData              = [];

    // FETCH para recoger los valores on-line por API-REST:
    onload = (function () {

        //debugger;
        startTime();   //arrNews);
        // averiguar URL correspondiente a SENATE o a HOUSE segun pagina en la que estemos:
        switch(pagina){
            case "TGIF Congress - Senate data":
                myURL = "https://api.propublica.org/congress/v1/113/senate/members.json";             // url = "https://api.myjson.com/bins/1eja30" 
                break;
            case "TGIF Congress - House data":
                myURL = "https://api.propublica.org/congress/v1/113/house/members.json";             // url = "https://api.myjson.com/bins/j83do"
                break;
        }
        fetch(myURL, {method:"GET", headers: {'X-API-Key': 'LhqEr2wOQVg6gsLmo3WMIn7gY3MOlWSCiTUirP1t'}})
            //.then(response => response.json())
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                // throw new Error(response.statusText);
            })
            .then(function (json) {
                var recogeDatos = json;
                // debugger;
                console.log(recogeDatos);
                filtrar_datos(recogeDatos);
                generar_tabla(conEstosDatos,enEsteLugarDelHtml);        
                generar_paises(arrState, enEsteDesplegable);
                if (pagina == "TGIF Congress - Senate data") {
                    loadingSenate.style.display = "none";    
                } else {
                    loadingHouse.style.display = "none";
                }                
            })
            .catch(function (error){
                console.log("request failed");
            });                       
    })


// ==== si quisieramos volverlo a pasar a String para tratar en JS:  //var arrayTablaBD = JSON.parse(myJsonData); 


// *******************************************************************************************************
// FUNCTION CALLS - Llamadas para invocar a las respectivas funciones ====================================

// function con los AdEventListener Boton LUPA FILTRAR - dentro de switch segun pagina donde estamos:
function filtrar_datos(myData){
    switch(pagina){
        case "TGIF Congress - Senate data":
            var MiLupaSenate = document.getElementById("btn-lupa-senate");
            var txtNombreSenate = document.getElementById("txt-nombre-senate");  
            enEsteLugarDelHtml = "tabla-congr-senate";
            conEstosDatos = prepara_datos(myData, chkRep,chkDem,chkInd,"","");    // myData será igual a data_senate
            
            MiLupaSenate.addEventListener('click', function(){
                console.log("mi lupa senate");
                elimina_tabla("tabla-congr-senate");
                conEstosDatos = prepara_datos(myData,chkRep,chkDem,chkInd,selSta,"");    // myData será igual a data_senate
                generar_tabla(conEstosDatos,"tabla-congr-senate");
            });    

            txtNombreSenate.addEventListener("keydown", function(event){
                teclaPulsada     = String.fromCharCode(event.keyCode);
                if (event.keyCode == "8"){
                     //alert("pulsaste retroceso");
                     nombreTecleado = nombreTecleado.substring(0,nombreTecleado.length-1);
                } else {
                    nombreTecleado   = nombreTecleado + teclaPulsada;
                }                
                if (nombreTecleado != ""){
                    elimina_tabla("tabla-congr-senate");
                    conEstosDatos = prepara_datos(myData,chkRep,chkDem,chkInd,selSta,nombreTecleado);    // myData será igual a data_senate
                    generar_tabla(conEstosDatos,"tabla-congr-senate");
                }
            });
            break;
        case "TGIF Congress - House data":
            var MiLupaHouse  = document.getElementById("btn-lupa-house");
            var txtNombreHouse = document.getElementById("txt-nombre-house");            
            enEsteLugarDelHtml = "tabla-congr-house";
            conEstosDatos = prepara_datos(myData, chkRep,chkDem,chkInd,"","");    // myData será igual a data_house

            MiLupaHouse.addEventListener('click', function(){
                elimina_tabla("tabla-congr-house");
                conEstosDatos = prepara_datos(myData,chkRep,chkDem,chkInd,selSta,"");    // myData será igual a data_house
                generar_tabla(conEstosDatos,"tabla-congr-house");
            });
            
            txtNombreHouse.addEventListener("keydown", function(event){
                teclaPulsada = String.fromCharCode(event.keyCode);
                if (event.keyCode == "8"){
                    //alert("pulsaste retroceso");
                    nombreTecleado = nombreTecleado.substring(0,nombreTecleado.length-1);
                } else {
                   nombreTecleado   = nombreTecleado + teclaPulsada;
                }                
                if (nombreTecleado != ""){                
                    elimina_tabla("tabla-congr-house");
                    conEstosDatos = prepara_datos(myData,chkRep,chkDem,chkInd,selSta,nombreTecleado);    // myData será igual a data_senate
                    generar_tabla(conEstosDatos,"tabla-congr-house");
                }
            });
            break;
    }
};

// function filtrar_nombre(){
//     console.log("entra??")
//     switch(pagina){
//         // debugger;
//         case "TGIF Congress - Senate data":
//             //enEsteLugarDelHtml = "tabla-congr-senate";
//             //conEstosDatos = prepara_datos(myData, chkRep,chkDem,chkInd,"","");    // myData será igual a data_senate
//             var txtNombreSenate = document.getElementById("txt-nombre-senate");
//             console.log(txtNombreSenate)
//             txtNombreSenate.addEventListener("keydown", function(event){
//                 console.log("keypresss")
//                 teclaPulsada = String.fromCharCode(event.keyCode);
//                 alert("mi tecla presionada es ", teclaPulsada);
//                 console.log("mi tecla presionada es ", teclaPulsada);
//                 nombreTecleado = nombreTecleado + teclaPulsada;
//                 elimina_tabla("tabla-congr-senate");
//                 conEstosDatos = prepara_datos(myData,chkRep,chkDem,chkInd,selSta,nombreTecleado);    // myData será igual a data_senate
//                 generar_tabla(conEstosDatos,"tabla-congr-senate");
//             });
//             break;
//         case "TGIF Congress - House data":    
//             enEsteLugarDelHtml = "tabla-congr-house";
//             conEstosDatos = prepara_datos(myData, chkRep,chkDem,chkInd,"","");    // myData será igual a data_senate
//             var txtNombreHouse = document.getElementById("txt-nombre-house");
//             txtNombreHouse.addEventListener("keydown", function(event){
//                 teclaPulsada = String.fromCharCode(event.keyCode);
//                 console.log("mi tecla presionada es ", teclaPulsada);
//                 nombreTecleado = nombreTecleado + teclaPulsada;
//                 elimina_tabla("tabla-congr-house");
//                 conEstosDatos = prepara_datos(myData,chkRep,chkDem,chkInd,selSta,nombreTecleado);    // myData será igual a data_house
//                 generar_tabla(conEstosDatos,"tabla-congr-house");  
//             });      
//     }
// };


// *******************************************************************************************************
// FUNCTION DECLARATION - definicion de las funciones que vamos a usar luego =============================

// function cargar_barra(incremento,maximo){
//     var barra = document.getElementById("barra");
//     barra.max   = maximo;
//     barra.value = incremento;
//     //barra.text = string(incremento);
//     alert(barra.value);
//     //debugger;
// }

function startTime() {
    //var noticias = new Array();
    //noticias = arrNews;
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);

    //debugger;
    // si es multiplo de 5 (cada 5 segundos)
    if (s % 10 == 0) {
        noticia_index++;
        //alert("noticia_index vale " + noticia_index);
        if (noticia_index > arrNews.length -1) {
            noticia_index = 0;
            //alert("correccion de noticia_index a " + noticia_index);
        }
    }

    // document.getElementById("hora").innerHTML = h + ":" + m + ":" + s + "  - &nbsp; LIVE NEWS : &nbsp; <marquee width=20%>" + arrNews[noticia_index] + "</marquee>";
    document.getElementById("hora").innerHTML = h + ":" + m + ":" + s + "  - &nbsp; LIVE NEWS : &nbsp; " + arrNews[noticia_index];
    var t = setInterval(function(){ startTime() }, 500);
  }
 

  function checkTime(i) {
    if (i<10) {
      i = "0" + i;
    }
    return i;
  }

// A...  PREPARAR LOS DATOS QUE NOS HAN DADO:
function prepara_datos( myJsonData, chkRep, chkDem, chkInd, selPais, filtroNombre){

    // A. 1. RECOGER LOS DATOS en un Objeto Array que en archivo senate_113.js hemos pasado de JSON a STRING 'myJsonData'.
    //recorremos el JSON para ir extrayendo la info para guardar en el Array Multidimensional
    console.log("inicializamos los sub-arrays");
    arrNames        = []; 
    arrNames[0]     = "Name";
    arrParty        = [];
    arrParty[0]     = "Party";
    arrState        = [];
    arrState[0]     = "State";
    arrSeniority    = [];
    arrSeniority[0] = "Years in Office";
    arrVotes        = [];
    arrVotes[0]     = "% votes";
    var nom         = "";
    var par         = "";
    var sta         = "";
    var yea         = "";
    var vot         = "";
    const eof       = myJsonData.results[0].members.length;
    console.log("El valor de eof es: "+eof);
    var canShow     = false;
    
    for (index=0; index < eof; index++) {        
            //guardamos en una variable para debugar los campos de cada registro (cada senador)            
            nom = myJsonData.results[0].members[index].first_name;
            nom = nom + " " + myJsonData.results[0].members[index].last_name;
            par = myJsonData.results[0].members[index].party;
            sta = myJsonData.results[0].members[index].state;
            yea = myJsonData.results[0].members[index].seniority;
            vot = myJsonData.results[0].members[index].votes_with_party_pct;
            //grabamos dentro del Array Bidimensional temporal de campos 
            canShow = false;
            switch(par){
                case chkDem.value:
                    if (chkDem.checked){
                        canShow = true;
                    };
                    break;
                case chkRep.value:
                    if (chkRep.checked){
                        canShow = true;
                    };
                    break;
                case chkInd.value:
                    if (chkInd.checked){
                        canShow = true;
                    };
                    break;
                default:
                    console.log("El partido del senador "+nom+" no esta definido!!");                        
            }   
            
            // filtro nombre tecleado
            //debugger;
             
            if ( (filtroNombre != "") && (nom.toUpperCase().indexOf(filtroNombre) < 0) ) {
                canShow = false;
            }
            
            if (canShow == true) 
            {                
                // si NO se ha seleccionado ningun PAIS, no tenemos en cuenta
                if ( (selSta.selectedIndex == (-1)  ) || (selSta.selectedIndex == 0 ) )
                {
                    arrNames.push(nom);
                    arrParty.push(par);
                    arrState.push(sta);
                    arrSeniority.push(yea);
                    arrVotes.push(vot);
                // en cambio si hay algun PAIS seleccionado, entramos a filtrar
                } else if (selSta.selectedIndex > 0 )
                {
                    if (sta == (selSta.options[selSta.selectedIndex].value))
                    {             
                        arrNames.push(nom);
                        arrParty.push(par);
                        arrState.push(sta);
                        arrSeniority.push(yea);
                        arrVotes.push(vot);
                    }                
                }
            }
            
    }
    arrTmpSenadores = [arrNames,arrParty,arrState,arrSeniority,arrVotes];
    console.log(arrTmpSenadores);
    return arrTmpSenadores;
}

// A. 2. PONEMOS EN MAYUS LA PRIMERA LETRA DEL NOMBRE Y APELLIDO
    function jsUcfirst(string) 
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

// A. 3. NO MATCH - cuando no encuentra registros
    function mostrar_noMatch() {
        // debugger;            
            let tblBody = document.createElement("tbody");
                var trow  = document.createElement("tr");
                    var tdiv  = document.createElement("td");
                    tdiv.colSpan = 5;
                    tdiv.innerHTML = "No match results found.";
                trow.appendChild(tdiv);
            tblBody.appendChild(trow);
        //tabla.appendChild(tblBody);
        //body.appendChild(tabla);
    }

// B.... FUNCION PARA GENERAR LA TABLA:
function generar_tabla(arrayTablaBD, sitio) {

    // B. 1. OBTENER NUM COLUMNAS DEL ARRAY (CUANTOS CAMPOS MOSTRAREMOS, EN PRINCIPIO 5 CAMPOS)
    var numberOfColumns = arrayTablaBD.length;

    // B. 2. OBTENER LA REFERENCIA DE < ELEMENTO > HTML EN EL CUAL QUIERO INSERTAR INFO
    var body = document.getElementById(sitio);

    // B. 3. CREAR ELEMENTO < TABLE > Y ELEMENTO < TBODY >
    var tabla   = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // B. 4. CREAR LA HILERA DE LA CABECERA... 1 ELEMENTO <TR> Y VARIOS ELEMENTOS <TH>  ==> BUCLE FOR (i < nColumns)
    var hileraCabecera = document.createElement("tr");
    for (var i=0; i<numberOfColumns; i++)
        {
        var columnaCabecera = document.createElement("th");
        columnaCabecera.className="cabecera";

    // B. 5. ESCRIBIR (CON innerHTML) LOS TITULOS DE LOS CAMPOS EN LA CASILLA CORRESPONDIENTE
        var nameColumn=(arrayTablaBD[i][0]);
        columnaCabecera.innerHTML=jsUcfirst(nameColumn);
        hileraCabecera.appendChild(columnaCabecera);
        }
    
    // B. 6. GRABAR TODO ESTO DENTRO DEL HTML EN EL MOMENTO DE CERRAR EL ELEMENTO </XXXXX> ... (CON appendChild)
    tblBody.appendChild(hileraCabecera);

    // B. 7. CREAR LAS CELDAS ..... QUE SERIAN VARIOS ELEMENTOS <TR> ... TANTOS COMO REGISTROS ==> BUCLE FOR (i < arrNames.length)
    
    for (var cuentaRegistros = 0; cuentaRegistros < arrNames.length-1; cuentaRegistros++){   
        //var barra = document.getElementById('barra');
        //barra.max   = arrNames.length-1;
        //barra.value = cuentaRegistros;

        // Crea las hileras de la tabla
        var hilera = document.createElement("tr");

    // B. 8. Y DENTRO DE CADA HILERA DE REGISTRO (BUCLE DE <TR>) HABRIA UN SUB-BUCLE DE <TD> ==> FOR (j < nColumns)
        for (var cuentaCampos = 0; cuentaCampos < numberOfColumns; cuentaCampos++) {
            var celda = document.createElement("td");

    // B. 9. MAQUETAMOS LAS FILAS PARES CON UN FONDO... ES DECIR, LE DAMOS UN CLASS PARA QUE CSS SE ENCARGUE DE PINTARLAS
            if (cuentaRegistros % 2==0)
            {
                celda.className="pares";
                if (cuentaRegistros == arrNames.length -2)
                {
                    celda.className="ultima_par";
                }
            }
            else
            {
                celda.className="impares";
                if (cuentaRegistros == arrNames.length -2)
                {
                    celda.className="ultima_impar";
                }
            }
            
    // B. 10. ESCRIBIR (CON innerHTML) LOS CONTENIDOS DE LOS CAMPOS EN LA HILERA DE REGISTRO RECIEN CREADA
            
            //var nameColumn=(arrayTablaBD[cuentaCampos][cuentaRegistros]);    
            
            //debugger;

            if (cuentaCampos == 4) {
                var barraProgreso = document.createElement("progress");
                //var valor=(arrayTablaBD[cuentaCampos][cuentaRegistros+1]);
                // barraProgreso.style.backgroundColor = "#8b0000";
                // barraProgreso.className = "barraVotos";  // "#8b0000";
                barraProgreso.max = 100;
                barraProgreso.value=(arrayTablaBD[cuentaCampos][cuentaRegistros+1]);
                barraProgreso.innerHTML = barraProgreso.value;
                celda.appendChild(barraProgreso);
                //alert("ponemos una barra para " + cuentaRegistros + " a valor " + barraProgreso.value);
                //     var celdaProgreso = document.createTextNode("<progress value=" + arrayTablaBD[cuentaCampos][cuentaRegistros+1] + " max='100' class='barraStyle'> </progress>");


            }else if (cuentaCampos == 1) {
                var bandera_partido = document.createElement("img");
                switch (arrayTablaBD[cuentaCampos][cuentaRegistros+1]) {
                    case "R":
                        bandera_partido.src="./img/repub.bmp";
                        // bandera_partido.height="20px";
                        // bandera_partido.width ="20px";
                        break;
                    case "D":
                        bandera_partido.src="./img/democ.bmp";
                        break;
                    case "I":
                        bandera_partido.src="./img/indep.bmp";
                }
                bandera_partido.style.height="25px";
                bandera_partido.style.width ="25px";
                celda.appendChild(bandera_partido);
            } else {
                var textoCelda = document.createTextNode(arrayTablaBD[cuentaCampos][cuentaRegistros+1]);  
                celda.appendChild(textoCelda);         
            }   
            
            hilera.appendChild(celda);

            // LIVE NEWS:  pondremos el primero, el quinceavo, y el vigésimo de la lista en noticias  // mayor = (x>y)?x:y;  // resultado = (condicion)?valor1:valor2;
            //debugger;
            var New_name, New_part, New_vots = "";
            if ((cuentaRegistros==0) || (cuentaRegistros==15) || (cuentaRegistros==20)) {
                switch (cuentaCampos){
                    case 0 : New_name = textoCelda.textContent;   // nombre del senador
                        break;
                    case 1 : New_part = (textoCelda.textContent=="R")?"republican":"democrat";  // partido del senador
                        break;
                    case 4 : New_vots = barraProgreso.value;  //textoCelda.textContent;
                }   
        
            }
        }        
        //debugger;
        if ((cuentaRegistros==0) || (cuentaRegistros==15) || (cuentaRegistros==20)) {
            noticia_texto = "The " + New_part + " candidate " + New_name + " has " + New_vots + " percent of votes.";
            arrNews.push(noticia_texto);                 
            noticia_texto = "";
        }

    // B. 11. AGREGA UNA HILERA al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
    }

    // B. 12. Opcional - mensaje de No Match - para cuando 0 registros:
    if (arrNames.length-1 == 0){
        // tabla.appendChild(tblBody);
        // mostrar_noMatch();
        tblBody = document.createElement("tbody");
            var trow  = document.createElement("tr");
                var tdiv  = document.createElement("td");
                tdiv.colSpan = 5;
                tdiv.align = "center";
                tdiv.style.padding = "50px";
                tdiv.style.margintop = "20px";
                tdiv.style.fontsize = "24px !important";
                tdiv.style.backgroundColor = "wheat";
                tdiv.innerHTML = "No match results found.";
            trow.appendChild(tdiv);
        tblBody.appendChild(trow);
    }
  
// añade el elemento <tbody> dentro del elemento <table>
tabla.appendChild(tblBody);

// añade el elemento <table> dentro del elemento <body>
body.appendChild(tabla);

// ...y si quisieramos modifica el atributo "border" seria asi:  // tabla.setAttribute("border", "2");
}


// ================== ELIMINA TABLA =======================================
function elimina_tabla(idTabla){
    var elemento = document.getElementById(idTabla);
    if (!elemento){
        console.log("no existe el elemento HTML a eliminar!!");
    } else {
        elemento.innerHTML = "";
        //var padre = elemento.parentNode;
        //padre.removeChild(elemento);
    }
}

// ===== Quitar Repetidos en un ARRAY ======== 
function EliminaRepetits(arrNumeros) {    // arriba fins .length -1 ... no cal comparar ultim valor, ja es compara en cada iteracio
    var punter = 0;
    var arrSenseRepetits = [];
    for (punter = 1; punter < arrNumeros.length - 1; punter++) {  
        if (arrSenseRepetits.indexOf(arrNumeros[punter]) <= 0){
            arrSenseRepetits.push(arrNumeros[punter]);
        }
    }
    arrSenseRepetits.sort();
    return arrSenseRepetits;
}

function generar_paises(myArray, sitio){
    var lugar = document.getElementById(sitio);
    var arrCombo = EliminaRepetits(myArray);
    var opt = document.createElement("option");
    var puntero = 1;
    for (puntero in arrCombo){
        opt = document.createElement("option");
        if (puntero==0) {
            opt.innerHTML="All states";
        } else {
            opt.innerHTML = arrCombo[puntero];
        }
        lugar.appendChild(opt);
    }
    return true;
}
