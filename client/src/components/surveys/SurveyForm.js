import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { reduxForm, Field } from 'redux-form';

import SurveyField from './SurveyField';
import FIELDS from './formFields.js';

import validateEmails from '../../utils/validateEmails';


class SurveyForm extends Component {
	renderFields() {
		return ( FIELDS.map( (field, i) => 
			<Field
				key={`field${i}`}
				type={field.type}
				name={field.name}
				label={field.label}
				component={SurveyField}
				tag={field.tag}
			/>
		));
	}
	render() {
		const { handleSubmit, onSurveySubmit } = this.props;
		return (
			<div>
				<form onSubmit={handleSubmit(onSurveySubmit)}>
					{this.renderFields()}
					<Link to="/surveys">
						<button className="red btn-flat left white-text">
							Cancel
							<i className="material-icons left">cancel</i>
						</button>
					</Link>
					<button className="teal btn-flat right white-text" type="submit">
						Next
						<i className="material-icons right">done</i>
					</button>
				</form>
			</div>
		);
	}
}

function validate(values) {
	const errors = {};

	FIELDS.forEach(field => {
		if (!values[field.name]) errors[field.name] = `You must provide a ${field.name}`;
	});
	if (!values.recipients) {
		errors.recipients = "You must provide at least 1 recipient";
	} else {
		errors.recipients = validateEmails(values.recipients || '');
	}

	return errors;
}

export default reduxForm({
	validate,
	form: 'surveyForm',
	destroyOnUnmount: false,
})(SurveyForm);