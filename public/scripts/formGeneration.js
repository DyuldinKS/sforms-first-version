/**
 * Компонент содержит прочие компоненты, задающие параметры формы и
 * параметры генерируемых вопросов
 */
var FormGenerator = React.createClass({
	render: function() {
		return (
			<form action="/api/comments" method="POST" role="form" className="formGenerator">
				<legend>Новая форма</legend>

				<FormTitle></FormTitle>
				<QuestionList></QuestionList>
				
				<button type="submit" className="btn btn-primary btn-block">Сохранить</button>
			</form>
		);
	}
});

/**
 * Компонент содержит поля ввода для названия и описания генерируемой формы
 */
var FormTitle = React.createClass({
	render: function() {
		return (
			<div className="formTitle">
				<div className="form-group">
					<label htmlFor="formTitle">Название формы</label>
					<input name="formTitle" type="text" id="formTitle" className="form-control" required="required" />
				</div>
				<div className="form-group">
					<label htmlFor="formDescription">Описание формы</label>
					<textarea name="formDescription" id="formDescription" className="form-control" rows="3" required="required" />
				</div>
			</div>
		);
	}
});

/**
 * Компонент содержит расширяющийся список генераторов вопросов
 */
var QuestionList = React.createClass({
	getInitialState : function () {
		return {data: [<QuestionGenerator key='0' idd="questions[0]"></QuestionGenerator>]};
	},

	addQuestion: function () {
		var data = this.state.data;
		var id = data.length;
		data.push(<QuestionGenerator key={id} idd={"questions["+id+"]"}></QuestionGenerator>);
		this.setState({data: data});
	},

	render: function() {
		return (
			<div className="questionList">
				{this.state.data}
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.addQuestion}>Добавить вопрос</button>
				</div>
			</div>
		);
	}
});

/**
 * Компонент содержит компоненты позволяющие генерировать очередной вопрос
 */
var QuestionGenerator = React.createClass({
	render: function() {
		return (
			<div className="questionGenerator">
				<QuestionTitle idd={this.props.idd}></QuestionTitle>
				<QuestionConfiguration idd={this.props.idd}></QuestionConfiguration>
			</div>
		);
	}
});


/**
 * Компонент содержит поля ввода для названия и описания очередного вопроса генератора вопросов
 */
var QuestionTitle = React.createClass({
	render: function() {
		return (
			<div className="questionTitle" >
				<div className="form-group">
					<label>Вопрос</label>
					<input name={this.props.idd+"[questionTitle]"} type="text" className="form-control" required="required" />
				</div>
				<div className="form-group">
					<label>Описание вопроса</label>
					<textarea name={this.props.idd+"[questionDescription]"} className="form-control" rows="3" required="required" />
				</div>
			</div>
		);
	}
});

/**
 * Компонент содержит поля ввода для настроек генерируемого вопроса
 */
var QuestionConfiguration = React.createClass({
	getInitialState: function() {
		return {selectGenerator: ''};
	},

	changeHandler: function(e) {
		if (e.target.value === "select") {
			this.setState({selectGenerator: <SelectGenerator idd={this.props.idd}></SelectGenerator>})
		}
		else this.setState({selectGenerator: ""});
	},

	render: function() {
		return (
			<div className="questionConfiguration">
				<div className="form-group">
					<label>Тип ответа</label> 
					<select name={this.props.idd+"[questionType]"} 
						className="form-control" 
						required="required" 
						defaultValue="string"
						onChange={this.changeHandler}>
						<option value="string">Строка</option>
						<option value="paragraph">Абзац</option>
						<option value="datetime">Дата/Время</option>
						<option value="select">Выбор из списка</option>
					</select>
				</div>
				{this.state.selectGenerator}
				<div className="form-group">
					<div className="checkbox">
						<label>
							<input name={this.props.idd+"[required]"} type="checkbox" defaultChecked="true" />
							Обязательный вопрос?
						</label>
					</div>
				</div>
			</div>
		);
	}
});

/**
 * Компонент содержит генератор вариантов ответа при выборе типа ответа выбор из списка
 */
var SelectGenerator = React.createClass({
	getInitialState: function() {
		return {options: [<OptionGenerator key="0" name={this.props.idd+"[options][0]"}></OptionGenerator>]};
	},

	addOption: function() {
		var options = this.state.options;
		var id = options.length;
		options.push(<OptionGenerator key={id} name={this.props.idd+"[options]["+id+"]"}></OptionGenerator>);
		this.setState({options: options});
	},

	render: function() {
		return (
			<div className="selectGenerator">
				{this.state.options}
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.addOption}>Добавить ответ</button>
				</div>
			</div>
		);
	}
});

/**
 * Компонент содержит поле для ввода очередного варианта ответа
 */
var OptionGenerator = React.createClass({
	render: function() {
		return (
			<div className="optionGenerator">
				<div className="form-group">
					<input name={this.props.name} type="text" className="form-control" required="required" placeholder="Вариант ответа" />
				</div>
			</div>
		);
	}
});


ReactDOM.render(
	<FormGenerator></FormGenerator>,
	document.getElementById('content')
);