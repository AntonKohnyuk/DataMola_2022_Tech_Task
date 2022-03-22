let arrayOfNumbers = [1,-9, 8 ,0 ,7 ,8 -65 , 7 ,8 , 9];

const getMaxSumSubarray = arr => {
    let result = {
    maxSum: arr[0],
    first: 0,
    last: 0
    };
    let sum = 0;
    
    for(let i = 0; i < arr.length; i++, sum = 0){
        for(let j = i; j < arr.length; j++){
            sum += arr[j];
            if(sum > result.maxSum){
                    result.maxSum = sum;
                    result.first = i;
                    result.last = j;
            }
        }
    }
    return result;
}
let resultArray = getMaxSumSubarray(arrayOfNumbers);
console.log(`Подмассив array[${resultArray.first}] - array[${resultArray.last}] имеет наибольшую сумму элементов, равную ${resultArray.maxSum}`);
console.log("Этот подмассив : ", arrayOfNumbers.slice(resultArray.first, resultArray.last+1));
