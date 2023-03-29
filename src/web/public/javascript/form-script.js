window.addEventListener('DOMContentLoaded', function () {
    function changeStep(button) {
        let index = 0

        let active = document.querySelector('.active')
        let steps = Array.from(document.querySelectorAll('form .step'))
        let alert = document.getElementById('alert')

        index = steps.indexOf(active)

        let inputs = steps[index].querySelectorAll('input')

        for (i = 0; i < inputs.length; i++) {
            if (inputs[i].value == '') {
                inputs[i].style.borderColor = 'red'
                alert.style.display = 'block'
                alert.innerHTML = `
                <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                Aún tienes campos a los cuales rellenar <strong>(${inputs[i].placeholder})</strong>
                `
                return
            } else {
                inputs[i].style.borderColor = 'green'
            }
        }

        steps[index].classList.remove('active')

        if (button == 'next') {
            index++
        } else if (button === 'prev') {
            index--
        }

        alert.style.display = 'none'
        steps[index].classList.add('active')
    }

    document.querySelectorAll('form .next-btn').forEach((button) => {
        button.addEventListener('click', () => {
            changeStep('next')
        })
    })

    document.querySelectorAll('form .previous-btn').forEach((button) => {
        button.addEventListener('click', () => {
            changeStep('prev')
        })
    })

    window.addEventListener('beforeunload', function (event) {
        event.preventDefault()
        event.returnValue = this.alert
    })
})