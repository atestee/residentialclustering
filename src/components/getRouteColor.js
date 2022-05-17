export function getRouteColor(type, name) {
    if (type === "metro") {
        if (name === "A") {
            return "#19B619"
        } else if (name === "B") {
            return "#dcda43"
        } else if (name === "C") {
            return "#FF0000"
        }
    } else {
        if (type === "tram"){
            return "#07b7e1"
        } else if (type === "bus"){
            return "#FF8000"
        } else {
            return "#C800FF"
        }
    }
}