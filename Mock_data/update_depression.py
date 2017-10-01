import csv
import os
import sys

FILE_NAME = 'MOCK_DATA_WITH_PHOTO_URL'
INPUT_FILE = '{}.csv'.format(FILE_NAME)
OUTPUT_FILE = "{}_OUTPUT.csv".format(FILE_NAME)


def update_depresion(delimiter=','):

    output_data = list()
    keys = list()
    with open(INPUT_FILE) as file:
        reader = csv.DictReader(file, delimiter=delimiter)
        keys = reader.fieldnames

        for row in reader:
            # print(row)
            profile_score = float(row['Profile Score'])
            pic1_score = float(row['Photo1 Score'])
            pic2_score = float(row['Photo2 Score'])
            pic3_score = float(row['Photo3 Score'])
            depression = float(row['Depression'])

            profile_score = profile_score * 100 if profile_score < 1 else profile_score
            new_depression_value = 100 - ((100-profile_score) + pic1_score + pic2_score + pic3_score)/4
            # print(new_depression_value, depression)
            # print("old: ", row)
            row['Depression'] = new_depression_value
            output_data.append(row)
            # print("new: ", row)

    with open(OUTPUT_FILE, 'w') as output_file:
        writer = csv.DictWriter(output_file, keys)
        writer.writeheader()
        writer.writerows(output_data)


if __name__ == '__main__':
    update_depresion()
