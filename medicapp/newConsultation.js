const tabConsultaMedica = document.getElementById("tabConsultaMedica")
tabConsultaMedica.addEventListener("click",showConsultaMedica)
const tabAntecedentes = document.getElementById("tabAntecedentes")
tabAntecedentes.addEventListener("click",showAntecedentes)

const seccionConsultaMedica = document.getElementById("seccionConsultaMedica")
const sectionAntecedentes = document.getElementById("sectionAntecedentes")

function showConsultaMedica(){
    tabConsultaMedica.classList.add("active")
    tabAntecedentes.classList.remove("active")
    seccionConsultaMedica.setAttribute("style","display:true")
    sectionAntecedentes.setAttribute("style","display:none")
}

function showAntecedentes(){
    tabConsultaMedica.classList.remove("active")
    tabAntecedentes.classList.add("active")
    seccionConsultaMedica.setAttribute("style","display:none")
    sectionAntecedentes.setAttribute("style","display:true")
}