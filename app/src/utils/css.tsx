export function CSS(){}

CSS.variable = function(name:string){
    return getComputedStyle(document.body).getPropertyValue(name).trim()
}