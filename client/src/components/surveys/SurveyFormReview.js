import React from 'react';

import { connect } from 'react-redux';
import FIELDS from './formFields.js';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';

const SurveyFormReview = (props) => {
	const { onCancel, formValues, submitSurvey, history } = props

	const reviewFields = FIELDS.map((field, i) => {
		return (<div key={`reviewForm-${i}`}>
			<label>{field.label}</label>
			<div>
				{formValues[field.name]}
			</div>
		</div>);
	});

	return (
		<div>
			<h5>Please confirm your entries</h5>
			{reviewFields}
			<button
				className="yellow darken-3 btn-flat white-text"
				onClick={onCancel}
			>Back</button>
			<button
				className="green btn-flat right white-text"
				onClick={() => submitSurvey(formValues, history)}
			>
				Send Survey
				<i className="material-icons right">email</i>
			</button>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		formValues: state.form.surveyForm.values
	};
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));