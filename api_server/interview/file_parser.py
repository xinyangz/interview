#! -*- coding: utf-8 -*-

from openpyxl import load_workbook
import csv
import uuid

def file_parser(file_path):
    ext_name = file_path.split('.')[-1].lower()

    if ext_name == 'csv':
        with open(file_path, newline='') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
            line_counter = 0
            for raw_row in spamreader:
                line_counter += 1
                if line_counter <= 1:
                    continue
                row = raw_row[0].split(',')
                if row[0] == '' or row[0] == None:
                    continue
                candidate_data = {
                    'id': uuid.uuid4(), # TODO: Check duplicate
                    'name': row[0],
                    'email': row[1],
                    'phone': row[2],
                    'status': '未面试',
                    'roomId': '',
                    'record': {
                        'video': 0,
                        'board': 0,
                        'chat': 0,
                        'code': 0,
                        'report': 9
                    }

                }
                print ("CSV Example")
                print (candidate_data)
    elif ext_name == 'xlsx':
        wb = load_workbook(filename=r'example1.xlsx')
        sheets = wb.get_sheet_names()
        sheet0 = sheets[0]
        ws = wb.get_sheet_by_name(sheet0)
        rows = ws.rows
        line_counter = 0
        for row in rows:
            line_counter += 1
            if line_counter <= 2:
                continue
            line = [col.value for col in row]
            if line[0] == '' or line[0] == None:
                continue
            candidate_data = {
                'id': uuid.uuid4(), # TODO: Check duplicate
                'name': line[0],
                'email': line[1],
                'phone': line[2],
                'status': '未面试',
                'roomId': '',
                'record': {
                    'video': 0,
                    'board': 0,
                    'chat': 0,
                    'code': 0,
                    'report': 9
                }
            }# TODO: Write into database directly?
            print ("XLSX example")
            print (candidate_data)
    else:
        print ("Unknown file format.")
        return

if __name__ == "__main__":
    file_parser('example1.xlsx')
    file_parser('example2.csv')
