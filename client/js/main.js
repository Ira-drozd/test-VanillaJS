let form = document.forms.myform;
let elements = form.elements
let submitButton = document.getElementById('submitForm')
let urlParams = new URLSearchParams(window.location.search);

file:///E:/Projects/test-just/client/index.html?firstname=qwe&lastname=Ivanov&email=70@gmail.com&phone=+375296666666&sex=Female&skills=CSS|JavaScript&department=SalesForce|Sharepoint
const getDataURL = (urlParams) => {
    let formDataURL = {}
    let paramsEntries = urlParams.entries()
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
    if (formDataURL.hasOwnProperty('skills')) {
        for (let i = 1; i < 5; i++) {
            if (formDataURL.skills.includes(elements[`checkbox${i}`].value)) {
                elements[`checkbox${i}`].checked = true
            }
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

setFormData(urlParams, elements)

const submitForm = elements => {
    console.log('department', elements.department.options[0])
    let formData = {
        firstname: elements.firstname.value,
        lastname: elements.lastname.value,
        email: elements.email.value,
        phone: elements.phone.value,
        sex: elements.sex.value,
        skills: getSkills(),
        department: getDepartment(elements.department.options)
    }

    console.log(formData)


    let newUrlParams = new URLSearchParams('')

    for (let el in formData) {
        if (formData[el].length > 0) {
            if (Array.isArray(formData[el])) {
                newUrlParams.append(el, formData[el].join('|'))
            } else {
                newUrlParams.append(el, formData[el].toString())
            }
        }
    }

    const newPath = 'file://' + window.location.pathname + '?' + decodeURIComponent(newUrlParams.toString())
    console.log(newPath)
    console.log(window.location.pathname)
    window.location.replace(newPath);
}

submitButton.addEventListener('click', submitForm.bind(this, elements))
