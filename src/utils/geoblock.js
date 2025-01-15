const rawNationalityOptions = [
    "Country A", "Country B", "Country C", "Country D"
]

export const nationalityOptions = rawNationalityOptions.map(country => {
    return {
        label: country, 
        value: country
    }
})

const rawResidencyOptions = [
    "Country A", "Country B", "Country C", "Country D"
]

export const residencyOptions = rawResidencyOptions.map(country => {
    return {
        label: country, 
        value: country
    }
})