$(document).ready(function() {
  getTodos();
  bindEvents();
});

//Handlebar.js
var source   = $("#todo-template").html();
var template = Handlebars.compile(source);
var sourceEditTemplate = $("#edit_template").html();
var editTemplate = Handlebars.compile(sourceEditTemplate)

var todosCompleted = {todos: []}
var todosPending = {todos: []}
var todos = {}

function bindEvents(){
  $(".crearTodo").off("submit");
  $(".delete").off("click");
  // $(".pending").off("click");
  $('.edit').off("click");
  $('.edit-form').off('submit');
  $('.edit-form input[type="button"]').off('click');

  $(".crearTodo").on("submit", createTodo);
  $(".delete").on("click", deleteTodo);
  // $(".pending").on("click", completeTodo);
  $(".edit").on("click", editTodo);
  $('.edit-form').on('submit', updateTodo);
  $('.edit-form input[type="button"]').on('click',getTodos);
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

function editTodo(event){
  
  event.preventDefault()
  var todoId = this.dataset.id
  var todo = todos[todoId] //busco el todo  en el arreglo todos por id
  console.log(todo)
  var element = this
  console.log(todo.done)
  var html = editTemplate(todo)
  $($(this).siblings()[2]).replaceWith(html)
    if (todo.done === true){
      $($($(this).siblings()[2]).children()[1]).find("input[type='checkbox']").attr( 'checked','checked');  
    }
  bindEvents()
}

function updateTodo(event){
  event.preventDefault()
  var element = this
  var url = element.action
  var data = $(this).serialize()
  $.ajax({
    method: "PATCH",
    url: url,
    data: data
  }).done(render).fail()
}

function createObjTodos(response){
  todos = response.todos.reduce(function(todos_obj, todo){
    todos_obj[todo.id] = todo
    return todos_obj

  }, {});
}

function render(response){
  createObjTodos(response)
  checkTodos(response)
  var pending = template(todosPending)
  $("#todo-pendientes").html(pending)
  var completed = template(todosCompleted)
  $("#todo-completados").html(completed)
  bindEvents()
}