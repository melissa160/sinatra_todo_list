$(document).ready(function() {
  getTodos();
  bindEvents();
});

var source   = $("#todo-template").html();
var template = Handlebars.compile(source);
var todosCompleted = {todos: []}
var todosPending = {todos: []}

function bindEvents(){
  $(".crearTodo").off("submit");
  $(".delete").off("click");
  $(".pending").off("click");

  $(".crearTodo").on("submit", createTodo);
  $(".delete").on("click", deleteTodo);
  $(".pending").on("click", completeTodo);
}

function getTodos(){
  $.ajax({
    method: "GET",
    url: "/todos"
  }).done(render).fail()
}

//verifica cuales todos se encuentran completados y cuales no
function checkTodos(response){
  todosCompleted = {todos: []}
  todosPending = {todos: []}
  response.todos.forEach(function(todo){
    if (todo.done){
      todosCompleted.todos.push(todo)
    }else
      todosPending.todos.push(todo)
  });  
}

function createTodo(event){
  event.preventDefault()
  var url = this.action
  var data = $(this).serialize()
  $("input[type='text']").val("")
  $.ajax({
    url: url,
    method: "POST",
    data: data
  }).done(render).fail()
}

function deleteTodo(event){
  event.preventDefault()
  var url = this.href
  $.ajax({
    url: url,
    method: "DELETE",
  }).done(render).fail()
}

function completeTodo(event){
  event.preventDefault()
  var url = this.href
  $.ajax({
    url: url,
    method: "PATCH"
  }).done(render).fail()
}

function render(response){
  checkTodos(response)
  console.log(todosPending)
  console.log(todosCompleted)
  var pending = template(todosPending)
  // var pending = template(response)
  $("#todo-pendientes").html(pending)
  var completed = template(todosCompleted)
  $("#todo-completados").html(completed)
  bindEvents()
}