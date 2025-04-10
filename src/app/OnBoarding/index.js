// node modules
import React from 'react';
import BeachPng from '@assets/images/ResultBackground.png';
import Button from '@components/Button';
import Form from './components/Form';
import Input from './components/Input';
import Background from './components/Background';

// core functions
import { useOnBoarding } from '@core/context/OnBoarding';

const OnBoarding = () => {
	const { handlePasswordSubmit } = useOnBoarding();

	return (
		<>
			<Background src={BeachPng} />
			<Form onSubmit={(e) => handlePasswordSubmit(e)}>
				<Input
					name="password"
					type="text"
					placeholder="Password"
					required={true}
				/>
				<Button type="submit">Log In</Button>
			</Form>
		</>
	);
};

export default OnBoarding;