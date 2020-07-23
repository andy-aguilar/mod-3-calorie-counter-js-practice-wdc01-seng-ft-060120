// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const BASEURL = "http://localhost:3000//api/v1/calorie_entries"

document.addEventListener("DOMContentLoaded", (e) => {
    const bmrForm = document.getElementById("bmr-calulator");
    const progressBar = document.querySelector(".uk-progress")
    const caloriesUl = document.getElementById("calories-list")
    const newCalorieForm = document.getElementById("new-calorie-form")
    const editCalorieForm = document.getElementById("edit-calorie-form")

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

    editCalorieForm.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(e.target)
    })

    newCalorieForm.addEventListener("submit", (e) => {
        e.preventDefault();
        postCalorieEntry(e.target);
    })

    const postCalorieEntry = (form) => {
        const calories = form.calories.value 
        const calorieEntry = {
            "calorie": calories,
            "note": form.notes.value
        }

        const calorieEntryConfig = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
            },
            body: JSON.stringify(calorieEntry)
        }
        fetch(BASEURL, calorieEntryConfig)
        .then(resp => resp.json())
        .then(entry => {
            renderCalorieEntry(entry);
        })
    }

    const setBmrSpans = (lowBmr, highBmr) => {
        const lowSpan = document.getElementById("lower-bmr-range")
        const highSpan = document.getElementById("higher-bmr-range")
        lowSpan.innerText = lowBmr
        highSpan.innerText = highBmr
        progressBar.max = ((lowBmr + highBmr)/2)
    }
    const getCalorieEntries = () => {
        fetch(BASEURL)
        .then(resp => resp.json())
        .then(entries => {
            entries.forEach(renderCalorieEntry)
        })
    }

    const renderCalorieEntry = (entry) => {
        const entryLi = document.createElement("li");
        entryLi.className = "calories-list-item";
        entryLi.dataset.id = entry.id
        entryLi.innerHTML = `
            <div class="uk-grid">
                <div class="uk-width-1-6">
                    <strong>${entry.calorie}</strong>
                    <span>kcal</span>
                </div>
                <div class="uk-width-4-5">
                    <em class="uk-text-meta">${entry.note}</em>
                </div>
            </div>
            <div class="list-item-menu">
                <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
                <a class="delete-button" uk-icon="icon: trash"></a>
            </div>
        `;
        caloriesUl.appendChild(entryLi);
        const deleteButton = entryLi.querySelector(".delete-button")
        deleteButton.addEventListener("click", (e) => {
            deleteCalorieEntry(entry, entryLi, progressBar)
        })
        progressBar.value += entry.calorie
    }

    getCalorieEntries()

})

const calculateLow = (weight, height, age) => {
    let BMR = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
    return Math.round(BMR)
}

const calculateHigh = (weight, height, age) => {
    let BMR = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
    return Math.round(BMR)
}

const deleteCalorieEntry = (entry, li, progressBar) => {
    const calorieEntryConfig = {
        method: "DELETE",

        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    fetch(`${BASEURL}/${entry.id}`, calorieEntryConfig)
    .then(resp => resp.json())
    .then(entry => {
        progressBar.value -= entry.calorie
        li.remove()
    })
}



/* <li class="calories-list-item">
    <div class="uk-grid">
        <div class="uk-width-1-6">
            <strong>400</strong>
            <span>kcal</span>
        </div>
        <div class="uk-width-4-5">
            <em class="uk-text-meta">Lorem ipsum dolores, some other filler text that I cannot rememeber the rest of...</em>
        </div>
    </div>
    <div class="list-item-menu">
        <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
        <a class="delete-button" uk-icon="icon: trash"></a>
    </div>
</li> */