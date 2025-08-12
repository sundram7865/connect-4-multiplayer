

//checks if the string contains uppercase and lowercase characters
export function containsUppercaseAndLowercase(str) {
    return Boolean(str.match(/[A-Z]/)&&str.match(/[a-z]/))
}

//checks if the string contains special characters
export function containsSpecialCharacter(str) {
    const specialChars = `[!#&*$]`
    for(let specialChar of specialChars) {
        if(str.includes(specialChar)) {
            return true
        }
    }
    return false
}
