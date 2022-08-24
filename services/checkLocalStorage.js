export default function checker(key){
    const localValue = localStorage.getItem(key)
    return JSON.parse(localValue)
}