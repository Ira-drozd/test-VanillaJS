const {Router} = require('express')
const router = Router()

router.post('/form', (req, res) => {
    try {
        const form = req.body

        let newUrlParams = new URLSearchParams()

        for (let el in form) {
            if (form[el].length > 0) {
                if (Array.isArray(form[el])) {
                    newUrlParams.append(el, form[el].join('|'))
                } else {
                    newUrlParams.append(el, form[el].toString())
                }
            }
        }

        const newPath = '?' + newUrlParams.toString()

        console.log('Body', form)

        res.status(201).json({message: 'Data  received', form, newPath})

    } catch (e) {
        res.status(500).json({message: 'Something wrong, try again'})
    }
})

module.exports = router
