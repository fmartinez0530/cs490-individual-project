from flask import Flask, request, jsonify #,render_template, request
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import random
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
                Select customer.customer_id, customer.first_name, customer.last_name, customer.email, address.address, address.district, address.postal_code, city.city, country.country, address.phone
                From customer
                Inner Join address On customer.address_id = address.address_id
                Inner Join city On address.city_id = city.city_id
                Inner Join country On city.country_id = country.country_id
                Order By customer.customer_id;
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

@app.route('/customer_rental_hist', methods = ['GET'])
def sendRentalHistory():
    try:
        customerId = request.args.get('customerId')
        cursor = mysql.connection.cursor()
        cursor.execute('''
                Select rental_id, rental_date, customer_id, return_date, staff_id
                From rental
                Where customer_id = %s
                Order By rental_id;
        ''', (customerId, ))
        data = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        cursor.close()
        results = [dict(zip(columns, row)) for row in data]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@app.route('/update_customer_rental_history', methods = ['POST'])
def updateRentalHistory():
    try:
        data = request.json
        customerId = data.get('custId')
        rentalId = data.get('rentalId')
        returnDate = data.get('return_date')
        print(returnDate)

        cursor = mysql.connection.cursor()
        cursor.execute('''
                Update rental
                Set return_date = %s
                Where customer_id = %s And rental_id = %s
        ''', (returnDate, customerId, rentalId))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Rental history updated successfully'}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    
@app.route('/rent_film', methods = ['POST'])
def rentFilmToCustomer():
    try:
        receivedData = request.json
        customerId = receivedData.get('customerId')
        print("Customer ID received:", customerId)
        filmId = receivedData.get('filmId')
        rentalDate = receivedData.get('rentalDate')

        cursor = mysql.connection.cursor()
        cursor.execute('''
                Select * From customer
                Where customer_id = %s            
        ''', (customerId, ))

        data = cursor.fetchone()
        cursor.close()
        print("Customer Data:", data)
        if (data):
            #Need to check if there are available copies to rent out
            #If there are, handle appropriately
            cursor = mysql.connection.cursor()
            cursor.execute('''
                Select inventory_id, film_id, store_id From inventory
                Where inventory_id Not In (
                    Select inventory_id From rental
                    Where return_date Is NULL
                ) And film_id = %s;
            ''', (filmId, ))
            filmCopies = cursor.fetchone()
            cursor.close()
            if (filmCopies):
                inventory_id, film_id, staff_id = filmCopies
                cursor = mysql.connection.cursor()
                cursor.execute('''
                        Insert Into rental (rental_date, inventory_id, customer_id, return_date, staff_id)
                        Values (%s, %s, %s, NULL, %s)
                ''', (rentalDate, inventory_id, customerId, staff_id))
                mysql.connection.commit()
                cursor.close()

                return jsonify({'message': 'Customer found. Copy found.'}), 200
            else:
                return jsonify({'message': 'Customer found. No copies found.'}), 404
        else:
            return jsonify({'message': "Customer not found."}), 404
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    
@app.route('/update_existing_customer', methods = ['POST'])
def updateExistingCustomer():
    try:
        data = request.json
        custId = data.get('customerId')

        #   Assign variables to be used later for updating this customer
        cursor = mysql.connection.cursor()
        cursor.execute('''
                Select customer.first_name, customer.last_name, customer.email, address.address, address.district, address.postal_code, city.city, country.country, address.phone, city.city_id, address.address_id
                From customer
                Inner Join address On customer.address_id = address.address_id
                Inner Join city On address.city_id = city.city_id
                Inner Join country On city.country_id = country.country_id
                Where customer_id = %s;
        ''', (custId, ))
        results = cursor.fetchone()

        #custName = data.get('inputName').upper() if data.get('inputName') != "" else results[0]
        
        custFirstName = data.get('inputName').split()[0].upper() if data.get('inputName') != "" else results[0]
        custLastName = data.get('inputName').split()[1].upper() if data.get('inputName') != "" else results[1]
        custEmail = data.get('inputEmail') if data.get('inputEmail') != "" else results[2]
        custAddress = data.get('inputAddress').title() if data.get('inputAddress') != "" else results[3]
        custDistrict = data.get('inputDistrict').title() if data.get('inputDistrict') != "" else results[4]
        custZipCode = data.get('inputZipCode') if data.get('inputZipCode') != "" else results[5]
        custCity = data.get('inputCity').title() if data.get('inputCity') != "" else results[6]
        custCountry = data.get('inputCountry').title() if data.get('inputCountry') != "" else results[7]
        custPhoneNum = data.get('inputPhoneNum') if data.get('inputPhoneNum') != "" else results[8]
        custCityId = results[9]
        custAddressId = results[10]

        #   Check if city and country have been updated, and if so are they valid
        cursor.execute('''
                Select city_id From city
                Where city = %s;
        ''', (custCity, ))
        results = cursor.fetchone()
        if results != "":
            custCityId = results[0]
        else:
            return jsonify({'error':'Invalid city inputted'}), 500

        cursor.execute('''
                Select country.country_id, country.country, city.city From country
                Inner Join city on country.country_id = city.country_id
                Where city.city_id = %s;
        ''', (custCityId, ))
        results = cursor.fetchone()
        if results != "":
            custCountryId = results[0]
            custCountry = results[1]
        else:
            return jsonify({'error':'Invalid country inputted'}), 500

        #   Update the customer;
        cursor.execute('''
                Update customer
                Set first_name = %s, last_name = %s, email = %s
                Where customer_id = %s;
        ''', (custFirstName, custLastName, custEmail, custId))
        mysql.connection.commit()
        cursor.execute('''
                Update address
                Set address = %s, district = %s, city_id = %s, postal_code = %s, phone = %s
                Where address_id = %s;
        ''', (custAddress, custDistrict, custCityId, custZipCode, custPhoneNum, custAddressId))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Customer updated successfully'}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    
