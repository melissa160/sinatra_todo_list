require "make_todo"
require 'uri'

#index
get '/' do
  erb :index
end

#send json with todos
get '/todos'  do
  todos = Tarea.all
  todos = todos.sort_by{ |t| t["id"] }
  content_type :json
  {todos: todos}.to_json
end

#create
post '/todos' do
  val = URI.escape(params[:title])
  Tarea.create(val) 
  redirect '/todos'
end

#complete todo
patch '/todos/:id' do
  todo = Tarea.find(params[:id])
  todo["done"] = true
  Tarea.update(todo["id"])
  redirect '/todos'
end

#delete todo
delete '/todos/:id' do
  Tarea.destroy(params[:id])
  redirect '/todos'
end
