require "make_todo"

get '/' do
  erb :index
end

get '/todos'  do
  todos = Tarea.all
  content_type :json
  {todos: todos}.to_json
end

post '/todos' do
  Tarea.create(params[:title])
  # if new_todo.save 
  redirect '/todos'
  # end
end

patch "/todos/:id/edit" do
  todo = Tarea.find(params[:id])
  puts "*"*60
  puts "#{params[:id]}"
  todo_state = params[:done] == nil ? false : true 
  todo["done"] = todo_state
  todo["title"] = params[:title]
  Tarea.update(todo["id"])
  redirect "/todos"
end

# patch '/todos/:id' do
#   todo = Tarea.find(params[:id])
#   puts "incompleta #{params[:incompleta]}"
#   if params[:incompleta] == "incompleta"
#     puts "*"*60
#     puts "tarea completa"
#   else
#     puts "*"*60
#     puts "no entra  a incompleta"
#   end
#   todo["done"] = true
#   Tarea.update(todo["id"])
#   redirect '/todos'
# end

delete '/todos/:id' do
  Tarea.destroy(params[:id])
  redirect '/todos'
end

get '/todos/:id' do
end