@app.route('/add_new_customer', methods = ['POST'])
def addNewCustomer():
    try:
        data = request.json
        custFirstName = data.get('inputName').split()[0].upper()
        custLastName = data.get('inputName').split()[1].upper()
        custEmail = data.get('inputEmail')
        custAddress = data.get('inputAddress').title()
        custDistrict = data.get('inputDistrict').title()
        custZipCode = data.get('inputZipCode')
        custCity = data.get('inputCity').title()
        custCountry = data.get('inputCountry').title()
        custPhoneNum = data.get('inputPhoneNum')

        cursor = mysql.connection.cursor()

        #   First, validate city and country that user inputted
        custCityId = None
        custCountryId = None
        cursor.execute('''
                Select city_id, country_id From city
                Where city = %s
        ''', (custCity, ))
        results = cursor.fetchone()
        if results == "":
            return jsonify({'error':'Invalid city inputted'}), 500
        else:
            custCityId = results[0]
            custCountryId = results[1]
        cursor.execute('''
                Select country From country
                Where country_id = %s
        ''', (custCountryId, ))
        results = cursor.fetchone()
        if results == "":
            return jsonify({'error':'Invalid country inputted'}), 500

        #   Insert into address BEFORE customer (need to create a new address_id)
        cursor.execute('''
                Insert Into address (address, district, city_id, postal_code, phone, location)
                Values (%s, %s, %s, %s, %s, ST_GeomFromText('POINT(-73.935242 40.730610)'));
        ''', (custAddress, custDistrict, custCityId, custZipCode, custPhoneNum))
        mysql.connection.commit()
        cursor.execute('Select LAST_INSERT_ID();')
        custAddressId = cursor.fetchone()[0]
        print("Got here 1")

        #   Finally, insert into customer
        randStoreId = random.randint(1, 2)
        cursor.execute('''
                Insert into customer (store_id, first_name, last_name, email, address_id)
                Values (%s, %s, %s, %s, %s)
        ''', (randStoreId, custFirstName, custLastName, custEmail, custAddressId))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'New customer added successfully'}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    
@app.route('/remove_customer', methods = ['POST'])
def removeCustomer():
    try:
        data = request.json
        custId = data.get('customerId')
        cursor = mysql.connection.cursor()
        cursor.execute('''
                Delete From rental
                Where customer_id = %s
        ''', (custId, ))
        mysql.connection.commit()
        cursor.execute('''
                Delete From payment
                Where customer_id = %s
        ''', (custId, ))
        mysql.connection.commit()
        cursor.execute('''
                Delete From customer
                Where customer_id = %s
        ''', (custId, ))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Customer removed successfully'}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500