function isNumber(i) {
	return (typeof i !== 'number' || isNaN(i));
}

function run() {

	do
	{
		var firstInput = parseInt(prompt("Введите первое число", ""));
		if (isNumber(firstInput)) {
			alert('Первый ввод – не число');
			break;
		}

		var secondInput = parseInt(prompt("Введите второе число", ""));
		if (isNumber(secondInput)) {
			alert('Второй ввод – не число');
			break;
		}

		switch(true) {
			case firstInput > secondInput:
			alert('Второе число меньше');
			break;

			case firstInput < secondInput:
			alert('Первое число меньше');
			break;

			case firstInput === secondInput:
			alert('Числа равны');
			break;
		}

	}
	while(true);
}

run();

