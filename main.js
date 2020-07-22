// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

document.addEventListener("DOMContentLoaded", (e) => {
    const bmrForm = document.getElementById("bmr-calulator");

    bmrForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let weight = e.target.weight.value
        let height = e.target.height.value
        let age = e.target.age.value
        let lowBmr = calculateLow(weight, height, age)
        let highBmr = calculateHigh(weight, height, age)
        if(weight && height && age){
            setBmrSpans(lowBmr, highBmr)
        }
        else{
            alert("All fields must be filled")
        }
        
    })

    const setBmrSpans = (lowBmr, highBmr) => {
        const lowSpan = document.getElementById("lower-bmr-range")
        const highSpan = document.getElementById("higher-bmr-range")
        const progressBar = document.querySelector(".uk-progress")
        lowSpan.innerText = lowBmr
        highSpan.innerText = highBmr
        progressBar.max = ((lowBmr + highBmr)/2)
    }

})

const calculateLow = (weight, height, age) => {
    let BMR = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
    return Math.round(BMR)
}

const calculateHigh = (weight, height, age) => {
    let BMR = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
    return Math.round(BMR)
}