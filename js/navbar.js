'use strict'

// declarar variables de respectivos botones
var btnScroll      = document.querySelector(".scroll");
btnScroll.display  = "none";
var cuerpo         = document.querySelector("body");
var navLista1      = document.querySelector("#nav-lista1");
var botonDesp1     = document.querySelector("#BotonDesplegable1");
    var subBoton11 = document.querySelector("#subBoton11");
    var subBoton12 = document.querySelector("#subBoton12");

var navLista2      = document.querySelector("#nav-lista2");    
var botonDesp2     = document.querySelector("#BotonDesplegable2");
    var subBoton21 = document.querySelector("#subBoton21");
    var subBoton22 = document.querySelector("#subBoton22");

var navLista3      = document.querySelector("#nav-lista3");
var botonDesp3     = document.querySelector("#BotonDesplegable3");
    var subBoton31 = document.querySelector("#subBoton31");
    var subBoton32 = document.querySelector("#subBoton32");

// When the user scrolls down 500px from the top of the document, show the button
window.onscroll = function() {scrollFunction(500)};

// boton de ir a Go to Top
btnScroll.addEventListener('click',function(){
    topFunction();
});

function scrollFunction(pixelsScrolled) {
  if (document.body.scrollTop > pixelsScrolled || document.documentElement.scrollTop > pixelsScrolled) {
    btnScroll.style.display = "block";
  } else {
    btnScroll.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scroll({
  top: 0, 
  behavior: 'smooth'
});
  document.documentElement.scroll({
  top: 0, 
  behavior: 'smooth'
});
}

// funciones de cambiar y recuperar 
function CambiarColor(elemento){
    elemento.style.background = "#8b0000";    // bg en granate
    elemento.fontcolor = "#f5deb3";           // fuente en vainilla
    return true;
}

function RecuperarColor(elemento){
    elemento.style.background = "#f5deb3";   // bg en vainilla
    elemento.fontcolor = "#8b0000"           // fuente en granate
    return true;
}

// eventos generados por el usuario
//navLista1.addEventListener('click',function(){
//    RecuperarColor(botonDesp1);
//    RecuperarColor(subBoton11);
//    RecuperarColor(subBoton22);
//});

// botones Desplegable1 e hijos ............................................................
botonDesp1.addEventListener('click',function(){
    CambiarColor(botonDesp1);
    RecuperarColor(botonDesp2);
    RecuperarColor(botonDesp3);
});

subBoton11.addEventListener('mouseout',function(){
    RecuperarColor(subBoton11);
});

// subBoton de opción SENATE
subBoton11.addEventListener('click',function(){
    RecuperarColor(subBoton11);
});

subBoton11.addEventListener('mouseover',function(){
    CambiarColor(subBoton11);
});

subBoton11.addEventListener('mouseout',function(){
    RecuperarColor(subBoton11);
});

// subBoton de opción HOUSE
subBoton12.addEventListener('click',function(){
    RecuperarColor(subBoton12);
});

subBoton12.addEventListener('mouseover',function(){
    CambiarColor(subBoton12);
});

subBoton12.addEventListener('mouseout',function(){
    RecuperarColor(subBoton12);
});

// botones Desplegable2 e hijos ...............................................................
botonDesp2.addEventListener('click',function(){
    CambiarColor(botonDesp2);
    RecuperarColor(botonDesp1);
    RecuperarColor(botonDesp3);
});

subBoton21.addEventListener('mouseout',function(){
    RecuperarColor(subBoton21);
});

// subBoton de opción SENATE
subBoton21.addEventListener('click',function(){
    RecuperarColor(subBoton21);
});

subBoton21.addEventListener('mouseover',function(){
    CambiarColor(subBoton21);
});

subBoton21.addEventListener('mouseout',function(){
    RecuperarColor(subBoton21);
});

// subBoton de opción HOUSE
subBoton22.addEventListener('click',function(){
    RecuperarColor(subBoton22);
});

subBoton22.addEventListener('mouseover',function(){
    CambiarColor(subBoton22);
});

subBoton22.addEventListener('mouseout',function(){
    RecuperarColor(subBoton22);
});

// botones Desplegable3 e hijos .............................................................
botonDesp3.addEventListener('click',function(){
    CambiarColor(botonDesp3);
    RecuperarColor(botonDesp2);
    RecuperarColor(botonDesp1);
});

subBoton31.addEventListener('mouseout',function(){
    RecuperarColor(subBoton31);
});

// subBoton de opción SENATE
subBoton31.addEventListener('click',function(){
    RecuperarColor(subBoton31);
});

subBoton31.addEventListener('mouseover',function(){
    CambiarColor(subBoton31);
});

subBoton31.addEventListener('mouseout',function(){
    RecuperarColor(subBoton31);
});

// subBoton de opción HOUSE
subBoton32.addEventListener('click',function(){
    RecuperarColor(subBoton32);
});

subBoton32.addEventListener('mouseover',function(){
    CambiarColor(subBoton32);
});

subBoton32.addEventListener('mouseout',function(){
    RecuperarColor(subBoton32);
});

cuerpo.addEventListener('click',function(){
    RecuperarColor(botonDesp1);
    RecuperarColor(botonDesp2);
    RecuperarColor(botonDesp3);
});

// como este JS se usa para varios HTML puede que no en todos existan los elementos
// prueba1 no va .... if (document.querySelector("#btn-more-acordion")){
if (document.title == "TGIF Congress - Welcome"){  
    var btnMoreAcc = document.querySelector("#btn-more-acordion");
        btnMoreAcc.addEventListener('click',function(){
            // debugger;
            var textoBoton = this.innerHTML;
            textoBoton = textoBoton.trim();
            if (textoBoton == "More info...") {
                this.innerHTML = "hide extra info";
            } else {
                if (textoBoton == "hide extra info") {
                    this.innerHTML = "More info...";    
                }
            }
            return true;
            }
        );
    }
//    }


