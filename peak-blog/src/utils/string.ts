
export function validateEmail(email): boolean {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
