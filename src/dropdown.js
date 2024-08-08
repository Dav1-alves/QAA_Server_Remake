var dropdown = document.querySelectorAll('.flex .dropdown')

for (let index = 0; index < dropdown.length; index++) {
    const group = dropdown[index].querySelector('.group')
    const button = dropdown[index].querySelector('button')

    dropdown[index].onmouseover = (event) => {
        group.classList.remove('hidden');

        if (button && button.classList.contains("danger")) {
            button.classList.add('border-red-600')
        }
    };



    dropdown[index].onmouseout = (event) => {
        group.classList.add('hidden');

        if (button && button.classList.contains("danger")) {
            button.classList.remove('border-red-600')
        }
    };

}

document.body.classList.add('min-h-screen')