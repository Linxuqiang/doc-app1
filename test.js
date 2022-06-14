

// function test() {
//     // Promise的回调函数，会在执行实例化的时候被立即执行，所以回调函数不会异步，
//     // 只有执行resolve以后才会异步，then才是异步
//     return new Promise(resolve => {
//         console.log('---------------------- new')
//         resolve(1)
//     })
// }

// test().then(d => {
//     console.log('---------------------- then回调结果', d)
// })
// console.log('---------------------- 主线程')


function test(index, flag) {
    return new Promise((resolve, reject) => {
        let time = Math.ceil(Math.random() * 600 + 400)
        console.log('---------------------- new', index, time)
        if (flag) {
            setTimeout(function() {
                resolve(index)
            }, time)
        } else {
            reject(index)
        }
    })
}

Promise.all([
    test(0, true),
    test(1, true),
    test(2, false),
    test(3, true)
]).then(d => {
    console.log('----------------------- success')
    console.log(d)
}).catch(e => {
    console.log('----------------------- error')
    console.log(e)
})

Promise.race([
    test(0, true),
    test(1, true),
    test(2, true),
    test(3, true)
]).then(d => {
    console.log('----------------------- success')
    console.log(d)
})