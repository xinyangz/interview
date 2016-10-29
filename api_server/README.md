# API Server

## Setup

1. Install Python 3.5, MongoDB.

2. Install Django, Django REST Framework and PyMongo.

    ```
    pip install django
    pip install djangorestframework
    pip install pymongo
    pip install django-cors-headers
    ```

## Run

1. Start development server.
    
    ```
    python manage.py runserver 8000
    ```

2. Open http://127.0.0.1:8000/v1/test/ in a browser to visit the test api. 
