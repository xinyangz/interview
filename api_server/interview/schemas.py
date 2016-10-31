"""
JSON Schemas related to API format.
"""

base_schema = {
    "type": "object",
    "properties": {},
    "required": [],
    "additionalProperties": False
}

user_schema = {
    "type": "object",
    "properties": {
        "username": {"type": "string"},
        "type": {"enum": ["hr", "interviewer", "candidate"]},
        "email": {"type": "string"},
        "password": {"type": "string"},
        "organization": {"type": "string"},
        "contact": {"type": "string"}
    },
    "required": ["username", "type", "email"],
    "additionalProperties": False
}
