export function getKeys(checkboxValues)  {
    if (checkboxValues["Tous"]) {
        return 'all'
    }
    let keys = [];
    for (const [key, value] of Object.entries(checkboxValues)) {
        if (value) {keys.push(key)}
    }
    return keys
}