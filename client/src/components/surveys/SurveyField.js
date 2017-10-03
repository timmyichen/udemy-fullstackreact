import React from 'react';

const SurveyField = ({ input, label, tag, meta }) => {
	return (
		<div>
			<label>{label}</label>
			{tag === 'textarea' ? 
				<textarea {...input} /> :
				<input {...input} style={{marginBottom: '5px'}}/>
			}
			<div className="red-text" style={{marginBottom: '20px'}}>
				{meta.touched && meta.error}
			</div>
		</div>
	);
}

export default SurveyField;