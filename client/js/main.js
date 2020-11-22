const form = document.forms.aboutForm;
const elements = form.elements
const submitButton = document.getElementById('submitForm')
const redirectButton = document.getElementById('redirect')
redirectButton.disabled = true
const urlParams = new URLSearchParams(window.location.search);

const getDataURL = (urlParams) => {
    const formDataURL = {}
    const paramsEntries = urlParams.entries()

    for (let pair of paramsEntries) {
        if (pair[0] === 'department' || pair[0] === 'skills') {
            formDataURL[pair[0]] = pair[1].split('|')
        } else (
            formDataURL[pair[0]] = pair[1]
        )
    }
    return formDataURL
}

const setFormData = (urlParams, elements) => {
    const formDataURL = getDataURL(urlParams)

    for (let el of elements) {
        if (formDataURL.hasOwnProperty(el.name)) {
            el.value = formDataURL[el.name]
        }
    }
    if (formDataURL.hasOwnProperty('department')) {
        const options = elements.department.options
        for (let i = 0; i < options.length; i++) {
            if (formDataURL.department.includes(options[i].value)) {
                options[i].selected = true
                options[i].style.fontWeight = 'bold'
            }
        }
    }
    if (formDataURL.hasOwnProperty('sex')) {
        elements.sex.value = formDataURL.sex
    }
    if (formDataURL.hasOwnProperty('skills')) {
        for (let i = 1; i < 5; i++) {
            if (formDataURL.skills.includes(elements[`checkbox${i}`].value)) {
                elements[`checkbox${i}`].checked = true
            }
        }
    }
}

const getSkills = () => {
    let skills = []

    for (let i = 1; i < 5; i++) {
        skills.push(elements[`checkbox${i}`].checked && elements[`checkbox${i}`].value)
    }
    return skills.filter(skill => skill !== false)
}

const getDepartment = (options) => {
    let departments = []

    for (let i = 0; i < options.length; i++) {
        departments.push(options[i].selected && options[i].value)
    }
    return departments.filter(department => department !== false)
}

const getFormData = () => {
    let formData = {
        firstname: elements.firstname.value,
        lastname: elements.lastname.value,
        email: elements.email.value,
        phone: elements.phone.value,
        sex: elements.sex.value,
        skills: getSkills(),
        department: getDepartment(elements.department.options)
    }

    Object.keys(formData).forEach((el) => (!formData[el].length) && delete formData[el]);

    return formData
}

const redirectToNewPath = (search) => {
    window.location.replace(search)
}

const submitHandler = async () => {
    try {
        const form = getFormData()

        const response = await fetch('/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(form)
        })

        const data = await response.json()

        console.log(data.message, data.form)

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong')
        } else {
            document.getElementById("about-form").reset();
            redirectButton.disabled = false
            redirectButton.addEventListener('click', redirectToNewPath.bind(this, data.newPath))
        }
    } catch (e) {
        console.log(e)
    }
}

setFormData(urlParams, elements)
submitButton.addEventListener('click', submitHandler)
