let arrayOfNumbers = [7,6,4,3,1,19];

const getMaxSum = arr => {
    let maxSum = 0;
    
    for(let i = arr.length - 1; i > 0; i--){
            if(arr[i] > arr[i-1])
                    maxSum +=(arr[i]-arr[i-1]);
    }
    return maxSum;
}
let maxSum = getMaxSum(arrayOfNumbers);
console.log(`Общая выгода равна : ${maxSum}`);