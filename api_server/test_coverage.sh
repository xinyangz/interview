#!/bin/bash

coverage run --source=interview --branch manage.py test interview --pattern="*_tests.py"
coverage report -m


