# API Server

## Setup

1. Install Python 2.7.x, MongoDB.

2. Install Django, Django REST Framework and PyMongo.

    ```
    pip install django
    pip install djangorestframework
    pip install pymongo
    pip install django-cors-headers
    pip install jsonschema
    pip install chardet
    pip install django-nose
    pip install coverage
    ```

## Run

1. Start development server.
    
    ```
    python manage.py runserver 8000
    ```

2. Open http://127.0.0.1:8000/v1/test/ in a browser to visit the test api. 
