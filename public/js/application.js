$(document).ready(function() {
  getTodos();
  bindEvents();
});

//variables para usar Handlebars.js
var source   = $("#todo-template").html();
var template = Handlebars.compile(source);

//objetos para meter en un arreglo los todos completados y los pendientes 
var todosCompleted = {todos: []}
var todosPending = {todos: []}

//planto los eventos de escucha
function bindEvents(){
  $(".crearTodo").off("submit");
  $(".delete").off("click");
  $(".pending").off("click");

  $(".crearTodo").on("submit", createTodo);
  $(".delete").on("click", deleteTodo);
  $(".pending").on("click", completeTodo);
}

//obtengo la lista de todos
function getTodos(){
  $.ajax({
    method: "GET",
    url: "/todos"
  }).done(render).fail()
}

//Crea un todo
function createTodo(event){
  event.preventDefault()
  var url = this.action
  var data = $(this).serialize()
  $("input[type='text']").val("")
  $.ajax({
    url: url,
    method: "POST",
    data: encodeURI(data)
  }).done(render).fail()
}

//Elimina un todo
function deleteTodo(event){
  event.preventDefault()
  var url = this.href
  $.ajax({
    url: url,
    method: "DELETE",
  }).done(render).fail()
}

//Completa un todo
function completeTodo(event){
  event.preventDefault()
  var url = this.href
  $.ajax({
    url: url,
    method: "PATCH"
  }).done(render).fail()
}

//muestra la lista de todos
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