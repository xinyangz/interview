from django.conf import settings
import pymongo


def get_next_sequence(sequence_name):
    """
    Get next unique sequence id for a given sequence
    :param sequence_name: Name of sequence
    :return: Next unique id
    """

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Create a new sequence if needed
    db.sequences.find_one_and_update(
        {'_id': sequence_name},
        {'$setOnInsert': {'seq': 0}},
        upsert=True
    )

    ret = db.sequences.find_one_and_update(
        {'_id': sequence_name},
        {'$inc': {'seq': 1}},
        projection={'seq': True, '_id': False},
        return_document=pymongo.ReturnDocument.AFTER
    )

    return ret['seq']
