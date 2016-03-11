
/**
 * Компонент содержит форму, которую необходимо заполнить
 */
var Form = React.createClass({

	getInitialState: function() {
		return {data: ''};
	},

	loadFormFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data[data.length-1]});
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function() {
		this.loadFormFromServer();
	},

	render: function () {
		console.log(this.state.data);

		return (
			<div className="form">
				<FormTitle data={this.state.data}></FormTitle>
				<QuestionList data={this.state.data.questions}></QuestionList>
			</div>
		);
	}
});

/**
 * Компонент содержит шапку формы: название и описание
 */
var FormTitle = React.createClass({
	render: function () {
		return (
			<div className="formTitle">
				<h1>{this.props.data.formTitle}</h1>
				<blockquote>{this.props.data.formDescription}</blockquote>
			</div>
		);
	}
});

/**
 * Компонент содержит список вопросов одной формы полученный из БД
 */
var QuestionList = React.createClass({
	render: function () {
		var questions = this.props.data;

		if (!questions) return (<div></div>);

		var questionOutput = questions.map(function(questionData, i) {
			return <Question data={questionData} key={i}></Question>;
		});

		return (
			<div className="questionList">
				{questionOutput}
			</div>
		);
	}
});

/**
 * Компонент содержит вопрос полученный из БД и поле для ввода ответа на него
 */
var Question = React.createClass({
	getInputField: function() {
		switch (this.props.data.questionType) {
			case 'string' :
				return <InputString></InputString>;
				break;
			case 'paragraph' :
				return <InputParagraph></InputParagraph>;
				break;
			case 'datetime' :
				return <InputDatetime></InputDatetime>;
				break;
			case 'select' :
				return <InputSelect options={this.props.data.options}></InputSelect>;
				break;
			default:
				return <p>Произошла ошибка, данный тип вопроса не поддерживается.</p>
		}
	},

	render: function () {
		return (
			<div className="question">
				<div className="form-group">
					<label>{this.props.data.questionTitle}</label>
					<p>{this.props.data.questionDescription}</p>
					{this.getInputField()}
				</div>
			</div>
		);
	}
});

/**
 * Пользовательский ввод
 * Тип строка
 */
var InputString = React.createClass({
	render: function () {
		return (
			<input type="text" name="" className="inputString form-control" value="" required="required"/>
		);
	}
});

/**
 * Пользовательский ввод
 * Тип параграф
 */
var InputParagraph = React.createClass({
	render: function () {
		return (
			<textarea name="" className="inputParagraph form-control" rows="3" required="required"></textarea>
		);
	}
});

/**
 * Пользовательский ввод
 * Тип дата время
 */
var InputDatetime = React.createClass({
	render: function () {
		return (
			<input type="date" name="" className="inputDatetime form-control" required="required" />
		);
	}
});

/**
 * Пользовательский ввод
 * Тип выбор из списка
 * options - массив вариантов ответа
 */
var InputSelect = React.createClass({

	getOptions: function () {
		var options = this.props.options;

		var output = options.map(function(option, i){
			return <option value={option} key={i}>{option}</option>;
		});

		return output;
	},

	render: function () {
		return (
			<select name="" className="inputSelect form-control" required="required">
				{this.getOptions()}
			</select>
		);
	}
});

// var  = React.createClass({
// 	render: function () {
// 		return (
// 			<div className="">
				
// 			</div>
// 		);
// 	}
// });
// 
// var data = {
	// 		formTitle: "Моя форма",
	// 		formDescription: "Это тестовый текст для описания формы",
	// 		questions: [
	// 			{
	// 				questionTitle: "Какой твой любимый цвет",
	// 				questionDescription: "Напиши",
	// 				questionType: "string",
	// 				required: "on"
	// 			},
	// 			{
	// 				questionTitle: "Какой твой любимый киногерой",
	// 				questionDescription: " Может Росомаха?",
	// 				questionType: "paragraph",
	// 				required: "on"
	// 			},
	// 			{
	// 				questionTitle: "Как много протеина ты употребляешь в сутки",
	// 				questionDescription: "в граммах",
	// 				questionType: "datetime",
	// 				required: "on"
	// 			},
	// 			{
	// 				questionTitle: "Как твое настроение",
	// 				questionDescription: "Выбери",
	// 				questionType: "select",
	// 				options: [
	// 					"Отличное",
	// 					"Нормальное",
	// 					"Плохое"
	// 				],
	// 				required: "on"
	// 			}
	// 		],
	// 	};

ReactDOM.render(
	<Form url="/api/comments"></Form>,
	document.getElementById('content')
);