
// let arr_removed_id = [1,4,78,7]

// console.log(arr_removed_id.includes(8))

console.log(Date.now() + 100)
console.log(Date.now())


var d1 = new Date (),
    d2 = new Date ( d1 );
d2.setMinutes ( d1.getMinutes() + 1);
console.log( d1 );
console.log( d2 );


"всу(?=\\s)"

var rgxp = new RegExp("всу\(\?\=\\s\)\|\всу\$", "gmi");
console.log(rgxp.test("всуна"))
console.log(rgxp.test("всу"))