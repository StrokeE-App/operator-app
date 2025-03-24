'use client';
//A button component that recieves a title, click event and a color

interface ButtonProps {
	title: string;
	onClick: () => void;
	color: string;
	disabled?: boolean;
}

export default function Button({title, onClick, color, disabled = false}: ButtonProps) {
	const buttonColor = color === 'red' ? 'bg-customRed' : 'bg-customGreen';
	const textColor = color === 'red' ? 'text-customWhite' : 'text-customBlack';
	const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

	return (
		<button onClick={onClick} disabled={disabled} className={`${buttonColor} ${textColor} font-bold py-2 px-4 rounded ${disabledStyle}`}>
			{title}
		</button>
	);
}
