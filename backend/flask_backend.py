from flask import Flask, request, jsonify #,render_template, request
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)
 
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '@ElPolloMan03'
app.config['MYSQL_DB'] = 'sakila'
 
mysql = MySQL(app)

#Creating a connection cursor


@app.route('/landing_page_tables', methods = ['GET'])
def queryTables():
    tableId = request.args.get('tableId')

    try:
        cursor = mysql.connection.cursor()
        if (tableId == '0'):
            cursor.execute('''Select film.film_id, Count(rental.inventory_id) as "rental_count", film.title, category.name As category
                            From film
                            Inner Join film_category On film.film_id = film_category.film_id
                            Inner Join category On film_category.category_id = category.category_id
                            Inner Join inventory On film_category.film_id = inventory.film_id
                            Inner Join rental On inventory.inventory_id = rental.inventory_id
                            Group By film.film_id, film.title, category.name
                            Order By Count(rental.inventory_id) DESC, film.title
                            Limit 5;'''
            )
        else:
            cursor.execute('''
                Select actor.actor_id, actor.first_name, actor.last_name, Count(film_actor.film_id) As movies
                From actor
                Inner Join film_actor On actor.actor_id = film_actor.actor_id
                Group By actor.actor_id
                Order By movies DESC
                Limit 5;
            ''')
        data = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        cursor.close()
        results = [dict(zip(columns, row)) for row in data]

        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/selected_movie_data', methods = ['GET'])
def sendMovieData():
    movieName = request.args.get('movieName')
    print(movieName)
    try:    
        cursor = mysql.connection.cursor()
        
        #Format for parameters
        #cursor.execute('SELECT * FROM t WHERE a = %s, b = %s;', (1, 'baz'))

        cursor.execute("Select * From film Where film.title = %s", (movieName,))

        data = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        cursor.close()
        results = [dict(zip(columns, row)) for row in data]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@app.route('/selected_actor_data', methods = ['GET'])
def sendActorData():
    actorId = request.args.get('actorId')
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('''
            Select film_actor.film_id, film.title, Count(rental.inventory_id) as "rental_count"
            From film_actor
            Inner Join film On film_actor.film_id = film.film_id
            Inner Join inventory On film_actor.film_id = inventory.film_id
            Inner Join rental On inventory.inventory_id = rental.inventory_id
            Where film_actor.actor_id = %s
            Group By film_actor.film_id, film.title
            Order By Count(rental.inventory_id) DESC, film.title
            Limit 5;
        ''', (int(actorId),))

        data = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        cursor.close()
        results = [dict(zip(columns, row)) for row in data]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    
@app.route('/customers_list', methods = ['GET'])
def sendCustomersList():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('''
                Select * From customer_list
                Order By customer_list.ID
        ''')
        data = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        cursor.close()
        results = [dict(zip(columns, row)) for row in data]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@app.route('/films_list', methods = ['GET'])
def sendFilmsList():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('''
                Select * From film_list
                Order By film_list.FID
        ''')
        data = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        cursor.close()
        results = [dict(zip(columns, row)) for row in data]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error':str(e)}), 500