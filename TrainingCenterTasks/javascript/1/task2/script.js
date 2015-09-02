function isNumber(i) {
	return (typeof i === 'number' && !isNaN(i));
}
function isPositive(i) {
	return i > 0;
}

function run() {

	do
	{

		// parseInt - отбрасывает дробную часть, 
		// можно было бы использовать parseFloat и затем ругать пользователя
		// за не целые числа. Но решил пока так оставить..

		var inputStoreys = parseInt(prompt("Введите этажность дома", "3"));
		if (!isNumber(inputStoreys) || !isPositive(inputStoreys))
			throw new Error('Этажность дома должно быть целое положительное число.')

		var inputEntrances = parseInt(prompt("Введите число подъездов", "4"));
		if (!isNumber(inputEntrances) || !isPositive(inputEntrances))
			throw new Error('Число подъездов должно быть целое положительное число.');
		
		var inputApartments = parseInt(prompt("Введите количество квартир на этаже", "2"));
		if (!isNumber(inputApartments) || !isPositive(inputApartments))
			throw new Error('Количество квартир на этаже должно быть целое положительное число.');

		var apartmentsCount = inputStoreys * inputEntrances * inputApartments;

		var inputApartmentNumber = parseInt(prompt("Введите номер квартиры", ""));
		
		if (!isNumber(inputApartmentNumber) || !isPositive(inputApartmentNumber))
			throw new Error('Номер квартиры должно быть целое положительное число.');

		if (inputApartmentNumber > apartmentsCount)
			throw new RangeError('Значение больше допустимого. В доме нет столько квартир.');


		var output = Math.ceil(inputApartmentNumber / (inputStoreys * inputApartments));

		alert('Квартира: ' + inputApartmentNumber + ' находится в подъезде: ' + output);
	}
	while(true);
}

run();